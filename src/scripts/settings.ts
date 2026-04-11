export {};

interface GameSettings {
    theme: string | null;
    player: string | null;
    boardSize: number | null;
}

let settingsData: GameSettings = {
    theme: null,
    player: null,
    boardSize: null
};

const ui = {
    startButton: document.getElementById("button-start") as HTMLButtonElement | null,
    previewImage: document.querySelector<HTMLImageElement>(".settings__preview"),
    summaryList: document.querySelector(".settings__summary ul"),
    themeInputs: document.querySelectorAll<HTMLInputElement>('input[name="theme"]'),
    playerInputs: document.querySelectorAll<HTMLInputElement>('input[name="player"]'),
    boardInputs: document.querySelectorAll<HTMLInputElement>('input[name="board"]')
};

const themePreviewMap: Record<string, string> = {
    CodeVibesTheme: "./assets/themeIT.svg",
    GamingTheme: "./assets/themeGaming.svg",
    DAProjectsTheme: "./assets/themeDA.svg",
    FoodsTheme: "./assets/themeFood.svg"
};

const themeMap: Record<string, string> = {
    CodeVibesTheme: "it",
    GamingTheme: "game",
    DAProjectsTheme: "da",
    FoodsTheme: "food"
};

/**
 * Initializes the start button behavior.
 */
function initStartButton(): void {
    ui.startButton?.addEventListener("click", () => {
        saveSettings();
        window.location.href = "./game.html";
    });
}

/**
 * Saves the selected settings.
 */
function saveSettings(): void {
    if (!settingsData.theme || !settingsData.player || !settingsData.boardSize) return;
    const mappedTheme = themeMap[settingsData.theme];
    sessionStorage.setItem("gameSettings", JSON.stringify({ ...settingsData, theme: mappedTheme }));
}

/**
 * Initializes all settings input listeners.
 */
function initSettingsInputs(): void {
    ui.themeInputs.forEach(input => {
        input.addEventListener("change", () => {
            settingsData.theme = input.value;
            updateSummary();
            updateStartButtonState();
        });
    });

    ui.playerInputs.forEach(input => {
        input.addEventListener("change", () => {
            settingsData.player = input.value;
            updateSummary();
            updateStartButtonState();
        });
    });

    ui.boardInputs.forEach(input => {
        input.addEventListener("change", () => {
            settingsData.boardSize = Number(input.value);
            updateSummary();
            updateStartButtonState();
        });
    });

    updateSummary();
    initThemeHoverPreview();
}

/**
 * Enables or disables the start button.
 */
function updateStartButtonState(): void {
    const complete =
        settingsData.theme !== null &&
        settingsData.player !== null &&
        settingsData.boardSize !== null;

    if (ui.startButton) ui.startButton.disabled = !complete;
}

/**
 * Updates preview image and summary list.
 */
function updateSummary(): void {
    updatePreviewImage();
    updateSummaryList();
}

/**
 * Updates the theme preview image.
 */
function updatePreviewImage(): void {
    if (!ui.previewImage) return;
    if (!settingsData.theme) {
        ui.previewImage.src = "";
        return;
    }
    ui.previewImage.src = themePreviewMap[settingsData.theme];
}

/**
 * Updates the summary list.
 */
function updateSummaryList(): void {
    if (!ui.summaryList) return;

    const themeText = settingsData.theme
        ? settingsData.theme.replace(/([A-Z])/g, " $1").trim()
        : "Theme";

    const playerText = settingsData.player
        ? `${settingsData.player} Player`
        : "Player";

    const boardText = settingsData.boardSize
        ? `Board-${settingsData.boardSize} Cards`
        : "Board size";

    ui.summaryList.innerHTML = `
        <li>${themeText}</li>
        <li>${playerText}</li>
        <li>${boardText}</li>
    `;
}

/**
 * Initializes hover preview for themes.
 */
function initThemeHoverPreview(): void {
    ui.themeInputs.forEach(input => {
        const label = input.parentElement as HTMLLabelElement;
        const themeKey = input.value;

        label.addEventListener("mouseover", () => {
            if (ui.previewImage) ui.previewImage.src = themePreviewMap[themeKey];
        });

        label.addEventListener("mouseout", () => {
            if (!ui.previewImage) return;
            ui.previewImage.src = settingsData.theme
                ? themePreviewMap[settingsData.theme]
                : "";
        });
    });
}

/**
 * Highlights selected radio labels.
 */
function initRadioHighlight(): void {
    const radios = document.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    radios.forEach(radio => {
        radio.addEventListener("change", () => {
            const fieldset = radio.closest("fieldset");
            if (!fieldset) return;
            fieldset.querySelectorAll("label").forEach(l => l.classList.remove("selected"));
            radio.closest("label")?.classList.add("selected");
        });
    });
}

/**
 * Private initializer for the settings page.
 */
function initSettingsPage(): void {
    initSettingsInputs();
    initStartButton();
    updateStartButtonState();
    initRadioHighlight();
}

/**
 * Public entry point for the settings page.
 */
export function startSettings(): void {
    initSettingsPage();
}
