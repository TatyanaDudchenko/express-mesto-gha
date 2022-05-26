const express = require('express');
const {
  getUsers,
  getUserByID,
  updateUser,
  updateAvatar,
  getUserInfo,
} = require('../controllers/users');
const { isAuthtorized } = require('../middlewares/auth');

const usersRoutes = express.Router();

usersRoutes.get('/', isAuthtorized, getUsers);
usersRoutes.get('/me', isAuthtorized, express.json(), getUserInfo);
usersRoutes.get('/:userId', isAuthtorized, getUserByID);
usersRoutes.patch('/me', isAuthtorized, express.json(), updateUser);
usersRoutes.patch('/me/avatar', isAuthtorized, express.json(), updateAvatar);

module.exports = {
  usersRoutes,
};
