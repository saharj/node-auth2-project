const express = require("express");

const Users = require("./userModels");

const Router = express.Router();

// function roleChecker(role) {
//   return function (req, res, next) {
//     if (req.decodedJwt.role === role) {
//       next();
//     } else {
//       res.status(401).json({ message: "you can't have access" });
//     }
//   };
// }

// Router.get("/", roleChecker(1), (req, res) => {
//   Users.find()
//     .then((users) => {
//       res.status(200).json(users);
//     })
//     .catch((err) => res.send(err));
// });

Router.get("/users", secure, (req, res) => {
  Users.find()
    .then((result) => {
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(400).json({ message: "Couldn't get users" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Something went wrong" });
    });
});

function secure(req, res, next) {
  // check if there is a user in the session
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized!" });
  }
}

module.exports = Router;
