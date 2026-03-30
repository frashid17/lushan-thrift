-- Admin-managed shop categories (products.category stores the category name as text)

CREATE TABLE product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT product_categories_name_unique UNIQUE (name),
  CONSTRAINT product_categories_name_nonempty CHECK (char_length(trim(name)) > 0)
);

CREATE INDEX idx_product_categories_sort ON product_categories (sort_order, name);

ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read product categories"
  ON product_categories FOR SELECT
  USING (true);

INSERT INTO product_categories (name, sort_order) VALUES
  ('Tops', 10),
  ('Dresses', 20),
  ('Beddings', 30),
  ('Jackets', 40),
  ('Ponchos', 50),
  ('Pajamas', 60);
