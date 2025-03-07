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

module.exports = { createOrder };
