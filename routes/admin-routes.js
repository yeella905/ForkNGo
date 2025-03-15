const express = require('express');
const router = express.Router();
const orders_admin = require("../db/queries/orders_admin");

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  const user = req.session.user;
  if (user && user.is_admin) {
    next();
  } else {
    res.redirect("/");
  }
};

// Apply admin check to all routes in this router
router.use(isAdmin);

const statusText = {
  "received" : "Mark as in progress",
  "in progress" : "Mark as ready for pick-up",
  "ready for pick-up": "Mark as picked up",
  "picked up" : "Picked up"
};

router.get("/", (req, res) => {
  const user = req.session.user;
  orders_admin
    .getAdminOrders()
    .then((ordersAdmin) => {
      console.log(ordersAdmin);
      res.render("admin", { ordersAdmin, user, statusText });
    })
    .catch((err) => {
      console.error("Error fetching order:", err);
      res.status(500).send("Error fetching order");
    });
});

module.exports = router;
