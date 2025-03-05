DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS food_items CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS recipients CASCADE;

CREATE TABLE recipients (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
);

CREATE TABLE food_items (
  id SERIAL PRIMARY KEY NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price INTEGER  NOT NULL DEFAULT 0,
  image_url VARCHAR(255) NOT NULL,
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY NOT NULL,
  recipients_id INTEGER REFERENCES recipients(id) ON DELETE CASCADE,
  user_selected_pickup_time DATE NOT NULL,
  estimated_pickup_time DATE NOT NULL,
  actual_pickup_time DATE NOT NULL,
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY NOT NULL,
  orders_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  food_items_id INTEGER REFERENCES food_items(id) ON DELETE CASCADE,
  quantity INTEGER  NOT NULL DEFAULT 0,
  price INTEGER  NOT NULL DEFAULT 0,
  tax INTEGER GENERATED ALWAYS AS (price * 0.13) STORED,
  special_request VARCHAR(255) NOT NULL,
);

CREATE TABLE notifications (
  id SERIAL PRIMARY KEY NOT NULL,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  recipients_id INTEGER REFERENCES recipients(id) ON DELETE CASCADE,
  message TEXT,
  sent_at DATE NOT NULL,
);
