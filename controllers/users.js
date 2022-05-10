const User = require("../models/user");

const BAD_REQUEST_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const SERVER_ERROR_CODE = 500;

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(BAD_REQUEST_ERROR_CODE).send({
        message: "Переданы некорректные данные при получении списка пользователей" // 400
      });
    }
    res.status(SERVER_ERROR_CODE).send({
      message: "На сервере произошла ошибка" // 500
    });
  }
};

const getUserByID = async (req, res) => {
  try {
    const userById = await User.findById(req.params.userId);
    res.status(200).send(userById);
  } catch (err) {
    if (err.kind === "ObjectId") {
      res.status(NOT_FOUND_ERROR_CODE).send({
        message: "Пользователь с указанным _id не найден" // 404
      });
    }
    res.status(SERVER_ERROR_CODE).send({
      message: "На сервере произошла ошибка" // 500
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = new User({ name, about, avatar });
    res.status(201).send(await user.save());
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(BAD_REQUEST_ERROR_CODE).send({
        message: "Переданы некорректные данные при создании пользователя" // 400
      });
    }
    res.status(SERVER_ERROR_CODE).send({
      message: "На сервере произошла ошибка" // 500
    });
  }
};

const updateUser = async (req, res) => {//400,404,500. Добавить 404 — Пользователь с указанным _id не найден
  try {
    const { name, about } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      // Передадим объект опций:
      {
        new: true, // обработчик получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
        upsert: true, // если пользователь не найден, он будет создан
      }
    );
    res.status(200).send(updatedUser);
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(BAD_REQUEST_ERROR_CODE).send({
        message: "Переданы некорректные данные при обновлении профиля" // 400
      });
    }
    res.status(SERVER_ERROR_CODE).send({
      message: "На сервере произошла ошибка" // 500
    });
  }
};

const updateAvatar = async (req, res) => {//400,404,500 Добавить 404 — Пользователь с указанным _id не найден
  try {
    const { avatar } = req.body;
    const updatedAvatar = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      // Передадим объект опций:
      {
        new: true, // обработчик получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
        upsert: true, // если пользователь не найден, он будет создан
      }
    );
    res.status(200).send(updatedAvatar);
  } catch (err) {
    if (err.errors.avatar.name === "ValidationError") {
      res.status(BAD_REQUEST_ERROR_CODE).send({
        message: "Переданы некорректные данные при обновлении аватара" // 400
      });
    }
    res.status(SERVER_ERROR_CODE).send({
      message: "На сервере произошла ошибка" // 500
    });
  }
};


module.exports = {
  getUsers,
  getUserByID,
  createUser,
  updateUser,
  updateAvatar,
};