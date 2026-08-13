import { io } from 'socket.io-client';

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  (import.meta.env.VITE_API_BASE_URL
    ? String(import.meta.env.VITE_API_BASE_URL).replace(/\/api\/?$/, '')
    : 'http://localhost:5000');

let sharedSocket = null;

export const getArtboardSocket = () => {
  if (sharedSocket) return sharedSocket;

  sharedSocket = io(SOCKET_URL, {
    path: '/socket.io',
    transports: ['websocket', 'polling'],
    autoConnect: true,
    withCredentials: true
  });

  return sharedSocket;
};

export const getSocketId = () => sharedSocket?.id || '';

export default getArtboardSocket;
