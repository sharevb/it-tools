import { describe, expect, it, vi } from 'vitest';
import { buildWebSocketUrl, createWebSocketClient } from './websocket-tester.service';

class FakeWebSocket {
  static instances: FakeWebSocket[] = [];

  onopen: (() => void) | null = null;
  onclose: (() => void) | null = null;
  onmessage: ((event: { data: unknown }) => void) | null = null;
  onerror: ((event: unknown) => void) | null = null;
  close = vi.fn<() => void>();

  constructor(public url: string) {
    FakeWebSocket.instances.push(this);
  }
}

function createClient(options: Parameters<typeof createWebSocketClient>[0] = {}) {
  FakeWebSocket.instances = [];
  const socket = createWebSocketClient(options, FakeWebSocket as unknown as typeof WebSocket);

  return socket as unknown as FakeWebSocket;
}

describe('websocket-tester', () => {
  describe('buildWebSocketUrl', () => {
    it('passes the token as a query parameter', () => {
      expect(buildWebSocketUrl({ url: 'ws://example.com:9000', token: 'abc' })).toBe(
        'ws://example.com:9000/?token=abc',
      );
    });

    it('falls back to the defaults when the url or the token is empty', () => {
      expect(buildWebSocketUrl({ url: '', token: '' })).toBe('ws://localhost:8080/?token=*');
      expect(buildWebSocketUrl({})).toBe('ws://localhost:8080/?token=*');
      expect(buildWebSocketUrl({ url: 'wss://example.com' })).toBe('wss://example.com/?token=*');
      expect(buildWebSocketUrl({ token: 'abc' })).toBe('ws://localhost:8080/?token=abc');
    });
  });

  describe('createWebSocketClient', () => {
    it('connects to the built url', () => {
      const socket = createClient({ url: 'ws://example.com:9000', token: 'abc' });

      expect(socket.url).toBe('ws://example.com:9000/?token=abc');
    });

    it('returns the socket itself, so callers can send on it', () => {
      const socket = createClient({ url: 'ws://example.com' });

      expect(FakeWebSocket.instances).toHaveLength(1);
      expect(socket).toBe(FakeWebSocket.instances[0]);
    });

    it('forwards the open and close events', () => {
      const open = vi.fn<() => void>();
      const close = vi.fn<() => void>();
      const socket = createClient({ open, close });

      socket.onopen?.();
      socket.onclose?.();

      expect(open).toHaveBeenCalledTimes(1);
      expect(close).toHaveBeenCalledTimes(1);
    });

    it('forwards the message payload rather than the event', () => {
      const message = vi.fn<(data: unknown) => void>();
      const socket = createClient({ message });

      socket.onmessage?.({ data: 'hello' });

      expect(message).toHaveBeenCalledWith('hello');
    });

    it('closes the socket after an error', () => {
      const error = vi.fn<(error: unknown) => void>();
      const socket = createClient({ error });
      const event = { type: 'error' };

      socket.onerror?.(event);

      expect(error).toHaveBeenCalledWith(event);
      expect(socket.close).toHaveBeenCalledTimes(1);
    });

    it('does not throw when no handler is provided', () => {
      const socket = createClient({});

      expect(() => {
        socket.onopen?.();
        socket.onmessage?.({ data: 'hello' });
        socket.onerror?.({ type: 'error' });
        socket.onclose?.();
      }).not.toThrow();
    });
  });
});
