const db = require("../connection");

const getAdminOrders = () => {
  return db
    .query(
      `SELECT orders.*, recipients.name, recipients.phone, array_agg(order_items) AS items, array_agg(food_items) AS foods 
      FROM orders 
      INNER JOIN recipients ON orders.recipients_id = recipients.id
      INNER JOIN order_items ON orders.id = order_items.orders_id
      INNER JOIN food_items ON order_items.food_items_id = food_items.id
      GROUP BY orders.id, recipients.id;`
    )
    .then((data) => {
      console.log(data.rows);
      return data.rows;
    });
};

module.exports = { getAdminOrders };
