const express = require('express');
const router = express.Router();
const controller = require('./controller');
const authController = require('../auth/controller');

// Routes for user
router.get('/users/user/:id', authController.protect, controller.getUserById);
router.get('/', authController.protect, authController.isAdmin, controller.getAllUsers);
router.patch('/user/:id', authController.protect, authController.isOwnerOrAdmin, controller.uploadUserImage, controller.updateUser); 
router.delete('/user/:id', authController.protect, authController.isOwnerOrAdmin, controller.deleteUser);
router.get('/user-logged', authController.protect, controller.getCurrentUser);
router.patch('/user-logged', authController.protect, controller.uploadUserImage, controller.updateUserLogged); 

// Routes for Reset Password
router.post('/forgot-password', controller.forgotPassword);
router.post('/reset-password/:token', controller.resetPassword);

module.exports = router;
