const express = require('express');
const router = express.Router();
const controller = require('./controller');
const authController = require('../auth/controller');
const upload = require('../../services/multer'); // Importar la configuración de multer

// Rutas para flats
router.post('/', authController.protect, authController.isOwner, upload.single('image'), controller.addFlat);
router.get('/', controller.getAllFlats);
router.patch('/:id', authController.protect, authController.isOwner, controller.updateFlat);
router.get('/:id', controller.getFlatById);
router.delete('/:id', authController.protect, authController.isOwner, controller.deleteFlat);
router.get('/my-flats/:id', authController.protect, controller.getMyFlats);
router.post('/add-favorite/:id', authController.protect, controller.addFavorite);
router.post('/remove-favorite/:id', authController.protect, controller.removeFavorite);
router.get('/favorites/:id', authController.protect, controller.getFavorites);

// Ruta de prueba para subir una imagen
router.post('/:id/upload-image', authController.protect, authController.isOwner, upload.single('image'), controller.uploadImage);

module.exports = router;
