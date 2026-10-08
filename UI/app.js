/**
 * DARK ATELIER // E-COMMERCE & INTERACTIVE CUSTOM STUDIO ENGINE
 * Technologies: Pure Vanilla JavaScript (ES6+), LocalStorage, SVG Manipulation
 */

// ==========================================
// 1. STATE & DATA STORE
// ==========================================

let PRODUCTS = [
  {
    id: 1,
    title: "THE DARK 01 OVERSIZED TEE",
    subtitle: "Architectural Boxy Cut",
    category: "graphic",
    price: 68.0,
    rating: 4.9,
    reviewsCount: 142,
    gsm: 240,
    image: "assets/tee_black.jpg",
    colors: ["#121217", "#26262e", "#e3dfd7"],
    colorNames: ["Onyx Black", "Washed Charcoal", "Vintage Chalk"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    badge: "BESTSELLER",
    description: "Crafted from high-density 240 GSM organic combed cotton. Features an architectural drop-shoulder cut, 2.5cm ribbed collar that holds shape forever, and distressed brutalist typography on the chest.",
    specs: ["240 GSM 100% Organic Cotton", "Preshrunk Double Jersey", "Reinforced Neckline", "Tokyo Made Graphics"]
  },
  {
    id: 2,
    title: "CYBER AESTHETICS ACID TEE",
    subtitle: "Mineral Distressed Wash",
    category: "vintage",
    price: 72.0,
    rating: 5.0,
    reviewsCount: 98,
    gsm: 240,
    image: "assets/tee_vintage.jpg",
    colors: ["#26262e", "#121217"],
    colorNames: ["Acid Charcoal", "Onyx Black"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    badge: "LIMITED DROP",
    description: "Each garment undergoes an artisanal acid-mineral enzyme bath creating unique patina patterns. Adorned with high-precision cybernetic matrix schematics across the chest.",
    specs: ["Acid Enzyme Wash", "240 GSM Combed Terry", "Anti-Fray Overlock Seams", "Hand-Finished Patina"]
  },
  {
    id: 3,
    title: "ATELIER ESSENTIAL BLANK TEE",
    subtitle: "Heavy Minimalist Standard",
    category: "minimal",
    price: 58.0,
    rating: 4.8,
    reviewsCount: 230,
    gsm: 260,
    image: "assets/tee_white.jpg",
    colors: ["#e3dfd7", "#121217", "#9a866b"],
    colorNames: ["Chalk Bone", "Onyx Black", "Dune Sand"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    badge: "ESSENTIAL",
    description: "The pure canvas for minimalist purists. Substantial 260 GSM combed cotton that creates a crisp, sculptural silhouette without any slouch. Subtle tonal chest embroidery.",
    specs: ["260 GSM Ultra-Dense Cotton", "Tonal Atelier Monogram", "Thick 1x1 Collar Ribbing", "Pre-Shrunk"]
  },
  {
    id: 4,
    title: "NEO-TOKYO CYBER SKULL TEE",
    subtitle: "Cyberpunk Holographic Drop",
    category: "graphic",
    price: 75.0,
    rating: 4.9,
    reviewsCount: 84,
    gsm: 240,
    image: "assets/tee_violet.jpg",
    colors: ["#3c2152", "#121217"],
    colorNames: ["Cyber Violet", "Onyx Black"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    badge: "DROP 01",
    description: "Deep cyber violet base garment bearing a multidimensional chrome holographic skull graphic and Japanese kanji typography. Limited run of 300 pieces worldwide.",
    specs: ["Metallic Ink & High-Density Screenprint", "240 GSM Heavy Cotton", "Numbered Archive Hem Tag", "Drop Shoulder"]
  },
  {
    id: 5,
    title: "RAW / NATURE DUAL-PRINT TEE",
    subtitle: "Heavyweight French Terry Cut",
    category: "heavy",
    price: 78.0,
    rating: 4.9,
    reviewsCount: 112,
    gsm: 280,
    image: "assets/tee_moss.jpg",
    colors: ["#354034", "#121217"],
    colorNames: ["Forest Moss", "Onyx Black"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    badge: "280 GSM",
    description: "Our heaviest tee to date. 280 GSM loopback cotton with subtle minimal chest branding and full technical typography across the back. Designed for transitional weather wear.",
    specs: ["280 GSM Heavy French Terry", "Dual Front & Back Prints", "Wide Box Silhouette", "Reactive Eco-Dye"]
  },
  {
    id: 6,
    title: "NEO-CYBERNETIC FLAGSHIP TEE",
    subtitle: "Editorial Lookbook Silhouette",
    category: "graphic",
    price: 68.0,
    rating: 5.0,
    reviewsCount: 167,
    gsm: 240,
    image: "assets/hero_model.jpg",
    colors: ["#121217", "#26262e"],
    colorNames: ["Onyx Black", "Charcoal"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    badge: "ICONIC",
    description: "The signature flagship tee worn on runway editorials. Oversized proportions with elongated sleeves that stack naturally above the elbow.",
    specs: ["240 GSM Organic Cotton", "High-Definition Neon Screenprint", "Comfort Shoulder Taping", "Sanforized Finish"]
  }
];

// Verified Initial Reviews
let REVIEWS = [
  {
    author: "Marcus K.",
    city: "Berlin",
    rating: 5,
    title: "The collar doesn't budge after 15 washes.",
    comment: "Most streetwear oversized tees get that wavy bacon collar within 3 weeks. THE DARK's 240 GSM collar is so thick and structurally sound it looks like day one. The drape is unmatched.",
    item: "THE DARK 01 OVERSIZED TEE - Size L"
  },
  {
    author: "Elena Rostova",
    city: "London",
    rating: 5,
    title: "Boxy silhouette done right.",
    comment: "I love the drape on the Acid Washed Cyber Tee. It's wide in the chest without looking ridiculously long. Truly feels like high-end luxury fashion at a fraction of the cost.",
    item: "CYBER AESTHETICS ACID TEE - Size M"
  },
  {
    author: "Kenji Sato",
    city: "Tokyo",
    rating: 5,
    title: "The Custom Studio tee exceeded expectations.",
    comment: "Designed a custom 280 GSM Terry tee in the Studio with the Cyber Skull print and custom text. Arrived in Tokyo in 4 days. The print quality is crisp and tactile.",
    item: "CUSTOM THE DARK TEE (280 GSM) - Size XL"
  }
];

// App State
const state = {
  cart: JSON.parse(localStorage.getItem("dark_atelier_cart")) || [],
  wishlist: JSON.parse(localStorage.getItem("dark_atelier_wishlist")) || [],
  filterCategory: "all",
  searchQuery: "",
  sortBy: "featured",
  activePromo: null,
  currency: "LKR",
  rates: { USD: 1.0, EUR: 0.92, GBP: 0.78, JPY: 152.0, AUD: 1.54, LKR: 305.0 },
  symbols: { USD: "$", EUR: "€", GBP: "£", JPY: "¥", AUD: "A$", LKR: "Rs " },
  
  // Custom Studio Active Configuration
  studio: {
    color: "#121217",
    colorName: "Onyx Black",
    gsm: 240,
    basePrice: 62.0,
    preset: "skull",
    presetName: "Neo Cyber Skull",
    customText: "THE DARK",
    font: "'Syne', sans-serif",
    inkColor: "#ffffff",
    size: "L",
    view: "front"
  }
};

// ==========================================
// 2. INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  initCatalog();
  initCustomStudio();
  initCart();
  initReviews();
  initModals();
  initSearch();
  initFAQ();
  initNewsletter();
  updateCartUI();
  updateWishlistUI();

  initAccountDrawer();
});

// ==========================================
// 2.5 ACCOUNT DRAWER & SESSION STATE
// ==========================================
function initAccountDrawer() {
  const trigger = document.getElementById("accountDrawerTrigger");
  const overlay = document.getElementById("accountDrawerOverlay");
  const drawer = document.getElementById("accountDrawer");
  const closeBtn = document.getElementById("accountDrawerClose");
  const guestView = document.getElementById("accountGuestView");
  const authView = document.getElementById("accountAuthView");
  const logoutBtn = document.getElementById("accountLogoutBtn");
  const userName = document.getElementById("drawerUserName");
  const userEmail = document.getElementById("drawerUserEmail");
  const userAvatar = document.getElementById("drawerUserAvatar");
  
  if (!trigger || !drawer || !overlay) return;

  // Toggle drawer open
  trigger.addEventListener("click", () => {
    overlay.classList.add("active");
    drawer.classList.add("open");
    checkSessionState();
  });

  // Close drawer
  const closeDrawer = () => {
    overlay.classList.remove("active");
    drawer.classList.remove("open");
  };

  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  if (overlay) overlay.addEventListener("click", closeDrawer);

  // Check Session
  const checkSessionState = () => {
    const sessionStr = localStorage.getItem("dark_currentUser");
    if (sessionStr) {
      try {
        const user = JSON.parse(sessionStr);
        if (guestView) guestView.style.display = "none";
        if (authView) authView.style.display = "block";
        if (userName) userName.textContent = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "COLLECTOR";
        if (userEmail) userEmail.textContent = user.email || "";
        if (userAvatar) userAvatar.textContent = (user.firstName || "U").charAt(0).toUpperCase();
        
        // Auto-fill checkout details if on storefront
        const cEmail = document.getElementById("checkoutEmail");
        const cFirst = document.getElementById("checkoutFirstName");
        const cLast = document.getElementById("checkoutLastName");
        if(cEmail && !cEmail.value) cEmail.value = user.email || "";
        if(cFirst && !cFirst.value) cFirst.value = user.firstName || "";
        if(cLast && !cLast.value) cLast.value = user.lastName || "";
      } catch (e) {
        console.error(e);
      }
    } else {
      if (guestView) guestView.style.display = "flex";
      if (authView) authView.style.display = "none";
    }
  };

  // Handle Logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("dark_currentUser");
      localStorage.removeItem("dark_token");
      checkSessionState();
      closeDrawer();
      showToast("Identity cleared. Signed out.", "info");
      setTimeout(() => window.location.reload(), 1000);
    });
  }
}

// ==========================================
// 3. CATALOG & FILTERING
// ==========================================
function initCatalog() {
  // Try to fetch dynamic prices from backend if running
  fetch("http://localhost:8001/api/products")
    .then(r => r.json())
    .then(data => {
      if (data.success && data.products) {
        data.products.forEach(apiProd => {
          const localProd = PRODUCTS.find(p => p.title === apiProd.title);
          if (localProd) {
            localProd.price = parseFloat(apiProd.price);
          }
        });
        renderProductGrid();
      }
    })
    .catch(err => console.log("Running offline or no API server, using default prices."));

  renderProductGrid();

  // Category Filter Pills
  const filterPills = document.querySelectorAll(".filter-pill");
  filterPills.forEach(pill => {
    pill.addEventListener("click", () => {
      filterPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      state.filterCategory = pill.dataset.category;
      renderProductGrid();
    });
  });

  // Sort Dropdown
  const sortSelect = document.getElementById("sortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      state.sortBy = e.target.value;
      renderProductGrid();
    });
  }

  // Reset filter button in empty state
  const resetBtn = document.getElementById("resetFiltersBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      state.filterCategory = "all";
      state.searchQuery = "";
      const searchInput = document.getElementById("headerSearchInput");
      if (searchInput) searchInput.value = "";
      filterPills.forEach(p => p.classList.toggle("active", p.dataset.category === "all"));
      renderProductGrid();
    });
  }

  // Currency Switcher
  const currencySelect = document.getElementById("currencySelect");
  if (currencySelect) {
    currencySelect.addEventListener("change", (e) => {
      state.currency = e.target.value;
      renderProductGrid();
      updateCartUI();
      updateStudioPricing();
      showToast(`Currency changed to ${state.currency}`, "info");
    });
  }
}

