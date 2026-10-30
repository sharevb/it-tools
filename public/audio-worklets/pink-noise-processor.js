class PinkNoiseProcessor extends AudioWorkletProcessor {
  b0 = 0;
  b1 = 0;
  b2 = 0;
  b3 = 0;
  b4 = 0;
  b5 = 0;
  b6 = 0;

  process(inputs, outputs) {
    const output = outputs[0];

    for (const channel of output) {
      for (let i = 0; i < channel.length; i++) {
        const white = Math.random() * 2 - 1;

        this.b0 = 0.99886 * this.b0 + white * 0.0555179;

        this.b1 = 0.99332 * this.b1 + white * 0.0750759;

        this.b2 = 0.969 * this.b2 + white * 0.153852;

        this.b3 = 0.8665 * this.b3 + white * 0.3104856;

        this.b4 = 0.55 * this.b4 + white * 0.5329522;

        this.b5 = -0.7616 * this.b5 - white * 0.016898;

        let pink = this.b0 + this.b1 + this.b2 + this.b3 + this.b4 + this.b5 + this.b6 + white * 0.5362;

        this.b6 = white * 0.115926;

        channel[i] = pink * 0.11;
      }
    }

    return true;
  }
}

registerProcessor('pink-noise-processor', PinkNoiseProcessor);
