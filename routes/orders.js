const express = require('express');
const router  = express.Router();
const orderQueries = require('../db/queries/orders');

router.use(express.json());

// Route to create a new order
router.post('/', (req, res) => {
  /*
  const user = req.session.user;

  if(!user) {
    return res.status(401).json({ error: 'You must be logged in to place an order' });
  }
  */
  const { recipient_id, items } = req.body;
  orderQueries.createOrder(
    recipient_id,
    items
  ).then(r => {
    res.status(201).json({ order_id: r.orderId });
  }).catch(err => {
    res.status(500).json({ message: "failed to create order", details: err.message});
  });
});

router.put('/:id', (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;
  console.log(`id: ${orderId}; status: ${status}`);

  orderQueries.updateOrder(
    orderId, status
  ).then(r => {
    res.status(201).json({ id: orderId });
  }).catch(err => {
    res.status(500).json({ message: "failed to create order", details: err.message});
  });
});

module.exports = router;
