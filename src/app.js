const dotenv = require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');

/* required all the routes here */
const authRoutes = require('./routes/auth.route');

const app = express();
app.use(express.json());
app.use(cookieParser());
connectDB();

/* using all the routes here */
app.use('/api/auth', authRoutes);

module.exports = app;