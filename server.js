// load .env data into process.env
require('dotenv').config();

// Web server config
const express = require('express');
const morgan = require('morgan');
const session = require("express-session") //cookies parser
const PORT = process.env.PORT || 8080;
const app = express();

const foodQueries = require("./db/queries/food_items");
const recipentQueries = require("./db/queries/recipents");
app.set("view engine", "ejs");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use( //session storage to save user details when user logs in
    session({
      secret: "abcdefghijklmnopquqnjnkanfbijqwleqiuewqe",
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false } 
    })
  );

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const widgetApiRoutes = require("./routes/widgets-api");
const recipentsApiRoutes = require("./routes/recipents");
const foodItemsApiRoutes = require("./routes/food_items");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use("/api/widgets", widgetApiRoutes);
app.use("/api/recipents", recipentsApiRoutes);
app.use("/api/food_items", foodItemsApiRoutes);
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

// Fetch food items and render them on the home page
app.get("/", (req, res) => {
    const user = req.session.user || null
    console.log(req.session)
  foodQueries
    .getFoodItems()
    .then((foodItems) => {
      res.render("index", { foodItems,user });
    })
    .catch((err) => {
      console.error("Error fetching food items:", err);
      res.status(500).send("Error fetching food items");
    });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {

  // Fetch user from the database
    recipentQueries
      .getUser(req.body)
      .then((user) => {
        if (user.length == 0) {
          return res.status(401).send( "error email or username not found" ); //if user provides wrong email or name, display 401 error message
        }
        req.session.user = {name:user[0].name} //once the user logs in, the session will belong to that user. this is how we are going to access the user in other ejs files
        res.redirect("/")
      })
      .catch((e) => res.send(e));

});

app.get("/logout", (req, res) => { 
    //when user logs out, destroy session and remover user data
    req.session.destroy((error) => {
        if (error) {
            res.status(500).send("failed to logout")
        }
    })
    res.redirect("/");
  });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
