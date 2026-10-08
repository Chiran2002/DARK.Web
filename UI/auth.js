/**
 * THE DARK // NEW AUTHENTICATION CONTROLLER
 * Handles dual-column login and registration without relying on past codebase patterns.
 */

(function initNewAuth() {
    const loginForm = document.getElementById('newLoginForm');
    const registerForm = document.getElementById('newRegisterForm');
    
    // Notification System
    function showAuthToast(msg, type = 'info') {
        const container = document.getElementById('authToastContainer');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `auth-toast ${type}`;
        toast.textContent = msg;
        
        container.appendChild(toast);
        
        // Trigger reflow for animation
        void toast.offsetWidth;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }
    
    // API Endpoint for future connection
    const API_ENDPOINT = 'http://localhost:8001/api';

    // Log In Handler
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const pwd = document.getElementById('loginPassword').value;
            const btn = document.getElementById('loginSubmitBtn');
            
            if (!email || !pwd) {
                showAuthToast('Email and Password are required.', 'error');
                return;
            }
            
            btn.textContent = 'VERIFYING...';
            btn.disabled = true;
            
            try {
                const response = await fetch(`${API_ENDPOINT}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password: pwd })
                });
                
                const json = await response.json();
                if (json.success) {
                    showAuthToast('Access Granted.', 'success');
                    localStorage.setItem('dark_currentUser', JSON.stringify(json.user));
                    localStorage.setItem('dark_token', json.token);
                    setTimeout(() => window.location.href = 'index.html', 100);
                } else {
                    showAuthToast(json.error || 'Invalid credentials.', 'error');
                }
            } catch (err) {
                // Offline fallback handling
                showAuthToast('Offline Mode: Access Granted.', 'success');
                localStorage.setItem('dark_currentUser', JSON.stringify({
                    id: Math.floor(Math.random() * 1000), 
                    firstName: 'Collector', 
                    lastName: '', 
                    email: email, 
                    isVip: true
                }));
                setTimeout(() => window.location.href = 'index.html', 100);
            } finally {
                btn.textContent = 'LOG IN';
                btn.disabled = false;
            }
        });
    }

    // Registration Handler
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fName = document.getElementById('regFirstName').value;
            const lName = document.getElementById('regLastName').value;
            const email = document.getElementById('regEmail').value;
            const pwd = document.getElementById('regPassword').value;
            const btn = document.getElementById('registerSubmitBtn');
            
            btn.textContent = 'PRODUCING...';
            btn.disabled = true;
            
            try {
                const response = await fetch(`${API_ENDPOINT}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ firstName: fName, lastName: lName, email, password: pwd, isVip: true })
                });
                
                const json = await response.json();
                if (json.success) {
                    showAuthToast('Identity Registered.', 'success');
                    localStorage.setItem('dark_currentUser', JSON.stringify(json.user));
                    localStorage.setItem('dark_token', json.token);
                    setTimeout(() => window.location.href = 'index.html', 100);
                } else {
                    showAuthToast(json.error || 'Registration failed.', 'error');
                }
            } catch (err) {
                // Offline fallback handling
                showAuthToast('Offline Mode: Identity Created.', 'success');
                localStorage.setItem('dark_currentUser', JSON.stringify({
                    id: Math.floor(Math.random() * 1000), 
                    firstName: fName, 
                    lastName: lName, 
                    email: email, 
                    isVip: true
                }));
                setTimeout(() => window.location.href = 'index.html', 100);
            } finally {
                btn.textContent = 'CREATE ACCOUNT';
                btn.disabled = false;
            }
        });
    }
})();
