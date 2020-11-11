const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Users = require("../user/userModels");
const { isValid } = require("../user/usersService");

const Router = express.Router();
const { jwtSecret } = require("./secrets.js");

Router.post("/register", (req, res) => {
  const credentials = req.body;

  if (isValid(credentials)) {
    const rounds = process.env.BCRYPT_ROUNDS || 8;
    const hashed = bcrypt.hashSync(credentials.password, rounds);
    credentials.password = hashed;
    // we will insert a record WITHOUT the raw password but the hash instead
    Users.add(credentials)
      .then((user) => {
        res.status(201).json({ data: user });
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  } else {
    res.status(400).json({
      message:
        "please provide username and password and the password should be alphanumeric",
    });
  }
});

Router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (isValid(req.body)) {
    Users.findBy({ username })
      .then((user) => {
        if (user && bcrypt.compare(password, user.password)) {
          const token = generateToken(user);
          res.status(200).json({ message: "Successful login", token });
        } else {
          res.status(401).json({ message: "Bad credentials" });
        }
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  } else {
    res.status(400).json({
      message:
        "please provide username and password and the password should be alphanumeric",
    });
  }
});

Router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        res.send("error logging out");
      } else {
        res.send("User logged out");
      }
    });
  }
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    department: user.department,
  };

  const options = {
    expiresIn: "40 seconds",
  };

  return jwt.sign(payload, jwtSecret, options);
}

module.exports = Router;
