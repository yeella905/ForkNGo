const express = require('express');
const router  = express.Router();
const orderQueries = require('../db/queries/orders');

module.exports = (db) => {

// Route to create a new order
router.post('/orders', (req, res) => {
  const user = req.session.user;

  if(!user) {
    return res.status(401).json({ error: 'You must be logged in to place an order' });
  }

  const { recipients_id, order_status, cartItems } = req.body;

  // Call the createOrder function to add the order and items to the DB
  orderQueries.createOrder(
    recipients_id,
    order_status,
    cartItems
  )
    .then(result => {
      res.status(201).json({message: 'Order created successfully!', orderId: result.orderId, cartItems: result.cartItems });
    })
    .catch(err => {
      res.status(500).json({ error: 'Failed to create order', details: err.message });
    });
});

return router;
};
