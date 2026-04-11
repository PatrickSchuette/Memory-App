import "./styles/style.scss";

/**
 * Loads and initializes the correct page module based on the data-page attribute.
 */
function loadPageScript(): void {
    const page = document.body.dataset.page;

    if (page === "settings") {
        import("./scripts/settings").then(module => module.startSettings());
        return;
    }

    if (page === "game") {
        import("./scripts/game").then(module => module.startGame());
        return;
    }

    if (page === "game-over") {
        import("./scripts/game-over").then(module => module.startGameOver());
        return;
    }

    if (page === "winner") {
        import("./scripts/winner").then(module => module.startWinner());
    }
}

/**
 * Initializes the application after DOM is ready.
 */
function initApp(): void {
    loadPageScript();
}

document.addEventListener("DOMContentLoaded", initApp);
