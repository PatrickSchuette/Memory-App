export {};

/**
 * Applies the theme stored in sessionStorage.
 */
function applyTheme(): void {
    const data = sessionStorage.getItem("gameSettings");
    if (!data) return;
    const settings = JSON.parse(data);
    document.body.classList.add(`theme--${settings.theme}`);
}

/**
 * Updates the winner text and styling.
 */
function updateWinnerText(): void {
    const winner = sessionStorage.getItem("winner") || "Draw";
    const el = document.getElementById("winner-text");
    if (!el) return;
    if (winner === "Blue") {
        el.textContent = "Blue Wins!";
        el.classList.add("winner--blue");
    } else if (winner === "Orange") {
        el.textContent = "Orange Wins!";
        el.classList.add("winner--orange");
    } else {
        el.textContent = "It's a Draw!";
    }
}

/**
 * Private initializer for the winner page.
 */
function initWinner(): void {
    applyTheme();
    updateWinnerText();
}

/**
 * Public entry point for the winner page.
 */
export function startWinner(): void {
    initWinner();
}
