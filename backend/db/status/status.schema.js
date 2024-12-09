const Schema = require('mongoose').Schema;

exports.StatusSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
    maxLength: 280
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { collection: 'statuses' });