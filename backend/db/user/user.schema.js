const Schema = require('mongoose').Schema;

exports.UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }
}, {
    collection: 'usersSpr2023',
    timestamps: true  // This adds createdAt and updatedAt automatically
});