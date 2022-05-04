const Card = require("../models/card");

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(200).send(cards);
  } catch (err) {
    res.status(500).send({
      message: "Произошла ошибка в работе сервера",
      err,
    });
  }
};

const createCard = async (req, res) => {
  try {
    const owner = req.user._id
    const { name, link } = req.body
    const card = new Card({ name, link, owner } );
    res.status(201).send(await card.save());

    console.log(`ID автора карточки ${req.user._id}`);

  } catch (err) {
    if (err.errors.name.name === "ValidatorError") {
      res.status(400).send({
        message: "Ошибка в введенных данных",
        err,
      });
    }
    res.status(500).send({
      message: "Произошла ошибка в работе сервера",
      err,
    });
  }
};

const deleteCardByID = async (req, res) => {
  try {
    const cardById = Card.findById(req.params.cardId);
    res.status(200).send(await cardById.deleteOne());
  } catch (err) {
    if (err.kind === "ObjectId") {
      res.status(400).send({
        message: "Карточка с таким id не найдена",
        err,
      });
    }
    res.status(500).send({
      message: "Произошла ошибка в работе сервера",
      err,
    });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCardByID
};