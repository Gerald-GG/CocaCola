document.addEventListener("DOMContentLoaded", () => {

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
       TOGGLE PROJECT VISIBILITY
    ========================= */
    window.toggleProjects = (levelId) => {
        document.querySelectorAll(".projects-list").forEach(list => {
            if (list.id !== levelId) list.style.display = "none";
        });

        const target = document.getElementById(levelId);
        target.style.display = target.style.display === "block" ? "none" : "block";

        currentLevelDisplay.textContent = levelMap[levelId];
    };

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
       EVENT LISTENERS
    ========================= */
    document.querySelectorAll("input[type='checkbox']").forEach(cb => {
        cb.addEventListener("change", updateProgress);
    });

    /* =========================
       LOGOUT
    ========================= */
    window.logout = () => {
        alert("Logged out successfully");
        window.location.href = "index.html";
    };

    updateProgress();
});
