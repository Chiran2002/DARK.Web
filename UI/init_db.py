"""
DARK ATELIER // DATABASE INITIALIZER & MANAGEMENT ENGINE
Creates and manages the SQLite database (dark_atelier.db) using schema.sql and seed.sql.
Includes automated verification queries and an optional lightweight JSON API server.
"""

import sqlite3
import os
import sys
import json
import hashlib
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

# Force UTF-8 on Windows stdout
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

DB_PATH = os.path.join(os.path.dirname(__file__), "dark_atelier.db")
SCHEMA_PATH = os.path.join(os.path.dirname(__file__), "schema.sql")
SEED_PATH = os.path.join(os.path.dirname(__file__), "seed.sql")


def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_database():
    """Initializes dark_atelier.db using schema.sql and seed.sql."""
    print("=" * 65)
    print("DARK ATELIER // SQL DATABASE INITIALIZATION")
    print("=" * 65)

    if os.path.exists(DB_PATH):
        try:
            os.remove(DB_PATH)
            print(f"[-] Removed existing database at: {DB_PATH}")
        except Exception as e:
            print(f"[!] Warning removing file: {e}")

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # 1. Execute Schema
    print(f"[+] Applying schema from: {SCHEMA_PATH}")
    with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
        schema_sql = f.read()
    cursor.executescript(schema_sql)

    # 2. Execute Seed Data
    print(f"[+] Populating seed data from: {SEED_PATH}")
    with open(SEED_PATH, "r", encoding="utf-8") as f:
        seed_sql = f.read()
    cursor.executescript(seed_sql)

    conn.commit()
    conn.close()
    print("[OK] Database dark_atelier.db successfully initialized and seeded!\n")


def verify_database():
    """Runs automated verification and analytics queries."""
    conn = get_db_connection()
    cursor = conn.cursor()

    print("=" * 65)
    print("DATABASE VERIFICATION & AUDIT REPORT")
    print("=" * 65)

    # 1. Table Counts
    tables = [
        "categories", "products", "product_colors", "product_sizes",
        "product_specs", "customers", "shipping_addresses", "promo_codes",
        "orders", "order_items", "custom_studio_designs", "reviews",
        "newsletter_subscribers"
    ]
    print("\n--- [Table Record Counts] ---")
    for tbl in tables:
        cursor.execute(f"SELECT COUNT(*) FROM {tbl}")
        count = cursor.fetchone()[0]
        print(f"  * {tbl.ljust(24)} : {count} rows")

    # 2. Products Catalog with Colorways & Stock
    print("\n--- [Catalog Silhouettes & Stock] ---")
    cursor.execute("""
        SELECT 
            p.product_id, p.title, p.price, p.gsm, c.name AS category,
            COALESCE(SUM(ps.stock_quantity), 0) AS total_units,
            GROUP_CONCAT(DISTINCT pc.color_name) AS colorways
        FROM products p
        JOIN categories c ON p.category_id = c.category_id
        LEFT JOIN product_sizes ps ON p.product_id = ps.product_id
        LEFT JOIN product_colors pc ON p.product_id = pc.product_id
        GROUP BY p.product_id
    """)
    for row in cursor.fetchall():
        print(f"  [{row['product_id']}] {row['title']} (${row['price']:.2f} | {row['gsm']} GSM)")
        print(f"      Category: {row['category']} | Inventory: {row['total_units']} pcs")
        print(f"      Colors: {row['colorways']}\n")

    # 3. Orders and Order Items (Standard & Custom Studio Line Items)
    print("--- [Recent Orders & Custom Creations] ---")
    cursor.execute("""
        SELECT 
            o.order_number, o.created_at, o.total_amount, o.order_status,
            c.first_name || ' ' || c.last_name AS customer_name,
            COUNT(oi.item_id) AS items_count
        FROM orders o
        JOIN customers c ON o.customer_id = c.customer_id
        LEFT JOIN order_items oi ON o.order_id = oi.order_id
        GROUP BY o.order_id
    """)
    for o in cursor.fetchall():
        print(f"  Order {o['order_number']} by {o['customer_name']} - Total: ${o['total_amount']:.2f} ({o['order_status']})")
        
        # Fetch items
        cursor.execute("""
            SELECT is_custom, title, size, color, gsm, custom_text, custom_preset, unit_price, quantity, total_price 
            FROM order_items 
            WHERE order_id = (SELECT order_id FROM orders WHERE order_number = ?)
        """, (o['order_number'],))
        for item in cursor.fetchall():
            if item['is_custom']:
                print(f"    ↳ [CUSTOM STUDIO TEE] {item['title']} - Size {item['size']} ({item['color']}, {item['gsm']} GSM)")
                print(f"       Print: \"{item['custom_text']}\" (Preset: {item['custom_preset']}) | ${item['total_price']:.2f}")
            else:
                print(f"    ↳ [CATALOG TEE] {item['title']} - Size {item['size']} ({item['color']}) | ${item['total_price']:.2f}")
        print()

    # 4. Promo Code Verification
    print("--- [Active Promo Codes] ---")
    cursor.execute("SELECT code, discount_type, discount_value, min_order_value FROM promo_codes WHERE is_active = 1")
    for p in cursor.fetchall():
        discount_desc = f"{p['discount_value']}%" if p['discount_type'] == 'percentage' else f"${p['discount_value']:.2f}"
        print(f"  • Code: {p['code'].ljust(10)} -> {discount_desc} off (Min Order: ${p['min_order_value']:.2f})")

    # 5. Financial Overview
    cursor.execute("SELECT SUM(total_amount), COUNT(order_id) FROM orders")
    rev, order_cnt = cursor.fetchone()
    print(f"\n--- [Store Summary] ---")
    print(f"  Total Processed Revenue : ${rev:.2f} across {order_cnt} orders.")
    print("=" * 65)

    conn.close()


