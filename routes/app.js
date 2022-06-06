const express = require('express');
const { usersRoutes } = require('./users');
const { cardsRoutes } = require('./cards');
const NotFoundError = require('../errors/not-found-err');

const routes = express.Router();

routes.use('/users', usersRoutes);
routes.use('/cards', cardsRoutes);
routes.use((req, res, next) => {
  next(new NotFoundError('Маршрут не найден')); // 404
});

module.exports = {
  routes,
};
