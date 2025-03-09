const db = require('../connection');

/**
 * Add a new order to the DB
 * @param {number} recipients_id The ID of the recipient
 * @param {Date} user_selected_pickup_time User selected pickup time
 * @param {Date} estimated_pickup_time Estimated pickup time
 * @param {Date} actual_pickup_time Actual pickup time
 * @param {Array} cartItems Array of items in the cart
 * @return {Promise<{}>} A promise to the property.
 */

const createOrder = function(recipients_id, user_selected_pickup_time, estimated_pickup_time, actual_pickup_time, cartItems) {
  const queryString_1 = `INSERT INTO orders (
  recipients_id, user_selected_pickup_time, estimated_pickup_time, actual_pickup_time)
  VALUES ($1, $2, $3, $4)
  RETURNING id;`;

  const queryParams_1 = [recipients_id, user_selected_pickup_time, estimated_pickup_time, actual_pickup_time];

  // Insert the new order into the 'orders' table
  return db.query(queryString_1, queryParams_1)
    .then(orderResult => {
      // Get the newly created order id
      const orderId = orderResult.rows[0].id;

      // Insert food items into the 'order_items' table
      const insertOrderItemsPromises = cartItems.map(item => {
        const queryString_2 = `INSERT INTO order_items (orders_id, food_items_id, quantity, price, tax, special_request)
        VALUES ($1, $2, $3, $4, $5, $6)`;

        const queryParams_2 = [
          orderId,
          item.food_items_id,
          item.quantity,
          item.price,
          item.tax,
          item.special_request
        ];

        return db.query(queryString_2, queryParams_2);
      });

      return Promise.all(insertOrderItemsPromises)
        .then(() => {
          // Return the created order id along with its items
          return { orderId, cartItems };
        });
    })

    .catch((err) => {
      console.log('Error adding the order', err);
      throw err;
    });
};

/**
 * Get orders for a specific user
 * @param {number} recipients_id The ID of the recipient
 * @return {promise<Array>} A promise to the orders
 */

const getOrders = function(recipients_id) {
  const queryString = `
    SELECT
      o.id as order_id,
      o.user_selected_pickup_time,
      o.estimated_pickup_time,
      o.actual_pickup_time,
      oi.id as order_item_id,
      oi.quantity,
      oi.price,
      oi.tax,
      oi.special_request,
      f.id as food_item_id,
      f.name as food_name,
      f.image_url
    FROM orders o
    JOIN order_items oi ON o.id = oi.orders_id
    JOIN food_items f ON oi.food_items_id = f.id
    WHERE o.recipients_id = $1
    ORDER BY o.id DESC, oi.id ASC;
    `;

  return db.query(queryString, [recipients_id])
    .then(result => {
      const orders = {};

      // Group by order_id
      result.rows.forEach(row => {
        if (!orders[row.order_id]) {
          orders[row.order_id] = {
            id: row.order_id,
            user_selected_pickup_time: row.estimated_pickup_time,
            actual_pickup_time: row.actual_pickup_time,
            items: []
          };
        }
        orders[row.order_id].items.push({
          id: row.order_item_id,
          food_item_id: row.food_item_id,
          name: row.food_name,
          quantity: row.quantity,
          price: row.price,
          tax: row.tax,
          special_request: row.special_request,
          image_url: row.image_url
        });
      });

      // Convert to array
      return Object.values(orders);
    })
    .catch((err) => {
      console.log('Error fetching orders', err);
      throw err;
    });
};


module.exports = {
  createOrder,
  getOrders
};
