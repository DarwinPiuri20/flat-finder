const express= require('express');
const router = express.Router();
const controller = require('./controller');
const authController = require('../auth/controller')


router.post('/',authController.protect,authController.isOwner,controller.addFlat);
router.get('/',controller.getAllFlats);
router.patch('/:id',authController.protect,authController.isOwner,controller.updateFlat);
router.get('/:id',controller.getFlatById);
router.delete('/:id',authController.protect,authController.isOwner,controller.deleteFlat);
router.get('/my-flats/:id',authController.protect,controller.getMyFlats);
router.post('/add-favorite/:id',authController.protect,controller.addFavorite);
router.post('/remove-favorite/:id',authController.protect,controller.removeFavorite);
router.get('/favorites/:id',authController.protect,controller.getFavorites);


///////routes messages

router.get('/:id/messages',authController.protect,controller.getMessages); 
router.get('/:flatId/messages/:senderId',authController.protect,controller.getUserMessages);
router.post('/:flatId/messages',authController.protect,controller.createMessage);

module.exports = router