// ============================================================================
// AUTHENTICATION & PAGE REDIRECTION LOGIC
// ============================================================================

// Check which page we're on and handle authentication
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

// Handle Login Page
if (currentPage === 'index.html' || currentPage === '') {
    document.addEventListener('DOMContentLoaded', function() {
        const loginForm = document.getElementById('loginForm');
        
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const identifier = document.getElementById('identifier')?.value;
                const password = document.getElementById('password')?.value;
                
                // Basic validation
                if (!identifier || !password) {
                    alert('Please enter both username/email and password');
                    return;
                }
                
                // For demo: Accept any credentials (in real app, verify against database)
                // Save login state
                localStorage.setItem('userLoggedIn', 'true');
                localStorage.setItem('userIdentifier', identifier);
                
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            });
        }
        
        // Check if user is already logged in
        if (localStorage.getItem('userLoggedIn') === 'true') {
            window.location.href = 'dashboard.html';
        }
    });
}

// Handle Register Page
else if (currentPage === 'register.html') {
    document.addEventListener('DOMContentLoaded', function() {
        const registerForm = document.getElementById('registerForm');
        
        if (registerForm) {
            registerForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const username = document.getElementById('registerUsername')?.value;
                const email = document.getElementById('registerEmail')?.value;
                const password = document.getElementById('registerPassword')?.value;
                const confirmPassword = document.getElementById('confirmPassword')?.value;
                
                // Validation
                if (!username || !email || !password || !confirmPassword) {
                    alert('Please fill in all fields');
                    return;
                }
                
                if (password !== confirmPassword) {
                    alert('Passwords do not match');
                    return;
                }
                
                if (password.length < 6) {
                    alert('Password must be at least 6 characters');
                    return;
                }
                
                // Save user data
                const users = JSON.parse(localStorage.getItem('cyberUsers') || '[]');
                
                // Check if user already exists
                const userExists = users.some(user => user.email === email || user.username === username);
                if (userExists) {
                    alert('User with this email or username already exists');
                    return;
                }
                
                // Add new user
                users.push({
                    username,
                    email,
                    password, // Note: In production, you should hash passwords!
                    joined: new Date().toISOString(),
                    progress: {
                        completedProjects: 0,
                        unlockedLevels: ['level1'],
                        currentLevel: 'level1'
                    }
                });
                
                localStorage.setItem('cyberUsers', JSON.stringify(users));
                
                // Auto-login after registration
                localStorage.setItem('userLoggedIn', 'true');
                localStorage.setItem('userIdentifier', username);
                
                // Initialize progress for new user
                localStorage.setItem('cyber_dashboard_progress', JSON.stringify({
                    checked: {},
                    currentLevel: "level1",
                    unlockedLevels: ["level1"]
                }));
                
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            });
        }
        
        // Check if user is already logged in
        if (localStorage.getItem('userLoggedIn') === 'true') {
            window.location.href = 'dashboard.html';
        }
    });
}

