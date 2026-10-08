/**
 * DARK ATELIER // ATELIER COMMAND CONSOLE (ADMIN ENGINE)
 * Direct real-time synchronization with dark_atelier.db via REST API (Port 8001)
 * with complete graceful offline persistence fallback.
 */

const API_BASE = "http://localhost:8001/api";

// Administrative In-Memory State

function formatAdminCurrency(usdAmount) {
  return "Rs " + (parseFloat(usdAmount) * 305).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
}
const adminState = {
  currentTab: "overview",
  stats: {
    revenue: 0,
    totalOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    totalStock: 0,
    productsCount: 0,
    subscribersCount: 0,
    reviewsCount: 0,
    dailyRevenue: 0,
    dailyProfit: 0
  },
  orders: [],
  products: [],
  customDesigns: [],
  promos: [],
  reviews: [],
  subscribers: [],
  customers: [],
  customers: [],
  customers: [],
  customers: [],
  orderFilter: "all",
  orderSearch: "",
  isOnlineApi: false
};

// Fallback Initial Data if API server is not started yet
const FALLBACK_PRODUCTS = [
  { product_id: 1, title: "THE DARK 01 OVERSIZED TEE", category_name: "Graphic Drops", price: 68.0, gsm: 240, badge: "BESTSELLER", image_url: "../UI/assets/tee_black.jpg", sizes: [{size_name:'S', stock_quantity:45},{size_name:'M', stock_quantity:80},{size_name:'L', stock_quantity:120},{size_name:'XL', stock_quantity:65},{size_name:'XXL', stock_quantity:30}] },
  { product_id: 2, title: "CYBER AESTHETICS ACID TEE", category_name: "Acid Washed", price: 72.0, gsm: 240, badge: "LIMITED DROP", image_url: "../UI/assets/tee_vintage.jpg", sizes: [{size_name:'S', stock_quantity:25},{size_name:'M', stock_quantity:50},{size_name:'L', stock_quantity:70},{size_name:'XL', stock_quantity:40},{size_name:'XXL', stock_quantity:15}] },
  { product_id: 3, title: "ATELIER ESSENTIAL BLANK TEE", category_name: "Minimalist Blank", price: 58.0, gsm: 260, badge: "ESSENTIAL", image_url: "../UI/assets/tee_white.jpg", sizes: [{size_name:'S', stock_quantity:60},{size_name:'M', stock_quantity:110},{size_name:'L', stock_quantity:150},{size_name:'XL', stock_quantity:90},{size_name:'XXL', stock_quantity:45}] },
  { product_id: 4, title: "NEO-TOKYO CYBER SKULL TEE", category_name: "Graphic Drops", price: 75.0, gsm: 240, badge: "DROP 01", image_url: "../UI/assets/tee_violet.jpg", sizes: [{size_name:'S', stock_quantity:20},{size_name:'M', stock_quantity:45},{size_name:'L', stock_quantity:60},{size_name:'XL', stock_quantity:35},{size_name:'XXL', stock_quantity:10}] },
  { product_id: 5, title: "RAW / NATURE DUAL-PRINT TEE", category_name: "Heavy French Terry", price: 78.0, gsm: 280, badge: "280 GSM", image_url: "../UI/assets/tee_moss.jpg", sizes: [{size_name:'S', stock_quantity:30},{size_name:'M', stock_quantity:60},{size_name:'L', stock_quantity:85},{size_name:'XL', stock_quantity:50},{size_name:'XXL', stock_quantity:20}] },
  { product_id: 6, title: "NEO-CYBERNETIC FLAGSHIP TEE", category_name: "Graphic Drops", price: 68.0, gsm: 240, badge: "ICONIC", image_url: "../UI/assets/hero_model.jpg", sizes: [{size_name:'S', stock_quantity:50},{size_name:'M', stock_quantity:90},{size_name:'L', stock_quantity:130},{size_name:'XL', stock_quantity:75},{size_name:'XXL', stock_quantity:35}] }
];

const FALLBACK_ORDERS = [
  { order_id: 1, order_number: "#DA-88294", first_name: "Alex", last_name: "Mercer", email: "alex@darkatelier.com", total_amount: 104.0, order_status: "PROCESSING", payment_method: "card", created_at: "2026-09-10 11:42:11", shipping_address_text: "742 Evergreen Terrace, Suite 4B, New York, 10001" },
  { order_id: 2, order_number: "#DA-71049", first_name: "Marcus", last_name: "Koenig", email: "marcus.k@berlin-tech.de", total_amount: 90.0, order_status: "SHIPPED", payment_method: "apple_pay", created_at: "2026-09-10 11:42:11", shipping_address_text: "Torstraße 142, Berlin, 10119, Germany" }
];

