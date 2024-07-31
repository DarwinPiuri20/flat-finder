const upload = require('../../services/multer');
const Flat = require('./model');
const User = require('../users/model');
const Message = require('../messages/model');
const path = require('path');
const fs = require('fs');



const handleError = (res, error, status = 500) => {
    console.error(error);
    res.status(status).json({ status: 'error', message: error.message });
};

exports.addFlat = async (req, res) => {
    upload.single('image')(req, res, async (err) => {
        if (err) return handleError(res, err);

        try {
            const flat = new Flat({
                ...req.body,
                images: req.file ? [req.file.filename] : [],
                created: new Date(),
                modified: new Date(),
                ownerId: req.user._id
            });

            await flat.save();

            const user = await User.findById(req.user._id);
            if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' });

            user.flats = user.flats || [];
            user.flats.push(flat._id);
            user.flatsCount = (user.flatsCount || 0) + 1;
            await user.save();

            res.status(201).json({ status: 'success', flat });
        } catch (error) {
            handleError(res, error);
        }
    });
};
// Other controller functions...

exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: 'fail', message: 'No file uploaded' });
        }
        res.status(200).json({ status: 'success', message: 'File uploaded successfully', file: req.file });
    } catch (error) {
        handleError(res, error);
    }
};
exports.getAllFlats = async (req, res) => {
    try {
        const { filter = {}, orderBy = 'city', order = 'asc' } = req.query;
        const queryFilter = {};

        if (filter.city) {
            queryFilter.city = { $regex: filter.city, $options: 'i' };
        }
        if (filter.hasAc) {
            queryFilter.hasAc = filter.hasAc === 'true';
        }
        if (filter.rentPrice) {
            const [rentPriceMin, rentPriceMax] = filter.rentPrice.split('-').map(Number);
            queryFilter.rentPrice = {};
            if (rentPriceMin) queryFilter.rentPrice.$gte = rentPriceMin;
            if (rentPriceMax) queryFilter.rentPrice.$lte = rentPriceMax;
        }

        const flats = await Flat.find(queryFilter).sort({ [orderBy]: order });
        res.status(200).json({ status: 'success', flats });
    } catch (error) {
        handleError(res, error);
    }
};

exports.updateFlat = async (req, res) => {
    try {
        const flat = await Flat.findById(req.params.id);
        if (!flat) return res.status(404).json({ status: 'fail', message: 'Flat not found' });
        if (flat.ownerId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
        }

        Object.assign(flat, req.body, { modified: new Date() });
        await flat.save();

        res.status(200).json({ status: 'success', flat });
    } catch (error) {
        handleError(res, error);
    }
};

exports.getMyFlats = async (req, res) => {
    try {
        const flats = await Flat.find({ ownerId: req.user._id });
        res.status(200).json({ status: 'success', flats });
    } catch (error) {
        handleError(res, error);
    }
};

exports.getFlatById = async (req, res) => {
    try {
        const flat = await Flat.findById(req.params.id).populate('ownerId');
        if (!flat) return res.status(404).json({ status: 'fail', message: 'Flat not found' });
        res.status(200).json({ status: 'success', data: flat });
    } catch (error) {
        handleError(res, error);
    }
};
exports.deleteFlat = async (req, res) => {
    try {
        const flat = await Flat.findById(req.params.id);
        if (!flat) return res.status(404).json({ status: 'fail', message: 'Flat not found' });
        if (flat.ownerId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
        }

        // Remove images associated with the flat
        if (flat.images && flat.images.length > 0) {
            flat.images.forEach(image => {
                const imagePath = path.join(__dirname, '../../uploads/', image);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            });
        }

        await flat.deleteOne();

        // Remove flat from user's flats
        const user = await User.findById(req.user._id);
        if (user) {
            user.flats = user.flats.filter(id => id.toString() !== flat._id.toString());
            user.flatsCount = Math.max(user.flatsCount - 1, 0);
            await user.save();
        }

        res.status(200).json({ status: 'success', message: 'Flat deleted successfully' });
    } catch (error) {
        handleError(res, error);
    }
};

// Messages
exports.getMessages = async (req, res) => {
    try {
        const { flatId, otherUserId } = req.params;
        const userId = req.user._id;

        if (!flatId || !otherUserId || !userId) {
            return res.status(400).json({ status: 'fail', message: 'Missing required parameters' });
        }

        const messages = await Message.find({
            flatId,
            $or: [
                { senderId: userId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: userId }
            ]
        }).populate('senderId', 'firstName').populate('receiverId', 'firstName');

        res.status(200).json({ status: 'success', messages });
    } catch (error) {
        handleError(res, error);
    }
};


// Crear un nuevo mensaje
exports.createMessage = async (req, res) => {
    try {
        const { content } = req.body;
        const { flatId } = req.params;
        const senderId = req.user._id;

        const flat = await Flat.findById(flatId).populate('ownerId');
        if (!flat) return res.status(404).json({ status: 'fail', message: 'Flat not found' });

        const receiverId = flat.ownerId.id;

        if (!flatId || !senderId || !receiverId) {
            return res.status(400).json({ status: 'fail', message: 'Missing required parameters' });
        }

        const newMessage = new Message({ content, senderId, receiverId, flatId });
        await newMessage.save();

        // Agregar el nuevo mensaje al arreglo de mensajes del flat
        flat.messages.push(newMessage._id);
        await flat.save();
        res.status(201).json({ status: 'success', message: newMessage });
    } catch (error) {
        handleError(res, error);
    }
};

exports.addFavorite = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' });

        const flat = await Flat.findById(req.params.id);
        if (!flat) return res.status(404).json({ status: 'fail', message: 'Flat not found' });

        if (!user.favoriteFlats) user.favoriteFlats = [];
        if (!user.favoriteFlats.includes(flat._id)) {
            user.favoriteFlats.push(flat._id);
            await user.save();
        }

        res.status(200).json({ status: 'success', message: 'Favorite added successfully' });
    } catch (error) {
        handleError(res, error);
    }
};

exports.getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' });

        const flats = await Flat.find({ _id: { $in: user.favoriteFlats } });
        res.status(200).json({ status: 'success', flats });
    } catch (error) {
        handleError(res, error);
    }
};

exports.removeFavorite = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' });

        const flatId = req.params.id;
        const index = user.favoriteFlats.indexOf(flatId);
        if (index > -1) {
            user.favoriteFlats.splice(index, 1);
            await user.save();
            res.status(200).json({ status: 'success', message: 'Favorite removed successfully' });
        } else {
            res.status(404).json({ status: 'fail', message: 'Favorite not found' });
        }
    } catch (error) {
        handleError(res, error);
    }
};