function formatCurrency(amountUSD) {
  const rate = state.rates[state.currency] || 1.0;
  const converted = amountUSD * rate;
  const symbol = state.symbols[state.currency] || "$";
  
  if (state.currency === "JPY") {
    return `${symbol}${Math.round(converted).toLocaleString()}`;
  }
  return `${symbol}${converted.toFixed(2)}`;
}

function renderProductGrid() {
  const grid = document.getElementById("productGrid");
  const emptyState = document.getElementById("catalogEmptyState");
  if (!grid) return;

  // Filter products
  let filtered = PRODUCTS.filter(p => {
    const matchesCategory = state.filterCategory === "all" || p.category === state.filterCategory;
    const q = state.searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      p.title.toLowerCase().includes(q) || 
      p.subtitle.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      p.specs.some(s => s.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  // Sort products
  if (state.sortBy === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (state.sortBy === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (state.sortBy === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  // Show/hide empty state
  if (filtered.length === 0) {
    grid.innerHTML = "";
    if (emptyState) emptyState.classList.remove("hidden");
    return;
  } else {
    if (emptyState) emptyState.classList.add("hidden");
  }

  grid.innerHTML = filtered.map(product => {
    const isSaved = state.wishlist.includes(product.id);
    return `
      <article class="product-card" data-id="${product.id}">
        <div class="product-thumb-wrap">
          ${product.badge ? `<span class="badge-tag product-badge-flag">${product.badge}</span>` : ""}
          <button class="card-wishlist-btn ${isSaved ? "active" : ""}" onclick="toggleWishlist(${product.id})" aria-label="Save to Wishlist" title="Save Silhouette">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isSaved ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </button>
          
          <img src="${product.image}" alt="${product.title}" class="product-img" loading="lazy">
          
          <div class="quick-action-overlay">
            <button class="quick-action-btn" onclick="openQuickView(${product.id})">Quick View</button>
            <button class="quick-action-btn" onclick="addToCart(${product.id})">+ Quick Add</button>
          </div>
        </div>

        <div class="product-info">
          <div class="product-meta-row">
            <span class="product-gsm-tag">${product.gsm} GSM // ORGANIC</span>
            <span class="product-rating">★ ${product.rating.toFixed(1)} (${product.reviewsCount})</span>
          </div>

          <h3 class="product-title">${product.title}</h3>
          <p class="product-silhouette">${product.subtitle}</p>

          <div class="product-footer-row">
            <span class="product-price">${formatCurrency(product.price)}</span>
            <div class="product-swatches" title="Available Colorways">
              ${product.colors.map(c => `<span class="mini-swatch" style="background:${c}"></span>`).join("")}
            </div>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

// ==========================================
// 4. INTERACTIVE CUSTOM T-SHIRT STUDIO
// ==========================================
function initCustomStudio() {
  const shirtBody = document.getElementById("shirtBody");
  const collarRib = document.getElementById("collarRib");
  const colorSelectedName = document.getElementById("colorSelectedName");
  const colorValLabel = document.getElementById("colorValLabel");
  const previewGsmBadge = document.getElementById("previewGsmBadge");
  const customTextInput = document.getElementById("studioCustomTextInput");
  const textCharCount = document.getElementById("textCharCount");
  const customTextLayer = document.getElementById("customTextLayer");
  const fontSelect = document.getElementById("studioFontSelect");
  const viewFrontBtn = document.getElementById("viewFrontBtn");
  const viewBackBtn = document.getElementById("viewBackBtn");
  const viewModeLabel = document.getElementById("viewModeLabel");
  const studioAddToCartBtn = document.getElementById("studioAddToCartBtn");

  // Step 1: Color Swatches
  const swatches = document.querySelectorAll("#studioColorSwatches .swatch-btn");
  swatches.forEach(btn => {
    btn.addEventListener("click", () => {
      swatches.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.studio.color = btn.dataset.color;
      state.studio.colorName = btn.dataset.name;

      if (shirtBody) shirtBody.setAttribute("fill", state.studio.color);
      // Slightly adjust collar rib to contrast nicely
      if (collarRib) collarRib.setAttribute("fill", state.studio.color);
      if (colorSelectedName) colorSelectedName.textContent = `Color: ${state.studio.colorName}`;
      if (colorValLabel) colorValLabel.textContent = state.studio.colorName;

      // Invert default text color if shirt is light chalk
      if (state.studio.color === "#e3dfd7" && state.studio.inkColor === "#ffffff") {
        setInkColor("#121217");
      }
    });
  });

  // Step 2: Fabric GSM
  const gsmButtons = document.querySelectorAll(".gsm-card-btn");
  gsmButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      gsmButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.studio.gsm = parseInt(btn.dataset.gsm, 10);
      state.studio.basePrice = parseFloat(btn.dataset.price);

      if (previewGsmBadge) {
        previewGsmBadge.textContent = `${state.studio.gsm} GSM ${btn.dataset.desc}`;
      }
      updateStudioPricing();
    });
  });

  // Step 3: Artwork Presets
  const artworkButtons = document.querySelectorAll("#artworkPresetGrid .artwork-btn");
  artworkButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      artworkButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.studio.preset = btn.dataset.preset;
      state.studio.presetName = btn.title;
      const presetLabel = document.getElementById("presetValLabel");
      if (presetLabel) presetLabel.textContent = state.studio.presetName;
      renderStudioArtwork();
    });
  });

  // Step 4: Custom Text Input
  if (customTextInput) {
    customTextInput.addEventListener("input", (e) => {
      const val = e.target.value.toUpperCase();
      state.studio.customText = val;
      if (customTextLayer) customTextLayer.textContent = val;
      if (textCharCount) textCharCount.textContent = `${val.length}/24`;
    });
  }

  // Font Selection
  if (fontSelect) {
    fontSelect.addEventListener("change", (e) => {
      state.studio.font = e.target.value;
      if (customTextLayer) customTextLayer.style.fontFamily = state.studio.font;
    });
  }

  // Ink Color Picker
  const inkButtons = document.querySelectorAll(".ink-btn");
  inkButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      inkButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      setInkColor(btn.dataset.ink);
    });
  });

  function setInkColor(color) {
    state.studio.inkColor = color;
    if (customTextLayer) customTextLayer.style.color = color;
    renderStudioArtwork(); // Updates SVG stroke/fill if needed
  }

  // Step 5: Size Selection
  const sizeButtons = document.querySelectorAll("#studioSizes .size-btn");
  sizeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      sizeButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.studio.size = btn.dataset.size;
    });
  });

  // Front vs Back Perspective Toggle
  if (viewFrontBtn && viewBackBtn) {
    viewFrontBtn.addEventListener("click", () => {
      viewFrontBtn.classList.add("active");
      viewBackBtn.classList.remove("active");
      state.studio.view = "front";
      if (viewModeLabel) viewModeLabel.textContent = "FRONT PERSPECTIVE";
      toggleTeePerspective("front");
    });

    viewBackBtn.addEventListener("click", () => {
      viewBackBtn.classList.add("active");
      viewFrontBtn.classList.remove("active");
      state.studio.view = "back";
      if (viewModeLabel) viewModeLabel.textContent = "BACK VIEW // POSTERIOR";
      toggleTeePerspective("back");
    });
  }

  // Studio Add to Cart Button
  if (studioAddToCartBtn) {
    studioAddToCartBtn.addEventListener("click", () => {
      addCustomTeeToCart();
    });
  }

  renderStudioArtwork();
  updateStudioPricing();
}

function toggleTeePerspective(view) {
  const innerNeck = document.getElementById("innerNeck");
  const collarRib = document.getElementById("collarRib");
  const printZone = document.getElementById("teePrintZone");

  if (view === "back") {
    // Hide inside collar tape, elevate collar curve
    if (innerNeck) innerNeck.style.display = "none";
    if (collarRib) collarRib.setAttribute("d", "M 160 70 C 220 56, 280 56, 340 70 C 325 50, 175 50, 160 70 Z");
    if (printZone) {
      printZone.style.top = "26%";
      printZone.style.height = "48%";
    }
  } else {
    // Restore front scoop
    if (innerNeck) innerNeck.style.display = "block";
    if (collarRib) collarRib.setAttribute("d", "M 160 70 C 190 102, 310 102, 340 70 C 325 50, 175 50, 160 70 Z");
    if (printZone) {
      printZone.style.top = "32%";
      printZone.style.height = "38%";
    }
  }
}

function renderStudioArtwork() {
  const layer = document.getElementById("graphicLayer");
  if (!layer) return;

  const color = state.studio.inkColor || "#ffffff";
  const preset = state.studio.preset;

  if (preset === "skull") {
    layer.innerHTML = `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 15 C30 15, 20 28, 20 48 C20 62, 28 72, 36 76 L36 86 C36 88, 64 88, 64 86 L64 76 C72 72, 80 62, 80 48 C80 28, 70 15, 50 15 Z" 
              stroke="${color}" stroke-width="2.5" fill="${color}" fill-opacity="0.1" />
        <!-- Eyes -->
        <circle cx="37" cy="46" r="7" fill="${color}" />
        <circle cx="63" cy="46" r="7" fill="${color}" />
        <!-- Glitch crosshair -->
        <line x1="15" y1="46" x2="85" y2="46" stroke="${color}" stroke-width="1" stroke-dasharray="2 3" opacity="0.6"/>
        <line x1="50" y1="10" x2="50" y2="90" stroke="${color}" stroke-width="1" stroke-dasharray="2 3" opacity="0.6"/>
        <!-- Teeth lines -->
        <line x1="42" y1="80" x2="42" y2="88" stroke="${color}" stroke-width="2"/>
        <line x1="50" y1="80" x2="50" y2="88" stroke="${color}" stroke-width="2"/>
        <line x1="58" y1="80" x2="58" y2="88" stroke="${color}" stroke-width="2"/>
      </svg>
    `;
  } else if (preset === "japanese") {
    layer.innerHTML = `
      <svg viewBox="0 0 120 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="5" width="110" height="60" stroke="${color}" stroke-width="1.5" stroke-dasharray="4 2"/>
        <text x="50%" y="42" text-anchor="middle" fill="${color}" font-family="'Syne', sans-serif" font-weight="800" font-size="18" letter-spacing="4">ネオ・東京</text>
        <text x="50%" y="56" text-anchor="middle" fill="${color}" font-family="'Space Grotesk', monospace" font-size="7" letter-spacing="2" opacity="0.8">CYBERNETICS // 2142</text>
      </svg>
    `;
  } else if (preset === "geometry") {
    layer.innerHTML = `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="50,15 85,50 50,85 15,50" stroke="${color}" stroke-width="2" fill="${color}" fill-opacity="0.08"/>
        <polygon points="50,25 75,50 50,75 25,50" stroke="${color}" stroke-width="1.5"/>
        <circle cx="50" cy="50" r="10" stroke="${color}" stroke-width="2"/>
        <circle cx="50" cy="50" r="3" fill="${color}"/>
        <line x1="50" y1="5" x2="50" y2="95" stroke="${color}" stroke-width="1" stroke-dasharray="3 3"/>
      </svg>
    `;
  } else if (preset === "minimal") {
    layer.innerHTML = `
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M40 18 L68 64 L12 64 Z" stroke="${color}" stroke-width="3" fill="none"/>
        <circle cx="40" cy="48" r="7" stroke="${color}" stroke-width="2"/>
        <line x1="26" y1="55" x2="54" y2="55" stroke="${color}" stroke-width="2"/>
      </svg>
    `;
  } else {
    // Blank
    layer.innerHTML = "";
  }
}

function updateStudioPricing() {
  const priceDisplay = document.getElementById("studioTotalPrice");
  if (!priceDisplay) return;

  // Graphic addition fee
  const artFee = state.studio.preset !== "none" ? 6.0 : 0;
  const total = state.studio.basePrice + artFee;
  
  const rate = state.rates[state.currency] || 1.0;
  const converted = total * rate;

  if (state.currency === "JPY") {
    priceDisplay.textContent = formatCurrency(total);
  } else {
    priceDisplay.textContent = formatCurrency(total);
  }
}

function addCustomTeeToCart() {
  const artFee = state.studio.preset !== "none" ? 6.0 : 0;
  const totalPrice = state.studio.basePrice + artFee;

  const customItem = {
    id: "custom_" + Date.now(),
    isCustom: true,
    title: `CUSTOM ${state.studio.gsm}GSM BOX TEE`,
    subtitle: `${state.studio.colorName} • ${state.studio.presetName}`,
    price: totalPrice,
    size: state.studio.size,
    color: state.studio.colorName,
    text: state.studio.customText,
    image: state.studio.color === "#e3dfd7" ? "assets/tee_white.jpg" : 
           state.studio.color === "#3c2152" ? "assets/tee_violet.jpg" :
           state.studio.color === "#354034" ? "assets/tee_moss.jpg" :
           state.studio.color === "#26262e" ? "assets/tee_vintage.jpg" : "assets/tee_black.jpg",
    quantity: 1
  };

  state.cart.push(customItem);
  saveCart();
  updateCartUI();
  openCartDrawer();
  showToast("Custom Engineered Tee added to Bag!", "success");
}


// ==========================================
// 6. SHOPPING CART SYSTEM
// ==========================================
function initCart() {
  const cartTrigger = document.getElementById("cartTrigger");
  const cartCloseBtn = document.getElementById("cartCloseBtn");
  const cartOverlay = document.getElementById("cartDrawerOverlay");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const promoApplyBtn = document.getElementById("promoApplyBtn");

  if (cartTrigger) cartTrigger.addEventListener("click", openCartDrawer);
  if (cartCloseBtn) cartCloseBtn.addEventListener("click", closeCartDrawer);
  if (cartOverlay) cartOverlay.addEventListener("click", closeCartDrawer);

  if (promoApplyBtn) {
    promoApplyBtn.addEventListener("click", applyPromoCode);
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (state.cart.length === 0) {
        showToast("Your bag is empty! Add silhouettes first.", "error");
        return;
      }
      closeCartDrawer();
      openCheckoutModal();
    });
  }
}

function openCartDrawer() {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartDrawerOverlay");
  if (drawer) drawer.classList.add("active");
  if (overlay) overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCartDrawer() {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartDrawerOverlay");
  if (drawer) drawer.classList.remove("active");
  if (overlay) overlay.classList.remove("active");
  document.body.style.overflow = "";
}

function addToCart(productId, size = "L", colorIndex = 0) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const chosenColor = product.colorNames[colorIndex] || product.colorNames[0];

  // Check if identical item already exists in cart
  const existing = state.cart.find(item => 
    !item.isCustom && item.productId === productId && item.size === size && item.color === chosenColor
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({
      id: "prod_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
      productId: product.id,
      title: product.title,
      price: product.price,
      size: size,
      color: chosenColor,
      image: product.image,
      quantity: 1
    });
  }

  saveCart();
  updateCartUI();
  openCartDrawer();
  showToast(`Added ${product.title} (${size}) to Bag!`, "success");
}

function updateCartQty(cartItemId, delta) {
  const item = state.cart.find(i => i.id === cartItemId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(cartItemId);
    return;
  }

  saveCart();
  updateCartUI();
}

function removeFromCart(cartItemId) {
  state.cart = state.cart.filter(i => i.id !== cartItemId);
  saveCart();
  updateCartUI();
  showToast("Item removed from Bag", "info");
}

function saveCart() {
  localStorage.setItem("dark_atelier_cart", JSON.stringify(state.cart));
}

function updateCartUI() {
  const countBadge = document.getElementById("cartCountBadge");
  const drawerCount = document.getElementById("cartDrawerCount");
  const list = document.getElementById("cartItemsList");
  const subtotalVal = document.getElementById("cartSubtotalVal");
  const discountRow = document.getElementById("cartDiscountRow");
  const discountVal = document.getElementById("cartDiscountVal");
  const shippingVal = document.getElementById("cartShippingVal");
  const grandTotalVal = document.getElementById("cartGrandTotalVal");
  const meterText = document.getElementById("shippingMeterText");
  const meterFill = document.getElementById("shippingMeterFill");

  const totalItems = state.cart.reduce((sum, i) => sum + i.quantity, 0);
  if (countBadge) countBadge.textContent = totalItems;
  if (drawerCount) drawerCount.textContent = `(${totalItems} ${totalItems === 1 ? "item" : "items"})`;

  if (!list) return;

  if (state.cart.length === 0) {
    list.innerHTML = `
      <div class="cart-empty-view">
        <div class="empty-bag-icon">🛍️</div>
        <h4>YOUR BAG IS EMPTY</h4>
        <p style="color:var(--text-muted);font-size:13px;margin:8px 0 20px;">Explore the latest drop or design your own heavyweight tee.</p>
        <button class="btn btn-secondary" onclick="closeCartDrawer();location.href='#catalogSection'">Explore Drops</button>
      </div>
    `;
    if (subtotalVal) subtotalVal.textContent = formatCurrency(0);
    if (grandTotalVal) grandTotalVal.textContent = formatCurrency(0);
    if (discountRow) discountRow.classList.add("hidden");
    if (meterFill) meterFill.style.width = "0%";
    if (meterText) meterText.innerHTML = `Add <strong>$100.00</strong> more for Free Express Worldwide Shipping!`;
    return;
  }

  // Calculate raw subtotal in USD
  const subtotalUSD = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Free shipping threshold: $100 USD
  const freeThreshold = 100.0;
  const remaining = Math.max(0, freeThreshold - subtotalUSD);
  const percent = Math.min(100, Math.round((subtotalUSD / freeThreshold) * 100));

  if (meterFill) meterFill.style.width = `${percent}%`;
  if (meterText) {
    if (remaining <= 0) {
      meterText.innerHTML = `🎉 <strong>UNLOCKED: FREE WORLDWIDE EXPRESS SHIPPING!</strong>`;
    } else {
      meterText.innerHTML = `Add <strong>${formatCurrency(remaining)}</strong> more for Free Worldwide Express Shipping!`;
    }
  }

  // Promo Calculation
  let discountUSD = 0;
  if (state.activePromo === "DARK20") {
    discountUSD = subtotalUSD * 0.20;
  } else if (state.activePromo === "DROP10") {
    discountUSD = Math.min(subtotalUSD, 10.0);
  }

  const shippingUSD = (subtotalUSD >= freeThreshold || subtotalUSD === 0) ? 0.0 : 12.0;
  const finalTotalUSD = Math.max(0, subtotalUSD - discountUSD + shippingUSD);

  if (subtotalVal) subtotalVal.textContent = formatCurrency(subtotalUSD);
  if (grandTotalVal) grandTotalVal.textContent = formatCurrency(finalTotalUSD);

  if (discountRow && discountVal) {
    if (discountUSD > 0) {
      discountRow.classList.remove("hidden");
      discountVal.textContent = `-${formatCurrency(discountUSD)}`;
    } else {
      discountRow.classList.add("hidden");
    }
  }

  if (shippingVal) {
    shippingVal.textContent = shippingUSD === 0 ? "FREE" : formatCurrency(shippingUSD);
  }

  // Render items
  list.innerHTML = state.cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.title}" class="cart-item-img">
      <div class="cart-item-details">
        <h4 class="cart-item-title">${item.title}</h4>
        <span class="cart-item-meta">Size: ${item.size} • ${item.color}</span>
        ${item.text ? `<span class="cart-item-meta" style="color:var(--accent-cyan)">Print: "${item.text}"</span>` : ""}
        
        <div class="cart-item-bottom">
          <div class="qty-controls">
            <button class="qty-btn" onclick="updateCartQty('${item.id}', -1)">-</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="qty-btn" onclick="updateCartQty('${item.id}', 1)">+</button>
          </div>
          <span class="cart-item-price">${formatCurrency(item.price * item.quantity)}</span>
        </div>
      </div>
      <button class="cart-item-remove-btn" onclick="removeFromCart('${item.id}')" title="Remove silhouette">✕</button>
    </div>
  `).join("");
}

function applyPromoCode() {
  const input = document.getElementById("promoCodeInput");
  const msg = document.getElementById("promoFeedbackMsg");
  if (!input || !msg) return;

  const code = input.value.trim().toUpperCase();
  if (code === "DARK20") {
    state.activePromo = "DARK20";
    msg.className = "promo-feedback-msg success";
    msg.textContent = "✓ Code DARK20 applied: 20% discount granted!";
    updateCartUI();
    showToast("20% Discount Code Applied!", "success");
  } else if (code === "DROP10") {
    state.activePromo = "DROP10";
    msg.className = "promo-feedback-msg success";
    msg.textContent = "✓ Code DROP10 applied: $10 credit granted!";
    updateCartUI();
    showToast("$10 Credit Applied!", "success");
  } else {
    msg.className = "promo-feedback-msg error";
    msg.textContent = "Invalid code. Try DARK20 for 20% off.";
    showToast("Invalid promo code", "error");
  }
}

// ==========================================
// 6. QUICK VIEW MODAL
// ==========================================
function openQuickView(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById("quickViewModal");
  const content = document.getElementById("quickViewContent");
  if (!modal || !content) return;

  let selectedSize = "L";
  let selectedColorIdx = 0;

  content.innerHTML = `
    <div class="quickview-grid">
      <div class="quickview-gallery-wrap">
        <img src="${product.image}" alt="${product.title}" id="qvMainImg">
      </div>

      <div class="quickview-details">
        <div class="product-meta-row">
          <span class="badge-tag">${product.badge || "EXCLUSIVE"}</span>
          <span class="product-rating">★ ${product.rating.toFixed(1)} (${product.reviewsCount} reviews)</span>
        </div>

        <h2>${product.title}</h2>
        <div class="quickview-price">${formatCurrency(product.price)}</div>
        <p class="quickview-desc">${product.description}</p>

        <div class="specs-chip-row">
          ${product.specs.map(spec => `<span class="specs-chip">✓ ${spec}</span>`).join("")}
        </div>

        <span class="modal-section-title">CHOOSE SIZE</span>
        <div class="quickview-size-row" id="qvSizes">
          ${product.sizes.map(s => `
            <button class="quickview-size-btn ${s === selectedSize ? "active" : ""}" data-size="${s}">${s}</button>
          `).join("")}
        </div>

        <button class="btn btn-primary" id="qvAddToCartBtn" style="padding:16px;">
          <span>Add ${formatCurrency(product.price)} to Bag</span>
        </button>
      </div>
    </div>
  `;

  // Attach size selection listeners inside modal
  const sizeBtns = content.querySelectorAll(".quickview-size-btn");
  sizeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      sizeBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedSize = btn.dataset.size;
    });
  });

  const addBtn = content.getElementById ? content.getElementById("qvAddToCartBtn") : content.querySelector("#qvAddToCartBtn");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      addToCart(product.id, selectedSize, selectedColorIdx);
      closeModal(modal);
    });
  }

  openModal(modal);
}

