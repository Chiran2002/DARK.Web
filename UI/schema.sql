-- ============================================================================
-- DARK ATELIER // E-COMMERCE & CUSTOM STUDIO RELATIONAL DATABASE SCHEMA
-- Compatible with: SQLite, PostgreSQL, MySQL 8.0+
-- Description: Full production schema for apparel catalog, variants, custom
--              studio designs, order processing, promo codes, and reviews.
-- ============================================================================

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    category_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. PRODUCTS TABLE (Base silhouettes)
CREATE TABLE IF NOT EXISTS products (
    product_id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    price DECIMAL(10, 2) NOT NULL,
    gsm INTEGER NOT NULL, -- Fabric weight in grams per square meter (e.g. 240, 280)
    rating DECIMAL(2, 1) DEFAULT 5.0,
    reviews_count INTEGER DEFAULT 0,
    badge VARCHAR(50), -- e.g. 'BESTSELLER', 'LIMITED DROP', 'ESSENTIAL'
    image_url VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE RESTRICT
);

-- 3. PRODUCT COLORWAYS TABLE
CREATE TABLE IF NOT EXISTS product_colors (
    color_id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    color_name VARCHAR(100) NOT NULL,
    hex_code VARCHAR(10) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- 4. PRODUCT SIZES & INVENTORY STOCK TABLE
CREATE TABLE IF NOT EXISTS product_sizes (
    size_id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    size_name VARCHAR(10) NOT NULL, -- 'S', 'M', 'L', 'XL', 'XXL'
    stock_quantity INTEGER NOT NULL DEFAULT 50,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    UNIQUE(product_id, size_name)
);

-- 5. PRODUCT FABRIC SPECIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS product_specs (
    spec_id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    spec_text VARCHAR(255) NOT NULL,
    display_order INTEGER DEFAULT 1,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- 6. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS customers (
    customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    password_hash VARCHAR(255),
    is_vip_member BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. SHIPPING ADDRESSES TABLE
CREATE TABLE IF NOT EXISTS shipping_addresses (
    address_id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    street_address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(30) NOT NULL,
    country VARCHAR(100) NOT NULL,
    is_default BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);

-- 7.5. CUSTOMER PAYMENT CARDS TABLE
CREATE TABLE IF NOT EXISTS customer_cards (
    card_id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    cardholder_name VARCHAR(100) NOT NULL,
    last4 VARCHAR(4) NOT NULL,
    expiry VARCHAR(10) NOT NULL,
    brand VARCHAR(20) DEFAULT 'VISA',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);

-- 8. PROMO CODES TABLE
CREATE TABLE IF NOT EXISTS promo_codes (
    promo_id INTEGER PRIMARY KEY AUTOINCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_type VARCHAR(20) NOT NULL, -- 'percentage' or 'fixed_amount'
    discount_value DECIMAL(10, 2) NOT NULL, -- e.g. 20.00 for 20% or 10.00 for $10
    min_order_value DECIMAL(10, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT 1,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    order_id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number VARCHAR(50) NOT NULL UNIQUE, -- e.g. '#DA-88294'
    customer_id INTEGER NOT NULL,
    promo_code_id INTEGER,
    subtotal DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    shipping_fee DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    shipping_method VARCHAR(100) DEFAULT 'Express Tracked Courier',
    payment_method VARCHAR(50) NOT NULL, -- 'card', 'apple_pay', 'upi'
    payment_status VARCHAR(50) DEFAULT 'PAID', -- 'PENDING', 'PAID', 'FAILED'
    order_status VARCHAR(50) DEFAULT 'PROCESSING', -- 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'
    shipping_address_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE RESTRICT,
    FOREIGN KEY (promo_code_id) REFERENCES promo_codes(promo_id) ON DELETE SET NULL
);

-- 10. ORDER ITEMS TABLE (Supports both Standard Products & Custom Studio creations)
CREATE TABLE IF NOT EXISTS order_items (
    item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER, -- Nullable if fully custom studio garment
    is_custom BOOLEAN DEFAULT 0,
    title VARCHAR(255) NOT NULL,
    size VARCHAR(10) NOT NULL,
    color VARCHAR(100) NOT NULL,
    gsm INTEGER NOT NULL,
    -- Custom studio specific configuration
    custom_text VARCHAR(100),
    custom_preset VARCHAR(100), -- 'skull', 'japanese', 'geometry', 'minimal'
    custom_font VARCHAR(100),
    custom_ink_color VARCHAR(20),
    unit_price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    total_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE SET NULL
);

-- 11. CUSTOM STUDIO SAVED DESIGNS TABLE
CREATE TABLE IF NOT EXISTS custom_studio_designs (
    design_id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER,
    design_title VARCHAR(255) DEFAULT 'Custom Boxy Silhouette',
    fabric_color VARCHAR(100) NOT NULL,
    fabric_hex VARCHAR(10) NOT NULL,
    gsm INTEGER NOT NULL,
    preset_artwork VARCHAR(50) NOT NULL,
    custom_text VARCHAR(50),
    font_family VARCHAR(100),
    ink_color_hex VARCHAR(10),
    size_preference VARCHAR(10) DEFAULT 'L',
    calculated_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE SET NULL
);

-- 12. VERIFIED REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
    review_id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    author_name VARCHAR(100) NOT NULL,
    author_city VARCHAR(100) DEFAULT 'Verified Collector',
    rating INTEGER CHECK(rating >= 1 AND rating <= 5),
    title VARCHAR(255) NOT NULL,
    comment TEXT NOT NULL,
    garment_tag VARCHAR(255),
    is_verified BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE SET NULL
);

-- 13. NEWSLETTER VIP SUBSCRIBERS TABLE
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    subscriber_id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    source VARCHAR(50) DEFAULT 'website_footer',
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES FOR HIGH-PERFORMANCE QUERYING
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_gsm ON products(gsm);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);
