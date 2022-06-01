const bcrypt = require('bcrypt');
const { getToken } = require('../middlewares/auth');
const User = require('../models/user');
const UnauthorizedError = require('../errors/unauthorized-err');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ServerError = require('../errors/server-err');
const DublicateMongooseError = require('../errors/dublicate-mongoose-err');

const SALT_ROUNDS = 10;

const {
  BAD_REQUEST_ERROR_CODE,
  UNAUTHORIZED_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  DUBLICATE_MONGOOSE_ERROR_CODE,
} = require('../utils/constants');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    next(new ServerError('На сервере произошла ошибка')); // 500
  }
};

const getUserByID = async (req, res, next) => {
  try {
    const userById = await User.findById(req.params.userId);
    if (!userById) {
      next(new NotFoundError('Пользователь с указанным _id не найден')); // 404
      return;
    }
    res.status(200).send(userById);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Передан некорректный _id пользователя')); // 400
      return;
    }
    if (err.statusCode === NOT_FOUND_ERROR_CODE) {
      next(new NotFoundError('Пользователь с указанным _id не найден')); // 404
      return;
    }
    next(new ServerError('На сервере произошла ошибка')); // 500
  }
};

const createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({
      name,
      about,
      avatar,
      email,
      password: hash,
    });
    res.status(201).send(await user.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при создании пользователя')); // 400
      return;
    }
    if (err.code === DUBLICATE_MONGOOSE_ERROR_CODE) {
      next(new DublicateMongooseError('Пользователь с таким email уже существует')); // 409
      return;
    }
    next(new ServerError('На сервере произошла ошибка')); // 500
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, about },
      // Передадим объект опций:
      {
        new: true, // обработчик получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      },
    );
    if (!updatedUser) {
      next(new NotFoundError('Пользователь с указанным _id не найден')); // 404
      return;
    }
    res.status(200).send(updatedUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при обновлении профиля')); // 400
      return;
    }
    if (err.statusCode === NOT_FOUND_ERROR_CODE) {
      next(new NotFoundError('Пользователь с указанным _id не найден')); // 404
      return;
    }
    next(new ServerError('На сервере произошла ошибка')); // 500
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const updatedAvatar = await User.findByIdAndUpdate(
      req.user.id,
      { avatar },
      // Передадим объект опций:
      {
        new: true, // обработчик получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      },
    );
    if (!updatedAvatar) {
      next(new NotFoundError('Пользователь с указанным _id не найден')); // 404
      return;
    }
    res.status(200).send(updatedAvatar);
  } catch (err) {
    if (err.errors.avatar.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при обновлении аватара')); // 400
      return;
    }
    if (err.statusCode === NOT_FOUND_ERROR_CODE) {
      next(new NotFoundError('Пользователь с указанным _id не найден')); // 404
      return;
    }
    next(new ServerError('На сервере произошла ошибка')); // 500
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      next(new BadRequestError('Неправильные логин или пароль')); // 400
      return;
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      next(new UnauthorizedError('Неправильные логин или пароль')); // 401
      return;
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      next(new UnauthorizedError('Неправильные логин или пароль')); // 401
      return;
    }
    const token = await getToken(user._id);
    res.status(200).send({ token });
  } catch (err) {
    if (err.statusCode === BAD_REQUEST_ERROR_CODE) {
      next(new BadRequestError('Неправильные логин или пароль')); // 400
      return;
    }
    if (err.statusCode === UNAUTHORIZED_ERROR_CODE) {
      next(new UnauthorizedError('Неправильные логин или пароль')); // 401
      return;
    }
    next(new ServerError('На сервере произошла ошибка')); // 500
  }
};

const getUserInfo = async (req, res, next) => {
  const { _id } = req.body;
  try {
    const userById = await User.findById({ _id });
    if (!userById) {
      next(new NotFoundError('Пользователь с указанным _id не найден')); // 404
      return;
    }
    res.status(200).send(userById);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Передан некорректный _id пользователя')); // 400
      return;
    }
    if (err.statusCode === NOT_FOUND_ERROR_CODE) {
      next(new NotFoundError('Пользователь с указанным _id не найден')); // 404
      return;
    }
    next(new ServerError('На сервере произошла ошибка')); // 500
  }
};

module.exports = {
  getUsers,
  getUserByID,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getUserInfo,
};

// const getUsers = async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.status(200).send(users);
//   } catch (err) {
//     res.status(SERVER_ERROR_CODE).send({
//       message: 'На сервере произошла ошибка', // 500
//     });
//   }
// };

// const getUserByID = async (req, res) => {
//   try {
//     const userById = await User.findById(req.params.userId);
//     if (!userById) {
//       const error = new Error('Пользователь с указанным _id не найден'); // 404
//       error.statusCode = NOT_FOUND_ERROR_CODE;
//       throw error;
//     }
//     res.status(200).send(userById);
//   } catch (err) {
//     if (err.name === 'CastError') {
//       res.status(BAD_REQUEST_ERROR_CODE).send({
//         message: 'Передан некорректный _id пользователя', // 400
//       });
//       return;
//     }
//     if (err.statusCode === NOT_FOUND_ERROR_CODE) {
//       res.status(NOT_FOUND_ERROR_CODE).send({
//         message: 'Пользователь с указанным _id не найден', // 404
//       });
//       return;
//     }
//     res.status(SERVER_ERROR_CODE).send({
//       message: 'На сервере произошла ошибка', // 500
//     });
//   }
// };

