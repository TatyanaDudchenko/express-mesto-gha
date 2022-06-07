const express = require('express');
const {
  getUsers,
  getUserByID,
  updateUser,
  updateAvatar,
  getUserInfo,
} = require('../controllers/users');
const { isAuthtorized } = require('../middlewares/auth');
const {
  validationsGetUserByID,
  validationsUpdateUser,
  validationsUpdateAvatar,
} = require('../middlewares/validations');

const usersRoutes = express.Router();

usersRoutes.get('/', isAuthtorized, getUsers);
usersRoutes.get('/me', isAuthtorized, getUserInfo);
usersRoutes.get('/:userId', isAuthtorized, validationsGetUserByID, getUserByID);
usersRoutes.patch('/me', isAuthtorized, express.json(), validationsUpdateUser, updateUser);
usersRoutes.patch(
  '/me/avatar',
  isAuthtorized,
  express.json(),
  validationsUpdateAvatar,
  updateAvatar,
);

module.exports = {
  usersRoutes,
};
