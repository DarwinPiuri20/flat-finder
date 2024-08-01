const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: [true, 'Please provide email'],
        lowercase: true,
        match: [/.+@.+\..+/, 'Please provide a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6
    },
    firstName: {
        type: String,
        required: [true, 'Please provide first name']
    },
    lastName: {
        type: String,
        required: [true, 'Please provide last name']
    },
    birthDate: {
        type: Date,
        required: [true, 'Please provide birth date']
    },
    role: {
        type: String,
        enum: ['renter', 'owner', 'admin'],
        default: 'renter'
    },
    favoriteFlats: [{
        type: Schema.Types.ObjectId,
        ref: 'Flat'
    }],
    flatsCount: { type: Number, default: 0 },
    flats: [{ type: Schema.Types.ObjectId, ref: 'Flat' }],
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
    resetPasswordToken: String,
    passwordChangedAt: Date,
    passwordResetExpires: Date,
    permission: {
        type: String,
        enum: ['admin', 'renter', 'owner'],
        default: 'renter'
    }
}, { timestamps: true });

// Middleware to hash password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.passwordChangedAt = Date.now();
    next();
});

// Instance methods
UserSchema.methods = {
    authenticate: async function(password) {
        return await bcrypt.compare(password, this.password);
    },

    generatePasswordResetToken: function() {
        const resetToken = crypto.randomBytes(32).toString('hex');
        this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        return resetToken;
    },

    resetPassword: async function(newPassword) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(newPassword, salt);
        this.resetPasswordToken = undefined;
        this.passwordResetExpires = undefined;
        this.passwordChangedAt = Date.now();
        return this.save();
    },

    toJson: function() {
        const user = this.toObject();
        delete user.password;
        return user;
    }
};

module.exports = mongoose.model('User', UserSchema);
