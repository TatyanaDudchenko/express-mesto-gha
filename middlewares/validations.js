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

module.exports = {
  validationsCreateCard,
};
