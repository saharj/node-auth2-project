const express = require("express");

const userRouter = require("./user/userRouter");

const server = express();

server.use(express.json());
server.use("/auth", userRouter);

server.get("/", (req, res) => {
  res.send(`
    <h2>The app is working</h2>
  `);
});

module.exports = server;
