const db = require("../connection");

const getAdminOrders = () => {
  return db
    .query(
      `SELECT orders.*, recipients.name, recipients.phone,
      array_agg(
      DISTINCT jsonb_build_object(
      'order_item_id', order_items.id,
      'food_item_id', order_items.food_items_id,
      'price', order_items.price,
      'qty', order_items.quantity,
      'tax', order_items.tax,
      'special_request', order_items.special_request,
      'food_name', food_items.name)) AS items
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

const updateOrder = (orderId, status) => {
  const querystring = `UPDATE orders SET order_status = $2
      WHERE id = $1`;
  const values = [orderId, status];
  return db
    .query(querystring, values)
    .then(() => {
      return { success: true, message: "Order status updated successfully" };
    })
    .catch((error) => {
      console.error("Error updating order status:", error);
      return { success: false, message: "Internal server error" };
    });
};

module.exports = { getAdminOrders, updateOrder };
