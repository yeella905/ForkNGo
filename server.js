// load .env data into process.env
require('dotenv').config();

// Web server config
const express = require('express');
const morgan = require('morgan');
const session = require("express-session"); //cookies parser
const foodQueries = require("./db/queries/food_items");
const PORT = process.env.PORT || 8080;
const app = express();

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

// API routes
const recipientsApiRoutes = require("./routes/recipients");
const foodItemsApiRoutes = require("./routes/menu");
const ordersApiRoutes = require("./routes/orders");

// Mount all API routes
app.use("/api/recipients", recipientsApiRoutes);
app.use("/api/food_items", foodItemsApiRoutes);
app.use("/api/orders", ordersApiRoutes);

// Page rendering routes
const viewPagesRoutes = require("./routes/view-pages");
const authRoutes = require("./routes/auth-routes");
const adminRoutes = require("./routes/admin-routes");

// Mount all page rendering routes
app.use("/", viewPagesRoutes);
app.use("/", authRoutes);
app.use("/admin", adminRoutes);


// Home page
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

app.listen(PORT, () => {
  console.log(`ForkNGo app listening on port ${PORT}`);
})