// ==========================================
// 7. CHECKOUT & ORDER CONFIRMATION
// ==========================================
function openCheckoutModal() {
  const modal = document.getElementById("checkoutModal");
  if (!modal) return;

  // Render Step 3 summary
  const summaryBox = document.getElementById("checkoutOrderSummary");
  const finalAmount = document.getElementById("checkoutFinalAmount");
  const subtotalUSD = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  let discountUSD = 0;
  if (state.activePromo === "DARK20") discountUSD = subtotalUSD * 0.20;
  else if (state.activePromo === "DROP10") discountUSD = Math.min(subtotalUSD, 10.0);

  const shippingUSD = subtotalUSD >= 100 ? 0.0 : 12.0;
  const grandTotal = Math.max(0, subtotalUSD - discountUSD + shippingUSD);

  if (summaryBox) {
    summaryBox.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:14px;">
        ${state.cart.map(i => `
          <div style="display:flex;justify-content:space-between;font-size:13px;">
            <span>${i.quantity}x ${i.title} (${i.size})</span>
            <strong>${formatCurrency(i.price * i.quantity)}</strong>
          </div>
        `).join("")}
      </div>
      <div class="cart-calculations" style="border-top:1px solid var(--border-subtle);padding-top:12px;">
        <div class="calc-row"><span>Subtotal</span><span>${formatCurrency(subtotalUSD)}</span></div>
        ${discountUSD > 0 ? `<div class="calc-row discount-row"><span>Discount (${state.activePromo})</span><span>-${formatCurrency(discountUSD)}</span></div>` : ""}
        <div class="calc-row"><span>Worldwide Priority Shipping</span><span>${shippingUSD === 0 ? "FREE" : formatCurrency(shippingUSD)}</span></div>
        <div class="calc-row total-row"><span>Total Due</span><span class="grand-total">${formatCurrency(grandTotal)}</span></div>
      </div>
    `;
  }

  if (finalAmount) finalAmount.textContent = `— ${formatCurrency(grandTotal)}`;

  // Reset to step 1
  switchCheckoutStep(1);
  openModal(modal);
}

function switchCheckoutStep(stepNumber) {
  const stepIndicators = document.querySelectorAll(".checkout-stepper .step-indicator");
  const stepShipping = document.getElementById("stepShipping");
  const stepPayment = document.getElementById("stepPayment");
  const stepReview = document.getElementById("stepReview");

  stepIndicators.forEach(ind => {
    ind.classList.toggle("active", parseInt(ind.dataset.step, 10) <= stepNumber);
  });

  if (stepShipping) stepShipping.classList.toggle("active", stepNumber === 1);
  if (stepPayment) stepPayment.classList.toggle("active", stepNumber === 2);
  if (stepReview) stepReview.classList.toggle("active", stepNumber === 3);
}

// ==========================================
// 8. WISHLIST MANAGEMENT
// ==========================================
function toggleWishlist(productId) {
  const index = state.wishlist.indexOf(productId);
  if (index > -1) {
    state.wishlist.splice(index, 1);
    showToast("Removed from Saved Silhouettes", "info");
  } else {
    state.wishlist.push(productId);
    showToast("Added to Saved Silhouettes!", "success");
  }

  localStorage.setItem("dark_atelier_wishlist", JSON.stringify(state.wishlist));
  updateWishlistUI();
  renderProductGrid();
}

function updateWishlistUI() {
  const badge = document.getElementById("wishlistBadge");
  if (badge) badge.textContent = state.wishlist.length;
}

function openWishlistModal() {
  const modal = document.getElementById("wishlistModal");
  const container = document.getElementById("wishlistItemsGrid");
  if (!modal || !container) return;

  const savedProducts = PRODUCTS.filter(p => state.wishlist.includes(p.id));

  if (savedProducts.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:40px 20px;">
        <p style="color:var(--text-muted);font-size:14px;margin-bottom:14px;">You haven't saved any silhouettes yet.</p>
        <button class="btn btn-secondary" onclick="closeModal(document.getElementById('wishlistModal'))">Browse Drops</button>
      </div>
    `;
  } else {
    container.innerHTML = savedProducts.map(p => `
      <div class="cart-item">
        <img src="${p.image}" alt="${p.title}" class="cart-item-img">
        <div class="cart-item-details">
          <h4 class="cart-item-title">${p.title}</h4>
          <span class="cart-item-meta">${p.gsm} GSM • ${formatCurrency(p.price)}</span>
          <div class="cart-item-bottom" style="margin-top:10px;">
            <button class="btn btn-primary" style="padding:6px 14px;font-size:12px;" onclick="addToCart(${p.id});closeModal(document.getElementById('wishlistModal'));">Add to Bag</button>
            <button class="cart-item-remove-btn" onclick="toggleWishlist(${p.id});openWishlistModal();">✕</button>
          </div>
        </div>
      </div>
    `).join("");
  }

  openModal(modal);
}

