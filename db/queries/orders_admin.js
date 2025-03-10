const db = require("../connection");

const getAdminOrders = () => {
  return db.query("SELECT * FROM orders;").then((data) => {
    return data.rows;
  });
};

module.exports = { getAdminOrders };
