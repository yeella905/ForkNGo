/*
 * All routes for Food items Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/food_items
 */

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
