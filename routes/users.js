const express = require('express');
const { getUsers, getUserByID, createUser } = require('../controllers/users');
const usersRoutes = express.Router();

usersRoutes.get("/", getUsers);
usersRoutes.get("/:userId", getUserByID);
usersRoutes.post("/", express.json(), createUser);

module.exports = {
  usersRoutes
};