const FALLBACK_STUDIO = [
  { design_id: 1, design_title: "Cyberpunk Skull Studio Drop", fabric_color: "Cyber Violet", fabric_hex: "#3c2152", gsm: 240, preset_artwork: "skull", custom_text: "THE DARK", font_family: "Syne", ink_color_hex: "#06b6d4", size_preference: "L", calculated_price: 68.0 },
  { design_id: 2, design_title: "Tokyo Minimalist Terry Prototype", fabric_color: "Washed Charcoal", fabric_hex: "#26262e", gsm: 280, preset_artwork: "japanese", custom_text: "TOKYO // 2026", font_family: "Space Grotesk", ink_color_hex: "#ffffff", size_preference: "XL", calculated_price: 84.0 }
];

const FALLBACK_PROMOS = [
  { promo_id: 1, code: "DARK20", discount_type: "percentage", discount_value: 20.0, min_order_value: 0.0, is_active: 1 },
  { promo_id: 2, code: "DROP10", discount_type: "fixed_amount", discount_value: 10.0, min_order_value: 50.0, is_active: 1 },
  { promo_id: 3, code: "VIP15", discount_type: "percentage", discount_value: 15.0, min_order_value: 0.0, is_active: 1 }
];

const FALLBACK_REVIEWS = [
  { review_id: 1, author_name: "Marcus K.", author_city: "Berlin", rating: 5, title: "The collar does not budge after 15 washes.", comment: "Most streetwear oversized tees get that wavy bacon collar within 3 weeks. THE DARK's 240 GSM collar is so thick and structurally sound.", garment_tag: "THE DARK 01 OVERSIZED TEE - Size L" },
  { review_id: 2, author_name: "Elena Rostova", author_city: "London", rating: 5, title: "Boxy silhouette done right.", comment: "I love the drape on the Acid Washed Cyber Tee. Wide in the chest without looking ridiculously long.", garment_tag: "CYBER AESTHETICS ACID TEE - Size M" },
  { review_id: 3, author_name: "Kenji Sato", author_city: "Tokyo", rating: 5, title: "The Custom Studio tee exceeded expectations.", comment: "Designed a custom 280 GSM Terry tee in the Studio with the Cyber Skull print and custom text. Arrived in Tokyo in 4 days.", garment_tag: "CUSTOM THE DARK TEE (280 GSM) - Size XL" }
];

const FALLBACK_SUBSCRIBERS = [
  { subscriber_id: 1, email: "vip.collector@darkatelier.com", source: "hero_modal", subscribed_at: "2026-09-08 14:22:00" },
  { subscriber_id: 2, email: "streetwear.archivist@gmail.com", source: "website_footer", subscribed_at: "2026-09-09 09:15:30" },
  { subscriber_id: 3, email: "tokyo.fits@shibuya.jp", source: "website_footer", subscribed_at: "2026-09-10 03:40:12" }
];

// ==========================================
// 1. INITIALIZATION & DATA FETCHING
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  initSidebarTabs();
  initFormSubmissions();
  initFiltersAndSearch();
  loadAllAdminData();

  // Refresh Sync Button
  const refreshBtn = document.getElementById("refreshDataBtn");
  if (refreshBtn) refreshBtn.addEventListener("click", () => {
    loadAllAdminData();
    showAdminToast("Data refreshed from database", "success");
  });

  // Mobile sidebar toggle
  const toggleBtn = document.getElementById("sidebarToggleBtn");
  const sidebar = document.getElementById("adminSidebar");
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener("click", () => sidebar.classList.toggle("open"));
  }
});

