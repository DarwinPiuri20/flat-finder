const Flat = require('./model');
const User = require('../users/model');
const Message = require('../messages/model');
const mongoose = require('mongoose');


    exports.addFlat = async (req, res) => {
    try{
    // Crear un nuevo flat
    const flat = new Flat(req.body);
    flat.created = new Date();
    flat.modified = new Date();
    flat.ownerId = req.user._id; 

    // Guardar el flat
    await flat.save();

    // Actualizar el usuario
    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    // Verificar que el array flats existe en el usuario antes de agregar el nuevo flat
    if (!user.flats) {
        user.flats = [];
    }

    user.flats.push(flat._id); // Agregar el ID del nuevo flat al array flats
    user.flatsCount++; // Incrementar el contador de flats
    await user.save();

    res.status(201).json({ status: 'success', flat: flat });
    } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
    }
        }

exports.getAllFlats = async (req, res) => {
    const filter =req.query.filter || {};
    const queryFilter = {}

    if(filter.city){
        queryFilter.city = {
            $regex: filter.city,
            $options: 'i'
        }
    }
    
    if(filter.hasAc){
        queryFilter.hasAc = {
            $eq: filter.hasAc
        }
    }
    if(filter.price){
        const arrayCounter = filter.price.split('-');
        filter.priceMin = arrayCounter[0];
        filter.priceMax = arrayCounter[1];
    }

    if(filter.priceMin){
        queryFilter.price = {
            $gte: parseInt(filter.priceMin)
        }
    }

    if(filter.priceMax){
        queryFilter.price = {
            $lte: parseInt(filter.priceMax)
        }
    }

    if(filter.priceMin && filter.priceMax){
        queryFilter.price = {
            $gte: parseInt(filter.priceMin),
            $lte: parseInt(filter.priceMax)
        }
    }

const orderBy= req.query.orderBy || 'city';
const order = req.query.order || 'asc';


    const flats = await Flat.find(queryFilter).sort({[orderBy]: order});
    res.status(200).json({ status: 'success', flats: flats });
    }  




exports.updateFlat = async (req, res) => {
    try {
        const flatId = req.params.id;
        const flat = await Flat.findById(flatId); 
        if (!flat) {
            return res.status(404).json({ status: 'fail', message: 'Flat not found' });
        }
        if (!flat.ownerId || !req.user._id) {
            return res.status(400).json({ status: 'fail', message: 'Invalid data' });
        }
        if (flat.ownerId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ status: 'fail', message: 'You are not authorized to perform this action' });
        }
        await flat.updateOne(req.body);
        res.status(200).json({ status: 'success', flat: flat });
    } catch (e) {
        res.status(404).json({ status: 'fail', message: 'error:0' + e });
    }
}

exports.getMyFlats = async (req, res) => {
    try {
       const flats = await Flat.find({ownerId: req.user._id})   // Obtener el ObjectId del usuario autenticado
        return res.status(200).json({ status: 'success', flats: flats });
    } catch (error) {
        console.error('Error fetching user flats:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
exports.getFlatById = async (req, res) => {
    try {
        const flatId = req.params.id;
        const flat = await Flat.findById({ _id: flatId });
        if (!flat) {
            return res.status(404).json({ status: 'fail', message: 'Flat not found' });
        }

        res.status(200).json({ status: 'success', data: flat });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};


exports.deleteFlat = async (req, res) => {
    try {
        const flatId = req.params.id;
        const flat = await Flat.findById(flatId);
        if (!flat) {
            return res.status(404).json({ status: 'fail', message: 'Flat not found' });
        }
        if (!flat.ownerId || !req.user._id) {
            return res.status(400).json({ status: 'fail', message: 'Invalid data' });
        }
        if (flat.ownerId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ status: 'fail', message: 'You are not authorized to perform this action' });
        }
        await flat.deleteOne();
        res.status(200).json({ status: 'success', message: 'Flat deleted successfully' });
    } catch (e) {
        res.status(404).json({ status: 'fail', message: 'error:0' + e });
    }
};




////////messages
exports.getMessages = async (req, res) => {
   
        try{
        const messages = await Message.find().populate('FlatId');
        const ownerMessages = messages.filter(message => {
           
            return message.FlatId.ownerId.toString() === req.user._id.toString();
        });
        res.status(200).json({ status: 'success', messages: ownerMessages });
        } catch (e) {
            
        }
}

exports.getUserMessages = async (req, res) => {
    try {
       
        const userId = req.user._id;
         
        const userMessages = await Message.find({ userId: userId }).populate('senderId');
        console.log(userId)
        console.log(userMessages)
        res.status(200).json({ status: 'success', messages: userMessages });
    } catch (e) {
        res.status(500).json({ status: 'fail', message: 'error:0' + e });
    }
};

exports.createMessage = async (req, res) => {
    try {
        const { content } = req.body;
        const { flatId } = req.params;
        const senderId = req.user._id;

        if (!flatId) {
            return res.status(400).json({ status: 'fail', message: 'FlatId is required' });
        }
        //verificar si el usuario existe
        const user = await User.findById(senderId);
        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }

        const flat = await Flat.findById(flatId);
        if (!flat) {
            return res.status(404).json({ status: 'fail', message: 'Flat not found' });
        }

        const newMessage = new Message({
            content: content,
            SenderId: senderId,
            FlatId: flatId
        });

        await newMessage.save();

        flat.messages.push(newMessage._id);
        await flat.save();
        // agregar el mesaje en el usuario
        user.messages.push(newMessage._id);
        await user.save();
        res.status(201).json({ status: 'success', message: newMessage });
    } catch (e) {
        res.status(500).json({ status: 'fail', message: 'Error: ' + e });
    }
};

exports.addFavorite = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user.favoriteFlats){
            user.favoriteFlats = [];
        } 
        const flatId = req.params.id;
        console.log('adios',flatId)
        const flat = await Flat.find({ _id: flatId });
        console.log('hola',flat)
        if (!flat || flat.length === 0) {
            return res.status(404).json({ status: 'fail', message: 'Flat not found' });
        }

        user.favoriteFlats.push(flat[0]._id);
        await user.save();
        res.status(200).json({ status: 'success', message: 'Favorite added successfully' });
    } catch (e) {
        res.status(500).json({ status: 'fail', message: 'Error: ' + e });
    }
};

exports.getFavorites = async (req, res) => {
    try{
      const user = await User.findById(req.user._id);
      const flats = await Flat.find({ _id: { $in: user.favoriteFlats } });
      res.status(200).json({ status: 'success', flats: flats });  
    }catch(e){
        res.status(500).json({ status: 'fail', message: 'Error: ' + e });
    }
};

exports.removeFavorite = async (req, res) => {
    const user = await User.findById(req.user._id);
    const flatId = req.params.id;
    const index = user.favoriteFlats.indexOf(flatId);
    if (index > -1) {
        user.favoriteFlats.splice(index, 1);
        await user.save();
        res.status(200).json({ status: 'success', message: 'Favorite removed successfully' });
    } else {
        res.status(404).json({ status: 'fail', message: 'Favorite not found' });
    }
};
