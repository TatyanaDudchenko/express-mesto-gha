const express = require('express');
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  createCard,
  deleteCardByID,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { isAuthtorized } = require('../middlewares/auth');

const cardsRoutes = express.Router();

cardsRoutes.get('/', isAuthtorized, getCards);
cardsRoutes.post(
  '/',
  isAuthtorized,
  express.json(),
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  createCard,
);
cardsRoutes.delete('/:cardId', isAuthtorized, deleteCardByID);
cardsRoutes.put('/:cardId/likes', isAuthtorized, likeCard);
cardsRoutes.delete('/:cardId/likes', isAuthtorized, dislikeCard);

module.exports = {
  cardsRoutes,
};
