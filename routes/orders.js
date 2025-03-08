const express = require('express');
const router  = express.Router();
const orderQueries = require('../db/queries/orders');


// Route to create an order
router.post('/create', (req, res) => {
  const { recipients_id, user_selected_pickup_time, estimated_pickup_time, actual_pickup_time, cartItems } = req.body;

  // Call the createOrder function to add the order and items to the DB
  orderQueries.createOrder(recipients_id, user_selected_pickup_time, estimated_pickup_time, actual_pickup_time, cartItems)
    .then(result => {
      res.status(201).json({message: 'Order created successfully!', orderId: result.orderId, cartItems: result.cartItems });
    })
    .catch(err => {
      res.status(500).json({ error: 'Failed to create order', details: err.message });
    });
});


module.exports = router;
