/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const database = require("../db/queries/recipients");

router.get("/", (req, res) => {
  res.render("users");
});

router.get("/login", (req, res) => {
  console.log(req);

  database
    .getUser(req.body)
    .then((user) => {
      if (user.length == 0) {
        return res.send({ error: "error email or username not found" });
      }

      res.send(user);
    })
    .catch((e) => res.send(e));
});

module.exports = router;
