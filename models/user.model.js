const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: ''
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    }
}, {timestamps: true});

const userModel = mongoose.model('User', userSchema);

module.exports = {
    userModel
};