async function loadAllAdminData() {
  const badge = document.getElementById("dbStatusBadge");

  try {
    // Attempt connecting to live API server on Port 8001
    const [statsRes, ordersRes, productsRes, studioRes, promosRes, reviewsRes, subsRes, customersRes] = await Promise.all([
      fetch(`${API_BASE}/stats`).then(r => r.json()),
      fetch(`${API_BASE}/orders`).then(r => r.json()),
      fetch(`${API_BASE}/products`).then(r => r.json()),
      fetch(`${API_BASE}/custom-designs`).then(r => r.json()),
      fetch(`${API_BASE}/promo-all`).then(r => r.json()),
      fetch(`${API_BASE}/reviews`).then(r => r.json()),
      fetch(`${API_BASE}/subscribers`).then(r => r.json()),
     fetch(`${API_BASE}/customers`).then(r => r.json()),
     fetch(`${API_BASE}/customers`).then(r => r.json()),
     fetch(`${API_BASE}/customers`).then(r => r.json()),
     fetch(`${API_BASE}/customers`).then(r => r.json())
    ]);

    adminState.isOnlineApi = true;
    adminState.stats = statsRes;
    adminState.orders = ordersRes.orders || [];
    adminState.products = productsRes.products || [];
    adminState.customDesigns = studioRes.designs || [];
    adminState.promos = promosRes.promos || [];
    adminState.reviews = reviewsRes.reviews || [];
    adminState.subscribers = subsRes.subscribers || [];
    adminState.customers = customersRes.customers || [];

    if (badge) {
      badge.innerHTML = `<span class="status-pulse-dot"></span><span>SQLite DB: Connected (Port 8001)</span>`;
      badge.style.color = "var(--accent-green)";
    }
  } catch (err) {
    // Offline Local Mode Fallback
    adminState.isOnlineApi = false;
    adminState.products = JSON.parse(localStorage.getItem("dark_admin_products")) || FALLBACK_PRODUCTS;
    adminState.orders = JSON.parse(localStorage.getItem("dark_admin_orders")) || FALLBACK_ORDERS;
    adminState.customDesigns = FALLBACK_STUDIO;
    adminState.promos = JSON.parse(localStorage.getItem("dark_admin_promos")) || FALLBACK_PROMOS;
    adminState.reviews = FALLBACK_REVIEWS;
    adminState.subscribers = FALLBACK_SUBSCRIBERS;

    // Recalculate stats locally
    const totalRev = adminState.orders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
    const totalUnits = adminState.products.reduce((sum, p) => {
      return sum + (p.sizes ? p.sizes.reduce((s, sz) => s + (sz.stock_quantity || 0), 0) : 200);
    }, 0);

    adminState.stats = {
      revenue: totalRev,
      totalOrders: adminState.orders.length,
      processingOrders: adminState.orders.filter(o => o.order_status === "PROCESSING").length,
      shippedOrders: adminState.orders.filter(o => o.order_status === "SHIPPED").length,
      totalStock: totalUnits,
      productsCount: adminState.products.length,
      subscribersCount: adminState.subscribers.length,
      reviewsCount: adminState.reviews.length
    };

    if (badge) {
      badge.innerHTML = `<span class="status-pulse-dot" style="background:#f59e0b;box-shadow:0 0 6px #f59e0b;"></span><span>Local Database Mode (Offline)</span>`;
      badge.style.color = "var(--accent-gold)";
    }
  }

  // Render everything across tabs
  renderOverviewKPIs();
  renderOverviewRecentOrders();
  renderOverviewLowStock();
  renderOrdersTable();
  renderInventoryTable();
  renderStudioCreations();
  renderPromoTable();
  renderReviewsGrid();
  renderSubscribersTable();

  // Update navbar counter
  const navCounter = document.getElementById("ordersNavCounter");
  if (navCounter) navCounter.textContent = adminState.orders.length;
}

// ==========================================
// 2. TAB NAVIGATION
// ==========================================
function initSidebarTabs() {
  const navItems = document.querySelectorAll(".sidebar-nav .nav-item");
  navItems.forEach(item => {
    item.addEventListener("click", () => {
      const tab = item.dataset.tab;
      switchAdminTab(tab);
    });
  });
}

function switchAdminTab(tabName) {
  adminState.currentTab = tabName;

  // Sidebar buttons
  document.querySelectorAll(".sidebar-nav .nav-item").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === tabName);
  });

  // Tab Panels
  document.querySelectorAll(".admin-content-view .tab-panel").forEach(panel => {
    panel.classList.toggle("active", panel.id === `panel-${tabName}`);
  });

  if (tabName === "customers" && adminState.isOnlineApi) {
    fetch(`${API_BASE}/customers`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          adminState.customers = data.customers;
          renderCustomers();
        }
      })
      .catch(console.error);
  }

  // Breadcrumb
  const bc = document.getElementById("currentTabBreadcrumb");
  if (bc) bc.textContent = `COMMAND // ${tabName.toUpperCase()}`;

  // Close mobile sidebar if open
  document.getElementById("adminSidebar")?.classList.remove("open");
}

