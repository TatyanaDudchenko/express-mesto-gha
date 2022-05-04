const express = require('express');
const { getCards, createCard, deleteCardByID } = require('../controllers/cards');
const cardsRoutes = express.Router();

cardsRoutes.get("/", getCards);
cardsRoutes.post("/", express.json(), createCard);
cardsRoutes.delete("/:cardId", deleteCardByID);

module.exports = {
  cardsRoutes
};