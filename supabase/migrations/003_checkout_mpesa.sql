-- M-Pesa manual checkout: location, customer details, payment verification

CREATE TABLE payment_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  mpesa_buy_goods TEXT NOT NULL DEFAULT '12345',
  mpesa_till_name TEXT NOT NULL DEFAULT 'lushanthrift',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO payment_settings (id, mpesa_buy_goods, mpesa_till_name)
SELECT 1, '12345', 'lushanthrift'
WHERE NOT EXISTS (SELECT 1 FROM payment_settings WHERE id = 1);

ALTER TABLE orders
  ADD COLUMN delivery_lat DOUBLE PRECISION,
  ADD COLUMN delivery_lng DOUBLE PRECISION,
  ADD COLUMN delivery_address_label TEXT,
  ADD COLUMN customer_name TEXT,
  ADD COLUMN customer_phone TEXT,
  ADD COLUMN customer_email TEXT,
  ADD COLUMN delivery_type TEXT DEFAULT 'shipping',
  ADD COLUMN payment_status TEXT DEFAULT 'pending',
  ADD COLUMN mpesa_message TEXT,
  ADD COLUMN mpesa_sender_name TEXT;

-- Legacy rows from simulated checkout
UPDATE orders SET
  customer_name = COALESCE(NULLIF(TRIM(customer_name), ''), 'Customer'),
  customer_phone = COALESCE(NULLIF(TRIM(customer_phone), ''), '—'),
  delivery_lat = COALESCE(delivery_lat, -4.0435),
  delivery_lng = COALESCE(delivery_lng, 39.6682),
  delivery_address_label = COALESCE(NULLIF(TRIM(delivery_address_label), ''), 'Not recorded (legacy order)'),
  delivery_type = COALESCE(delivery_type, 'pickup'),
  payment_status = CASE
    WHEN status = 'paid_simulated' THEN 'approved'
    ELSE COALESCE(payment_status, 'pending')
  END
WHERE customer_name IS NULL
   OR TRIM(COALESCE(customer_name, '')) = ''
   OR customer_phone IS NULL
   OR TRIM(COALESCE(customer_phone, '')) = '';

UPDATE orders SET status = 'placed' WHERE status = 'paid_simulated';

UPDATE orders SET
  delivery_lat = COALESCE(delivery_lat, -4.0435),
  delivery_lng = COALESCE(delivery_lng, 39.6682),
  delivery_address_label = COALESCE(NULLIF(TRIM(delivery_address_label), ''), 'Not recorded (legacy order)')
WHERE delivery_lat IS NULL OR delivery_lng IS NULL;

ALTER TABLE orders ALTER COLUMN customer_name SET NOT NULL;
ALTER TABLE orders ALTER COLUMN customer_phone SET NOT NULL;
ALTER TABLE orders ALTER COLUMN delivery_type SET NOT NULL;
ALTER TABLE orders ALTER COLUMN payment_status SET NOT NULL;

ALTER TABLE orders ALTER COLUMN delivery_lat SET NOT NULL;
ALTER TABLE orders ALTER COLUMN delivery_lng SET NOT NULL;

ALTER TABLE orders ALTER COLUMN status SET DEFAULT 'placed';

ALTER TABLE orders
  ADD CONSTRAINT orders_delivery_type_check CHECK (delivery_type IN ('pickup', 'shipping'));

ALTER TABLE orders
  ADD CONSTRAINT orders_payment_status_check CHECK (payment_status IN ('pending', 'submitted', 'approved'));

CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
