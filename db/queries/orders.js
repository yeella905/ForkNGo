require('dotenv').config();
const db = require('../connection');
const twilio = require("twilio");

// Sets Twilio env variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

async function createMessage(phoneNumber) {
  const message = await client.messages.create({
    body: "ForkNGo has received your order. We'll update you shortly with pickup time.",
    from: "+17242020885",
    to: phoneNumber,
  });
  console.log(message.body);
  return message;
}

const createOrder = function(recipient_id, items) {
  const insertIntoOrders = "INSERT INTO orders (recipients_id, order_status) VALUES ($1, $2) RETURNING *";
  const insertIntoOrdersParams = [recipient_id, "received"];

  console.log(insertIntoOrdersParams);

  // Insert the new order into the 'orders' table
  return db.query(insertIntoOrders, insertIntoOrdersParams)
    .then(orderResult => {
      console.log(orderResult);
      console.log(orderResult.rows);

      // Get the newly created order id
      const orderId = orderResult.rows[0].id;
      const recipientId = orderResult.rows[0].recipients_id;
      console.log(recipientId);

      // Get recipient's phone number
      const getRecipientPhone = `SELECT phone FROM recipients WHERE id = $1`;
      return db.query(getRecipientPhone, [recipientId])
        .then(recipientResult => {
          const recipientPhone = recipientResult.rows[0].phone;
          console.log(recipientPhone);

          // Insert food items into the 'order_items' table
          const insertOrderItemsPromises = items.map(item => {
            const insertIntoOrderItems = `INSERT INTO order_items (orders_id, food_items_id, quantity, special_request)
            VALUES ($1, $2, $3, $4)`;
            const insertIntoOrderItemsParams = [orderId, item.food_items_id, item.quantity, item.special_request];

            console.log(insertIntoOrderItemsParams);

            return db.query(
              insertIntoOrderItems,
              insertIntoOrderItemsParams);
          });

          return Promise.all(insertOrderItemsPromises)
            .then(() => {
              // Pass the recipient's phone number to createMessage
              return createMessage(recipientPhone)
                .then(messageResult => {
                  return {
                    orderId,
                    messageStatus: messageResult.status
                  };
                });
            });
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
