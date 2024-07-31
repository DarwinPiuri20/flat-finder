const mongoose = require('mongoose');
const { Schema } = mongoose;

const MessageSchema = new Schema({
    content: {
        type: String,
        required: [true, 'Please provide content'],
        minlength: [1, 'Content must have at least one character']
    },
    flatId: {
        type: Schema.Types.ObjectId,
        ref: 'Flat',
        required: true,
        index: true
    },
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Message', MessageSchema);
