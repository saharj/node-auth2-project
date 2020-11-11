const express = require("express");
const bcrypt = require("bcryptjs");

const Users = require("./userModels");

const Router = express.Router();

Router.post("/register", async (req, res) => {
  try {
    const { username, password, department } = req.body;
    const hashed = bcrypt.hashSync(password, 10);
    // we will insert a record WITHOUT the raw password but the hash instead
    const user = { username, password: hashed, department };
    const addedUser = await Users.add(user);
    // send back the record to the client
    res.json(addedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

Router.post("/login", async (req, res) => {
  try {
    const { username } = req.body;
    const user = await Users.findBy({ username });

    const password = await req.body.password;
    if (user && bcrypt.compare(password, user.password)) {
      req.session.user = user;
      res.json({ message: "Successful login" });
    } else {
      res.status(401).json({ message: "Bad credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

Router.get("/users", (req, res) => {
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

function secure(req, res, next) {
  // check if there is a user in the session
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized!" });
  }
}

module.exports = Router;
