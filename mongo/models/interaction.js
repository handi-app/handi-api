const mongoose = require('mongoose');

const InteractionSchema = new mongoose.Schema({
  customer: {
    username: {
      type: String,
      unique: true
    },
    rating: {
      type: Number
    }
  },

  handyperson: {
    username: {
      type: String,
      unique: true
    },
    rating: {
      type: Number
    },
    rate: {
      type: Number
    }
  },

  startTime: {
    type: Number
  },

  endTime: {
    type: Number
  },

  status: {
    type: Number
  }

});

const Interaction = mongoose.model('Interaction', InteractionSchema);

module.exports.Interaction = Interaction;
