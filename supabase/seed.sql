-- Seed data for Lushan Thrift (run after migrations)
-- Replace placeholder image URLs with your Cloudinary URLs after uploading.

INSERT INTO products (name, description, price, image_url, category, size, availability) VALUES
('Vintage Denim Jacket', 'Classic blue denim jacket, lightly worn. Perfect for Mombasa evenings.', 1200, 'https://res.cloudinary.com/demo/image/upload/sample.jpg', 'Outerwear', 'M', true),
('Floral Midi Dress', 'Light cotton floral dress, ideal for warm weather.', 800, 'https://res.cloudinary.com/demo/image/upload/sample.jpg', 'Dresses', 'L', true),
('Striped Cotton Tee', 'Comfortable striped t-shirt, pre-loved condition.', 350, 'https://res.cloudinary.com/demo/image/upload/sample.jpg', 'Tops', 'M', true),
('High-Waist Trousers', 'Smart casual trousers, navy blue.', 950, 'https://res.cloudinary.com/demo/image/upload/sample.jpg', 'Bottoms', 'L', true),
('Canvas Sneakers', 'White canvas sneakers, size 42.', 600, 'https://res.cloudinary.com/demo/image/upload/sample.jpg', 'Shoes', '42', true),
('Woven Basket Bag', 'Hand-woven bag, perfect for beach or market.', 450, 'https://res.cloudinary.com/demo/image/upload/sample.jpg', 'Accessories', 'One Size', true);

-- Note: Create a user in Clerk first, then set their publicMetadata.role = 'admin' in Clerk Dashboard.
-- Sync will create the users row via /api/auth/sync-user when they sign in.
