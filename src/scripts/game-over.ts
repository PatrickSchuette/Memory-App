export {};

/**
 * Loads the final scores from sessionStorage.
 */
function loadScores(): { blue: string; orange: string } {
    return {
        blue: sessionStorage.getItem("blueScore") || "0",
        orange: sessionStorage.getItem("orangeScore") || "0"
    };
}

/**
 * Applies the saved theme to the document body.
 */
function applyTheme(): void {
    const data = sessionStorage.getItem("gameSettings");
    if (!data) return;
    const settings = JSON.parse(data);
    document.body.classList.add(`theme--${settings.theme}`);
}

/**
 * Initializes the Game Over screen.
 */
function initGameOver(): void {
    applyTheme();
    const { blue, orange } = loadScores();

    const blueEl = document.getElementById("blue-final");
    const orangeEl = document.getElementById("orange-final");

    if (blueEl) blueEl.textContent = blue;
    if (orangeEl) orangeEl.textContent = orange;

    setTimeout(() => {
        window.location.href = "./winner.html";
    }, 1500);
}

/**
 * Public entry point for the Game Over page.
 */
export function startGameOver(): void {
    initGameOver();
}
