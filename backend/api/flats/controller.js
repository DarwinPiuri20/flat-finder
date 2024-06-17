const Flat = require('./model');
const User = require('../users/model');
const Message = require('../messages/model');


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
    try{
        const flats = await Flat.find();
        res.status(200).json({status:'success',flats:flats});
    }catch(e){
        res.status(404).json({status:'fail',message:'error:0'+e});
    }
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
