const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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
    },
    image: {
        type: String // Store image URL
    }
}, { timestamps: true });

// Middleware to hash password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Middleware to set permissions based on role
UserSchema.pre('save', function(next) {
    if (!this.isModified('role')) return next();

    this.permission = this.role; // Simplified assignment
    next();
});

// Instance methods
UserSchema.methods = {
    authenticate: async function(password) {
        return await bcrypt.compare(password, this.password);
    },

    generatePasswordResetToken: function() {
        this.resetPasswordToken = uuidv4();
        return this.resetPasswordToken;
    },

    resetPassword: async function(newPassword) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(newPassword, salt);
        this.resetPasswordToken = null;
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
