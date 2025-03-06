// load .env data into process.env
require('dotenv').config();

// Web server config
const express = require('express');
const morgan = require('morgan');

const PORT = process.env.PORT || 8080;
const app = express();

app.set('view engine', 'ejs');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const widgetApiRoutes = require('./routes/widgets-api');
const usersRoutes = require('./routes/users');
const foodItemsApiRoutes = require('./routes/food_items')

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use('/api/widgets', widgetApiRoutes);
app.use('/users', usersRoutes);
app.use('/api/food_items', foodItemsApiRoutes);
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

// Fetch food items and render them on the home page
app.get('/', (req, res) => {
  foodQueries.getFoodItems()
    .then(foodItems => {
      res.render('index', { foodItems });
    })
    .catch(err => {
      console.error('Error fetching food items:', err);
      res.status(500).send('Error fetching food items');
    });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
