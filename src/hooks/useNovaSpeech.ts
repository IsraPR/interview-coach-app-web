// src/hooks/useNovaSpeech.ts

import { useEffect, useRef, useCallback } from 'react';
import { useNovaStore } from '@/store/slices/novaSlice';
import webSocketClient from '@/api/websocketClient';
import { useShallow } from 'zustand/react/shallow';
import { NovaEventFactory } from '@/api/NovaEventFactory';
import { useNotificationStore } from '@/store/slices/notificationSlice';

// Helper functions remain the same
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result?.toString().split(',')[1] || '';
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

export const useNovaSpeech = () => {
  const {
    connectionStatus, isRecording, isSpeaking, transcript, error,
    setConnectionStatus, startRecordingSession, stopRecordingSession,
    setIsSpeaking, setTranscript, setError, resetNovaState,
  } = useNovaStore(useShallow((state) => state));

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioQueueRef = useRef<ArrayBuffer[]>([]);
  // 👇 Refs to store session IDs, just like in the sample
  const promptNameRef = useRef<string | null>(null);
  const audioContentNameRef = useRef<string | null>(null);

  const processAudioQueue = useCallback(async () => {
    if (isSpeaking || audioQueueRef.current.length === 0) return;
    setIsSpeaking(true);
    const audioData = audioQueueRef.current.shift();
    if (audioData && audioContextRef.current) {
      try {
        const audioBuffer = await audioContextRef.current.decodeAudioData(audioData);
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);
        source.start(0);
        source.onended = () => {
          setIsSpeaking(false);
          processAudioQueue();
        };
      } catch (e) {
        console.error('Error decoding or playing audio:', e);
        setIsSpeaking(false);
      }
    } else {
      setIsSpeaking(false);
    }
  }, [isSpeaking, setIsSpeaking]);

  const handleWebSocketClose = useCallback(() => {
    const currentStatus = useNovaStore.getState().connectionStatus;
    if (currentStatus === 'CONNECTED' || currentStatus === 'CONNECTING') {
      useNotificationStore.getState().showNotification("Connection closed unexpectedly.", 'error');
      setConnectionStatus('ERROR');
      // If the connection drops, the recording session is effectively over.
      // This ensures the UI resets to a non-recording state.
      stopRecordingSession(); 
    }
  }, [setError, setConnectionStatus, stopRecordingSession]);

  const handleWebSocketMessage = useCallback((data: any) => {
    const event = data.event;
    if (!event) return;
    if (event.textOutput) {
      setTranscript(event.textOutput.content);
    } else if (event.audioOutput) {
      const audioData = base64ToArrayBuffer(event.audioOutput.content);
      audioQueueRef.current.push(audioData);
      processAudioQueue();
    } else if (event.error) {
      const errorMessage = event.error.message || 'An unknown error occurred.';
      useNotificationStore.getState().showNotification(errorMessage, 'error');
    }
  }, [setTranscript, setError, processAudioQueue]);

  const startSession = useCallback(async () => {
    // Construct the URL from environment variables
    const baseUrl = import.meta.env.VITE_API_BASE_URL.replace(/^http/, 'ws');
    const fullUrl = `${baseUrl}/ws/interview/live-interaction/`;

    if (connectionStatus === 'CONNECTED' || connectionStatus === 'CONNECTING') return;
    setConnectionStatus('CONNECTING');
    setError(null);

    try {
      await webSocketClient.connect(fullUrl);
      setConnectionStatus('CONNECTED');
      webSocketClient.registerOnMessageHandler(handleWebSocketMessage);
      webSocketClient.registerOnCloseHandler(handleWebSocketClose);

      if (!audioContextRef.current) audioContextRef.current = new AudioContext();

      // 1. Generate unique names for this session
      promptNameRef.current = crypto.randomUUID();
      const systemPromptContentName = crypto.randomUUID();
      audioContentNameRef.current = crypto.randomUUID();

      // 2. Send the session start sequence
      webSocketClient.send(NovaEventFactory.sessionStart());
      webSocketClient.send(NovaEventFactory.promptStart(promptNameRef.current));
      webSocketClient.send(NovaEventFactory.contentStartText(promptNameRef.current, systemPromptContentName));
      webSocketClient.send(NovaEventFactory.textInput(promptNameRef.current, systemPromptContentName, NovaEventFactory.DEFAULT_SYSTEM_PROMPT));
      webSocketClient.send(NovaEventFactory.contentEnd(promptNameRef.current, systemPromptContentName));
      webSocketClient.send(NovaEventFactory.contentStartAudio(promptNameRef.current, audioContentNameRef.current));

      // 3. Start the microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });

      mediaRecorderRef.current.ondataavailable = async (event) => {
        if (event.data.size > 0 && promptNameRef.current && audioContentNameRef.current) {
          const base64Audio = await blobToBase64(event.data);
          webSocketClient.send(NovaEventFactory.audioInput(promptNameRef.current, audioContentNameRef.current, base64Audio));
        }
      };

      mediaRecorderRef.current.start(500); // Send audio chunks every 500ms
      startRecordingSession();

    } catch (err: any) {
      useNotificationStore.getState().showNotification('Connection closed unexpectedly.', 'error');
      setConnectionStatus('ERROR');
    }
  }, [connectionStatus, setConnectionStatus, setError, handleWebSocketMessage, startRecordingSession]);

  const stopSession = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    if (promptNameRef.current && audioContentNameRef.current) {
      webSocketClient.send(NovaEventFactory.contentEnd(promptNameRef.current, audioContentNameRef.current));
      webSocketClient.send(NovaEventFactory.promptEnd(promptNameRef.current));
    }
    webSocketClient.send(NovaEventFactory.sessionEnd());
    
    stopRecordingSession(); // Sets isRecording to false
    webSocketClient.disconnect(); // Intentionally close the connection
    setConnectionStatus('IDLE'); // Set our state to reflect the end of the session
  }, [stopRecordingSession]);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current) mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      if (audioContextRef.current) audioContextRef.current.close();
      webSocketClient.disconnect();
      resetNovaState();
    };
  }, [resetNovaState]);

  return {
    connectionStatus, isRecording, isSpeaking, transcript, error,
    startSession, stopSession,
  };
};