import { Server } from 'socket.io';

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST'],
    },
  });

  // Track online users: userId → socketId
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    // User registers their userId on connect
    socket.on('register', (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit('onlineUsers', Array.from(onlineUsers.keys()));
    });

    // Join a private room per order
    socket.on('joinRoom', (orderId) => {
      socket.join(orderId);
    });

    // Broadcast message to room in real time
    // Message already saved to DB via HTTP POST /api/messages
    socket.on('sendMessage', ({ orderId, message }) => {
      io.to(orderId).emit('receiveMessage', message);
    });

    // Typing indicator
    socket.on('typing', ({ orderId, userId }) => {
      socket.to(orderId).emit('userTyping', userId);
    });

    socket.on('disconnect', () => {
      onlineUsers.forEach((socketId, userId) => {
        if (socketId === socket.id) onlineUsers.delete(userId);
      });
      io.emit('onlineUsers', Array.from(onlineUsers.keys()));
    });
  });
};
