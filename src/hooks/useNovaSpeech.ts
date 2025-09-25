// src/hooks/useNovaSpeech.ts

import { useEffect, useRef, useCallback } from 'react';
import { useNovaStore } from '@/store/slices/novaSlice';
import { useNotificationStore } from '@/store/slices/notificationSlice';
import webSocketClient from '@/api/websocketClient';
import { useShallow } from 'zustand/react/shallow';
import { NovaEventFactory } from '@/api/NovaEventFactory';
import { base64ToFloat32Array, processAudioData } from '@/lib/audioHelper';
import AudioPlayer from '@/lib/AudioPlayer';
import type { SessionData } from '@/types';

export const useNovaSpeech = () => {
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

  const audioPlayerRef = useRef<AudioPlayer | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  
  const promptNameRef = useRef<string | null>(null);
  const audioContentNameRef = useRef<string | null>(null);

  const handleWebSocketMessage = useCallback((data: any) => {
    const event = data.event;
    if (!event) return;

    if (event.textOutput) {
      const content = event.textOutput.content;
      if (content.startsWith('{')) {
        try {
          const parsedContent = JSON.parse(content);
          if (parsedContent.interrupted === true) {
            audioPlayerRef.current?.bargeIn();
            return;
          }
        } catch (e) { /* Not JSON, treat as text */ }
      }
      setTranscript(content);
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

  const startSession = useCallback(async (sessionData: SessionData) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL.replace(/^http/, 'ws');
    const fullUrl = `${baseUrl}/ws/interview/live-interaction/`;

    if (connectionStatus === 'CONNECTED' || connectionStatus === 'CONNECTING') return;
    setConnectionStatus('CONNECTING');

    try {
      audioPlayerRef.current = new AudioPlayer();
      await audioPlayerRef.current.start();

      await webSocketClient.connect(fullUrl);
      setConnectionStatus('CONNECTED');
      webSocketClient.registerOnMessageHandler(handleWebSocketMessage);
      webSocketClient.registerOnCloseHandler(handleWebSocketClose);

      promptNameRef.current = sessionData.prompt_name;
      const systemPromptContentName = crypto.randomUUID();
      audioContentNameRef.current = crypto.randomUUID();

      webSocketClient.send(NovaEventFactory.sessionStart(sessionData.inference_config));
      webSocketClient.send(NovaEventFactory.promptStart(promptNameRef.current));
      webSocketClient.send(NovaEventFactory.contentStartText(promptNameRef.current, systemPromptContentName));
      webSocketClient.send(NovaEventFactory.textInput(promptNameRef.current, systemPromptContentName, sessionData.s2s_system_prompt));
      webSocketClient.send(NovaEventFactory.contentEnd(promptNameRef.current, systemPromptContentName));
      webSocketClient.send(NovaEventFactory.contentStartAudio(promptNameRef.current, audioContentNameRef.current));

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const context = new AudioContext();
      audioContextRef.current = context;
      
      const source = context.createMediaStreamSource(stream);
      mediaStreamSourceRef.current = source;
      
      const processor = context.createScriptProcessor(4096, 1, 1);
      scriptProcessorRef.current = processor;

      processor.onaudioprocess = (e) => {
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

  const stopSession = useCallback(async () => {
    audioPlayerRef.current?.bargeIn();

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
    
    if (promptNameRef.current && audioContentNameRef.current) {
      webSocketClient.send(NovaEventFactory.contentEnd(promptNameRef.current, audioContentNameRef.current));
      webSocketClient.send(NovaEventFactory.promptEnd(promptNameRef.current));
    }
    webSocketClient.send(NovaEventFactory.sessionEnd());
    
    stopRecordingSession();
    webSocketClient.disconnect();
    setConnectionStatus('IDLE');
  }, [stopRecordingSession, setConnectionStatus]);

  useEffect(() => {
    return () => {
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

  return {
    connectionStatus,
    isRecording,
    transcript,
    startSession,
    stopSession,
  };
};