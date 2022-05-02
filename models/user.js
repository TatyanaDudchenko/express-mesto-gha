const mongoose = require('mongoose');

// создаем схему
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  }
});

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);