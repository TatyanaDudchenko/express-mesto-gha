const validator = require('validator');
const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;

// создаем схему
const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: (v) => validator.isURL(v),
  },
  owner: {
    type: ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [
    {
      type: ObjectId,
      ref: 'user',
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// создаём модель и экспортируем её
module.exports = mongoose.model('card', cardSchema);
