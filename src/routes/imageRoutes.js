// src/routes/imageRoutes.js
const express = require('express');
const upload = require('../config/multerConfig'); // Importar la configuración de multer
const { processImage, getAllPublications, getUserPublications } = require('../controllers/imageController'); // Importar los controladores

const router = express.Router();

router.post('/upload', upload.single('image'), processImage);
router.get('/publications', getAllPublications); // Nueva ruta para obtener todas las publicaciones
router.get('/publications/user/:user', getUserPublications);

module.exports = router;