// ==========================================
// 9. REVIEWS SYSTEM
// ==========================================
function initReviews() {
  renderReviews();

  const openBtn = document.getElementById("openReviewModalBtn");
  const reviewModal = document.getElementById("reviewModal");
  const reviewForm = document.getElementById("reviewForm");
  const starsContainer = document.getElementById("starRatingInput");

  if (openBtn && reviewModal) {
    openBtn.addEventListener("click", () => openModal(reviewModal));
  }

  let selectedRating = 5;
  if (starsContainer) {
    const stars = starsContainer.querySelectorAll(".star-pick");
    stars.forEach(star => {
      star.addEventListener("click", () => {
        selectedRating = parseInt(star.dataset.val, 10);
        stars.forEach(s => {
          s.classList.toggle("active", parseInt(s.dataset.val, 10) <= selectedRating);
        });
      });
    });
  }

  if (reviewForm) {
    reviewForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const author = document.getElementById("reviewAuthor").value.trim();
      const title = document.getElementById("reviewTitle").value.trim();
      const comment = document.getElementById("reviewComment").value.trim();

      REVIEWS.unshift({
        author: author,
        city: "Verified Collector",
        rating: selectedRating,
        title: title,
        comment: comment,
        item: "THE DARK GARMENT // VERIFIED FIT"
      });

      renderReviews();
      closeModal(reviewModal);
      reviewForm.reset();
      showToast("Thank you! Your verified review is published.", "success");
    });
  }
}

