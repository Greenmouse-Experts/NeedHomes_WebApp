import { io, Socket } from 'socket.io-client';

// Get JWT token from your auth system
const token = localStorage.getItem('authToken');

// Connect to WebSocket server
const socket: Socket = io(import.meta.env.VITE_BACKEND_URL || 'https://needhomes-backend-staging.onrender.com', {
  auth: {
    token: token  // Pass JWT token for authentication
  },
  // OR pass in headers
  extraHeaders: {
    Authorization: `Bearer ${token}`
  },
  transports: ['websocket', 'polling'], // Fallback to polling if WebSocket fails
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
});

// Connection event handlers
socket.on('connect', () => {
  console.log('✅ Connected to WebSocket');
});

socket.on('disconnect', (reason) => {
  console.log('❌ Disconnected:', reason);
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});

// Server confirms connection with user data
socket.on('connected', (data) => {
  console.log('User data:', data);
  // data = { userId, email, role, isAdmin, timestamp }
});
