const express = require('express');
const { usersRoutes } = require('./users');
const routes = express.Router();

routes.use('/users', usersRoutes);

module.exports = {
  routes
}