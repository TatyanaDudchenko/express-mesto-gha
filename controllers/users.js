const User = require("../models/user");

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({
      message: "Произошла ошибка в работе сервера",
      err,
    });
  }
};

const getUserByID = async (req, res) => {
  try {
    const userById = await User.findById(req.params.userId);
    res.status(200).send(userById);
  } catch (err) {
    if (err.kind === "ObjectId") {
      res.status(400).send({
        message: "Пользователя с таким id не найдено",
        err,
      });
    }
    res.status(500).send({
      message: "Произошла ошибка в работе сервера",
      err,
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = new User({ name, about, avatar });
    res.status(201).send(await user.save());
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

const updateUser = async (req, res) => {
  try {
    const { name, about } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      // Передадим объект опций:
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
        upsert: true, // если пользователь не найден, он будет создан
      }
    );
    res.status(200).send(updatedUser);
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

module.exports = {
  getUsers,
  getUserByID,
  createUser,
  updateUser,
};