// ==========================================
// 3. OVERVIEW RENDERERS
// ==========================================
function renderOverviewKPIs() {
  const revEl = document.getElementById("kpiRevenue");
  const ordersEl = document.getElementById("kpiTotalOrders");
  const stockEl = document.getElementById("kpiTotalStock");
  const dSalesEl = document.getElementById("kpiDailySales");
  const dProfitEl = document.getElementById("kpiDailyProfit");
  const prodCntEl = document.getElementById("kpiProductCount");
  const procTag = document.getElementById("kpiProcessingTag");
  const shippedCnt = document.getElementById("kpiShippedCount");

  const s = adminState.stats;
  if (revEl) revEl.textContent = `Rs ${(s.revenue * 305).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
  if (ordersEl) ordersEl.textContent = s.totalOrders;
  if (stockEl) stockEl.textContent = `${s.totalStock.toLocaleString()} pcs`;
  if (prodCntEl) prodCntEl.textContent = s.productsCount;
  if (procTag) procTag.textContent = `${s.processingOrders} Processing`;
  if (shippedCnt) shippedCnt.textContent = s.shippedOrders;

  if (dSalesEl) dSalesEl.textContent = `Rs ${((s.dailyRevenue || 0) * 305).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
  if (dProfitEl) dProfitEl.textContent = `Rs ${((s.dailyProfit || 0) * 305).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
}

function renderOverviewRecentOrders() {
  const tbody = document.getElementById("overviewRecentOrdersTbody");
  if (!tbody) return;

  const recent = adminState.orders.slice(0, 5);
  if (recent.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text-muted);">No orders recorded yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = recent.map(o => {
    const custName = o.first_name ? `${o.first_name} ${o.last_name}` : (o.shipping_address_text ? o.shipping_address_text.split(",")[0] : "Collector");
    const statusClass = `status-${(o.order_status || "PROCESSING").toLowerCase()}`;
    return `
      <tr>
        <td><strong>${o.order_number}</strong></td>
        <td>${custName}</td>
        <td>1 item</td>
        <td><strong>${formatAdminCurrency(o.total_amount)}</strong></td>
        <td><span class="status-badge ${statusClass}">${o.order_status}</span></td>
        <td><button class="btn btn-secondary" style="padding:4px 10px;font-size:11px;" onclick="inspectOrder('${o.order_number}')">Audit</button></td>
      </tr>
    `;
  }).join("");
}

function renderOverviewLowStock() {
  const list = document.getElementById("overviewLowStockList");
  if (!list) return;

  // Find sizes with stock < 30
  let lowItems = [];
  adminState.products.forEach(p => {
    if (p.sizes) {
      p.sizes.forEach(sz => {
        if (sz.stock_quantity <= 30) {
          lowItems.push({ title: p.title, size: sz.size_name, qty: sz.stock_quantity });
        }
      });
    }
  });

  if (lowItems.length === 0) {
    list.innerHTML = `<div style="text-align:center;padding:20px;color:var(--text-muted);font-size:12px;">All size SKUs are healthy above 30 units.</div>`;
    return;
  }

  list.innerHTML = lowItems.slice(0, 4).map(item => `
    <div class="low-stock-item">
      <div class="low-stock-info">
        <strong>${item.title}</strong>
        <span>Size SKU: ${item.size}</span>
      </div>
      <span class="low-stock-qty">${item.qty} units left</span>
    </div>
  `).join("");
}

// ==========================================
// 4. ORDERS TAB RENDERER
// ==========================================
function renderOrdersTable() {
  const tbody = document.getElementById("ordersTableBody");
  if (!tbody) return;

  let filtered = adminState.orders.filter(o => {
    const matchFilter = adminState.orderFilter === "all" || o.order_status === adminState.orderFilter;
    const q = adminState.orderSearch.toLowerCase().trim();
    const custName = `${o.first_name || ""} ${o.last_name || ""} ${o.email || ""}`.toLowerCase();
    const matchSearch = !q || o.order_number.toLowerCase().includes(q) || custName.includes(q);
    return matchFilter && matchSearch;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:30px;color:var(--text-muted);">No orders matching filter criteria.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(o => {
    const custName = o.first_name ? `${o.first_name} ${o.last_name}` : "Collector";
    const dateStr = o.created_at ? o.created_at.split(" ")[0] : "Today";
    const addr = o.shipping_address_text || "Standard Tracked";
    const status = o.order_status || "PROCESSING";

    return `
      <tr>
        <td><strong style="color:#ffffff;">${o.order_number}</strong></td>
        <td>${dateStr}</td>
        <td>
          <div style="font-weight:600;color:#ffffff;">${custName}</div>
          <div style="font-size:11px;color:var(--text-muted);">${o.email || "guest"}</div>
        </td>
        <td style="max-width:200px;font-size:12px;" title="${addr}">${addr}</td>
        <td><strong style="color:var(--accent-cyan);">${formatAdminCurrency(o.total_amount)}</strong></td>
        <td style="text-transform:uppercase;font-family:var(--font-mono);font-size:11px;">${o.payment_method || "card"}</td>
        <td>
          <select class="table-status-select" onchange="updateOrderStatus(${o.order_id}, this.value)">
            <option value="PROCESSING" ${status === "PROCESSING" ? "selected" : ""}>PROCESSING</option>
            <option value="SHIPPED" ${status === "SHIPPED" ? "selected" : ""}>SHIPPED</option>
            <option value="DELIVERED" ${status === "DELIVERED" ? "selected" : ""}>DELIVERED</option>
            <option value="CANCELLED" ${status === "CANCELLED" ? "selected" : ""}>CANCELLED</option>
          </select>
        </td>
        <td>
          <button class="btn btn-secondary" style="padding:6px 12px;font-size:11px;" onclick="inspectOrder('${o.order_number}')">Inspect</button>
        </td>
      </tr>
    `;
  }).join("");
}

async function updateOrderStatus(orderId, newStatus) {
  if (adminState.isOnlineApi) {
    try {
      const res = await fetch(`${API_BASE}/orders/update-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderId, status: newStatus })
      }).then(r => r.json());

      if (res.success) {
        showAdminToast(`Order #${orderId} status updated to ${newStatus}`, "success");
      }
    } catch (e) {
      showAdminToast("Failed to update status on server", "error");
    }
  }

  // Update in local memory
  const order = adminState.orders.find(o => o.order_id === orderId);
  if (order) {
    order.order_status = newStatus;
    localStorage.setItem("dark_admin_orders", JSON.stringify(adminState.orders));
    renderOverviewKPIs();
    renderOverviewRecentOrders();
    renderOrdersTable();
    showAdminToast(`Status changed to ${newStatus}`, "success");
  }
}

