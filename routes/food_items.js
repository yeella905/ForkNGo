const express = require('express');
const router  = express.Router();
const foodQueries = require('../db/queries/food_items');

// Route to get all food items
router.get('/', (req, res) => {
  foodQueries.getFoodItems()
    .then(foodItems => {
      res.json({ foodItems });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

module.exports = router;
