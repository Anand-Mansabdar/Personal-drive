require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');


const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const storageRoutes =require('./routes/storage.routes');
const errorHandler = require('./middlewares/error');

const app = express();
connectDB();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

// console.log(authRoutes);
app.use('/api/auth', authRoutes);
// console.log(errorHandler)
app.use(errorHandler);
app.use('/api', storageRoutes)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});