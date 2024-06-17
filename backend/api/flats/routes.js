const express= require('express');
const router = express.Router();
const controller = require('./controller');
const authController = require('../auth/controller')


router.post('/',authController.protect,authController.isOwner,controller.addFlat);
router.get('/',controller.getAllFlats);
router.patch('/:id',authController.protect,authController.isOwner,controller.updateFlat);
router.get('/:id',controller.getFlatById);
router.delete('/:id',authController.protect,authController.isOwner,controller.deleteFlat);


///////routes messages

router.get('/:id/messages',authController.protect,controller.getMessages); 
router.get('/:flatId/messages/:senderId',authController.protect,controller.getUserMessages);
router.post('/:flatId/messages',authController.protect,controller.createMessage);

module.exports = router