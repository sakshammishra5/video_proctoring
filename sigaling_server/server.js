const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

// Simple Socket.IO setup
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Store rooms (simple object)
const rooms = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Join room
  socket.on('join-room', (data) => {
    const { roomId, userType } = data;
    
    socket.join(roomId);
    
    // Store user info
    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }
    rooms[roomId].push({ id: socket.id, type: userType });
    
    console.log(`${userType} joined room: ${roomId}`);
    
    // Tell others someone joined
    socket.to(roomId).emit('user-joined', { userType, socketId: socket.id });
  });
  
  // Forward WebRTC offer
  socket.on('offer', (data) => {
    console.log('Forwarding offer');
    socket.to(data.roomId).emit('offer', data);
  });
  
  // Forward WebRTC answer
  socket.on('answer', (data) => {
    console.log('Forwarding answer');
    socket.to(data.roomId).emit('answer', data);
  });
  
  // Forward ICE candidate
  socket.on('ice-candidate', (data) => {
    console.log('Forwarding ICE candidate');
    socket.to(data.roomId).emit('ice-candidate', data);
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remove from rooms
    for (let roomId in rooms) {
      rooms[roomId] = rooms[roomId].filter(user => user.id !== socket.id);
      if (rooms[roomId].length === 0) {
        delete rooms[roomId];
      }
    }
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 Signaling server running on port ${PORT}`);
});