// const createUser = async (req, res) => {
//   const {
//     name, about, avatar, email, password,
//   } = req.body;
//   try {
//     const hash = await bcrypt.hash(password, SALT_ROUNDS);
//     const user = new User({
//       name,
//       about,
//       avatar,
//       email,
//       password: hash,
//     });
//     res.status(201).send(await user.save());
//   } catch (err) {
//     if (err.name === 'ValidationError') {
//       res.status(BAD_REQUEST_ERROR_CODE).send({
//         message: 'Переданы некорректные данные при создании пользователя', // 400
//       });
//       return;
//     }
//     res.status(SERVER_ERROR_CODE).send({
//       message: 'На сервере произошла ошибка', // 500
//     });
//   }
// };

// const updateUser = async (req, res) => {
//   try {
//     const { name, about } = req.body;
//     const updatedUser = await User.findByIdAndUpdate(
//       req.user.id,
//       { name, about },
//       // Передадим объект опций:
//       {
//         new: true, // обработчик получит на вход обновлённую запись
//         runValidators: true, // данные будут валидированы перед изменением
//       },
//     );
//     if (!updatedUser) {
//       const error = new Error('Пользователь с указанным _id не найден'); // 404
//       error.statusCode = NOT_FOUND_ERROR_CODE;
//       throw error;
//     }
//     res.status(200).send(updatedUser);
//   } catch (err) {
//     if (err.name === 'ValidationError') {
//       res.status(BAD_REQUEST_ERROR_CODE).send({
//         message: 'Переданы некорректные данные при обновлении профиля', // 400
//       });
//       return;
//     }
//     if (err.statusCode === NOT_FOUND_ERROR_CODE) {
//       res.status(NOT_FOUND_ERROR_CODE).send({
//         message: 'Пользователь с указанным _id не найден', // 404
//       });
//       return;
//     }
//     res.status(SERVER_ERROR_CODE).send({
//       message: 'На сервере произошла ошибка', // 500
//     });
//   }
// };

// const updateAvatar = async (req, res) => {
//   try {
//     const { avatar } = req.body;
//     const updatedAvatar = await User.findByIdAndUpdate(
//       req.user.id,
//       { avatar },
//       // Передадим объект опций:
//       {
//         new: true, // обработчик получит на вход обновлённую запись
//         runValidators: true, // данные будут валидированы перед изменением
//       },
//     );
//     if (!updatedAvatar) {
//       const error = new Error('Пользователь с указанным _id не найден'); // 404
//       error.statusCode = NOT_FOUND_ERROR_CODE;
//       throw error;
//     }
//     res.status(200).send(updatedAvatar);
//   } catch (err) {
//     if (err.errors.avatar.name === 'ValidationError') {
//       res.status(BAD_REQUEST_ERROR_CODE).send({
//         message: 'Переданы некорректные данные при обновлении аватара', // 400
//       });
//       return;
//     }
//     if (err.statusCode === NOT_FOUND_ERROR_CODE) {
//       res.status(NOT_FOUND_ERROR_CODE).send({
//         message: 'Пользователь с указанным _id не найден', // 404
//       });
//       return;
//     }
//     res.status(SERVER_ERROR_CODE).send({
//       message: 'На сервере произошла ошибка', // 500
//     });
//   }
// };

// const login = async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     res.status(400).send({ message: 'Неправильные логин или пароль' });
//     return;
//   }
//   const user = await User.findOne({ email }).select('+password');
//   if (!user) {
//     res.status(401).send({ message: 'Неправильные логин или пароль' });
//     return;
//   }
//   const isValidPassword = await bcrypt.compare(password, user.password);
//   if (!isValidPassword) {
//     res.status(401).send({ message: 'Неправильные логин или пароль' });
//     return;
//   }
//   const token = await getToken(user._id);
//   res.status(200).send({ token });
// };

// const getUserInfo = async (req, res) => {
//   const { _id } = req.body;
//   try {
//     const userById = await User.findById({ _id });
//     if (!userById) {
//       const error = new Error('Пользователь с указанным _id не найден'); // 404
//       error.statusCode = NOT_FOUND_ERROR_CODE;
//       throw error;
//     }
//     res.status(200).send(userById);
//   } catch (err) {
//     if (err.name === 'CastError') {
//       res.status(BAD_REQUEST_ERROR_CODE).send({
//         message: 'Передан некорректный _id пользователя', // 400
//       });
//       return;
//     }
//     if (err.statusCode === NOT_FOUND_ERROR_CODE) {
//       res.status(NOT_FOUND_ERROR_CODE).send({
//         message: 'Пользователь с указанным _id не найден', // 404
//       });
//       return;
//     }
//     res.status(SERVER_ERROR_CODE).send({
//       message: 'На сервере произошла ошибка', // 500
//     });
//   }
// };