function renderReviews() {
  const container = document.getElementById("reviewsGrid");
  if (!container) return;

  container.innerHTML = REVIEWS.map(r => `
    <div class="review-card">
      <div class="review-card-header">
        <div class="review-author-info">
          <span class="review-author-name">${r.author}</span>
          <span class="verified-badge">✓ Verified Fit</span>
        </div>
        <div class="stars">${"★".repeat(r.rating)}</div>
      </div>

      <h4 class="review-title">"${r.title}"</h4>
      <p class="review-comment">${r.comment}</p>
      <div class="review-item-tag">${r.item}</div>
    </div>
  `).join("");
}

// ==========================================
// 10. MODALS, ACCORDIONS, SEARCH & TOASTS
// ==========================================
function initModals() {
  // Generic close buttons
  document.querySelectorAll(".modal-close-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const modal = e.target.closest(".modal-overlay");
      if (modal) closeModal(modal);
    });
  });

  // Overlay click to close
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal(overlay);
    });
  });

  // ESC key
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-overlay.active").forEach(closeModal);
      closeCartDrawer();
    }
  });

  // Size Guide Triggers
  const openSizeGuide = document.getElementById("openSizeGuideLink");
  const footerSizeGuide = document.getElementById("footerSizeGuide");
  const sizeGuideModal = document.getElementById("sizeGuideModal");
  if (openSizeGuide && sizeGuideModal) {
    openSizeGuide.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(sizeGuideModal);
    });
  }
  if (footerSizeGuide && sizeGuideModal) {
    footerSizeGuide.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(sizeGuideModal);
    });
  }

  // Wishlist Trigger
  const wishlistTrigger = document.getElementById("wishlistTrigger");
  if (wishlistTrigger) {
    wishlistTrigger.addEventListener("click", openWishlistModal);
  }

  // Mobile menu button
  const mobileBtn = document.getElementById("mobileMenuBtn");
  const navLinks = document.getElementById("navLinks");
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
    navLinks.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => navLinks.classList.remove("open"));
    });
  }

  // Checkout Step Navigation
  const toPaymentBtn = document.getElementById("toPaymentBtn");
  const backToShippingBtn = document.getElementById("backToShippingBtn");
  const toReviewBtn = document.getElementById("toReviewBtn");
  const backToPaymentBtn = document.getElementById("backToPaymentBtn");
  const checkoutForm = document.getElementById("checkoutForm");
  const orderSuccessModal = document.getElementById("orderSuccessModal");
  const continueShoppingBtn = document.getElementById("continueShoppingBtn");

  if (toPaymentBtn) {
    toPaymentBtn.addEventListener("click", () => {
      const email = document.getElementById("shipEmail").value;
      const addr = document.getElementById("shipAddress").value;
      if (!email || !addr) {
        showToast("Please fill out your shipping and email information", "error");
        return;
      }
      switchCheckoutStep(2);
    });
  }

  if (backToShippingBtn) backToShippingBtn.addEventListener("click", () => switchCheckoutStep(1));
  if (toReviewBtn) toReviewBtn.addEventListener("click", () => switchCheckoutStep(3));
  if (backToPaymentBtn) backToPaymentBtn.addEventListener("click", () => switchCheckoutStep(2));

  // Payment Tabs inside checkout
  const payTabs = document.querySelectorAll(".payment-tabs .pay-tab-btn");
  payTabs.forEach(btn => {
    btn.addEventListener("click", () => {
      payTabs.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const tab = btn.dataset.tab;
      document.getElementById("payCardContent")?.classList.toggle("active", tab === "card");
      document.getElementById("payAppleContent")?.classList.toggle("active", tab === "apple");
      document.getElementById("payUpiContent")?.classList.toggle("active", tab === "upi");
    });
  });

  // Final Place Order Submit
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const orderNum = "#DA-" + Math.floor(10000 + Math.random() * 90000);
      const email = document.getElementById("shipEmail")?.value || "collector@darkatelier.com";
      const firstName = document.getElementById("shipFirstName")?.value || "Guest";
      const lastName = document.getElementById("shipLastName")?.value || "Collector";
      const address = `${document.getElementById("shipAddress")?.value || ""}, ${document.getElementById("shipCity")?.value || ""}, ${document.getElementById("shipZip")?.value || ""}`;

      const confirmedOrderId = document.getElementById("confirmedOrderId");
      const confirmedCustomerEmail = document.getElementById("confirmedCustomerEmail");
      if (confirmedOrderId) confirmedOrderId.textContent = orderNum;
      if (confirmedCustomerEmail) confirmedCustomerEmail.textContent = email;

      // Close checkout modal, open success
      closeModal(document.getElementById("checkoutModal"));
      openModal(orderSuccessModal);

      // Trigger celebratory confetti effect
      createConfetti();

      // Asynchronously attempt to sync order to SQL database API (port 8001 or current host)
      const subtotalUSD = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      let discountUSD = 0;
      if (state.activePromo === "DARK20") discountUSD = subtotalUSD * 0.20;
      else if (state.activePromo === "DROP10") discountUSD = Math.min(subtotalUSD, 10.0);
      const shippingUSD = subtotalUSD >= 100 ? 0.0 : 12.0;
      const totalDue = Math.max(0, subtotalUSD - discountUSD + shippingUSD);

      const orderPayload = {
        orderNumber: orderNum,
        email: email,
        firstName: firstName,
        lastName: lastName,
        address: address,
        subtotal: subtotalUSD,
        discount: discountUSD,
        shipping: shippingUSD,
        total: totalDue,
        paymentMethod: "card",
        items: state.cart
      };

      // Try port 8001 (Atelier API Server) and current host
      fetch("http://localhost:8001/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload)
      }).then(res => res.json()).then(data => {
        if (data && data.success) {
          console.log("[DB] Order synchronized with SQLite database:", data.orderNumber);
        }
      }).catch(() => {
        // Standalone offline mode - order stored in local session
      });

      // Empty cart
      state.cart = [];
      saveCart();
      updateCartUI();
      showToast("Order placed & confirmed!", "success");
    });
  }

  if (continueShoppingBtn) {
    continueShoppingBtn.addEventListener("click", () => {
      closeModal(orderSuccessModal);
      location.href = "#catalogSection";
    });
  }
}

