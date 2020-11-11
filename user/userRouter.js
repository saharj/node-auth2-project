const express = require("express");

const Users = require("./userModels");
const restricted = require("../auth/restricted");

const Router = express.Router();

Router.get("/", restricted, (req, res) => {
  Users.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).json({ message: "Something went wrong" });
    });
});

module.exports = Router;
