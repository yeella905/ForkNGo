-- Seed for order items
INSERT INTO order_items (orders_id, food_items_id, quantity, price, tax, special_request)
VALUES
  (1, 1, 2, 9.99, 1.50, 'No cheese on one pizza'),  -- Customer 1 ordered 2 Margherita Pizzas
  (1, 3, 1, 7.99, 1.20, 'No onions'),             -- Customer 1 ordered 1 Cheeseburger
  (2, 2, 1, 12.99, 1.95, 'Extra sauce'),          -- Customer 2 ordered 1 Pepperoni Pizza
  (2, 5, 2, 4.99, 0.75, '');                      -- Customer 2 ordered 2 Chocolate Cakes
