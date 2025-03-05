const db = require('../connection');

const getFoodItems = () => {
  return db.query('SELECT * FROM food_items;')
    .then(data => {
      return data.rows;
    });
};

module.exports = { getFoodItems };