function inspectOrder(orderNum) {
  const order = adminState.orders.find(o => o.order_number === orderNum);
  if (!order) return;

  const modal = document.getElementById("orderInspectModal");
  const numEl = document.getElementById("inspectOrderNum");
  const dateEl = document.getElementById("inspectOrderDate");
  const detailsEl = document.getElementById("orderInspectDetails");

  if (numEl) numEl.textContent = order.order_number;
  if (dateEl) dateEl.textContent = `Placed on ${order.created_at || "Recent"}`;

  const custName = order.first_name ? `${order.first_name} ${order.last_name}` : "Collector";

  detailsEl.innerHTML = `
    <div style="background:var(--admin-card);padding:16px;border-radius:var(--radius-md);margin-bottom:20px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:13px;">
        <div><span style="color:var(--text-muted);">Customer:</span> <strong>${custName}</strong></div>
        <div><span style="color:var(--text-muted);">Email:</span> <strong>${order.email || "guest"}</strong></div>
        <div style="grid-column:span 2;"><span style="color:var(--text-muted);">Delivery Address:</span> <strong>${order.shipping_address_text || "Standard Delivery"}</strong></div>
        <div><span style="color:var(--text-muted);">Payment Mode:</span> <strong style="text-transform:uppercase;">${order.payment_method || "card"}</strong></div>
        <div><span style="color:var(--text-muted);">Current Status:</span> <strong style="color:var(--accent-cyan);">${order.order_status}</strong></div>
      </div>
    </div>

    <h4 style="font-family:var(--font-mono);font-size:12px;color:var(--text-muted);margin-bottom:12px;">GARMENT LINE ITEMS</h4>
    <div style="display:flex;flex-direction:column;gap:10px;">
      <div class="order-inspect-line-item">
        <div>
          <strong>${order.order_number === "#DA-88294" ? "THE DARK 01 OVERSIZED TEE (Size L)" : "RAW / NATURE DUAL-PRINT TEE (Size L)"}</strong>
          <div style="font-size:12px;color:var(--text-muted);">240 GSM Organic Combed Cotton • Onyx Black</div>
        </div>
        <strong>${formatAdminCurrency(68)}</strong>
      </div>
      ${order.order_number === "#DA-88294" ? `
        <div class="order-inspect-line-item">
          <div>
            <strong style="color:var(--accent-purple);">CUSTOM 240GSM BOX TEE (Size XL)</strong>
            <div style="font-size:12px;color:var(--text-muted);">Custom Print: "THE DARK" (Preset: skull) • Cyber Violet</div>
          </div>
          <strong>${formatAdminCurrency(62)}</strong>
        </div>
      ` : ""}
    </div>

    <div style="margin-top:20px;padding-top:16px;border-top:1px solid var(--border-subtle);display:flex;justify-content:space-between;font-size:16px;">
      <span>Total Amount Paid</span>
      <strong style="color:var(--accent-green);font-family:var(--font-mono);">${formatAdminCurrency(order.total_amount)}</strong>
    </div>
  `;

  openAdminModal("orderInspectModal");
}

// ==========================================
// 5. CATALOG & INVENTORY TAB
// ==========================================
function renderInventoryTable() {
  const tbody = document.getElementById("inventoryTableBody");
  if (!tbody) return;

  tbody.innerHTML = adminState.products.map(p => {
    const totalUnits = p.sizes ? p.sizes.reduce((sum, sz) => sum + sz.stock_quantity, 0) : 0;
    
    // Fix image URL for Admin folder context
    let imgSrc = p.image_url || "../UI/assets/tee_black.jpg";
    if (!imgSrc.startsWith("..") && !imgSrc.startsWith("http")) {
      imgSrc = "../UI/" + imgSrc;
    }

    return `
      <tr>
        <td>
          <div style="display:flex;align-items:center;gap:12px;">
            <img src="${imgSrc}" alt="${p.title}" style="width:46px;height:46px;border-radius:4px;object-fit:cover;background:#000;">
            <div>
              <strong style="display:block;color:#ffffff;">${p.title}</strong>
              <span class="badge-tag" style="font-size:9px;">${p.badge || "ACTIVE"}</span>
            </div>
          </div>
        </td>
        <td>${p.category_name || "Streetwear"}</td>
        <td style="font-family:var(--font-mono);">${p.gsm} GSM</td>
        <td>
          <div style="display:flex;align-items:center;gap:6px;">
            <strong id="priceDisplay_${p.product_id}" style="font-family:var(--font-mono);color:#ffffff;">${formatAdminCurrency(p.price)}</strong>
            <input type="number" id="priceInput_${p.product_id}" value="${p.price}" style="display:none;width:60px;padding:2px;font-size:12px;background:#111;color:#fff;border:1px solid #333;" step="0.5" />
            <button class="btn btn-secondary" style="padding:2px 6px;font-size:10px;" id="editBtn_${p.product_id}" onclick="toggleEditPrice(${p.product_id})">Edit</button>
            <button class="btn btn-primary" style="display:none;padding:2px 6px;font-size:10px;" id="saveBtn_${p.product_id}" onclick="savePrice(${p.product_id})">Save</button>
          </div>
        </td>
        <td>
          <div class="size-steppers-cell">
            ${(p.sizes || []).map(sz => `
              <div class="size-stepper-box">
                <span class="size-label">${sz.size_name}</span>
                <button class="stock-step-btn" onclick="adjustProductStock(${p.product_id}, '${sz.size_name}', -5)">-</button>
                <span class="size-stock-num" id="stock_${p.product_id}_${sz.size_name}">${sz.stock_quantity}</span>
                <button class="stock-step-btn" onclick="adjustProductStock(${p.product_id}, '${sz.size_name}', 5)">+</button>
              </div>
            `).join("")}
          </div>
        </td>
        <td><strong style="font-family:var(--font-mono);font-size:14px;color:var(--accent-cyan);">${totalUnits}</strong></td>
        <td>
          <button class="btn btn-secondary" style="padding:4px 10px;font-size:11px;" onclick="quickRestock(${p.product_id})">+10 All</button>
        </td>
      </tr>
    `;
  }).join("");
}

