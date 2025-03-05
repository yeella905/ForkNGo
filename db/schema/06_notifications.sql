DROP TABLE IF EXISTS notifications CASCADE;

CREATE TABLE notifications (
  id SERIAL PRIMARY KEY NOT NULL,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  recipients_id INTEGER REFERENCES recipients(id) ON DELETE CASCADE,
  message TEXT,
  sent_at DATE NOT NULL
);