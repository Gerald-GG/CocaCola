// Enhanced form validation for login and registration (works on both pages)

document.addEventListener("DOMContentLoaded", () => {
    // Login Form Handling (only on index.html)
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const identifier = document.getElementById("identifier").value.trim();
            const password = document.getElementById("password").value.trim();

            // Basic checks
            if (identifier === "" || password === "") {
                showMessage("Please fill in all fields.");
                return;
            }

            // Email format check only if identifier contains '@'
            if (identifier.includes("@")) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(identifier)) {
                    showMessage("Please enter a valid email address.");
                    return;
                }
            }

            // Password length
            if (password.length < 6) {
                showMessage("Password must be at least 6 characters long.");
                return;
            }

            // Success message
            showMessage("Login successful! Redirecting...", true);
            setTimeout(() => {
                window.location.href = "dashboard.html"; // Redirect to dashboard
            }, 1500);
        });
    }

    // Registration Form Handling (only on register.html)
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const fullName = document.getElementById("fullName").value.trim();
            const email = document.getElementById("regEmail").value.trim();
            const password = document.getElementById("regPassword").value.trim();
            const confirmPassword = document.getElementById("confirmPassword").value.trim();

            // Basic checks
            if (fullName === "" || email === "" || password === "" || confirmPassword === "") {
                showMessage("Please fill in all fields.");
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showMessage("Please enter a valid email address.");
                return;
            }

            // Password length
            if (password.length < 6) {
                showMessage("Password must be at least 6 characters long.");
                return;
            }

            // Password confirmation
            if (password !== confirmPassword) {
                showMessage("Passwords do not match.");
                return;
            }

            // Success message (in a real app, send data to server)
            showMessage("Registration successful! Redirecting to dashboard...", true);
            setTimeout(() => {
                window.location.href = "dashboard.html"; // Direct redirect to dashboard
            }, 1500);
        });
    }
});

// Floating message function
function showMessage(message, success = false) {
    const msgBox = document.createElement("div");
    msgBox.className = `message-box ${success ? "success" : "error"}`;
    msgBox.textContent = message;

    document.body.appendChild(msgBox);

    setTimeout(() => {
        msgBox.classList.add("show");
    }, 100);

    setTimeout(() => {
        msgBox.classList.remove("show");
        setTimeout(() => msgBox.remove(), 300);
    }, 2500);
}