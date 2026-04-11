export {};

const WinnerScreen = {
    /**
     * Initializes the winner screen.
     */
    init(): void {
        this.applyTheme();
        this.updateWinnerText();
    },

    /**
     * Applies the theme stored in sessionStorage.
     */
    applyTheme(): void {
        const data = sessionStorage.getItem("gameSettings");
        if (!data) return;

        const settings = JSON.parse(data);
        document.body.classList.add(`theme--${settings.theme}`);
    },

    /**
     * Updates the winner text and styling.
     */
    updateWinnerText(): void {
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
};

document.addEventListener("DOMContentLoaded", () => WinnerScreen.init());
