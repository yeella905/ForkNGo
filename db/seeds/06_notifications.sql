-- Seed for notifications
INSERT INTO notifications (order_id, recipients_id, message, sent_at)
VALUES
  (1, 1, 'Your order has been received and is being prepared!', '2025-03-10'),
  (2, 2, 'Your order is ready for pickup!', '2025-03-11');
