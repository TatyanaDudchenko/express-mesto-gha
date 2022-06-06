const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

// const urlRegExp = /^(http(s)?):\/\/(w{3}.)?[а-яА-Я\w\-._~:\/?#[\]@!$&'()*+,;=]+$/;

const validateURL = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new Error('Неправильный формат ссылки');
  }
  return value;
};

const validationsCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().valid(validateURL),
  }),
});

const validationsLogin = celebrate({
  headers: Joi.object().keys({
    // валидируем заголовки
  }).unknown(true),
});

const validationsCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().required().valid(validateURL),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validationsDeleteCardByID = celebrate({
  headers: Joi.object().keys({
    // валидируем заголовки
  }).unknown(true),
});

const validationsLikeCard = celebrate({
  headers: Joi.object().keys({
    // валидируем заголовки
  }).unknown(true),
});

const validationsDislikeCard = celebrate({
  headers: Joi.object().keys({
    // валидируем заголовки
  }).unknown(true),
});

module.exports = {
  validationsCreateCard,
  validationsLogin,
  validationsCreateUser,
  validationsDeleteCardByID,
  validationsLikeCard,
  validationsDislikeCard,
};
