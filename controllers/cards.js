const Card = require("../models/card");

const BAD_REQUEST_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const SERVER_ERROR_CODE = 500;

const getCards = async (req, res) => {//400,500. Добавить 400 — Переданы некорректные данные при поиске карточек
  try {
    const cards = await Card.find({});
    res.status(200).send(cards);
  } catch (err) {
    res.status(SERVER_ERROR_CODE).send({
      message: "На сервере произошла ошибка" // 500
    });
  }
};

const createCard = async (req, res) => {
  try {
    const owner = req.user._id;
    const { name, link } = req.body;
    const card = new Card({ name, link, owner });
    res.status(201).send(await card.save());
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(BAD_REQUEST_ERROR_CODE).send({
        message: "Переданы некорректные данные при создании карточки" // 400
      });
    }
    res.status(SERVER_ERROR_CODE).send({
      message: "На сервере произошла ошибка" // 500
    });
  }
};

const deleteCardByID = async (req, res) => {
  try {
    const cardById = Card.findById(req.params.cardId);
    res.status(200).send(await cardById.deleteOne());
  } catch (err) {
    if (err.kind === "ObjectId") {
      res.status(NOT_FOUND_ERROR_CODE).send({
        message: "Карточка с указанным _id не найдена" // 404
      });
    }
    res.status(SERVER_ERROR_CODE).send({
      message: "На сервере произошла ошибка" // 500
    });
  }
};

const likeCard = async (req, res) => {//400,404,500. Добавить 400 — Переданы некорректные данные при постановке лайка
  try {
    const updatedCardLike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true }
    );
    res.status(200).send(updatedCardLike);
  } catch (err) {
    if (err.kind === "ObjectId") {
      res.status(NOT_FOUND_ERROR_CODE).send({
        message: "Передан несуществующий _id карточки", // 404
        err,
      });
    }
    res.status(SERVER_ERROR_CODE).send({
      message: "На сервере произошла ошибка" // 500
    });
  }
};

const dislikeCard = async (req, res) => {//400,404,500. Добавить 400 — Переданы некорректные данные при снятии лайка
  try {
    const updatedCardDislike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true }
    );
    res.status(200).send(updatedCardDislike);
  } catch (err) {
    if (err.kind === "ObjectId") {
      res.status(NOT_FOUND_ERROR_CODE).send({
        message: "Передан несуществующий _id карточки" // 404
      });
    }
    res.status(SERVER_ERROR_CODE).send({
      message: "На сервере произошла ошибка"
    });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCardByID,
  likeCard,
  dislikeCard
};
