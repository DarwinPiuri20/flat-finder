const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('./model');
const sendEmail = require('../../services/email');
const upload = require('../../services/multer');

exports.uploadUserImage = upload.single('image');

exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ status: 'fail', message: 'Invalid user ID' });
        }

        const updateData = req.body;
        if (req.file) {
            updateData.image = req.file.path;
        }

        const user = await User.findByIdAndUpdate(userId, updateData, { new: true });

        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }

        res.status(200).json({ status: 'success', data: user });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ status: 'fail', message: 'Server error: ' + error.message });
    }
};

exports.updateUserLogged = async (req, res) => {
    try {
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ status: 'fail', message: 'Invalid user ID' });
        }

        const updateData = req.body;
        if (req.file) {
            updateData.image = req.file.path;
        }

        const user = await User.findByIdAndUpdate(userId, updateData, { new: true });

        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }

        res.status(200).json({ status: 'success', data: user });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ status: 'fail', message: 'Server error: ' + error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' });
        await user.deleteOne();
        res.status(200).json({ status: 'success', message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: 'Server error: ' + error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ status: 'fail', message: 'Invalid user ID' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }

        res.status(200).json({ status: 'success', data: user });
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ status: 'fail', message: 'Server error: ' + error.message });
    }
};

exports.getCurrentUser = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ status: 'fail', message: 'User not authenticated' });
        }

        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ status: 'fail', message: 'Invalid user ID' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }

        res.status(200).json({ status: 'success', data: user });
    } catch (error) {
        console.error('Error fetching current user:', error);
        res.status(500).json({ status: 'fail', message: 'Server error: ' + error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const { filter = {}, orderBy = 'firstName', order = 'asc', page = 1, limit = 10 } = req.query;
        const queryFilter = buildUserQueryFilter(filter);
        const skip = (page - 1) * limit;
        const sortOption = order === 'desc' ? -1 : 1;

        const users = await User.aggregate([
            { $lookup: { from: 'flats', localField: '_id', foreignField: 'ownerId', as: 'flats' } },
            { $addFields: { flatsCount: { $size: '$flats' } } },
            { $match: queryFilter },
            { $sort: { [orderBy]: sortOption } },
            { $skip: skip },
            { $limit: parseInt(limit) }
        ]);

        res.status(200).json({ message: 'Users retrieved successfully', data: users });
    } catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({ status: 'fail', message: 'Server error: ' + error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'No user found with that email address' });
        }

        const resetToken = user.generatePasswordResetToken();
        await user.save();

        const resetURL = `http://localhost:3000/reset-password/${resetToken}`;
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Token',
            message: `You requested a password reset. Please click the link below to reset your password:\n\n${resetURL}`
        });

        res.status(200).json({ status: 'success', message: 'Token sent to email!' });
    } catch (error) {
        console.error('Error generating password reset token:', error);
        res.status(500).json({ status: 'fail', message: 'Server error: ' + error.message });
    }
};

exports.resetPassword = async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;

    try {
        if (!password) {
            return res.status(400).json({ status: 'fail', message: 'Password is required' });
        }

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ status: 'fail', message: 'Token is invalid or has expired' });
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.passwordResetExpires = undefined;
        user.passwordChangedAt = Date.now();
        await user.save();

        res.status(200).json({ status: 'success', message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ status: 'fail', message: 'Server error: ' + error.message });
    }
};

// Helper function to build user query filter
function buildUserQueryFilter(filter) {
    const queryFilter = {};

    if (filter.role) {
        queryFilter.role = filter.role;
    }

    if (filter.firstName) {
        queryFilter.firstName = { $regex: filter.firstName, $options: 'i' };
    }

    if (filter.flatsCounter) {
        const [min, max] = filter.flatsCounter.split('-').map(Number);
        queryFilter.flatsCount = {};
        if (min) queryFilter.flatsCount.$gte = min;
        if (max) queryFilter.flatsCount.$lte = max;
    }

    if (filter.age) {
        const [minAge, maxAge] = filter.age.split('-').map(Number);
        const currentYear = new Date().getFullYear();
        queryFilter.birthDate = {};
        if (minAge) queryFilter.birthDate.$lte = new Date(currentYear - minAge, 0, 1);
        if (maxAge) queryFilter.birthDate.$gte = new Date(currentYear - maxAge, 11, 31);
    }

    return queryFilter;
}
