// Enhanced form validation for username or email

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const identifierInput = document.getElementById("identifier");
    const passwordInput = document.getElementById("password");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const identifier = identifierInput.value.trim();
        const password = passwordInput.value.trim();

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
            window.location.href = "dashboard.html"; // Optional redirect
        }, 1500);
    });
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