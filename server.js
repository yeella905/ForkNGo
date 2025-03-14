// load .env data into process.env
require('dotenv').config();

// Web server config
const express = require('express');
const morgan = require('morgan');
const session = require("express-session"); //cookies parser
const PORT = process.env.PORT || 8080;
const app = express();

const foodQueries = require("./db/queries/food_items");
const orderQueries = require("./db/queries/orders");
const recipientQueries = require("./db/queries/recipients");
const orders_admin = require("./db/queries/orders_admin");
app.set("view engine", "ejs");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(
  //session storage to save user details when user logs in
  session({
    secret: "abcdefghijklmnopquqnjnkanfbijqwleqiuewqe",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Separated Routes for each Resource
const recipientsApiRoutes = require("./routes/recipients");
const foodItemsApiRoutes = require("./routes/menu");
const ordersApiRoutes = require("./routes/orders");

// Mount all resource routes
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use("/api/recipients", recipientsApiRoutes);
app.use("/api/food_items", foodItemsApiRoutes);
app.use("/api/orders", ordersApiRoutes);
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

// Fetch food items and render them on the home page
app.get("/", (req, res) => {
  const user = req.session.user || null;
  console.log(">>>> SESSION");
  console.log(user);
  foodQueries
    .getFoodItems()
    .then((foodItems) => {
      res.render("index", { foodItems, user });
    })
    .catch((err) => {
      console.error("Error fetching food items:", err);
      res.status(500).send("Error fetching food items");
    });
});

app.get('/orders', (req, res) => {
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

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async(req, res) => {
  // Fetch user from the database
  recipientQueries
    .getUser(req.body)
    .then((user) => {
      if (user.length === 0) {
        return res.status(401).send("error email or username not found"); //if user provides wrong email or name, display 401 error message
      }
      req.session.user = { name: user.name, is_admin: user.is_admin, recipient_id: user.id }; //once the user logs in, the session will belong to that user. this is how we are going to access the user in other ejs files
      if (user.is_admin) {
        res.redirect("/admin");
      } else {
        res.redirect("/");
      }
    })
    .catch((e) => res.send(e));
});

app.get("/logout", (req, res) => {
  //when user logs out, destroy session and remove user data
  req.session.destroy((error) => {
    if (error) {
      res.status(500).send("failed to logout");
    }
  });
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

app.get("/admin", (req, res) => {
  const user = req.session.user || null;
  if (user.is_admin) {
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
  } else {
    res.redirect("/");
  }
});

app.post("/update-status", (req, res) => {
  const { orderId, newStatus } = req.body;

  if (!orderId || !newStatus) {
    //making sure orderId and newStatus is passed properly
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
