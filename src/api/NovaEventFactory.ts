// src/api/NovaEventFactory.ts

import { SessionData } from '@/types';

// Define a type for the inference configuration for clarity
type InferenceConfig = SessionData['inference_config'];

export class NovaEventFactory {
  // --- DEFAULT CONFIGURATIONS ---
  static DEFAULT_INFER_CONFIG: InferenceConfig = {
    maxTokens: 1024,
    topP: 0.95,
    temperature: 0.7,
  };

  static DEFAULT_SYSTEM_PROMPT = `You are a helpful and friendly assistant.`;

  static DEFAULT_AUDIO_OUTPUT_CONFIG = {
    mediaType: "audio/lpcm",
    sampleRateHertz: 24000,
    sampleSizeBits: 16,
    channelCount: 1,
    voiceId: "matthew",
    encoding: "base64",
    audioType: "SPEECH",
  };

  // --- EVENT CREATION METHODS ---

  /**
   * UPDATED: Now accepts an optional inferenceConfig.
   */
  static sessionStart(inferenceConfig: InferenceConfig = this.DEFAULT_INFER_CONFIG) {
    return { event: { sessionStart: { inferenceConfiguration: inferenceConfig } } };
  }

  static promptStart(promptName: string, audioOutputConfig = this.DEFAULT_AUDIO_OUTPUT_CONFIG) {
    return {
      event: {
        promptStart: {
          promptName: promptName,
          textOutputConfiguration: { mediaType: "text/plain" },
          audioOutputConfiguration: audioOutputConfig,
          toolUseOutputConfiguration: { mediaType: "application/json" },
        },
      },
    };
  }

  static contentStartText(promptName: string, contentName: string, role: 'SYSTEM' | 'USER' = 'SYSTEM') {
    return {
      event: {
        contentStart: {
          promptName,
          contentName,
          type: 'TEXT',
          interactive: true,
          role,
          textInputConfiguration: { mediaType: 'text/plain' },
        },
      },
    };
  }

  /**
   * UPDATED: Now accepts a systemPrompt argument.
   */
  static textInput(promptName: string, contentName: string, systemPrompt: string = this.DEFAULT_SYSTEM_PROMPT) {
    return {
      event: {
        textInput: {
          promptName,
          contentName,
          content: systemPrompt,
        },
      },
    };
  }

  static contentEnd(promptName: string, contentName: string) {
    return {
      event: {
        contentEnd: {
          promptName,
          contentName,
        },
      },
    };
  }

  static contentStartAudio(promptName: string, contentName: string) {
    return {
      event: {
        contentStart: {
          promptName,
          contentName,
          type: 'AUDIO',
          interactive: true,
          role: 'USER',
          audioInputConfiguration: {
            mediaType: "audio/lpcm",
            sampleRateHertz: 16000,
            sampleSizeBits: 16,
            channelCount: 1,
            audioType: "SPEECH",
            encoding: "base64",
          },
        },
      },
    };
  }

  static audioInput(promptName: string, contentName: string, content: string) {
    return {
      event: {
        audioInput: {
          promptName,
          contentName,
          content, // Base64 encoded audio
        },
      },
    };
  }

  static promptEnd(promptName: string) {
    return {
      event: {
        promptEnd: {
          promptName,
        },
      },
    };
  }

  static sessionEnd() {
    return { event: { sessionEnd: {} } };
  }
}