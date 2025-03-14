const express = require('express');
const router = express.Router();
const recipientQueries = require("../db/queries/recipients");

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async(req, res) => {
  // Fetch user from the database
  recipientQueries
    .getUser(req.body)
    .then((user) => {
      if (user.length === 0) {
        return res.status(401).send("error email or username not found");
      }
      req.session.user = { name: user.name, is_admin: user.is_admin, recipient_id: user.id };
      if (user.is_admin) {
        res.redirect("/admin");
      } else {
        res.redirect("/");
      }
    })
    .catch((e) => res.send(e));
});

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      res.status(500).send("failed to logout");
    }
  });
  res.redirect("/");
});

module.exports = router;