function openModal(modal) {
  if (!modal) return;
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

function initSearch() {
  const toggleBtn = document.getElementById("searchToggleBtn");
  const drawer = document.getElementById("searchDrawer");
  const input = document.getElementById("headerSearchInput");
  const clearBtn = document.getElementById("clearSearchBtn");

  if (toggleBtn && drawer && input) {
    toggleBtn.addEventListener("click", () => {
      drawer.classList.toggle("open");
      if (drawer.classList.contains("open")) {
        input.focus();
      }
    });
  }

  if (input) {
    input.addEventListener("input", (e) => {
      state.searchQuery = e.target.value;
      renderProductGrid();
    });
  }

  if (clearBtn && input) {
    clearBtn.addEventListener("click", () => {
      input.value = "";
      state.searchQuery = "";
      renderProductGrid();
    });
  }
}

function initFAQ() {
  const headers = document.querySelectorAll(".accordion-header");
  headers.forEach(header => {
    header.addEventListener("click", () => {
      const isExpanded = header.getAttribute("aria-expanded") === "true";
      const content = header.nextElementSibling;

      // Close other accordions
      headers.forEach(h => {
        h.setAttribute("aria-expanded", "false");
        if (h.nextElementSibling) h.nextElementSibling.classList.remove("open");
      });

      if (!isExpanded && content) {
        header.setAttribute("aria-expanded", "true");
        content.classList.add("open");
      }
    });
  });
}

function initNewsletter() {
  const form = document.getElementById("newsletterForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("newsletterEmail").value;
      form.reset();
      showToast("VIP Access granted! Check your inbox for secret code.", "success");
    });
  }
}

