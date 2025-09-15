import { io, Socket } from 'socket.io-client';

// NOTE: In a real app, this URL would also come from environment variables
const WEBSOCKET_URL = 'http://localhost:3001'; // Example URL for your WebSocket server

// We export the socket instance.
// The 'autoConnect: false' is important. We don't want to connect immediately
// when the app loads. We want to control when the connection is made,
// for example, after a user logs in.
export const socket: Socket = io(WEBSOCKET_URL, {
  autoConnect: false,
});

// You can also export helper functions to manage the connection
export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
    console.log('WebSocket connected!');
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
    console.log('WebSocket disconnected!');
  }
};