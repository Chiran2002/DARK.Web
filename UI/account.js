const API_BASE = "http://localhost:8001/api";

document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("dark_currentUser");
  const token = localStorage.getItem("dark_token");
  if (!user || !token) {
    window.location.href = "index.html";
    return;
  }
  fetchAccountData(token);
});

function switchAccountTab(tabId, event) {
  document.querySelectorAll(".account-panel").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".account-nav-btn").forEach(b => b.classList.remove("active"));
  document.getElementById(`panel-${tabId}`).classList.add("active");
  if (event && event.target) {
    event.target.classList.add("active");
  }
}

async function fetchAccountData(token) {
  try {
    const res = await fetch(`${API_BASE}/account/details`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) {
      document.getElementById("profileName").textContent = `${data.user.first_name} ${data.user.last_name}`;
      document.getElementById("profileEmail").textContent = data.user.email;
      document.getElementById("profileStatus").textContent = data.user.is_vip_member ? "VIP Member" : "Standard";

      const hBody = document.getElementById("historyBody");
      if (data.orders.length === 0) {
        hBody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#666;">No orders found</td></tr>`;
      } else {
        hBody.innerHTML = data.orders.map(o => `
          <tr>
            <td><strong>${o.order_number}</strong></td>
            <td>${o.created_at.split(' ')[0]}</td>
            <td style="color:var(--accent-cyan);">${o.order_status}</td>
            <td style="font-family:var(--font-mono);">Rs ${(o.total_amount * 305).toFixed(2)}</td>
          </tr>
        `).join("");
      }

      const cList = document.getElementById("cardsList");
      if (data.cards.length === 0) {
        cList.innerHTML = `<div style="color:#666;">No cards saved</div>`;
      } else {
        cList.innerHTML = data.cards.map(c => `
          <div class="card-item">
            <div>
              <div style="font-family:var(--font-mono); font-size:14px; margin-bottom:4px;">•••• •••• •••• ${c.last4}</div>
              <div style="font-size:11px; color:#888;">${c.cardholder_name} | Expires ${c.expiry}</div>
            </div>
            <div style="font-family:var(--font-display); font-size:18px;">${c.brand}</div>
          </div>
        `).join("");
      }
    } else {
      localStorage.removeItem("dark_currentUser");
      window.location.href = "index.html";
    }
  } catch (e) {
    console.error(e);
  }
}

async function addCard() {
  const token = localStorage.getItem("dark_token");
  const name = document.getElementById("cardName").value;
  const last4 = document.getElementById("cardLast4").value;
  const expiry = document.getElementById("cardExpiry").value;
  if (!name || last4.length !== 4 || !expiry) {
    showToast("Please fill all fields correctly", "error");
    return;
  }
  try {
    const res = await fetch(`${API_BASE}/account/card`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ cardholder_name: name, last4, expiry })
    });
    const data = await res.json();
    if (data.success) {
      showToast(data.message, "success");
      document.getElementById("cardName").value = "";
      document.getElementById("cardLast4").value = "";
      document.getElementById("cardExpiry").value = "";
      fetchAccountData(token);
    } else {
      showToast(data.error || "Failed", "error");
    }
  } catch (e) {
    console.error(e);
  }
}

async function changePassword() {
  const token = localStorage.getItem("dark_token");
  const oldPass = document.getElementById("oldPass").value;
  const newPass = document.getElementById("newPass").value;
  if (!oldPass || !newPass) return;
  
  try {
    const res = await fetch(`${API_BASE}/account/password`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword: oldPass, newPassword: newPass })
    });
    const data = await res.json();
    if (data.success) {
      showToast(data.message, "success");
      document.getElementById("oldPass").value = "";
      document.getElementById("newPass").value = "";
    } else {
      showToast(data.error || "Failed", "error");
    }
  } catch (e) {
    console.error(e);
  }
}

function logout() {
  localStorage.removeItem("dark_currentUser");
  localStorage.removeItem("dark_token");
  window.location.href = "index.html";
}

function showToast(msg, type="info") {
  const c = document.getElementById("toastContainer");
  if(!c) return;
  const t = document.createElement("div");
  t.className = `toast ${type}`;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(()=> t.remove(), 3000);
}
