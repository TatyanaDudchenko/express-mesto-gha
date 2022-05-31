const Card = require('../models/card');
const ForbiddenError = require('../errors/forbidden-err');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ServerError = require('../errors/server-err');

const {
  FORBIDDEN_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
} = require('../utils/constants');

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
    if (!cardById.owner.toString().equals(req.user.id)) {
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

// const getCards = async (req, res) => {
//   try {
//     const cards = await Card.find({});
//     res.status(200).send(cards);
//   } catch (err) {
//     res.status(SERVER_ERROR_CODE).send({
//       message: 'На сервере произошла ошибка', // 500
//     });
//   }
// };

// const createCard = async (req, res) => {
//   try {
//     const owner = req.user.id;
//     const { name, link } = req.body;
//     const card = new Card({ name, link, owner });
//     res.status(201).send(await card.save());
//   } catch (err) {
//     if (err.name === 'ValidationError') {
//       res.status(BAD_REQUEST_ERROR_CODE).send({
//         message: 'Переданы некорректные данные при создании карточки', // 400
//       });
//       return;
//     }
//     res.status(SERVER_ERROR_CODE).send({
//       message: 'На сервере произошла ошибка', // 500
//     });
//   }
// };

// // const deleteCardByID = async (req, res) => {
// //   try {
// //     const cardById = await Card.findById(req.params.cardId);
// //     if (!cardById) {
// //       const error = new Error('Карточка с указанным _id не найдена'); // 404
// //       error.statusCode = NOT_FOUND_ERROR_CODE;
// //       throw error;
// //     }
// //     // console.log(req.user.id);
// //     // console.log(cardById.owner.toString());

// //     // if (!cardById.owner.toString().equals(req.user.id)) {
// //     //   const error = new Error('Нельзя удалить чужую карточку'); // 403
// //     //   error.statusCode = 403;
// //     //   throw error;
// //     // }
// //     res.status(200).send(await cardById.deleteOne());
// //   } catch (err) {
// //     if (err.name === 'CastError') {
// //       res.status(BAD_REQUEST_ERROR_CODE).send({
// //         message: 'Передан некорректный _id карточки', // 400
// //       });
// //       return;
// //     }
// //     if (err.statusCode === NOT_FOUND_ERROR_CODE) {
// //       res.status(NOT_FOUND_ERROR_CODE).send({
// //         message: 'Карточка с указанным _id не найдена', // 404
// //       });
// //       return;
// //     }
// //     // if (err.statusCode === 403) {
// //     //   res.status(403).send({
// //     //     message: 'Нельзя удалить чужую карточку', // 403
// //     //   });
// //     //   return;
// //     // }
// //     res.status(SERVER_ERROR_CODE).send({
// //       message: 'На сервере произошла ошибка', // 500
// //     });
// //   }
// // };

// const deleteCardByID = async (req, res, next) => {
//   try {
//     const cardById = await Card.findById(req.params.cardId);
//     if (!cardById) {
//       throw new NotFoundError('Карточка с указанным _id не найдена'); // 404
//     }
//     // console.log(req.user.id);
//     // console.log(cardById.owner.toString());

//     // if (!cardById.owner.toString().equals(req.user.id)) {
//     //   const error = new Error('Нельзя удалить чужую карточку'); // 403
//     //   error.statusCode = 403;
//     //   throw error;
//     // }
//     // if (!cardById.owner.toString().equals(req.user.id)) {
//     //   next(new ForbiddenError('Нельзя удалить чужую карточку')); // 403
//     //   return;
//     // }
//     res.status(200).send(await cardById.deleteOne());
//   } catch (err) {
//     if (err.name === 'CastError') {
//       next(new BadRequestError('Передан некорректный _id карточки')); // 400
//       return;
//     }
//     if (err.statusCode === NOT_FOUND_ERROR_CODE) {
//       next(new NotFoundError('Карточка с указанным _id не найдена')); // 404
//       return;
//     }
//     if (err.statusCode === FORBIDDEN_ERROR_CODE) {
//       next(new ForbiddenError('Нельзя удалить чужую карточку')); // 403
//       return;
//     }
//     next(new ServerError('На сервере произошла ошибка')); // 500
//   }
// };

// const likeCard = async (req, res) => {
//   try {
//     const updatedCardLike = await Card.findByIdAndUpdate(
//       req.params.cardId,
//       { $addToSet: { likes: req.user.id } }, // добавить _id в массив, если его там нет
//       { new: true },
//     );
//     if (!updatedCardLike) {
//       const error = new Error(
//         'Передан несуществующий _id карточки при постановке лайка',
//       ); // 404
//       error.statusCode = NOT_FOUND_ERROR_CODE;
//       throw error;
//     }
//     res.status(200).send(updatedCardLike);
//   } catch (err) {
//     if (err.name === 'CastError') {
//       res.status(BAD_REQUEST_ERROR_CODE).send({
//         message: 'Передан некорректный _id карточки при постановке лайка', // 400
//       });
//       return;
//     }
//     if (err.statusCode === NOT_FOUND_ERROR_CODE) {
//       res.status(NOT_FOUND_ERROR_CODE).send({
//         message: 'Передан несуществующий _id карточки при постановке лайка', // 404
//       });
//       return;
//     }
//     res.status(SERVER_ERROR_CODE).send({
//       message: 'На сервере произошла ошибка', // 500
//     });
//   }
// };

// const dislikeCard = async (req, res) => {
//   try {
//     const updatedCardDislike = await Card.findByIdAndUpdate(
//       req.params.cardId,
//       { $pull: { likes: req.user.id } }, // убрать _id из массива
//       { new: true },
//     );
//     if (!updatedCardDislike) {
//       const error = new Error(
//         'Передан несуществующий _id карточки при снятии лайка',
//       ); // 404
//       error.statusCode = NOT_FOUND_ERROR_CODE;
//       throw error;
//     }
//     res.status(200).send(updatedCardDislike);
//   } catch (err) {
//     if (err.name === 'CastError') {
//       res.status(BAD_REQUEST_ERROR_CODE).send({
//         message: 'Передан некорректный _id карточки при снятии лайка', // 400
//       });
//       return;
//     }
//     if (err.statusCode === NOT_FOUND_ERROR_CODE) {
//       res.status(NOT_FOUND_ERROR_CODE).send({
//         message: 'Передан несуществующий _id карточки при снятии лайка', // 404
//       });
//       return;
//     }
//     res.status(SERVER_ERROR_CODE).send({
//       message: 'На сервере произошла ошибка', // 500
//     });
//   }
// };
