-- Seed data for Lushan Thrift (run after migrations)
-- Replace placeholder image URLs with your Cloudinary URLs after uploading.

INSERT INTO products (name, description, price, image_url, category, size, availability) VALUES
('Vintage Denim Jacket', 'Classic blue denim jacket, lightly worn.', 1200, 'https://res.cloudinary.com/demo/image/upload/sample.jpg', 'Jackets', 'M', true),
('Floral Midi Dress', 'Light cotton floral dress, ideal for warm weather.', 800, 'https://res.cloudinary.com/demo/image/upload/sample.jpg', 'Dresses', 'L', true),
('Striped Cotton Tee', 'Comfortable striped t-shirt, pre-loved condition.', 350, 'https://res.cloudinary.com/demo/image/upload/sample.jpg', 'Tops', 'M', true),
('Cotton Pajama Set', 'Soft two-piece pajamas, gently used.', 950, 'https://res.cloudinary.com/demo/image/upload/sample.jpg', 'Pajamas', 'L', true),
('Hooded Poncho', 'Lightweight cover-up, one size.', 600, 'https://res.cloudinary.com/demo/image/upload/sample.jpg', 'Ponchos', 'One Size', true),
('Woven Throw Blanket', 'Hand-woven accent blanket for bed or sofa.', 450, 'https://res.cloudinary.com/demo/image/upload/sample.jpg', 'Beddings', 'One Size', true);

-- Note: Create a user in Clerk first, then set their publicMetadata.role = 'admin' in Clerk Dashboard.
-- Sync will create the users row via /api/auth/sync-user when they sign in.
