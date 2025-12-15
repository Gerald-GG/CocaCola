// script.js

document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       LOGIN FORM VALIDATION
    ========================== */
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const identifier = document.getElementById("identifier").value.trim();
            const password = document.getElementById("password").value.trim();

            if (identifier === "" || password === "") {
                alert("Please enter your username/email and password.");
                return;
            }

            // Simulated authentication (replace with backend later)
            alert("Login successful!");
            window.location.href = "dashboard.html";
        });
    }

    /* =========================
       REGISTRATION FORM
    ========================== */
    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const fullName = document.getElementById("fullName").value.trim();
            const email = document.getElementById("regEmail").value.trim();
            const password = document.getElementById("regPassword").value.trim();
            const confirmPassword = document.getElementById("confirmPassword").value.trim();

            if (!fullName || !email || !password || !confirmPassword) {
                alert("All fields are required.");
                return;
            }

            if (password !== confirmPassword) {
                alert("Passwords do not match.");
                return;
            }

            alert("Registration successful! You can now log in.");
            window.location.href = "index.html";
        });
    }
});

/* =========================
   DASHBOARD FUNCTIONS
========================= */

// Toggle roadmap project lists
function toggleProjects(levelId) {
    const section = document.getElementById(levelId);
    if (section) {
        section.style.display =
            section.style.display === "block" ? "none" : "block";
    }
}

// Logout function
function logout() {
    alert("You have been logged out.");
    window.location.href = "index.html";
}
