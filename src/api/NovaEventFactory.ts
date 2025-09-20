// src/api/NovaEventFactory.ts

// This is a high-fidelity TypeScript version of the S2sEvent.js helper class.
// It includes the default configurations and creates the exact payloads the sample uses.

export class NovaEventFactory {
  // --- DEFAULT CONFIGURATIONS (as seen in the sample) ---

  static DEFAULT_INFER_CONFIG = {
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
    voiceId: "matthew", // A default voice
    encoding: "base64",
    audioType: "SPEECH",
  };

  // --- EVENT CREATION METHODS ---

  static sessionStart(inferenceConfig = this.DEFAULT_INFER_CONFIG) {
    return { event: { sessionStart: { inferenceConfiguration: inferenceConfig } } };
  }

  static promptStart(promptName: string, audioOutputConfig = this.DEFAULT_AUDIO_OUTPUT_CONFIG) {
    return {
      event: {
        promptStart: {
          promptName: promptName,
          // The sample includes these default output configurations
          textOutputConfiguration: {
            mediaType: "text/plain",
          },
          audioOutputConfiguration: audioOutputConfig,
          toolUseOutputConfiguration: {
            mediaType: "application/json",
          },
          toolConfiguration: {
            "tools": []
          }
          // We can omit the toolConfiguration if not using tools for now
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
          interactive: false,
          role,
          textInputConfiguration: {
            mediaType: 'text/plain',
          },
        },
      },
    };
  }

  static textInput(promptName: string, contentName: string, content: string) {
    return {
      event: {
        textInput: {
          promptName,
          contentName,
          content,
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
          // The sample includes a default audio input config here
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