import express from 'express';
import { createServer } from 'http';
import dotenv from 'dotenv';
dotenv.config();

import connectDB from './src/config/db.js';
import app from './src/app.js';
import { initSocket } from './src/socket.js';

// Force CORS on every response — before everything
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  next();
});

const httpServer = createServer(app);
initSocket(httpServer);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`DevHire server running on port ${PORT}`);
  });
});