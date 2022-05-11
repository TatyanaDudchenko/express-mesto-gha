const express = require("express");
const {
  getUsers,
  getUserByID,
  createUser,
  updateUser,
  updateAvatar,
} = require("../controllers/users");
const usersRoutes = express.Router();

usersRoutes.get("/", getUsers);
usersRoutes.get("/:userId", getUserByID);
usersRoutes.post("/", express.json(), createUser);
usersRoutes.patch("/me", express.json(), updateUser);
usersRoutes.patch("/me/avatar", express.json(), updateAvatar);

module.exports = {
  usersRoutes,
};
