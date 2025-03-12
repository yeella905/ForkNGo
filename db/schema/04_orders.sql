DROP TABLE IF EXISTS orders CASCADE;

CREATE TABLE orders (
  id SERIAL PRIMARY KEY NOT NULL,
  recipients_id INTEGER REFERENCES recipients(id) ON DELETE CASCADE,
  order_status VARCHAR(255) NOT NULL DEFAULT 'received'
);
