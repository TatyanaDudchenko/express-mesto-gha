const express = require('express');
const {
  getCards,
  createCard,
  deleteCardByID,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { isAuthtorized } = require('../middlewares/auth');
const {
  validationsCreateCard,
  validationsDeleteCardByID,
  validationsLikeCard,
  validationsDislikeCard,
} = require('../middlewares/validations');

const cardsRoutes = express.Router();

cardsRoutes.get('/', isAuthtorized, getCards);
cardsRoutes.post('/', isAuthtorized, express.json(), validationsCreateCard, createCard);
cardsRoutes.delete('/:cardId', isAuthtorized, validationsDeleteCardByID, deleteCardByID);
cardsRoutes.put('/:cardId/likes', isAuthtorized, validationsLikeCard, likeCard);
cardsRoutes.delete('/:cardId/likes', isAuthtorized, validationsDislikeCard, dislikeCard);

module.exports = {
  cardsRoutes,
};
