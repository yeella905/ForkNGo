-- Recipients seeds (users)
INSERT INTO recipients (name, email, phone, is_admin)
VALUES
  ('John Doe', 'johndoe@example.com', '123-456-7890', FALSE),  -- Customer
  ('Jane Smith', 'janesmith@example.com', '234-567-8901', FALSE), -- Customer
  ('Admin User', 'admin@restaurant.com', '345-678-9012', TRUE), -- Restaurant Owner/Admin
  ('Alice Johnson', 'alice.johnson@example.com', '456-789-0123', FALSE), -- Customer
  ('Bob Williams', 'bob.williams@restaurant.com', '567-890-1234', TRUE); -- Restaurant Owner/Admin
