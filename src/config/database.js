// src/config/database.js
const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017/mi_redsocial";
const client = new MongoClient(uri);

// Función para conectar a la base de datos
async function connectDB() {
    try {
        await client.connect();
        console.log('Conexión a MongoDB local realizada correctamente');
    } catch (error) {
        console.error('Error al conectar a MongoDB local:', error);
    }
}

// Exportar tanto la función de conexión como la base de datos
module.exports = { connectDB, db: client.db('mi_redsocial') };
