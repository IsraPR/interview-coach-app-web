// src/lib/AudioPlayer.ts

export default class AudioPlayer {
  private initialized = false;
  private audioContext: AudioContext | null = null;
  private workletNode: AudioWorkletNode | null = null;

  async start() {
    if (this.initialized) return;

    this.audioContext = new AudioContext({ sampleRate: 24000 });

    const workletUrl = '/audio/audioPlayerProcessor.worklet.js';
    // Use a try-catch block for better error handling if the module fails to load
    try {
      await this.audioContext.audioWorklet.addModule(workletUrl);
    } catch (e) {
      console.error(`Failed to load audio worklet at ${workletUrl}`, e);
      return;
    }

    this.workletNode = new AudioWorkletNode(this.audioContext, "audio-player-processor");
    this.workletNode.connect(this.audioContext.destination);

    this.initialized = true;
  }

  stop() {
    if (!this.initialized) return;
    if (this.audioContext) {
      this.audioContext.close();
    }
    if (this.workletNode) {
      this.workletNode.disconnect();
    }
    this.initialized = false;
  }

  playAudio(samples: Float32Array) {
    if (!this.initialized || !this.workletNode) {
      console.error("Audio player is not initialized.");
      return;
    }
    this.workletNode.port.postMessage({
      type: "audio",
      audioData: samples,
    });
  }

  bargeIn() {
    if (!this.initialized || !this.workletNode) return;
    
    this.workletNode.port.postMessage({
      type: "barge-in",
    });
    console.log('Audio player barged in.');
  }
}