async function adjustProductStock(productId, sizeName, delta) {
  const prod = adminState.products.find(p => p.product_id === productId);
  if (!prod || !prod.sizes) return;

  const sizeObj = prod.sizes.find(s => s.size_name === sizeName);
  if (!sizeObj) return;

  sizeObj.stock_quantity = Math.max(0, sizeObj.stock_quantity + delta);

  // Update DOM element
  const numEl = document.getElementById(`stock_${productId}_${sizeName}`);
  if (numEl) numEl.textContent = sizeObj.stock_quantity;

  // Persist to server if online
  if (adminState.isOnlineApi) {
    fetch(`${API_BASE}/products/update-stock`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: productId, size: sizeName, stock: sizeObj.stock_quantity })
    }).catch(() => {});
  } else {
    localStorage.setItem("dark_admin_products", JSON.stringify(adminState.products));
  }

  renderOverviewKPIs();
  renderOverviewLowStock();
}

function quickRestock(productId) {
  const prod = adminState.products.find(p => p.product_id === productId);
  if (!prod || !prod.sizes) return;

  prod.sizes.forEach(sz => sz.stock_quantity += 10);
  renderInventoryTable();
  renderOverviewKPIs();
  showAdminToast(`Restocked +10 units to ${prod.title}`, "success");
}

function toggleEditPrice(id) {
  document.getElementById(`priceDisplay_${id}`).style.display = 'none';
  document.getElementById(`editBtn_${id}`).style.display = 'none';
  document.getElementById(`priceInput_${id}`).style.display = 'inline-block';
  document.getElementById(`saveBtn_${id}`).style.display = 'inline-block';
}

async function savePrice(productId) {
  const inputEl = document.getElementById(`priceInput_${productId}`);
  const newPrice = parseFloat(inputEl.value);
  
  if (isNaN(newPrice) || newPrice < 0) {
    showAdminToast("Invalid price entered.", "error");
    return;
  }
  
  if (!adminState.isOnlineApi) {
    showAdminToast("API server offline. Cannot update price.", "error");
    return;
  }
  
  try {
    const res = await fetch(`${API_BASE}/products/update-price`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, price: newPrice })
    });
    const data = await res.json();
    if (data.success) {
      showAdminToast("Price saved successfully! Updates are live on the storefront.", "success");
      const prod = adminState.products.find(p => p.product_id === productId);
      if (prod) prod.price = newPrice;
      renderInventoryTable();
    } else {
      showAdminToast("Failed to update price.", "error");
    }
  } catch(e) {
    console.error(e);
    showAdminToast("API Error updating price.", "error");
  }
}

// ==========================================
// 6. CUSTOM STUDIO DESIGNS TAB
// ==========================================
function renderStudioCreations() {
  const grid = document.getElementById("studioCreationsGrid");
  if (!grid) return;

  grid.innerHTML = adminState.customDesigns.map(d => `
    <div class="studio-design-card">
      <div class="design-color-bar" style="background:${d.fabric_hex || '#3c2152'};"></div>
      
      <div class="design-title-row">
        <h4>${d.design_title}</h4>
        <span class="design-price">${formatAdminCurrency(d.calculated_price)}</span>
      </div>

      <div class="design-meta-box">
        <div><strong>Dye Shade:</strong> ${d.fabric_color} (${d.fabric_hex})</div>
        <div><strong>Fabric Weight:</strong> ${d.gsm} GSM French Terry</div>
        <div><strong>Preset Artwork:</strong> ${d.preset_artwork}</div>
        <div><strong>Custom Print Text:</strong> "${d.custom_text || "None"}"</div>
        <div><strong>Typography Font:</strong> ${d.font_family || "Syne"}</div>
        <div><strong>Size Ordered:</strong> ${d.size_preference || "L"}</div>
      </div>
    </div>
  `).join("");
}

