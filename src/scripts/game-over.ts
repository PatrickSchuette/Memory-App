export {};
    const blue = document.getElementById("blue-final");
    const orange = document.getElementById("orange-final");

    const blueScore = sessionStorage.getItem("blueScore") || "0";
    const orangeScore = sessionStorage.getItem("orangeScore") || "0";

    /**
     * Initializes the Game Over screen by loading the final scores,
     * applying the correct theme, and preparing the redirect.
     */
    function initGameOver(): void {
    
        // Apply theme from sessionStorage
        const settingsData = sessionStorage.getItem("gameSettings");
        if (settingsData) {
            const settings = JSON.parse(settingsData);
            document.body.classList.add(`theme--${settings.theme}`);
        }
    
        if (blue) blue.textContent = blueScore;
        if (orange) orange.textContent = orangeScore;
    
        setTimeout(() => {
            window.location.href = "./winner.html";
        }, 1500);
    }
    
    initGameOver();