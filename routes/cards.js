const express = require('express');
const {
  getCards,
  createCard,
  deleteCardByID,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { isAuthtorized } = require('../middlewares/auth');
const { validationsCreateCard } = require('../middlewares/validations');

const cardsRoutes = express.Router();

cardsRoutes.get('/', isAuthtorized, getCards);
cardsRoutes.post(
  '/',
  isAuthtorized,
  express.json(),
  validationsCreateCard,
  createCard,
);
cardsRoutes.delete('/:cardId', isAuthtorized, deleteCardByID);
cardsRoutes.put('/:cardId/likes', isAuthtorized, likeCard);
cardsRoutes.delete('/:cardId/likes', isAuthtorized, dislikeCard);

module.exports = {
  cardsRoutes,
};
