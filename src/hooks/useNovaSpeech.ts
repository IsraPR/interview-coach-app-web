// src/hooks/useNovaSpeech.ts

import { useEffect, useRef, useCallback } from 'react';
import { useNovaStore } from '@/store/slices/novaSlice';
import { useNotificationStore } from '@/store/slices/notificationSlice';
import webSocketClient from '@/api/websocketClient';
import { useShallow } from 'zustand/react/shallow';
import { NovaEventFactory } from '@/api/NovaEventFactory';
import { base64ToFloat32Array, processAudioData } from '@/lib/audioHelper';
import AudioPlayer from '@/lib/AudioPlayer';

export const useNovaSpeech = () => {
  // --- State Management ---
  const {
    connectionStatus,
    isRecording,
    transcript,
    setConnectionStatus,
    startRecordingSession,
    stopRecordingSession,
    setTranscript,
    resetNovaState,
  } = useNovaStore(useShallow((state) => state));

  // --- Refs for Audio Tools and Session Data ---
  const audioPlayerRef = useRef<AudioPlayer | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  
  const promptNameRef = useRef<string | null>(null);
  const audioContentNameRef = useRef<string | null>(null);

  // --- WebSocket Message Handling ---
  const handleWebSocketMessage = useCallback((data: any) => {
    const event = data.event;
    if (!event) return;

    if (event.textOutput) {
      setTranscript(event.textOutput.content);
    } else if (event.audioOutput) {
      const audioData = base64ToFloat32Array(event.audioOutput.content);
      audioPlayerRef.current?.playAudio(audioData);
    } else if (event.error) {
      useNotificationStore.getState().showNotification(event.error.message || 'An unknown error occurred.', 'error');
    }
  }, [setTranscript]);

  const handleWebSocketClose = useCallback(() => {
    const currentStatus = useNovaStore.getState().connectionStatus;
    if (currentStatus === 'CONNECTED' || currentStatus === 'CONNECTING') {
      useNotificationStore.getState().showNotification('Connection closed unexpectedly.', 'error');
      setConnectionStatus('ERROR');
      stopRecordingSession();
    }
  }, [setConnectionStatus, stopRecordingSession]);

  // --- Session Control ---
  const startSession = useCallback(async () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL.replace(/^http/, 'ws');
    const fullUrl = `${baseUrl}/ws/interview/live-interaction/`;

    if (connectionStatus === 'CONNECTED' || connectionStatus === 'CONNECTING') return;
    setConnectionStatus('CONNECTING');

    try {
      // 1. Initialize the high-performance audio player
      audioPlayerRef.current = new AudioPlayer();
      await audioPlayerRef.current.start();

      // 2. Connect the WebSocket and register handlers
      await webSocketClient.connect(fullUrl);
      setConnectionStatus('CONNECTED');
      webSocketClient.registerOnMessageHandler(handleWebSocketMessage);
      webSocketClient.registerOnCloseHandler(handleWebSocketClose);

      // 3. Generate session IDs and send the initial event sequence
      promptNameRef.current = crypto.randomUUID();
      const systemPromptContentName = crypto.randomUUID();
      audioContentNameRef.current = crypto.randomUUID();

      webSocketClient.send(NovaEventFactory.sessionStart());
      webSocketClient.send(NovaEventFactory.promptStart(promptNameRef.current));
      webSocketClient.send(NovaEventFactory.contentStartText(promptNameRef.current, systemPromptContentName));
      webSocketClient.send(NovaEventFactory.textInput(promptNameRef.current, systemPromptContentName, NovaEventFactory.DEFAULT_SYSTEM_PROMPT));
      webSocketClient.send(NovaEventFactory.contentEnd(promptNameRef.current, systemPromptContentName));
      webSocketClient.send(NovaEventFactory.contentStartAudio(promptNameRef.current, audioContentNameRef.current));

      // 4. Set up the microphone for raw audio processing
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const context = new AudioContext();
      audioContextRef.current = context;
      
      const source = context.createMediaStreamSource(stream);
      mediaStreamSourceRef.current = source;
      
      const processor = context.createScriptProcessor(4096, 1, 1);
      scriptProcessorRef.current = processor;

      processor.onaudioprocess = (e) => {
        // Use the global state to check if we should be processing
        if (useNovaStore.getState().isRecording) {
          const inputData = e.inputBuffer.getChannelData(0);
          const base64Audio = processAudioData(inputData, context.sampleRate);
          
          if (promptNameRef.current && audioContentNameRef.current) {
            webSocketClient.send(NovaEventFactory.audioInput(promptNameRef.current, audioContentNameRef.current, base64Audio));
          }
        }
      };

      source.connect(processor);
      processor.connect(context.destination);

      startRecordingSession();

    } catch (err: any) {
      const errorMessage = err.message || 'Failed to start session.';
      useNotificationStore.getState().showNotification(errorMessage, 'error');
      setConnectionStatus('ERROR');
    }
  }, [connectionStatus, setConnectionStatus, handleWebSocketMessage, handleWebSocketClose, startRecordingSession]);

  const stopSession = useCallback(() => {
    // Stop microphone processing
    if (mediaStreamSourceRef.current && scriptProcessorRef.current) {
      mediaStreamSourceRef.current.disconnect();
      scriptProcessorRef.current.disconnect();
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Send session end events
    if (promptNameRef.current && audioContentNameRef.current) {
      webSocketClient.send(NovaEventFactory.contentEnd(promptNameRef.current, audioContentNameRef.current));
      webSocketClient.send(NovaEventFactory.promptEnd(promptNameRef.current));
    }
    webSocketClient.send(NovaEventFactory.sessionEnd());
    
    // Update state and disconnect
    stopRecordingSession();
    webSocketClient.disconnect();
    setConnectionStatus('IDLE');
  }, [stopRecordingSession, setConnectionStatus]);

  // --- Cleanup Effect ---
  useEffect(() => {
    return () => {
      // This runs when the component unmounts, ensuring everything is shut down
      audioPlayerRef.current?.stop();
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      webSocketClient.disconnect();
      resetNovaState();
    };
  }, [resetNovaState]);

  // --- Public API ---
  return {
    connectionStatus,
    isRecording,
    transcript,
    startSession,
    stopSession,
  };
};