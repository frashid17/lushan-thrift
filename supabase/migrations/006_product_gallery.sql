-- Multiple images per product: ordered JSON array; first URL is the primary (card / list image).
-- products.image_url stays in sync as the primary for backward compatibility.

ALTER TABLE products ADD COLUMN IF NOT EXISTS gallery_urls JSONB NOT NULL DEFAULT '[]'::jsonb;

UPDATE products
SET gallery_urls = jsonb_build_array(image_url)
WHERE jsonb_array_length(gallery_urls) = 0
  AND image_url IS NOT NULL
  AND TRIM(image_url) <> '';