// Handle Dashboard Page
else if (currentPage === 'dashboard.html') {
    // Authentication check - runs before DOMContentLoaded
    (function checkAuth() {
        const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
        const hasProgress = localStorage.getItem('cyber_dashboard_progress');
        
        // Allow access if:
        // 1. User is logged in, OR
        // 2. User has existing progress (returning user without explicit login)
        if (!isLoggedIn && !hasProgress) {
            // No session and no progress - redirect to login
            window.location.href = 'index.html';
            return false;
        }
        
        // If user has progress but wasn't logged in, create a session
        if (!isLoggedIn && hasProgress) {
            localStorage.setItem('userLoggedIn', 'true');
            localStorage.setItem('userIdentifier', 'Returning User');
        }
        
        return true;
    })();
    
    // ============================================================================
    // DASHBOARD FUNCTIONALITY (ORIGINAL CODE)
    // ============================================================================
    
    document.addEventListener("DOMContentLoaded", () => {
        const STORAGE_KEY = "cyber_dashboard_progress";
        const UNLOCK_THRESHOLD = 70; // Minimum percentage to unlock next level

        // Enhanced level map with unlock relationships
        const levelMap = {
            level1: { name: "Foundations", unlocks: "level2" },
            level2: { name: "Intermediate", unlocks: "level3" },
            level3: { name: "Advanced", unlocks: "level4" },
            level4: { name: "Expert", unlocks: null }
        };

        const completedDisplay = document.getElementById("completedCount");
        const skillDisplay = document.querySelector(".stat-card:nth-child(3) p");
        const currentLevelDisplay = document.querySelector(".stat-card:nth-child(2) p");

        /* =========================
           LOAD SAVED DATA
        ========================= */
        const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
            checked: {},
            currentLevel: "level1",
            unlockedLevels: ["level1"] // Always start with level 1 unlocked
        };

        /* =========================
           ENHANCED TOGGLE PROJECTS WITH LEVEL LOCKING
        ========================= */
        window.toggleProjects = (levelId) => {
            // Check if level is unlocked
            if (!savedData.unlockedLevels.includes(levelId)) {
                const currentLevelName = levelMap[savedData.currentLevel]?.name || "the current level";
                const targetLevelName = levelMap[levelId]?.name || "this level";
                alert(`🔒 Complete ${UNLOCK_THRESHOLD}% of ${currentLevelName} to unlock ${targetLevelName}`);
                return;
            }

            document.querySelectorAll(".projects-list").forEach(list => {
                list.style.display = "none";
            });

            const target = document.getElementById(levelId);
            if (target) {
                target.style.display = "block";
            }

            // Update active level styling
            document.querySelectorAll(".level-card").forEach(card => {
                card.classList.remove("active-level");
            });
            
            const levelCard = document.querySelector(`[onclick="toggleProjects('${levelId}')"]`);
            if (levelCard) {
                levelCard.classList.add("active-level");
            }

            currentLevelDisplay.textContent = levelMap[levelId].name;
            savedData.currentLevel = levelId;
            saveData();
        };

        /* =========================
           SAVE DATA
        ========================= */
        function saveData() {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(savedData));
        }

        /* =========================
           CALCULATE LEVEL PROGRESS
        ========================= */
        function calculateLevelProgress(levelId) {
            const card = document.querySelector(`#${levelId}`);
            if (!card) return 0;
            
            const checkboxes = card.querySelectorAll("input[type='checkbox']");
            if (!checkboxes.length) return 0;
            
            const completed = [...checkboxes].filter(cb => cb.checked).length;
            const total = checkboxes.length;
            return Math.round((completed / total) * 100);
        }

        /* =========================
           ENHANCED UPDATE PROGRESS WITH UNLOCK SYSTEM
        ========================= */
        function updateProgress() {
            let totalCompleted = 0;
            const newlyUnlocked = [];

            document.querySelectorAll(".level-card").forEach(card => {
                const checkboxes = card.querySelectorAll("input[type='checkbox']");
                const progressBar = card.querySelector(".progress");
                const progressText = card.querySelector("p");

                if (!checkboxes.length) return;

                const completed = [...checkboxes].filter(cb => cb.checked).length;
                const total = checkboxes.length;
                const percent = Math.round((completed / total) * 100);

                progressBar.style.width = percent + "%";
                progressText.textContent = `Progress: ${completed} / ${total} projects (${percent}%)`;

                // Find level ID from card's onclick attribute
                const onclick = card.getAttribute("onclick");
                const levelId = onclick ? onclick.match(/toggleProjects\('(level\d+)'\)/)?.[1] : null;
                
                if (levelId && levelMap[levelId]) {
                    // Add or update unlock status indicator
                    let unlockText = card.querySelector(".unlock-status");
                    if (!unlockText) {
                        unlockText = document.createElement("div");
                        unlockText.className = "unlock-status";
                        card.appendChild(unlockText);
                    }
                    
                    // Check if this level unlocks the next one
                    if (levelMap[levelId].unlocks && percent >= UNLOCK_THRESHOLD) {
                        const nextLevel = levelMap[levelId].unlocks;
                        if (!savedData.unlockedLevels.includes(nextLevel)) {
                            savedData.unlockedLevels.push(nextLevel);
                            newlyUnlocked.push(nextLevel);
                        }
                        unlockText.textContent = `✅ Unlocks: ${levelMap[nextLevel].name}`;
                        unlockText.style.color = "#4ade80";
                        unlockText.style.fontSize = "0.85rem";
                        unlockText.style.marginTop = "8px";
                        unlockText.style.fontWeight = "500";
                    } else if (levelMap[levelId].unlocks) {
                        unlockText.textContent = `🔒 ${UNLOCK_THRESHOLD}% required to unlock ${levelMap[levelMap[levelId].unlocks].name}`;
                        unlockText.style.color = "#94a3b8";
                        unlockText.style.fontSize = "0.85rem";
                        unlockText.style.marginTop = "8px";
                        unlockText.style.fontWeight = "500";
                    } else if (!levelMap[levelId].unlocks) {
                        unlockText.textContent = "🏁 Final Level";
                        unlockText.style.color = "#f59e0b";
                        unlockText.style.fontSize = "0.85rem";
                        unlockText.style.marginTop = "8px";
                        unlockText.style.fontWeight = "500";
                    }
                    
                    // Update card appearance based on lock status
                    if (!savedData.unlockedLevels.includes(levelId) && levelId !== "level1") {
                        card.style.opacity = "0.7";
                        card.style.position = "relative";
                        card.style.cursor = "not-allowed";
                        
                        // Add lock overlay if not present
                        if (!card.querySelector(".lock-overlay")) {
                            const lockOverlay = document.createElement("div");
                            lockOverlay.className = "lock-overlay";
                            lockOverlay.innerHTML = "🔒";
                            lockOverlay.style.cssText = `
                                position: absolute;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                                font-size: 2rem;
                                z-index: 2;
                                opacity: 0.5;
                            `;
                            card.appendChild(lockOverlay);
                        }
                    } else {
                        card.style.opacity = "1";
                        card.style.cursor = "pointer";
                        const lockOverlay = card.querySelector(".lock-overlay");
                        if (lockOverlay) {
                            lockOverlay.remove();
                        }
                    }
                }

                totalCompleted += completed;
            });

            // Update global stats
            completedDisplay.textContent = `${totalCompleted} projects completed`;
            skillDisplay.textContent = totalCompleted;

            // Save updated unlocked levels
            saveData();

            // Show unlock notification
            if (newlyUnlocked.length > 0) {
                newlyUnlocked.forEach(unlockedId => {
                    showNotification(`🎉 Level Unlocked: ${levelMap[unlockedId].name}`);
                });
            }
        }

        /* =========================
           NOTIFICATION SYSTEM
        ========================= */
        function showNotification(message) {
            // Remove existing notification
            const existing = document.querySelector(".notification");
            if (existing) existing.remove();

            // Create notification
            const notification = document.createElement("div");
            notification.className = "notification";
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.3);
                z-index: 1000;
                animation: slideIn 0.3s ease;
                font-weight: 500;
            `;

            document.body.appendChild(notification);

            // Auto-remove after 4 seconds
            setTimeout(() => {
                notification.style.animation = "slideOut 0.3s ease";
                setTimeout(() => notification.remove(), 300);
            }, 4000);
        }

        /* =========================
           RESTORE CHECKBOX STATE (Modified to trigger unlocks)
        ========================= */
        document.querySelectorAll("input[type='checkbox']").forEach(cb => {
            // Use a more robust way to identify checkbox
            const projectItem = cb.closest('.project-item') || cb.parentElement;
            const id = projectItem.textContent.trim() || 
                       cb.id || 
                       cb.name || 
                       `project_${Math.random().toString(36).substr(2, 9)}`;

            if (savedData.checked[id]) {
                cb.checked = true;
            }

            cb.addEventListener("change", () => {
                savedData.checked[id] = cb.checked;
                saveData();
                updateProgress(); // Now includes unlock checks
            });
        });

        /* =========================
           RESTORE CURRENT LEVEL & INITIALIZE UI
        ========================= */
        function initializeUI() {
            // Add CSS for animations and styling
            const style = document.createElement("style");
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
                .level-card.active-level {
                    background: rgba(99, 102, 241, 0.1);
                    border-left: 4px solid #6366f1;
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                }
                .level-card {
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }
            `;
            document.head.appendChild(style);

            // Apply initial lock state to cards
            document.querySelectorAll(".level-card").forEach(card => {
                const onclick = card.getAttribute("onclick");
                const levelId = onclick ? onclick.match(/toggleProjects\('(level\d+)'\)/)?.[1] : null;
                
                if (levelId && !savedData.unlockedLevels.includes(levelId) && levelId !== "level1") {
                    card.style.opacity = "0.7";
                    card.style.position = "relative";
                    card.style.cursor = "not-allowed";
                    
                    // Add lock overlay
                    const lockOverlay = document.createElement("div");
                    lockOverlay.className = "lock-overlay";
                    lockOverlay.innerHTML = "🔒";
                    lockOverlay.style.cssText = `
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        font-size: 2rem;
                        z-index: 2;
                        opacity: 0.5;
                    `;
                    card.appendChild(lockOverlay);
                }
            });

            // Restore current level display
            if (savedData.currentLevel && savedData.unlockedLevels.includes(savedData.currentLevel)) {
                toggleProjects(savedData.currentLevel);
            } else if (savedData.unlockedLevels.length > 0) {
                // Default to first unlocked level
                toggleProjects(savedData.unlockedLevels[0]);
            }
        }

        /* =========================
           RESET PROGRESS (Optional - for testing)
        ========================= */
        window.resetProgress = () => {
            if (confirm("Reset all progress? This will clear all completed projects and level unlocks.")) {
                localStorage.removeItem(STORAGE_KEY);
                location.reload();
            }
        };

        /* =========================
           ENHANCED LOGOUT FUNCTION
        ========================= */
        window.logout = () => {
            // Clear session
            localStorage.removeItem('userLoggedIn');
            localStorage.removeItem('userIdentifier');
            
            // Optional: Clear progress data too (comment out to keep progress)
            // localStorage.removeItem(STORAGE_KEY);
            // localStorage.removeItem('cyberUsers');
            
            // Redirect to login
            window.location.href = "index.html";
        };

        // Initialize the UI and update progress
        initializeUI();
        updateProgress();
    });
}

// Handle any other pages (404, etc.)
else {
    // If user is logged in but on wrong page, redirect to dashboard
    if (localStorage.getItem('userLoggedIn') === 'true') {
        window.location.href = 'dashboard.html';
    }
}