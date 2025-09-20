// src/lib/AudioPlayer.ts

export default class AudioPlayer {
  private initialized = false;
  private audioContext: AudioContext | null = null;
  private workletNode: AudioWorkletNode | null = null;

  async start() {
    if (this.initialized) return;

    this.audioContext = new AudioContext({ sampleRate: 24000 });

    // The URL must be absolute from the public directory
    const workletUrl = '/audio/audioPlayerProcessor.worklet.js';
    await this.audioContext.audioWorklet.addModule(workletUrl);

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
}