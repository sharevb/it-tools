// composables/useSerialPort.ts
import { onBeforeUnmount, ref } from 'vue';

export function useSerialPort() {
  const isConnected = ref(false);
  const outputLines = ref<string[]>([]);
  const baudRate = ref(9600);
  const lineEnding = ref<'CR' | 'LF' | 'CRLF'>('LF');
  const availablePorts = ref<SerialPort[]>([]);

  let port: SerialPort | null = null;
  let reader: ReadableStreamDefaultReader<string> | null = null;
  let writer: WritableStreamDefaultWriter<string> | null = null;
  let inputDone: Promise<void> | null | undefined = null;
  let outputDone: Promise<void> | null | undefined = null;
  let disconnecting = false;
  let reconnectAttempts = 0;
  const maxReconnects = 3;

  function appendOutput(data: string) {
    outputLines.value.push(data);
  }

  async function listPorts() {
    availablePorts.value = await navigator.serial.getPorts();
  }

  async function connect(selectedPort?: SerialPort) {
    try {
      port = selectedPort || await navigator.serial.requestPort();
      await openPort();
    }
    catch (err) {
      appendOutput(`[Connect error] ${err}`);
    }
  }

  async function openPort() {
    try {
      await port!.open({ baudRate: baudRate.value });
      isConnected.value = true;
      reconnectAttempts = 0;

      const decoder = new TextDecoderStream();
      inputDone = port!.readable!.pipeTo(decoder!.writable);
      reader = decoder.readable.getReader();
      readLoop();

      const encoder = new TextEncoderStream();
      outputDone = encoder.readable.pipeTo(port!.writable!);
      writer = encoder.writable.getWriter();

      appendOutput('[Connected]');
    }
    catch (err) {
      appendOutput(`[Open error] ${err}`);
      attemptReconnect();
    }
  }

  async function disconnect() {
    if (!port || disconnecting) {
      return;
    }
    disconnecting = true;
    appendOutput('[Disconnecting...]');

    try {
      reader?.cancel();
      await inputDone?.catch(() => {});
      reader?.releaseLock();

      await writer?.close().catch(() => {});
      await outputDone?.catch(() => {});
      writer?.releaseLock();

      await port.close();
      appendOutput('[Disconnected]');
    }
    catch (err) {
      appendOutput(`[Teardown error] ${err}`);
    }
    finally {
      isConnected.value = false;
      disconnecting = false;
    }
  }

  async function readLoop() {
    try {
      while (true) {
        const { value, done } = await reader!.read();
        if (done) {
          break;
        }
        if (value) {
          appendOutput(value);
        }
      }
    }
    catch (err) {
      if (!disconnecting) {
        appendOutput(`[Read error] ${err}`);
        attemptReconnect();
      }
    }
  }

  async function send(data: string) {
    if (!writer || !isConnected.value) {
      return;
    }
    const ending = lineEnding.value === 'CR'
      ? '\r'
      : lineEnding.value === 'CRLF'
        ? '\r\n'
        : '\n';
    writer.write(data + ending);
    appendOutput(`> ${data}`);
  }

  async function attemptReconnect() {
    if (reconnectAttempts >= maxReconnects) {
      appendOutput('[Reconnect failed]');
      return;
    }
    reconnectAttempts++;
    appendOutput(`[Reconnecting... attempt ${reconnectAttempts}]`);
    await new Promise(resolve => setTimeout(resolve, 1000 * reconnectAttempts));
    try {
      await openPort();
    }
    catch (err) {
      attemptReconnect();
    }
  }

  onBeforeUnmount(() => {
    disconnect();
  });

  return {
    isConnected,
    outputLines,
    baudRate,
    lineEnding,
    availablePorts,
    connect,
    disconnect,
    send,
    listPorts,
  };
}