function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  
  const icon = type === "success" ? "✓" : type === "error" ? "✕" : "✦";
  toast.innerHTML = `
    <span style="font-weight:bold;">${icon}</span>
    <span class="toast-msg">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function createConfetti() {
  const container = document.getElementById("confettiContainer");
  if (!container) return;

  container.innerHTML = "";
  const colors = ["#8b5cf6", "#06b6d4", "#22c55e", "#ffffff", "#a855f7"];
  
  for (let i = 0; i < 40; i++) {
    const particle = document.createElement("div");
    particle.style.position = "absolute";
    particle.style.width = Math.random() * 8 + 4 + "px";
    particle.style.height = Math.random() * 8 + 4 + "px";
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    particle.style.top = "50%";
    particle.style.left = "50%";
    particle.style.borderRadius = "2px";
    particle.style.pointerEvents = "none";
    particle.style.zIndex = "10";
    
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 200 + 80;
    const destX = Math.cos(angle) * velocity;
    const destY = Math.sin(angle) * velocity;
    
    container.appendChild(particle);
    
    particle.animate([
      { transform: "translate(0, 0) scale(1)", opacity: 1 },
      { transform: `translate(${destX}px, ${destY}px) rotate(${Math.random() * 720}deg) scale(0)`, opacity: 0 }
    ], {
      duration: 1200 + Math.random() * 600,
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      fill: "forwards"
    });
  }
}
