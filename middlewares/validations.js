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
    link: Joi.string().required().custom(validateURL),
  }),
});

const validationsLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validationsCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateURL),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validationsDeleteCardByID = celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

const validationsLikeCard = celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

const validationsDislikeCard = celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

const validationsGetUserByID = celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
});

const validationsUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const validationsUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validateURL),
  }),
});

module.exports = {
  validationsCreateCard,
  validationsLogin,
  validationsCreateUser,
  validationsDeleteCardByID,
  validationsLikeCard,
  validationsDislikeCard,
  validationsGetUserByID,
  validationsUpdateUser,
  validationsUpdateAvatar,
};
