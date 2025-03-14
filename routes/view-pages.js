const express = require('express');
const router = express.Router();
const orderQueries = require("../db/queries/orders");

router.get('/orders', (req, res) => {
  const user = req.session.user;

  // If user is not logged in just show the cart
  if (!user) {
    return res.render('orders', { user: null, orders: [] });
  }

  // Get user's orders
  orderQueries.getOrders(user.id)
    .then(orders => {
      res.render('orders', { user, orders });
    })
    .catch(err => {
      console.error('Error fetching orders:', err);
      res.render('orders', { user, orders: [], error: 'Error fetching orders'});
    });
});

module.exports = router;
