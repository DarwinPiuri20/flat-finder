const express = require('express');
const router = express.Router();
const controller = require('./controller');
const authController= require('../auth/controller');


router.get('/users/:id',controller.getUserById);
router.get('/users',authController.protect,authController.isAdmin,controller.getAllUsers);
router.patch('/users/:id',authController.protect,authController.isOwnerOrAdmin,controller.updateUser);
router.delete('/users/:id',authController.protect,authController.isOwnerOrAdmin,controller.deleteUser);
router.post('/forgot-password',controller.forgotPassword);
router.post('/reset-password',controller.resetPassword);

module.exports = router