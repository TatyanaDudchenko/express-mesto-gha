const validator = require('validator');
const mongoose = require('mongoose');

// создаем схему
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: false,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: false,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: false,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: (v) => validator.isURL(v),
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: (v) => validator.isEmail(v),
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);
