const mongoose = require('mongoose');
const _ = require('lodash');

const LastHashSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  lastHash: {
    type: String,
    required: true
  }
});

const LastHash = mongoose.model('LastHash', LastHashSchema);

module.exports.LastHash = LastHash;