// ==========================================
// 7. PROMO CODES TAB
// ==========================================
function renderPromoTable() {
  const tbody = document.getElementById("promoTableBody");
  if (!tbody) return;

  tbody.innerHTML = adminState.promos.map(p => {
    const isAct = p.is_active === 1 || p.is_active === true;
    const discLabel = p.discount_type === "percentage" ? `${p.discount_value}%` : `${formatAdminCurrency(p.discount_value)}`;
    return `
      <tr>
        <td><strong style="font-family:var(--font-mono);font-size:14px;color:#ffffff;">${p.code}</strong></td>
        <td style="text-transform:capitalize;">${p.discount_type.replace("_", " ")}</td>
        <td><strong style="color:var(--accent-green);font-family:var(--font-mono);">${discLabel}</strong></td>
        <td>${formatAdminCurrency(p.min_order_value || 0)}</td>
        <td><span class="status-badge ${isAct ? "status-delivered" : "status-cancelled"}">${isAct ? "ACTIVE" : "INACTIVE"}</span></td>
        <td>
          <button class="btn btn-secondary" style="padding:4px 10px;font-size:11px;" onclick="togglePromoCode(${p.promo_id})">
            ${isAct ? "Deactivate" : "Activate"}
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

async function togglePromoCode(promoId) {
  const promo = adminState.promos.find(p => p.promo_id === promoId);
  if (!promo) return;

  promo.is_active = promo.is_active === 1 ? 0 : 1;

  if (adminState.isOnlineApi) {
    fetch(`${API_BASE}/promo/toggle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ promoId: promoId })
    }).catch(() => {});
  } else {
    localStorage.setItem("dark_admin_promos", JSON.stringify(adminState.promos));
  }

  renderPromoTable();
  showAdminToast(`Promo ${promo.code} status updated`, "info");
}

// ==========================================
// 8. REVIEWS TAB
// ==========================================
function renderReviewsGrid() {
  const grid = document.getElementById("adminReviewsGrid");
  if (!grid) return;

  grid.innerHTML = adminState.reviews.map(r => `
    <div class="admin-review-card">
      <div class="review-card-top">
        <strong style="color:#ffffff;">${r.author_name}</strong>
        <span class="review-stars">${"★".repeat(r.rating || 5)}</span>
      </div>
      <h5 style="font-size:14px;color:#ffffff;font-weight:700;">"${r.title}"</h5>
      <p style="font-size:12px;color:var(--text-secondary);line-height:1.5;">${r.comment}</p>
      <div style="font-size:11px;color:var(--text-muted);font-family:var(--font-mono);margin-top:auto;">
        ${r.garment_tag || "Verified Fit"}
      </div>
    </div>
  `).join("");
}

// ==========================================
// 9. SUBSCRIBERS TAB
// ==========================================
function renderSubscribersTable() {
  const tbody = document.getElementById("subscribersTableBody");
  if (!tbody) return;

  tbody.innerHTML = adminState.subscribers.map(s => `
    <tr>
      <td style="font-family:var(--font-mono);">#${s.subscriber_id}</td>
      <td><strong style="color:#ffffff;">${s.email}</strong></td>
      <td style="font-family:var(--font-mono);font-size:11px;">${s.source || "web"}</td>
      <td style="color:var(--text-muted);">${s.subscribed_at || "Recent"}</td>
    </tr>
  `).join("");
}

function exportSubscribersCsv() {
  const csvContent = "data:text/csv;charset=utf-8," 
    + ["ID,Email,Source,Date"].concat(adminState.subscribers.map(s => `${s.subscriber_id},${s.email},${s.source},${s.subscribed_at}`)).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "dark_atelier_vip_subscribers.csv");
  document.body.appendChild(link);
  link.click();
  link.remove();
  showAdminToast("Subscribers CSV exported!", "success");
}

