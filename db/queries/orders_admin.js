const db = require("../connection");

const getadminorders = () => {
  return db.query("SELECT * FROM order;").then((data) => {
    return data.rows;
  });
};

module.exports = { getadminorders };
