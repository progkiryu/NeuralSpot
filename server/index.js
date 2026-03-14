require('dotenv').config();
const express = require('express');
var cors = require('cors');
const { appConfig } = require('./config/AppConfig')

const startServer = async () => {
  // Redis Sessions Database Connection
  const app = express();

  // CORS configuration (example using Express)
  const corsOptions = {
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true, // Allow credentials (cookies)
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
  app.use(cors(corsOptions));

  // App Default Config
  await appConfig(app);
};
startServer();