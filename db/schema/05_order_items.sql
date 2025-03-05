DROP TABLE IF EXISTS order_items CASCADE;

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY NOT NULL,
  orders_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  food_items_id INTEGER REFERENCES food_items(id) ON DELETE CASCADE,
  quantity INTEGER  NOT NULL DEFAULT 0,
  price INTEGER  NOT NULL DEFAULT 0,
  tax INTEGER GENERATED ALWAYS AS (price * 0.13) STORED,
  special_request VARCHAR(255) NOT NULL,
);