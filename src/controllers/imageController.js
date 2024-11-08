// src/controllers/imageController.js
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { db } = require('../config/database'); // Importar la base de datos correctamente

// Función para obtener todas las publicaciones en orden descendente
const getAllPublications = async (req, res) => {
    try {
        const publications = await db.collection('publication')
            .find()
            .sort({ createdAt: -1 }) // Orden descendente según createdAt
            .toArray();

        res.status(200).json(publications);
    } catch (error) {
        console.error('Error al obtener las publicaciones:', error);
        res.status(500).json({ message: 'Error al obtener las publicaciones' });
    }
};

// Función para procesar imágenes y almacenar las rutas en la base de datos
const processImage = async (req, res) => {
    const id_user = req.body.id_user;
    const description = req.body.description;
    const originalImagePath = req.file.path.replace(/\\/g, '/'); // Reemplazar barras invertidas con barras normales
    const outputDir = 'transformed/';
    
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    try {
        const filename = path.basename(originalImagePath, path.extname(originalImagePath));

        // Reducción de escala
        const smallImagePath = `${outputDir}${filename}_small.jpg`;
        await sharp(originalImagePath).resize(200).toFile(smallImagePath);

        // Blanco y negro
        const bwImagePath = `${outputDir}${filename}_bw.jpg`;
        await sharp(originalImagePath).grayscale().toFile(bwImagePath);

        // Sepia
        const sepiaImagePath = `${outputDir}${filename}_sepia.jpg`;
        await sharp(originalImagePath).tint({ r: 112, g: 66, b: 20 }).toFile(sepiaImagePath);

        // Inserta la publicación en la base de datos
        await db.collection('publication').insertOne({
            user: id_user,
            description: description,
            imagePaths: {
                original: originalImagePath,
                small: smallImagePath,
                bw: bwImagePath,
                sepia: sepiaImagePath
            },
            createdAt: new Date()
        });

        res.status(200).send({ message: 'Imágenes transformadas y almacenadas en la base de datos con éxito.' });
    } catch (error) {
        console.error('Error al procesar las imágenes:', error);
        res.status(500).send('Ocurrió un error al procesar las imágenes.');
    }
};

const getUserPublications = async (req, res) => {
    const userId = req.params.user;

    try {
        const userPublications = await db.collection('publication')
            .find({ user: userId })
            .sort({ createdAt: -1 }) // Orden descendente por fecha de creación
            .toArray();

        res.status(200).json(userPublications);
    } catch (error) {
        console.error('Error al obtener las publicaciones del usuario:', error);
        res.status(500).json({ message: 'Error al obtener las publicaciones del usuario' });
    }
};

module.exports = { processImage, getAllPublications, getUserPublications };
