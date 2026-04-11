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
 * Initializes the settings page.
 */
function initSettingsPage(): void {
    initThemeInputs();
    initPlayerInputs();
    initBoardInputs();
    initStartButton();
    initRadioHighlight();
    initThemeHoverPreview();
    updateSummary();
    updateStartButtonState();
}

/**
 * Initializes theme input listeners.
 */
function initThemeInputs(): void {
    ui.themeInputs.forEach(input => {
        input.addEventListener("change", () => {
            settingsData.theme = input.value;
            handleSettingsChange();
        });
    });
}

/**
 * Initializes player input listeners.
 */
function initPlayerInputs(): void {
    ui.playerInputs.forEach(input => {
        input.addEventListener("change", () => {
            settingsData.player = input.value;
            handleSettingsChange();
        });
    });
}

/**
 * Initializes board size input listeners.
 */
function initBoardInputs(): void {
    ui.boardInputs.forEach(input => {
        input.addEventListener("change", () => {
            settingsData.boardSize = Number(input.value);
            handleSettingsChange();
        });
    });
}

/**
 * Handles updates after any settings change.
 */
function handleSettingsChange(): void {
    updateSummary();
    updateStartButtonState();
}

/**
 * Initializes the start button.
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
 * Updates the start button state.
 */
function updateStartButtonState(): void {
    const ready =
        settingsData.theme !== null &&
        settingsData.player !== null &&
        settingsData.boardSize !== null;

    if (ui.startButton) ui.startButton.disabled = !ready;
}

/**
 * Updates preview image and summary list.
 */
function updateSummary(): void {
    updatePreviewImage();
    updateSummaryList();
}

/**
 * Updates the preview image.
 */
function updatePreviewImage(): void {
    if (!ui.previewImage) return;
    ui.previewImage.src = settingsData.theme ? themePreviewMap[settingsData.theme] : "";
}

/**
 * Updates the summary list.
 */
function updateSummaryList(): void {
    if (!ui.summaryList) return;
    const themeText = settingsData.theme
        ? formatThemeName(settingsData.theme)
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
        <li>${boardText}</li>  `;
}

/**
 * Formats theme names for display.
 */
function formatThemeName(name: string): string {
    return name.replace(/([A-Z])/g, " $1").trim();
}

/**
 * Initializes hover preview for themes.
 */
function initThemeHoverPreview(): void {
    ui.themeInputs.forEach(input => {
        const label = input.parentElement as HTMLLabelElement;
        label.addEventListener("mouseover", () => setHoverPreview(input.value));
        label.addEventListener("mouseout", resetHoverPreview);
    });
}

/**
 * Sets hover preview image.
 */
function setHoverPreview(themeKey: string): void {
    if (ui.previewImage) ui.previewImage.src = themePreviewMap[themeKey];
}

/**
 * Resets hover preview image.
 */
function resetHoverPreview(): void {
    if (!ui.previewImage) return;
    ui.previewImage.src = settingsData.theme ? themePreviewMap[settingsData.theme] : "";
}

/**
 * Initializes radio highlight behavior.
 */
function initRadioHighlight(): void {
    const radios = document.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    radios.forEach(radio => {
        radio.addEventListener("change", () => highlightRadio(radio));
    });
}

/**
 * Highlights the selected radio label.
 */
function highlightRadio(radio: HTMLInputElement): void {
    const fieldset = radio.closest("fieldset");
    if (!fieldset) return;
    fieldset.querySelectorAll("label").forEach(l => l.classList.remove("selected"));
    radio.closest("label")?.classList.add("selected");
}

/**
 * Public entry point for the settings page.
 */
export function startSettings(): void {
    initSettingsPage();
}
