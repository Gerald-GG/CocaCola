// AUTHENTICATION FUNCTIONS - Add this to the top of your script.js

// Check if we're on the login page
if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
    // Login Page Logic
    document.addEventListener('DOMContentLoaded', function() {
        const loginForm = document.getElementById('loginForm');
        
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const identifier = document.getElementById('identifier').value;
                const password = document.getElementById('password').value;
                
                // Simple validation
                if (!identifier || !password) {
                    alert('Please enter both username/email and password');
                    return;
                }
                
                // For demo: Accept any non-empty credentials
                // Save login state
                localStorage.setItem('userLoggedIn', 'true');
                localStorage.setItem('userIdentifier', identifier);
                
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            });
        }
    });
} 
// Check if we're on the register page
else if (window.location.pathname.includes('register.html')) {
    // Register Page Logic
    document.addEventListener('DOMContentLoaded', function() {
        const registerForm = document.getElementById('registerForm');
        
        if (registerForm) {
            registerForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const username = document.getElementById('registerUsername').value;
                const email = document.getElementById('registerEmail').value;
                const password = document.getElementById('registerPassword').value;
                const confirmPassword = document.getElementById('confirmPassword').value;
                
                // Validation
                if (!username || !email || !password || !confirmPassword) {
                    alert('Please fill in all fields');
                    return;
                }
                
                if (password !== confirmPassword) {
                    alert('Passwords do not match');
                    return;
                }
                
                // Save user data
                const users = JSON.parse(localStorage.getItem('cyberUsers') || '[]');
                
                // Check if user exists
                const userExists = users.some(user => user.email === email || user.username === username);
                if (userExists) {
                    alert('Username or email already exists');
                    return;
                }
                
                // Add new user
                users.push({
                    username,
                    email,
                    password, // In real app, hash this!
                    joined: new Date().toISOString()
                });
                
                localStorage.setItem('cyberUsers', JSON.stringify(users));
                
                // Auto-login
                localStorage.setItem('userLoggedIn', 'true');
                localStorage.setItem('userIdentifier', username);
                
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            });
        }
    });
}
// Check if we're on the dashboard page
else if (window.location.pathname.includes('dashboard.html')) {
    // Dashboard Page Logic - Add auth check at the beginning
    (function checkAuth() {
        const isLoggedIn = localStorage.getItem('userLoggedIn');
        const hasProgress = localStorage.getItem('cyber_dashboard_progress');
        
        // Allow access if logged in OR has existing progress
        if (!isLoggedIn && !hasProgress) {
            // Redirect to login
            window.location.href = 'index.html';
            return false;
        }
        
        return true;
    })();
    
    // THEN YOUR EXISTING DASHBOARD CODE FOLLOWS...
    // ...all your existing dashboard JavaScript code goes here
}