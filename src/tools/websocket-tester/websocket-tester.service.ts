export interface WebSocketClientOptions {
  url?: string
  token?: string
  open?: () => void
  close?: () => void
  message?: (data: unknown) => void
  error?: (error: unknown) => void
}

const defaultUrl = 'ws://localhost:8080';
const defaultToken = '*';

// The token is passed as a query parameter, the way the previous client built its url.
export function buildWebSocketUrl({ url, token }: { url?: string; token?: string }) {
  return `${url || defaultUrl}/?token=${token || defaultToken}`;
}

/**
 * Opens a websocket and wires the handlers to it. The constructor is injectable so that tests can
 * drive the socket without a server; the browser passes its own global.
 */
export function createWebSocketClient(
  { url, token, open, close, message, error }: WebSocketClientOptions,
  WebSocketImpl: typeof WebSocket = WebSocket,
) {
  const socket = new WebSocketImpl(buildWebSocketUrl({ url, token }));

  socket.onopen = () => open?.();
  socket.onclose = () => close?.();
  socket.onmessage = event => message?.(event.data);
  socket.onerror = (event) => {
    error?.(event);
    // an errored socket never recovers, so close it rather than leaving it half open
    socket.close();
  };

  return socket;
}
