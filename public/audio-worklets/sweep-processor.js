class SweepProcessor extends AudioWorkletProcessor {
  phase = 0;
  position = 0;

  startFreq = 20;
  endFreq = 20000;
  duration = 10;

  process(inputs, outputs) {
    const output = outputs[0];

    const totalSamples = sampleRate * this.duration;

    for (const channel of output) {
      for (let i = 0; i < channel.length; i++) {
        const progress = this.position / totalSamples;

        const freq = this.startFreq * Math.pow(this.endFreq / this.startFreq, progress);

        channel[i] = Math.sin(this.phase) * 0.2;

        this.phase += (2 * Math.PI * freq) / sampleRate;

        this.position++;
      }
    }

    if (this.position >= totalSamples) {
      return false;
    }

    return true;
  }
}

registerProcessor('sweep-processor', SweepProcessor);
