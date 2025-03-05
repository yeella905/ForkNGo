DROP TABLE IF EXISTS orders CASCADE;

CREATE TABLE orders (
  id SERIAL PRIMARY KEY NOT NULL,
  recipients_id INTEGER REFERENCES recipients(id) ON DELETE CASCADE,
  user_selected_pickup_time TIMESTAMP NOT NULL,
  estimated_pickup_time TIMESTAMP NOT NULL,
  actual_pickup_time TIMESTAMP NOT NULL
);
