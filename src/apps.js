// src/app.js
const express = require('express');
const cors = require('cors');
const imageRoutes = require('./routes/imageRoutes');
const connectDB = require('./config/database').connectDB;

const app = express();

// Middleware
// app.use(cors());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());

// Conectar a la base de datos
connectDB();

app.use('/uploads', express.static('uploads'));
app.use('/transformed', express.static('transformed'));

// Rutas
app.use('/api/images', imageRoutes);

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
