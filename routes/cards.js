const express = require('express');
const { getCards, createCard, deleteCardByID, likeCard, dislikeCard } = require('../controllers/cards');
const cardsRoutes = express.Router();

cardsRoutes.get("/", getCards);
cardsRoutes.post("/", express.json(), createCard);
cardsRoutes.delete("/:cardId", deleteCardByID);
cardsRoutes.put("/:cardId/likes", likeCard);
cardsRoutes.delete("/:cardId/likes", dislikeCard);

module.exports = {
  cardsRoutes
};