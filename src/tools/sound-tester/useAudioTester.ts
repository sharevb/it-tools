import { onBeforeUnmount } from 'vue';
import { appBaseUrl as base } from '@/utils/base-url';

export function useAudioTester() {
  let context: AudioContext | null = null;
  let node: AudioNode | null = null;
  let oscillator: AudioWorkletNode | null = null;

  async function getContext() {
    if (context) {
      return context;
    }

    context = new AudioContext();

    await context.audioWorklet.addModule(`${base}audio-worklets/tone-processor.js`);
    await context.audioWorklet.addModule(`${base}audio-worklets/sweep-processor.js`);
    await context.audioWorklet.addModule(`${base}audio-worklets/white-noise-processor.js`);
    await context.audioWorklet.addModule(`${base}audio-worklets/pink-noise-processor.js`);

    return context;
  }

  function stop() {
    node?.disconnect();
    oscillator?.disconnect();

    node = null;
    oscillator = null;
  }

  async function playTone(frequency: number, pan = 0) {
    stop();

    const ctx = await getContext();

    const tone = new AudioWorkletNode(ctx, 'tone-processor');

    tone.parameters.get('frequency')?.setValueAtTime(frequency, ctx.currentTime);

    const panner = new StereoPannerNode(ctx, {
      pan,
    });

    tone.connect(panner);
    panner.connect(ctx.destination);

    oscillator = tone;
    node = panner;
  }

  async function playSweep() {
    stop();

    const ctx = await getContext();

    const worklet = new AudioWorkletNode(ctx, 'sweep-processor');

    worklet.connect(ctx.destination);

    oscillator = worklet;
  }

  async function playWhiteNoise() {
    stop();

    const ctx = await getContext();

    const worklet = new AudioWorkletNode(ctx, 'white-noise-processor');

    worklet.connect(ctx.destination);

    oscillator = worklet;
  }

  async function playPinkNoise() {
    stop();

    const ctx = await getContext();

    const worklet = new AudioWorkletNode(ctx, 'pink-noise-processor');

    worklet.connect(ctx.destination);

    oscillator = worklet;
  }

  async function destroy() {
    stop();

    if (context) {
      await context.close();
      context = null;
    }
  }

  onBeforeUnmount(destroy);

  return {
    playTone,
    playSweep,
    playWhiteNoise,
    playPinkNoise,
    stop,
  };
}
