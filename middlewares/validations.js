const { celebrate, Joi } = require('celebrate');

// const urlRegExp = new RegExp(/^http:\/\/\w+\.\/-\.~:\/?#\[\]@!$&'()\*+,;=#$/);
const urlRegExp = /^(http|https):\/\/.+\\..+'/;

const validationsCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().pattern(urlRegExp),
  }),
});

module.exports = {
  validationsCreateCard,
};
