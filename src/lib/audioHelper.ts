// src/lib/audioHelper.ts

export function base64ToFloat32Array(base64String: string): Float32Array {
  const binaryString = atob(base64String);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const int16Array = new Int16Array(bytes.buffer);
  const float32Array = new Float32Array(int16Array.length);
  for (let i = 0; i < int16Array.length; i++) {
    float32Array[i] = int16Array[i] / 32768.0;
  }

  return float32Array;
}

const floatTo16BitPCMBase64 = (float32Array: Float32Array): string => {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view = new DataView(buffer);

  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const resampleFloat32 = (inputArray: Float32Array, fromSampleRate: number, toSampleRate: number): Float32Array => {
  if (!inputArray || fromSampleRate === toSampleRate) return inputArray;

  const ratio = fromSampleRate / toSampleRate;
  const newLength = Math.max(1, Math.round(inputArray.length / ratio));
  const resampled = new Float32Array(newLength);

  let offsetResult = 0;
  let offsetBuffer = 0;
  while (offsetResult < resampled.length) {
    const nextOffsetBuffer = Math.round((offsetResult + 1) * ratio);
    let accum = 0;
    let count = 0;
    for (let i = offsetBuffer; i < nextOffsetBuffer && i < inputArray.length; i++) {
      accum += inputArray[i];
      count++;
    }
    resampled[offsetResult] = count > 0 ? accum / count : 0;
    offsetResult++;
    offsetBuffer = nextOffsetBuffer;
  }
  return resampled;
};

export const processAudioData = (audioData: Float32Array, inputSampleRate: number, targetSampleRate = 16000): string => {
  const resampled = resampleFloat32(audioData, inputSampleRate, targetSampleRate);
  return floatTo16BitPCMBase64(resampled);
};