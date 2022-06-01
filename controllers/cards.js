const Card = require('../models/card');
const ForbiddenError = require('../errors/forbidden-err');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ServerError = require('../errors/server-err');

const { FORBIDDEN_ERROR_CODE, NOT_FOUND_ERROR_CODE } = require('../utils/constants');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.status(200).send(cards);
  } catch (err) {
    next(new ServerError('На сервере произошла ошибка')); // 500
  }
};

const createCard = async (req, res, next) => {
  try {
    const owner = req.user.id;
    const { name, link } = req.body;
    const card = new Card({ name, link, owner });
    res.status(201).send(await card.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при создании карточки')); // 400
      return;
    }
    next(new ServerError('На сервере произошла ошибка')); // 500
  }
};

const deleteCardByID = async (req, res, next) => {
  try {
    const cardById = await Card.findById(req.params.cardId);
    if (!cardById) {
      next(new NotFoundError('Карточка с указанным _id не найдена')); // 404
      return;
    }
    const currentUserId = req.user.id;
    if (cardById.owner.toString() !== currentUserId) {
      next(new ForbiddenError('Нельзя удалить чужую карточку')); // 403
      return;
    }
    res.status(200).send(await cardById.deleteOne());
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Передан некорректный _id карточки')); // 400
      return;
    }
    if (err.statusCode === NOT_FOUND_ERROR_CODE) {
      next(new NotFoundError('Карточка с указанным _id не найдена')); // 404
      return;
    }
    if (err.statusCode === FORBIDDEN_ERROR_CODE) {
      next(new ForbiddenError('Нельзя удалить чужую карточку')); // 403
      return;
    }
    next(new ServerError('На сервере произошла ошибка')); // 500
  }
};

const likeCard = async (req, res, next) => {
  try {
    const updatedCardLike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user.id } }, // добавить _id в массив, если его там нет
      { new: true },
    );
    if (!updatedCardLike) {
      next(new NotFoundError('Передан несуществующий _id карточки при постановке лайка')); // 404
      return;
    }
    res.status(200).send(updatedCardLike);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Передан некорректный _id карточки при постановке лайка')); // 400
      return;
    }
    if (err.statusCode === NOT_FOUND_ERROR_CODE) {
      next(new NotFoundError('Передан несуществующий _id карточки при постановке лайка')); // 404
      return;
    }
    next(new ServerError('На сервере произошла ошибка')); // 500
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const updatedCardDislike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user.id } }, // убрать _id из массива
      { new: true },
    );
    if (!updatedCardDislike) {
      next(new NotFoundError('Передан несуществующий _id карточки при снятии лайка')); // 404
      return;
    }
    res.status(200).send(updatedCardDislike);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Передан некорректный _id карточки при снятии лайка')); // 400
      return;
    }
    if (err.statusCode === NOT_FOUND_ERROR_CODE) {
      next(new NotFoundError('Передан несуществующий _id карточки при снятии лайка')); // 404
      return;
    }
    next(new ServerError('На сервере произошла ошибка')); // 500
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCardByID,
  likeCard,
  dislikeCard,
};
