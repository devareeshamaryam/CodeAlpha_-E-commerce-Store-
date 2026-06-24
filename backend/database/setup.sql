-- E-Commerce Database Schema for Supabase
-- Run this SQL in Supabase SQL Editor to create tables

-- ═══════════════════════════════════════════════════════════════════════════
-- PRODUCTS TABLE
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  image TEXT,
  category TEXT NOT NULL,
  tag TEXT,
  description TEXT[] DEFAULT '{}',
  made_to_order_note TEXT,
  disclaimer TEXT,
  sizes TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_tag ON products(tag);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access
CREATE POLICY "Allow public read access to products"
  ON products FOR SELECT
  USING (true);

-- Policy: Allow authenticated users to insert/update/delete (for admin dashboard)
CREATE POLICY "Allow authenticated users to manage products"
  ON products FOR ALL
  USING (auth.role() = 'authenticated');

-- ═══════════════════════════════════════════════════════════════════════════
-- ORDERS TABLE
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address JSONB NOT NULL,
  items JSONB NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read all orders (admin)
CREATE POLICY "Allow authenticated users to read orders"
  ON orders FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Allow anyone to create orders (for checkout)
CREATE POLICY "Allow anyone to create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Policy: Allow authenticated users to update orders (admin)
CREATE POLICY "Allow authenticated users to update orders"
  ON orders FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Policy: Allow authenticated users to delete orders (admin)
CREATE POLICY "Allow authenticated users to delete orders"
  ON orders FOR DELETE
  USING (auth.role() = 'authenticated');

-- ═══════════════════════════════════════════════════════════════════════════
-- CUSTOMERS TABLE (Optional - for user accounts)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to manage customers
CREATE POLICY "Allow authenticated users to manage customers"
  ON customers FOR ALL
  USING (auth.role() = 'authenticated');

