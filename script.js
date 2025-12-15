document.addEventListener("DOMContentLoaded", () => {

    const STORAGE_KEY = "cyber_dashboard_progress";

    const levelMap = {
        level1: "Foundations",
        level2: "Intermediate",
        level3: "Advanced",
        level4: "Expert"
    };

    const completedDisplay = document.getElementById("completedCount");
    const skillDisplay = document.querySelector(".stat-card:nth-child(3) p");
    const currentLevelDisplay = document.querySelector(".stat-card:nth-child(2) p");

    /* =========================
       LOAD SAVED DATA
    ========================= */
    const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
        checked: {},
        currentLevel: null
    };

    /* =========================
       TOGGLE PROJECTS
    ========================= */
    window.toggleProjects = (levelId) => {
        document.querySelectorAll(".projects-list").forEach(list => {
            list.style.display = "none";
        });

        const target = document.getElementById(levelId);
        target.style.display = "block";

        currentLevelDisplay.textContent = levelMap[levelId];
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
       UPDATE PROGRESS
    ========================= */
    function updateProgress() {
        let totalCompleted = 0;

        document.querySelectorAll(".level-card").forEach(card => {
            const checkboxes = card.querySelectorAll("input[type='checkbox']");
            const progressBar = card.querySelector(".progress");
            const progressText = card.querySelector("p");

            if (!checkboxes.length) return;

            const completed = [...checkboxes].filter(cb => cb.checked).length;
            const total = checkboxes.length;
            const percent = Math.round((completed / total) * 100);

            progressBar.style.width = percent + "%";
            progressText.textContent = `Progress: ${completed} / ${total} projects`;

            totalCompleted += completed;
        });

        completedDisplay.textContent = `${totalCompleted} projects completed`;
        skillDisplay.textContent = totalCompleted;
    }

    /* =========================
       RESTORE CHECKBOX STATE
    ========================= */
    document.querySelectorAll("input[type='checkbox']").forEach(cb => {
        const id = cb.parentElement.textContent.trim();

        if (savedData.checked[id]) {
            cb.checked = true;
        }

        cb.addEventListener("change", () => {
            savedData.checked[id] = cb.checked;
            saveData();
            updateProgress();
        });
    });

    /* =========================
       RESTORE CURRENT LEVEL
    ========================= */
    if (savedData.currentLevel) {
        toggleProjects(savedData.currentLevel);
    }

    /* =========================
       LOGOUT
    ========================= */
    window.logout = () => {
        localStorage.removeItem(STORAGE_KEY);
        window.location.href = "index.html";
    };

    updateProgress();
});
