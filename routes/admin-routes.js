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

router.get("/", (req, res) => {
  const user = req.session.user;
  orders_admin
    .getAdminOrders()
    .then((ordersAdmin) => {
      console.log(ordersAdmin);
      res.render("admin", { ordersAdmin, user });
    })
    .catch((err) => {
      console.error("Error fetching order:", err);
      res.status(500).send("Error fetching order");
    });
});

router.post("/update-status", (req, res) => {
  const { orderId, newStatus } = req.body;

  if (!orderId || !newStatus) {
    return res.status(400).send("Missing orderId or newStatus");
  }

  orders_admin
    .updateOrder(orderId, newStatus)
    .then((response) => {
      console.log("Update response:", response);
      res.json({ response });
    })
    .catch((err) => {
      console.error("Error updating order:", err);
      res.status(500).send("Error updating order");
    });
});

module.exports = router;
