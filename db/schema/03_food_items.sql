DROP TABLE IF EXISTS food_items CASCADE;

CREATE TABLE food_items (
  id SERIAL PRIMARY KEY NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2)  NOT NULL DEFAULT 0.00,
  image_url VARCHAR NOT NULL
);
