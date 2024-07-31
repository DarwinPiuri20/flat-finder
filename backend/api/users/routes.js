const express = require('express');
const router = express.Router();
const controller = require('./controller');
const authController = require('../auth/controller');

// Routes for user
router.get('/users/user/:id', authController.protect, controller.getUserById);
router.get('/', authController.protect, authController.isAdmin, controller.getAllUsers);
router.patch('/user/:id', authController.protect, authController.isOwnerOrAdmin, controller.uploadUserImage, controller.updateUser); // Include multer middleware
router.delete('/users/:id', authController.protect, authController.isOwnerOrAdmin, controller.deleteUser);
router.get('/user-logged', authController.protect, controller.getCurrentUser);

router.post('/forgot-password', controller.forgotPassword);
router.post('/reset-password', controller.resetPassword);

module.exports = router;
