const express = require('express');
const {
  getUsers,
  getUserByID,
  updateUser,
  updateAvatar,
  getUserInfo,
} = require('../controllers/users');

const usersRoutes = express.Router();

usersRoutes.get('/', getUsers);
usersRoutes.get('/me', express.json(), getUserInfo);
usersRoutes.get('/:userId', getUserByID);
usersRoutes.patch('/me', express.json(), updateUser);
usersRoutes.patch('/me/avatar', express.json(), updateAvatar);

module.exports = {
  usersRoutes,
};
