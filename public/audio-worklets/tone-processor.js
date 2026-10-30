class ToneProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      {
        name: 'frequency',
        defaultValue: 440,
        minValue: 20,
        maxValue: 20000,
      },
      {
        name: 'gain',
        defaultValue: 0.2,
        minValue: 0,
        maxValue: 1,
      },
    ];
  }

  phase = 0;

  process(inputs, outputs, parameters) {
    const output = outputs[0];

    const frequencies = parameters.frequency;
    const gains = parameters.gain;

    for (let channel = 0; channel < output.length; channel++) {
      const data = output[channel];

      for (let i = 0; i < data.length; i++) {
        const frequency = frequencies.length > 1 ? frequencies[i] : frequencies[0];

        const gain = gains.length > 1 ? gains[i] : gains[0];

        data[i] = Math.sin(this.phase) * gain;

        this.phase += (2 * Math.PI * frequency) / sampleRate;

        if (this.phase > Math.PI * 2) {
          this.phase -= Math.PI * 2;
        }
      }
    }

    return true;
  }
}

registerProcessor('tone-processor', ToneProcessor);
