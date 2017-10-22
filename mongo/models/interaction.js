const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

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
    }
  },

  startTime: {
    type: Number
  },

  endTime: {
    type: Number
  },

  status: {
    type: Boolean
  }

});

InteractionSchema.statics.findByUser = function (username, callback) {
  const InteractionSchema = this;

  InteractionSchema.findOne(
    {
      $or: [{'customer.username': username}, {'handyperson.username': username}]
    }, (err, doc) => {
      if (!doc) return callback({ err: 'No interaction found' });

      callback(doc);

  });
};

const Interaction = mongoose.model('Interaction', InteractionSchema);

module.exports.Interaction = Interaction;
