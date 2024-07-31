const mongoose = require('mongoose');
const { Schema } = mongoose;

const FlatSchema = new Schema({
    city: {
        type: String,
        required: [true, 'Please provide city']
    },
    streetName: {
        type: String,
        required: [true, 'Please provide street name']
    },
    streetNumber: {
        type: Number,
        required: [true, 'Please provide street number'],
        min: [1, 'Street number must be a positive number']
    },
    areaSize: {
        type: Number,
        required: [true, 'Please provide area size'],
        min: [0, 'Area size must be a non-negative number']
    },
    hasAc: {
        type: Boolean,
        default: false
    },
    yearBuilt: {
        type: Number,
        required: [true, 'Please provide year built'],
        min: [1900, 'Year built must be a valid year']
    },
    rentPrice: {
        type: Number,
        required: [true, 'Please provide rent price'],
        min: [0, 'Rent price must be a non-negative number']
    },
    dateAvailable: {
        type: Date,
        required: [true, 'Please provide date available']
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Message'
    }],
    images: [{
        type: String // Store image URLs
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Flat', FlatSchema);
