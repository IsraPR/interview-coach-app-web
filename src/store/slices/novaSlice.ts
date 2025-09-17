// src/store/slices/novaSlice.ts

import { create } from 'zustand';

// Define the possible states for our WebSocket connection
export type NovaConnectionStatus = 'IDLE' | 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'ERROR';

// Define the shape of our state and the actions that can modify it
interface NovaState {
  connectionStatus: NovaConnectionStatus;
  isRecording: boolean;
  isSpeaking: boolean;
  transcript: string;
  error: string | null;

  // Actions
  setConnectionStatus: (status: NovaConnectionStatus) => void;
  startRecordingSession: () => void;
  stopRecordingSession: () => void;
  setIsSpeaking: (isSpeaking: boolean) => void;
  appendTranscript: (text: string) => void;
  setTranscript: (text: string) => void;
  setError: (error: string | null) => void;
  resetNovaState: () => void;
}

// Define the initial state for the slice
const initialState = {
  connectionStatus: 'IDLE' as NovaConnectionStatus,
  isRecording: false,
  isSpeaking: false,
  transcript: '',
  error: null,
};

export const useNovaStore = create<NovaState>((set, get) => ({
  ...initialState,

  // --- ACTIONS ---

  setConnectionStatus: (status) => {
    set({ connectionStatus: status });
  },

  startRecordingSession: () => {
    // When a new recording starts, reset the transcript and any old errors.
    set({ isRecording: true, transcript: '', error: null });
  },

  stopRecordingSession: () => {
    set({ isRecording: false });
  },

  setIsSpeaking: (isSpeaking) => {
    set({ isSpeaking });
  },

  appendTranscript: (text) => {
    // Adds new text to the existing transcript, with a space in between.
    // The `get()` function allows us to access the current state inside an action.
    set({ transcript: get().transcript + text });
  },

  setTranscript: (text) => {
    // Replaces the entire transcript. Useful for final transcripts.
    set({ transcript: text });
  },

  setError: (error) => {
    set({ error });
  },

  resetNovaState: () => {
    // Resets the entire slice back to its initial state.
    // Useful for cleaning up when the user navigates away from the page.
    set(initialState);
  },
}));