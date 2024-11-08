// src/config/multerConfig.js
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueId = uuidv4();
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        cb(null, `${uniqueId}_${timestamp}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