-- ═══════════════════════════════════════════════════════════════════════════
-- TRIGGER: Auto-update updated_at timestamp
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════════════════════════════
-- SEED DATA: Sample Products
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO products (slug, name, price, image, category, tag, description, sizes, made_to_order_note, disclaimer) VALUES
  (
    'classic-logo-tee-black',
    'Classic Logo Tee (Black)',
    11200,
    '/images/tee-black.png',
    'T-Shirt',
    'T-SHIRT',
    ARRAY['Made to order', 'Screen-printed graphics', 'PRO CLUB Heavyweight T-Shirt'],
    ARRAY['Small', 'Medium', 'Large', 'X-Large', '2X-Large'],
    'This product is MADE TO ORDER. Please allow up to 2 weeks for production and shipping.',
    'Please note: product images are digital mockups. Actual products may vary in color, brand, style and/or production materials due to reasons beyond our control.'
  ),
  (
    'classic-logo-tee-white',
    'Classic Logo Tee (White)',
    11200,
    '/images/tee-white.png',
    'T-Shirt',
    'T-SHIRT',
    ARRAY['Made to order', 'Screen-printed graphics', 'PRO CLUB Heavyweight T-Shirt'],
    ARRAY['Small', 'Medium', 'Large', 'X-Large', '2X-Large'],
    'This product is MADE TO ORDER. Please allow up to 2 weeks for production and shipping.',
    'Please note: product images are digital mockups. Actual products may vary in color, brand, style and/or production materials due to reasons beyond our control.'
  ),
  (
    'graphic-print-tee-red',
    'Graphic Print Tee (Red)',
    9800,
    '/images/tee-red.png',
    'T-Shirt',
    'T-SHIRT',
    ARRAY['Made to order', 'Screen-printed graphics', 'PRO CLUB Heavyweight T-Shirt'],
    ARRAY['Small', 'Medium', 'Large', 'X-Large', '2X-Large'],
    'This product is MADE TO ORDER. Please allow up to 2 weeks for production and shipping.',
    'Please note: product images are digital mockups. Actual products may vary in color, brand, style and/or production materials due to reasons beyond our control.'
  ),
  (
    'varsity-bomber-jacket-black',
    'Varsity Bomber Jacket (Black)',
    33600,
    '/images/jacket-varsity.png',
    'Jacket',
    'JACKET',
    ARRAY['Made to order', 'Premium tailored fit', 'Durable all-season shell'],
    ARRAY['Small', 'Medium', 'Large', 'X-Large', '2X-Large'],
    'This product is MADE TO ORDER. Please allow up to 2 weeks for production and shipping.',
    'Please note: product images are digital mockups. Actual products may vary in color, brand, style and/or production materials due to reasons beyond our control.'
  ),
  (
    'cargo-pants-black',
    'Cargo Pants (Black)',
    21000,
    '/images/pants-cargo.png',
    'Pants',
    'PANTS',
    ARRAY['Made to order', 'Reinforced stitching', 'Relaxed everyday fit'],
    ARRAY['Small', 'Medium', 'Large', 'X-Large', '2X-Large'],
    'This product is MADE TO ORDER. Please allow up to 2 weeks for production and shipping.',
    'Please note: product images are digital mockups. Actual products may vary in color, brand, style and/or production materials due to reasons beyond our control.'
  ),
  (
    'low-top-canvas-sneaker-white',
    'Low Top Canvas Sneaker (White)',
    25200,
    '/images/sneaker-low.png',
    'Sneakers',
    'SNEAKERS',
    ARRAY['Limited release', 'Premium leather and canvas upper', 'Cushioned comfort sole'],
    ARRAY['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    NULL,
    'Please note: product images are digital mockups. Actual products may vary in color, brand, style and/or production materials due to reasons beyond our control.'
  )
ON CONFLICT (slug) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════
-- SEED DATA: Sample Order
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO orders (customer_name, customer_email, customer_phone, shipping_address, items, total_amount, status) VALUES
  (
    'Ahmad Ali',
    'ahmad@example.com',
    '+92-300-1234567',
    '{"street": "123 Main Street", "city": "Karachi", "state": "Sindh", "zip_code": "75500", "country": "Pakistan"}'::jsonb,
    '[{"product_id": "1", "name": "Classic Logo Tee (Black)", "price": 11200, "quantity": 2, "size": "Large"}]'::jsonb,
    22400,
    'pending'
  );

-- ═══════════════════════════════════════════════════════════════════════════
-- VIEWS: Useful database views
-- ═══════════════════════════════════════════════════════════════════════════

-- View: Product summary with counts
CREATE OR REPLACE VIEW product_summary AS
SELECT 
  category,
  COUNT(*) as product_count,
  AVG(price) as avg_price,
  MIN(price) as min_price,
  MAX(price) as max_price
FROM products
GROUP BY category;

-- View: Order statistics
CREATE OR REPLACE VIEW order_statistics AS
SELECT 
  status,
  COUNT(*) as order_count,
  SUM(total_amount) as total_revenue,
  AVG(total_amount) as avg_order_value
FROM orders
GROUP BY status;

-- ═══════════════════════════════════════════════════════════════════════════
-- FUNCTIONS: Useful stored procedures
-- ═══════════════════════════════════════════════════════════════════════════

-- Function: Get products by category with pagination
CREATE OR REPLACE FUNCTION get_products_by_category(
  p_category TEXT,
  p_limit INT DEFAULT 10,
  p_offset INT DEFAULT 0
)
RETURNS SETOF products AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM products
  WHERE category = p_category
  ORDER BY created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- Function: Search products
CREATE OR REPLACE FUNCTION search_products(search_term TEXT)
RETURNS SETOF products AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM products
  WHERE 
    name ILIKE '%' || search_term || '%' OR
    category ILIKE '%' || search_term || '%' OR
    tag ILIKE '%' || search_term || '%'
  ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- ═══════════════════════════════════════════════════════════════════════════
-- COMPLETED
-- ═══════════════════════════════════════════════════════════════════════════

-- To verify tables were created:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