// ==========================================
// 10. MODALS & FORMS
// ==========================================
function initFormSubmissions() {
  // Add Drop Form
  const dropForm = document.getElementById("newDropForm");
  if (dropForm) {
    dropForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const newDrop = {
        title: document.getElementById("dropTitle").value.trim(),
        category: document.getElementById("dropCategory").value,
        price: parseFloat(document.getElementById("dropPrice").value),
        gsm: parseInt(document.getElementById("dropGsm").value, 10),
        badge: document.getElementById("dropBadge").value.trim(),
        image: document.getElementById("dropImage").value.trim(),
        description: document.getElementById("dropDesc").value.trim(),
        sizes: {
          S: parseInt(document.getElementById("stockS").value, 10),
          M: parseInt(document.getElementById("stockM").value, 10),
          L: parseInt(document.getElementById("stockL").value, 10),
          XL: parseInt(document.getElementById("stockXL").value, 10),
          XXL: parseInt(document.getElementById("stockXXL").value, 10)
        }
      };

      if (adminState.isOnlineApi) {
        try {
          await fetch(`${API_BASE}/products/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newDrop)
          });
        } catch (err) {}
      }

      // Add to local state
      adminState.products.unshift({
        product_id: Date.now(),
        title: newDrop.title,
        category_name: newDrop.category,
        price: newDrop.price,
        gsm: newDrop.gsm,
        badge: newDrop.badge,
        image_url: newDrop.image,
        sizes: Object.keys(newDrop.sizes).map(k => ({ size_name: k, stock_quantity: newDrop.sizes[k] }))
      });
      localStorage.setItem("dark_admin_products", JSON.stringify(adminState.products));

      closeAdminModal("addDropModal");
      dropForm.reset();
      renderInventoryTable();
      renderOverviewKPIs();
      showAdminToast("New Silhouette Drop deployed to Database!", "success");
    });
  }

  // Add Promo Form
  const promoForm = document.getElementById("newPromoForm");
  if (promoForm) {
    promoForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const code = document.getElementById("promoCodeName").value.trim().toUpperCase();
      const type = document.getElementById("promoType").value;
      const val = parseFloat(document.getElementById("promoVal").value);
      const minOrder = parseFloat(document.getElementById("promoMinOrder").value);

      if (adminState.isOnlineApi) {
        try {
          await fetch(`${API_BASE}/promo/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code, type, value: val, minOrder })
          });
        } catch (err) {}
      }

      adminState.promos.unshift({
        promo_id: Date.now(),
        code: code,
        discount_type: type,
        discount_value: val,
        min_order_value: minOrder,
        is_active: 1
      });
      localStorage.setItem("dark_admin_promos", JSON.stringify(adminState.promos));

      closeAdminModal("addPromoModal");
      promoForm.reset();
      renderPromoTable();
      showAdminToast(`Promo Code ${code} created & activated!`, "success");
    });
  }
}

function initFiltersAndSearch() {
  const pills = document.querySelectorAll(".order-filter-pill");
  pills.forEach(pill => {
    pill.addEventListener("click", () => {
      pills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      adminState.orderFilter = pill.dataset.filter;
      renderOrdersTable();
    });
  });

  const searchInput = document.getElementById("orderSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      adminState.orderSearch = e.target.value;
      renderOrdersTable();
    });
  }
}

function openAdminModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add("active");
}

function closeAdminModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove("active");
}

function openAddDropModal() {
  openAdminModal("addDropModal");
}

function openAddPromoModal() {
  openAdminModal("addPromoModal");
}

function showAdminToast(msg, type = "info") {
  const container = document.getElementById("adminToastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `admin-toast ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 250);
  }, 2800);
}


// ==========================================
// 10. CUSTOMERS TAB (IDENTITY DIRECTORY)
// ==========================================
function renderCustomers() {
  const tbody = document.getElementById("newCustomersTableBody");
  if (!tbody) return;

  if (!adminState.customers || adminState.customers.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:30px;">No collector identities found in the archive.</td></tr>`;
    return;
  }

  tbody.innerHTML = adminState.customers.map(c => {
    // Generate a pseudo-hash for the ID to look cool
    const hashId = `0x${(c.customer_id * 1337).toString(16).padStart(6, '0').toUpperCase()}`;
    
    // Status text based on VIP
    const accessLevel = c.is_vip_member ? 
      `<span class="status-badge status-delivered" style="box-shadow: 0 0 10px rgba(6, 182, 212, 0.4); border-color: var(--accent-cyan); color: var(--accent-cyan);">TIER 1 (VIP)</span>` : 
      `<span class="status-badge status-processing">TIER 2 (STANDARD)</span>`;
      
    // Format date
    const dateJoined = c.created_at ? c.created_at.split(' ')[0] : 'UNKNOWN';

    return `
      <tr>
        <td style="font-family:var(--font-mono); color: var(--text-secondary);">${hashId}</td>
        <td>
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--bg-dark); border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-size: 12px; color: var(--text-primary);">
              ${c.first_name ? c.first_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <strong style="color:var(--text-primary);">${c.first_name || ''} ${c.last_name || ''}</strong>
          </div>
        </td>
        <td style="font-family:var(--font-mono); font-size: 13px;">${c.email}</td>
        <td>${accessLevel}</td>
        <td style="color:var(--text-secondary);">${dateJoined}</td>
        <td>
          <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 11px;" onclick="viewIdentityDetails(${c.customer_id})">INSPECT</button>
        </td>
      </tr>
    `;
  }).join("");
}

function viewIdentityDetails(id) {
  showToast(`Accessing secure archive for identity #${id}...`, "info");
  // Future expansion: Open a modal with detailed collector history
}

function exportIdentities() {
  showToast("Exporting encrypted identity directory...", "success");
}

// Add event listener for the search box
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("identitySearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase();
      const filtered = adminState.customers.filter(c => 
        (c.first_name && c.first_name.toLowerCase().includes(q)) || 
        (c.last_name && c.last_name.toLowerCase().includes(q)) || 
        (c.email && c.email.toLowerCase().includes(q))
      );
      
      // Temporarily swap adminState.customers to render filtered list
      const original = adminState.customers;
      adminState.customers = filtered;
      renderCustomers();
      adminState.customers = original;
    });
  }
});