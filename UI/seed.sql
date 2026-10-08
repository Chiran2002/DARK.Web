-- ============================================================================
-- DARK ATELIER // INITIAL SEED DATA
-- Populates categories, products, inventory variants, promo codes,
-- customer profiles, sample orders, custom designs, and verified reviews.
-- ============================================================================

-- 1. CATEGORIES
INSERT INTO categories (category_id, name, description) VALUES
('graphic', 'Graphic Drops', 'High-density silk-screen and metallic cyber typography streetwear tees.'),
('vintage', 'Acid Washed', 'Artisanal mineral enzyme-washed distressed heavyweight garments.'),
('minimal', 'Minimalist Blank', 'Sculptural ultra-heavyweight blanks with zero exterior branding.'),
('heavy', 'Heavy French Terry', '280 GSM luxury loopback cotton engineered for colder months.');

-- 2. PRODUCTS
INSERT INTO products (product_id, category_id, title, subtitle, price, gsm, rating, reviews_count, badge, image_url, description) VALUES
(1, 'graphic', 'THE DARK 01 OVERSIZED TEE', 'Architectural Boxy Cut', 68.00, 240, 4.9, 142, 'BESTSELLER', 'assets/tee_black.jpg', 'Crafted from high-density 240 GSM organic combed cotton. Features an architectural drop-shoulder cut, 2.5cm ribbed collar that holds shape forever, and distressed brutalist typography on the chest.'),
(2, 'vintage', 'CYBER AESTHETICS ACID TEE', 'Mineral Distressed Wash', 72.00, 240, 5.0, 98, 'LIMITED DROP', 'assets/tee_vintage.jpg', 'Each garment undergoes an artisanal acid-mineral enzyme bath creating unique patina patterns. Adorned with high-precision cybernetic matrix schematics across the chest.'),
(3, 'minimal', 'ATELIER ESSENTIAL BLANK TEE', 'Heavy Minimalist Standard', 58.00, 260, 4.8, 230, 'ESSENTIAL', 'assets/tee_white.jpg', 'The pure canvas for minimalist purists. Substantial 260 GSM combed cotton that creates a crisp, sculptural silhouette without any slouch. Subtle tonal chest embroidery.'),
(4, 'graphic', 'NEO-TOKYO CYBER SKULL TEE', 'Cyberpunk Holographic Drop', 75.00, 240, 4.9, 84, 'DROP 01', 'assets/tee_violet.jpg', 'Deep cyber violet base garment bearing a multidimensional chrome holographic skull graphic and Japanese kanji typography. Limited run of 300 pieces worldwide.'),
(5, 'heavy', 'RAW / NATURE DUAL-PRINT TEE', 'Heavyweight French Terry Cut', 78.00, 280, 4.9, 112, '280 GSM', 'assets/tee_moss.jpg', 'Our heaviest tee to date. 280 GSM loopback cotton with subtle minimal chest branding and full technical typography across the back. Designed for transitional weather wear.'),
(6, 'graphic', 'NEO-CYBERNETIC FLAGSHIP TEE', 'Editorial Lookbook Silhouette', 68.00, 240, 5.0, 167, 'ICONIC', 'assets/hero_model.jpg', 'The signature flagship tee worn on runway editorials. Oversized proportions with elongated sleeves that stack naturally above the elbow.');

-- 3. PRODUCT COLORWAYS
INSERT INTO product_colors (product_id, color_name, hex_code) VALUES
(1, 'Onyx Black', '#121217'),
(1, 'Washed Charcoal', '#26262e'),
(1, 'Vintage Chalk', '#e3dfd7'),
(2, 'Acid Charcoal', '#26262e'),
(2, 'Onyx Black', '#121217'),
(3, 'Chalk Bone', '#e3dfd7'),
(3, 'Onyx Black', '#121217'),
(3, 'Dune Sand', '#9a866b'),
(4, 'Cyber Violet', '#3c2152'),
(4, 'Onyx Black', '#121217'),
(5, 'Forest Moss', '#354034'),
(5, 'Onyx Black', '#121217'),
(6, 'Onyx Black', '#121217'),
(6, 'Charcoal', '#26262e');

