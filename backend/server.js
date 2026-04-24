const express = require('express');
const cors = require('cors');
const connectDB = require("./config/db")
const authRoutes = require('./routes/auth.routes.js')
const containerRoutes = require('./routes/container.routes.js');
const inventoryRoutes = require('./routes/inventory.routes.js');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5174';

app.use(cookieParser());
app.use(cors({
  origin: CLIENT_URL,  
  credentials: true
}));
app.use(express.json()); 
app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRoutes)
app.use('/api/containers', containerRoutes);
app.use('/api/inventory', inventoryRoutes);

app.get('/', (req, res) => {
  res.send('MERN Backend is running!');
});
app.listen(PORT, () => {

  connectDB();

  console.log(`Server is running at http://localhost:${PORT}/api/`);
});