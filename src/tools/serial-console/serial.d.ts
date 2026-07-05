// serial.d.ts
interface SerialPort {
  open(options: { baudRate: number }): Promise<void>
  close(): Promise<void>
  readable: ReadableStream | null
  writable: WritableStream | null
  getInfo(): { usbVendorId?: number; usbProductId?: number }
}

interface Serial extends EventTarget {
  getPorts(): Promise<SerialPort[]>
  requestPort(options?: { filters: Array<{ usbVendorId?: number; usbProductId?: number }> }): Promise<SerialPort>
}

interface Navigator {
  serial: Serial
}