-- 4. PRODUCT SIZES & INVENTORY STOCK
INSERT INTO product_sizes (product_id, size_name, stock_quantity) VALUES
(1, 'S', 45), (1, 'M', 80), (1, 'L', 120), (1, 'XL', 65), (1, 'XXL', 30),
(2, 'S', 25), (2, 'M', 50), (2, 'L', 70),  (2, 'XL', 40), (2, 'XXL', 15),
(3, 'S', 60), (3, 'M', 110),(3, 'L', 150), (3, 'XL', 90), (3, 'XXL', 45),
(4, 'S', 20), (4, 'M', 45), (4, 'L', 60),  (4, 'XL', 35), (4, 'XXL', 10),
(5, 'S', 30), (5, 'M', 60), (5, 'L', 85),  (5, 'XL', 50), (5, 'XXL', 20),
(6, 'S', 50), (6, 'M', 90), (6, 'L', 130), (6, 'XL', 75), (6, 'XXL', 35);

-- 5. PRODUCT SPECS
INSERT INTO product_specs (product_id, spec_text, display_order) VALUES
(1, '240 GSM 100% Organic Combed Cotton', 1),
(1, 'Preshrunk Double Jersey Knit', 2),
(1, 'Thick 2.5cm Collar Ribbing', 3),
(1, 'Tokyo Made Silkscreen Graphics', 4),
(2, 'Acid Enzyme Mineral Patina Bath', 1),
(2, '240 GSM Combed Terry Weave', 2),
(2, 'Anti-Fray Overlock Seams', 3),
(2, 'Brutalist Circuitry Blueprint Print', 4),
(3, '260 GSM Ultra-Dense Structural Cotton', 1),
(3, 'Tonal Atelier Monogram Embroidery', 2),
(3, 'Thick 1x1 Collar Ribbing', 3),
(3, 'Zero-Shrinkage Sanforized Finish', 4),
(4, 'Multidimensional Chrome Holographic Ink', 1),
(4, '240 GSM Heavyweight Cotton', 2),
(4, 'Limited Numbered Hem Archive Tag', 3),
(4, 'Signature Streetwear Drop Shoulder', 4),
(5, '280 GSM Heavy Loopback French Terry', 1),
(5, 'Dual Front & Back Technical Typography', 2),
(5, 'Wide Box Silhouette with Dropped Armhole', 3),
(5, 'Low-Impact Certified Reactive Dyes', 4),
(6, '240 GSM Organic Cotton', 1),
(6, 'High-Definition Neon Screenprint', 2),
(6, 'Reinforced Shoulder-to-Shoulder Taping', 3),
(6, 'Pre-Washed for Softness and Zero Drift', 4);

-- 6. PROMO CODES
INSERT INTO promo_codes (code, discount_type, discount_value, min_order_value, is_active, expires_at) VALUES
('DARK20', 'percentage', 20.00, 0.00, 1, '2027-12-31 23:59:59'),
('DROP10', 'fixed_amount', 10.00, 50.00, 1, '2027-12-31 23:59:59'),
('VIP15', 'percentage', 15.00, 0.00, 1, '2027-12-31 23:59:59');

-- 7. CUSTOMERS
INSERT INTO customers (customer_id, first_name, last_name, email, phone, password_hash, is_vip_member) VALUES
(1, 'Alex', 'Mercer', 'alex@darkatelier.com', '+1 (555) 019-2831', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 1),
(2, 'Marcus', 'Koenig', 'marcus.k@berlin-tech.de', '+49 30 1234567', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 1),
(3, 'Elena', 'Rostova', 'elena.rostova@london.co.uk', '+44 20 7946 0912', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 0),
(4, 'Kenji', 'Sato', 'kenji.sato@tokyo-arch.jp', '+81 3 5555 0143', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 1);

-- 8. SHIPPING ADDRESSES
INSERT INTO shipping_addresses (address_id, customer_id, street_address, city, postal_code, country, is_default) VALUES
(1, 1, '742 Evergreen Terrace, Suite 4B', 'New York', '10001', 'United States', 1),
(2, 2, 'Torstraße 142', 'Berlin', '10119', 'Germany', 1),
(3, 3, '48 Shoreditch High St', 'London', 'E1 6JJ', 'United Kingdom', 1),
(4, 4, '2-11-3 Shibuya', 'Tokyo', '150-0002', 'Japan', 1);