# ============================================================================
# OPTIONAL LIGHTWEIGHT REST API HANDLER
# ============================================================================
class AtelierAPIHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Access-Control-Allow-Private-Network', 'true')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(200)

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        conn = get_db_connection()
        cursor = conn.cursor()

        try:
            if path == "/api/products":
                cursor.execute("""
                    SELECT p.*, c.name as category_name
                    FROM products p
                    JOIN categories c ON p.category_id = c.category_id
                    WHERE p.is_active = 1
                """)
                products = [dict(row) for row in cursor.fetchall()]

                # Attach colors, sizes, and specs
                for p in products:
                    cursor.execute("SELECT color_name, hex_code FROM product_colors WHERE product_id = ?", (p['product_id'],))
                    p['colors'] = [dict(r) for r in cursor.fetchall()]

                    cursor.execute("SELECT size_name, stock_quantity FROM product_sizes WHERE product_id = ?", (p['product_id'],))
                    p['sizes'] = [dict(r) for r in cursor.fetchall()]

                    cursor.execute("SELECT spec_text FROM product_specs WHERE product_id = ? ORDER BY display_order", (p['product_id'],))
                    p['specs'] = [r['spec_text'] for r in cursor.fetchall()]

                self._set_headers(200)
                self.wfile.write(json.dumps({"success": True, "count": len(products), "products": products}).encode("utf-8"))

            elif path == "/api/orders":
                cursor.execute("""
                    SELECT o.*, c.first_name, c.last_name, c.email
                    FROM orders o
                    JOIN customers c ON o.customer_id = c.customer_id
                    ORDER BY o.created_at DESC
                """)
                orders = [dict(row) for row in cursor.fetchall()]
                self._set_headers(200)
                self.wfile.write(json.dumps({"success": True, "orders": orders}).encode("utf-8"))

            elif path == "/api/reviews":
                cursor.execute("SELECT * FROM reviews ORDER BY created_at DESC")
                reviews = [dict(row) for row in cursor.fetchall()]
                self._set_headers(200)
                self.wfile.write(json.dumps({"success": True, "reviews": reviews}).encode("utf-8"))

            elif path == "/api/promo":
                query_params = parse_qs(parsed.query)
                code = query_params.get("code", [""])[0].upper()
                cursor.execute("SELECT * FROM promo_codes WHERE code = ? AND is_active = 1", (code,))
                promo = cursor.fetchone()
                if promo:
                    self._set_headers(200)
                    self.wfile.write(json.dumps({"success": True, "promo": dict(promo)}).encode("utf-8"))
            elif path == "/api/stats":
                cursor.execute("SELECT COALESCE(SUM(total_amount), 0), COUNT(order_id) FROM orders")
                rev, total_orders = cursor.fetchone()
                
                cursor.execute("SELECT COUNT(*) FROM orders WHERE order_status = 'PROCESSING'")
                proc_orders = cursor.fetchone()[0]

                cursor.execute("SELECT COUNT(*) FROM orders WHERE order_status = 'SHIPPED'")
                ship_orders = cursor.fetchone()[0]

                cursor.execute("SELECT COALESCE(SUM(stock_quantity), 0) FROM product_sizes")
                total_stock = cursor.fetchone()[0]

                cursor.execute("SELECT COUNT(*) FROM products WHERE is_active = 1")
                products_count = cursor.fetchone()[0]

                cursor.execute("SELECT COUNT(*) FROM newsletter_subscribers")
                subscribers_count = cursor.fetchone()[0]

                cursor.execute("SELECT COUNT(*) FROM reviews")
                reviews_count = cursor.fetchone()[0]

                # Daily Sales & Profit
                cursor.execute("SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE date(created_at) = date('now')")
                daily_rev = cursor.fetchone()[0]
                daily_profit = float(daily_rev) * 0.40  # Assumes a 40% profit margin

                self._set_headers(200)
                self.wfile.write(json.dumps({
                    "success": True,
                    "revenue": float(rev),
                    "totalOrders": total_orders,
                    "processingOrders": proc_orders,
                    "shippedOrders": ship_orders,
                    "totalStock": total_stock,
                    "productsCount": products_count,
                    "subscribersCount": subscribers_count,
                    "reviewsCount": reviews_count,
                    "dailyRevenue": float(daily_rev),
                    "dailyProfit": daily_profit
                }).encode("utf-8"))

            elif path == "/api/custom-designs":
                cursor.execute("SELECT * FROM custom_studio_designs ORDER BY created_at DESC")
                designs = [dict(row) for row in cursor.fetchall()]
                self._set_headers(200)
                self.wfile.write(json.dumps({"success": True, "designs": designs}).encode("utf-8"))

            elif path == "/api/customers":
                cursor.execute("SELECT customer_id, first_name, last_name, email, is_vip_member, created_at, (SELECT COUNT(*) FROM orders o WHERE o.customer_id = customers.customer_id) as total_orders FROM customers")
                customers = [dict(row) for row in cursor.fetchall()]
                self._set_headers(200)
                self.wfile.write(json.dumps({"success": True, "customers": customers}).encode("utf-8"))

            elif path == "/api/subscribers":
                cursor.execute("SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC")
                subs = [dict(row) for row in cursor.fetchall()]
                self._set_headers(200)
                self.wfile.write(json.dumps({"success": True, "subscribers": subs}).encode("utf-8"))

            elif path == "/api/promo-all":
                cursor.execute("SELECT * FROM promo_codes ORDER BY created_at DESC")
                promos = [dict(row) for row in cursor.fetchall()]
                self._set_headers(200)
                self.wfile.write(json.dumps({"success": True, "promos": promos}).encode("utf-8"))

            elif path == "/api/account/details":
                auth_header = self.headers.get('Authorization', '')
                if auth_header.startswith('Bearer '):
                    token = auth_header.split(' ')[1]
                    try:
                        customer_id = int(token.split('_')[0])
                        cursor.execute("SELECT customer_id, first_name, last_name, email, is_vip_member FROM customers WHERE customer_id = ?", (customer_id,))
                        user = cursor.fetchone()
                        if user:
                            # Fetch orders
                            cursor.execute("SELECT order_number, total_amount, order_status, created_at FROM orders WHERE customer_id = ? ORDER BY created_at DESC", (customer_id,))
                            orders = [dict(r) for r in cursor.fetchall()]
                            
                            # Fetch cards
                            cursor.execute("SELECT card_id, cardholder_name, last4, expiry, brand FROM customer_cards WHERE customer_id = ?", (customer_id,))
                            cards = [dict(r) for r in cursor.fetchall()]
                            
                            self._set_headers(200)
                            self.wfile.write(json.dumps({
                                "success": True,
                                "user": dict(user),
                                "orders": orders,
                                "cards": cards
                            }).encode("utf-8"))
                            return
                    except:
                        pass
                self._set_headers(401)
                self.wfile.write(json.dumps({"error": "Unauthorized"}).encode("utf-8"))

            elif path == "/api/auth/me":
                auth_header = self.headers.get('Authorization', '')
                if auth_header.startswith('Bearer '):
                    token = auth_header.split(' ')[1]
                    try:
                        customer_id = int(token.split('_')[0])
                        cursor.execute("SELECT customer_id, first_name, last_name, email, is_vip_member FROM customers WHERE customer_id = ?", (customer_id,))
                        user = cursor.fetchone()
                        if user:
                            self._set_headers(200)
                            self.wfile.write(json.dumps({"success": True, "user": dict(user)}).encode("utf-8"))
                            return
                    except:
                        pass
                self._set_headers(401)
                self.wfile.write(json.dumps({"error": "Unauthorized"}).encode("utf-8"))

            else:
                self._set_headers(404)
                self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode("utf-8"))

        except Exception as e:
            self._set_headers(500)
            self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
        finally:
            conn.close()

    def do_POST(self):
        parsed = urlparse(self.path)
        content_length = int(self.headers.get('Content-Length', 0))
        post_body = self.rfile.read(content_length).decode('utf-8')
        data = json.loads(post_body) if post_body else {}

        conn = get_db_connection()
        cursor = conn.cursor()

        try:
            if parsed.path == "/api/orders":
                # Create customer if needed
                email = data.get("email", "guest@darkatelier.com")
                first_name = data.get("firstName", "Guest")
                last_name = data.get("lastName", "Collector")

                cursor.execute("SELECT customer_id FROM customers WHERE email = ?", (email,))
                cust_row = cursor.fetchone()
                if cust_row:
                    customer_id = cust_row['customer_id']
                else:
                    cursor.execute(
                        "INSERT INTO customers (first_name, last_name, email) VALUES (?, ?, ?)",
                        (first_name, last_name, email)
                    )
                    customer_id = cursor.lastrowid

                order_number = "#DA-" + str(os.urandom(2).hex().upper())
                subtotal = float(data.get("subtotal", 0))
                discount = float(data.get("discount", 0))
                shipping = float(data.get("shipping", 0))
                total = float(data.get("total", 0))
                payment_method = data.get("paymentMethod", "card")
                address = data.get("address", "Standard Delivery")

                cursor.execute("""
                    INSERT INTO orders (
                        order_number, customer_id, subtotal, discount_amount, shipping_fee,
                        total_amount, payment_method, shipping_address_text
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, (order_number, customer_id, subtotal, discount, shipping, total, payment_method, address))

                order_id = cursor.lastrowid

                # Insert items
                for item in data.get("items", []):
                    cursor.execute("""
                        INSERT INTO order_items (
                            order_id, product_id, is_custom, title, size, color, gsm,
                            custom_text, custom_preset, unit_price, quantity, total_price
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, (
                        order_id,
                        item.get("productId"),
                        1 if item.get("isCustom") else 0,
                        item.get("title", "Apparel Tee"),
                        item.get("size", "L"),
                        item.get("color", "Onyx Black"),
                        int(item.get("gsm", 240)),
                        item.get("text"),
                        item.get("preset"),
                        float(item.get("price", 0)),
                        int(item.get("quantity", 1)),
                        float(item.get("price", 0)) * int(item.get("quantity", 1))
                    ))

                conn.commit()
                self._set_headers(201)
                self.wfile.write(json.dumps({
                    "success": True,
                    "orderNumber": order_number,
                    "orderId": order_id,
                    "message": "Order successfully recorded in SQLite database!"
                }).encode("utf-8"))

            elif parsed.path == "/api/orders/update-status":
                order_id = data.get("orderId")
                new_status = data.get("status", "PROCESSING")
                cursor.execute("UPDATE orders SET order_status = ? WHERE order_id = ?", (new_status, order_id))
                conn.commit()
                self._set_headers(200)
                self.wfile.write(json.dumps({"success": True, "message": f"Order #{order_id} status updated to {new_status}"}).encode("utf-8"))

            elif parsed.path == "/api/products/update-stock":
                product_id = data.get("productId")
                size_name = data.get("size")
                new_stock = int(data.get("stock", 0))
                cursor.execute("""
                    UPDATE product_sizes 
                    SET stock_quantity = ? 
                    WHERE product_id = ? AND size_name = ?
                """, (new_stock, product_id, size_name))
                conn.commit()
                self._set_headers(200)
                self.wfile.write(json.dumps({"success": True, "message": "Stock quantity updated successfully"}).encode("utf-8"))

            elif parsed.path == "/api/products/update-price":
                product_id = data.get("productId")
                new_price = float(data.get("price", 0.0))
                cursor.execute("UPDATE products SET price = ? WHERE product_id = ?", (new_price, product_id))
                conn.commit()
                self._set_headers(200)
                self.wfile.write(json.dumps({"success": True, "message": f"Product #{product_id} price updated successfully"}).encode("utf-8"))

            elif parsed.path == "/api/products/create":
                title = data.get("title", "NEW ATELIER DROP")
                subtitle = data.get("subtitle", "Architectural Cut")
                category_id = data.get("category", "graphic")
                price = float(data.get("price", 65.0))
                gsm = int(data.get("gsm", 240))
                badge = data.get("badge", "NEW DROP")
                image_url = data.get("image", "assets/tee_black.jpg")
                desc = data.get("description", "Heavyweight luxury streetwear blank.")

                cursor.execute("""
                    INSERT INTO products (category_id, title, subtitle, price, gsm, badge, image_url, description)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, (category_id, title, subtitle, price, gsm, badge, image_url, desc))
                new_prod_id = cursor.lastrowid

                # Default colorway
                cursor.execute("INSERT INTO product_colors (product_id, color_name, hex_code) VALUES (?, ?, ?)",
                               (new_prod_id, "Onyx Black", "#121217"))

                # Standard size inventory
                for sz in ["S", "M", "L", "XL", "XXL"]:
                    stock_amt = int(data.get("sizes", {}).get(sz, 50))
                    cursor.execute("INSERT INTO product_sizes (product_id, size_name, stock_quantity) VALUES (?, ?, ?)",
                                   (new_prod_id, sz, stock_amt))

                # Default spec
                cursor.execute("INSERT INTO product_specs (product_id, spec_text, display_order) VALUES (?, ?, ?)",
                               (new_prod_id, f"{gsm} GSM Combed Organic Cotton", 1))

                conn.commit()
                self._set_headers(201)
                self.wfile.write(json.dumps({"success": True, "productId": new_prod_id, "message": "New silhouette created successfully"}).encode("utf-8"))

            elif parsed.path == "/api/promo/create":
                code = data.get("code", "").upper().strip()
                discount_type = data.get("type", "percentage")
                val = float(data.get("value", 10.0))
                min_val = float(data.get("minOrder", 0.0))

                cursor.execute("""
                    INSERT INTO promo_codes (code, discount_type, discount_value, min_order_value, is_active)
                    VALUES (?, ?, ?, ?, 1)
                """, (code, discount_type, val, min_val))
                conn.commit()
                self._set_headers(201)
                self.wfile.write(json.dumps({"success": True, "message": f"Promo code {code} activated!"}).encode("utf-8"))

            elif parsed.path == "/api/promo/toggle":
                promo_id = data.get("promoId")
                cursor.execute("UPDATE promo_codes SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END WHERE promo_id = ?", (promo_id,))
                conn.commit()
                self._set_headers(200)
                self.wfile.write(json.dumps({"success": True, "message": "Promo code status toggled"}).encode("utf-8"))

            elif parsed.path == "/api/account/password":
                auth_header = self.headers.get('Authorization', '')
                if auth_header.startswith('Bearer '):
                    token = auth_header.split(' ')[1]
                    try:
                        customer_id = int(token.split('_')[0])
                        old_pass = data.get("oldPassword")
                        new_pass = data.get("newPassword")
                        
                        
                        cursor.execute("SELECT password_hash FROM customers WHERE customer_id = ?", (customer_id,))
                        row = cursor.fetchone()
                        if row:
                            old_hash = hashlib.sha256(old_pass.encode()).hexdigest()
                            if old_hash == row['password_hash']:
                                new_hash = hashlib.sha256(new_pass.encode()).hexdigest()
                                cursor.execute("UPDATE customers SET password_hash = ? WHERE customer_id = ?", (new_hash, customer_id))
                                conn.commit()
                                self._set_headers(200)
                                self.wfile.write(json.dumps({"success": True, "message": "Password updated successfully"}).encode("utf-8"))
                                return
                            else:
                                self._set_headers(400)
                                self.wfile.write(json.dumps({"error": "Incorrect current password"}).encode("utf-8"))
                                return
                    except Exception as e:
                        pass
                self._set_headers(401)
                self.wfile.write(json.dumps({"error": "Unauthorized"}).encode("utf-8"))

            elif parsed.path == "/api/account/card":
                auth_header = self.headers.get('Authorization', '')
                if auth_header.startswith('Bearer '):
                    token = auth_header.split(' ')[1]
                    try:
                        customer_id = int(token.split('_')[0])
                        cardholder = data.get("cardholder_name")
                        last4 = data.get("last4")
                        expiry = data.get("expiry")
                        brand = data.get("brand", "VISA")
                        
                        cursor.execute("INSERT INTO customer_cards (customer_id, cardholder_name, last4, expiry, brand) VALUES (?, ?, ?, ?, ?)",
                                       (customer_id, cardholder, last4, expiry, brand))
                        conn.commit()
                        self._set_headers(200)
                        self.wfile.write(json.dumps({"success": True, "message": "Card added successfully"}).encode("utf-8"))
                        return
                    except:
                        pass
                self._set_headers(401)
                self.wfile.write(json.dumps({"error": "Unauthorized"}).encode("utf-8"))

            elif parsed.path == "/api/auth/register":
                first_name = data.get("firstName", "").strip()
                last_name = data.get("lastName", "").strip()
                email = data.get("email", "").strip().lower()
                password = data.get("password", "")
                is_vip = 1 if data.get("isVip", False) else 0

                if not first_name or not last_name or not email or not password:
                    self._set_headers(400)
                    self.wfile.write(json.dumps({"error": "All fields are required"}).encode("utf-8"))
                    return

                password_hash = hashlib.sha256(password.encode()).hexdigest()

                try:
                    cursor.execute("""
                        INSERT INTO customers (first_name, last_name, email, password_hash, is_vip_member)
                        VALUES (?, ?, ?, ?, ?)
                    """, (first_name, last_name, email, password_hash, is_vip))
                    customer_id = cursor.lastrowid
                    conn.commit()
                    
                    token = f"{customer_id}_" + os.urandom(16).hex()
                    
                    self._set_headers(201)
                    self.wfile.write(json.dumps({
                        "success": True, 
                        "message": "Account created successfully",
                        "token": token,
                        "user": {
                            "id": customer_id,
                            "firstName": first_name,
                            "lastName": last_name,
                            "email": email,
                            "isVip": bool(is_vip)
                        }
                    }).encode("utf-8"))
                except sqlite3.IntegrityError:
                    self._set_headers(409)
                    self.wfile.write(json.dumps({"error": "Email already exists"}).encode("utf-8"))

            elif parsed.path == "/api/auth/login":
                email = data.get("email", "").strip().lower()
                password = data.get("password", "")

                if not email or not password:
                    self._set_headers(400)
                    self.wfile.write(json.dumps({"error": "Email and password are required"}).encode("utf-8"))
                    return

                password_hash = hashlib.sha256(password.encode()).hexdigest()

                cursor.execute("""
                    SELECT customer_id, first_name, last_name, email, password_hash, is_vip_member 
                    FROM customers WHERE email = ?
                """, (email,))
                user = cursor.fetchone()

                if user and user["password_hash"] == password_hash:
                    token = f"{user['customer_id']}_" + os.urandom(16).hex()
                    self._set_headers(200)
                    self.wfile.write(json.dumps({
                        "success": True,
                        "message": "Login successful",
                        "token": token,
                        "user": {
                            "id": user['customer_id'],
                            "firstName": user['first_name'],
                            "lastName": user['last_name'],
                            "email": user['email'],
                            "isVip": bool(user['is_vip_member'])
                        }
                    }).encode("utf-8"))
                else:
                    self._set_headers(401)
                    self.wfile.write(json.dumps({"error": "Invalid email or password"}).encode("utf-8"))

            else:
                self._set_headers(404)
                self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode("utf-8"))

        except Exception as e:
            conn.rollback()
            self._set_headers(500)
            self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
        finally:
            conn.close()


def run_api_server(port=8001):
    server_address = ('', port)
    httpd = HTTPServer(server_address, AtelierAPIHandler)
    print(f"\n[API] DARK ATELIER REST API server running on: http://localhost:{port}")
    print("   Endpoints: /api/products, /api/orders, /api/promo?code=DARK20, /api/reviews")
    print("   Press Ctrl+C to terminate server.")
    httpd.serve_forever()


if __name__ == "__main__":
    init_database()
    verify_database()

    if "--server" in sys.argv:
        run_api_server(8001)
