export {};

/**
 * Initializes the Winner screen by loading the winner name
 * from sessionStorage, applying the correct theme class,
 * and updating the UI accordingly.
 */
function initWinner(): void {
    const winner = sessionStorage.getItem("winner") || "Draw";
    const winnerText = document.getElementById("winner-text");

    // Apply theme from settings
    const settingsData = sessionStorage.getItem("gameSettings");
    if (settingsData) {
        const settings = JSON.parse(settingsData);
        document.body.classList.add(`theme--${settings.theme}`);
    }

    if (winnerText) {
        if (winner === "Blue") {
            winnerText.textContent = "Blue Wins!";
            winnerText.classList.add("winner--blue");
        } else if (winner === "Orange") {
            winnerText.textContent = "Orange Wins!";
            winnerText.classList.add("winner--orange");
        } else {
            winnerText.textContent = "It's a Draw!";
        }
    }
}

// Run when DOM is ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWinner);
} else {
    initWinner();
}