-- 9. ORDERS
INSERT INTO orders (order_id, order_number, customer_id, promo_code_id, subtotal, discount_amount, shipping_fee, total_amount, currency, shipping_method, payment_method, payment_status, order_status, shipping_address_text) VALUES
(1, '#DA-88294', 1, 1, 130.00, 26.00, 0.00, 104.00, 'USD', 'Express Tracked Courier', 'card', 'PAID', 'PROCESSING', 'Alex Mercer, 742 Evergreen Terrace, Suite 4B, New York, 10001, United States'),
(2, '#DA-71049', 2, NULL, 78.00, 0.00, 12.00, 90.00, 'USD', 'Express Tracked Courier', 'apple_pay', 'PAID', 'SHIPPED', 'Marcus Koenig, Torstraße 142, Berlin, 10119, Germany');

-- 10. ORDER ITEMS
INSERT INTO order_items (order_id, product_id, is_custom, title, size, color, gsm, custom_text, custom_preset, custom_font, custom_ink_color, unit_price, quantity, total_price) VALUES
-- Order 1 Item 1: Standard product
(1, 1, 0, 'DARK ATELIER 01 OVERSIZED TEE', 'L', 'Onyx Black', 240, NULL, NULL, NULL, NULL, 68.00, 1, 68.00),
-- Order 1 Item 2: Custom engineered studio t-shirt
(1, NULL, 1, 'CUSTOM 240GSM BOX TEE', 'XL', 'Cyber Violet', 240, 'DARK ATELIER', 'skull', 'Syne Heavy', '#06b6d4', 62.00, 1, 62.00),
-- Order 2 Item 1: Heavy French Terry tee
(2, 5, 0, 'RAW / NATURE DUAL-PRINT TEE', 'L', 'Forest Moss', 280, NULL, NULL, NULL, NULL, 78.00, 1, 78.00);

-- 11. CUSTOM STUDIO SAVED DESIGNS
INSERT INTO custom_studio_designs (customer_id, design_title, fabric_color, fabric_hex, gsm, preset_artwork, custom_text, font_family, ink_color_hex, size_preference, calculated_price) VALUES
(1, 'Cyberpunk Skull Studio Drop', 'Cyber Violet', '#3c2152', 240, 'skull', 'DARK ATELIER', 'Syne', '#06b6d4', 'L', 68.00),
(4, 'Tokyo Minimalist Terry Prototype', 'Washed Charcoal', '#26262e', 280, 'japanese', 'TOKYO // 2026', 'Space Grotesk', '#ffffff', 'XL', 84.00);

-- 12. VERIFIED REVIEWS
INSERT INTO reviews (product_id, author_name, author_city, rating, title, comment, garment_tag, is_verified) VALUES
(1, 'Marcus K.', 'Berlin', 5, 'The collar does not budge after 15 washes.', 'Most streetwear oversized tees get that wavy bacon collar within 3 weeks. DARK ATELIER''s 240 GSM collar is so thick and structurally sound it looks like day one. The drape is unmatched.', 'DARK ATELIER 01 OVERSIZED TEE - Size L', 1),
(2, 'Elena Rostova', 'London', 5, 'Boxy silhouette done right.', 'I love the drape on the Acid Washed Cyber Tee. It''s wide in the chest without looking ridiculously long. Truly feels like high-end luxury fashion at a fraction of the cost.', 'CYBER AESTHETICS ACID TEE - Size M', 1),
(NULL, 'Kenji Sato', 'Tokyo', 5, 'The Custom Studio tee exceeded expectations.', 'Designed a custom 280 GSM Terry tee in the Studio with the Cyber Skull print and custom text. Arrived in Tokyo in 4 days. The print quality is crisp and tactile.', 'CUSTOM ATELIER TEE (280 GSM) - Size XL', 1);

-- 13. NEWSLETTER VIP SUBSCRIBERS
INSERT INTO newsletter_subscribers (email, source) VALUES
('vip.collector@darkatelier.com', 'hero_modal'),
('streetwear.archivist@gmail.com', 'website_footer'),
('tokyo.fits@shibuya.jp', 'website_footer');
