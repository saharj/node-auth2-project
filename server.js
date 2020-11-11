const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const sessionStore = require("connect-session-knex")(session);

const userRouter = require("./user/userRouter");

const server = express();

server.use(helmet());
server.use(express.json());
// server.use(cors());
server.use(
  session({
    name: "usersSession",
    secret: "this should come from process.env", // the cookie is encrypted
    cookie: {
      maxAge: 1000 * 60,
      secure: false, // in production do true (https is a must)
      httpOnly: true, // this means the JS on the page cannot read the cookie
    },
    resave: false, // we don't want to recreate sessions that haven't changed
    saveUninitialized: false, // we don't want to persist the session 'by default' (GDPR!!!!)
    // storing the session in the db so it survives server restarts
    store: new sessionStore({
      knex: require("./data/db-config"),
      tablename: "sessions",
      sidfieldname: "sid",
      createTable: true,
      clearInterval: 1000 * 60 * 60,
    }),
  })
);
server.use("/auth", userRouter);

server.get("/", (req, res) => {
  res.send(`
    <h2>The app is working</h2>
  `);
});

module.exports = server;
