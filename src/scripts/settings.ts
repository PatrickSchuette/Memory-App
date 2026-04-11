export {};

/**
 * Represents the game settings selected by the user.
 */
interface GameSettings {
    theme: string | null;
    player: string | null;
    boardSize: number | null;
}

/**
 * Holds the currently selected settings before saving.
 * All values start as null to force user interaction.
 */
let settingsData: GameSettings = {
    theme: null,
    player: null,
    boardSize: null
};

/**
 * Centralized reference object for all DOM elements used in the settings page.
 */
const elementRev = {
    startButton: document.getElementById('button-start') as HTMLButtonElement | null,

    previewImage: document.querySelector<HTMLImageElement>('.settings__preview'),
    summaryList: document.querySelector('.settings__summary ul'),

    themeInputs: document.querySelectorAll<HTMLInputElement>('input[name="theme"]'),
    playerInputs: document.querySelectorAll<HTMLInputElement>('input[name="player"]'),
    boardInputs: document.querySelectorAll<HTMLInputElement>('input[name="board"]')
};

/**
 * Maps internal theme identifiers to preview image paths.
 */
const themePreviewMap: Record<string, string> = {
    CodeVibesTheme: './assets/themeIT.svg',
    GamingTheme: './assets/themeGaming.svg',
    DAProjectsTheme: './assets/themeDA.svg',
    FoodsTheme: './assets/themeFood.svg'
};

/**
 * Maps internal theme identifiers to simplified SCSS theme keys.
 */
const themeMap: Record<string, string> = {
    CodeVibesTheme: "it",
    GamingTheme: "game",
    DAProjectsTheme: "da",
    FoodsTheme: "food"
};


initSettings();
initStartButton();
updateStartButtonState();
initRadioHighlight();


/**
 * Initializes the event listener for the start button.
 * The button remains disabled until all settings are selected.
 */
function initStartButton(): void {
    elementRev.startButton?.addEventListener('click', () => {
        saveSettings();
        window.location.href = "./game.html";
    });
}


/**
 * Saves the current settings to sessionStorage.
 * The theme is mapped to the simplified SCSS-compatible theme key.
 */
function saveSettings(): void {
    if (!settingsData.theme || !settingsData.player || !settingsData.boardSize) return;

    const mappedTheme = themeMap[settingsData.theme];

    sessionStorage.setItem('gameSettings', JSON.stringify({
        ...settingsData,
        theme: mappedTheme
    }));
}

/**
 * Initializes all settings input listeners.
 * Each input updates the settingsData object and refreshes the summary.
 */
function initSettings(): void {
    elementRev.themeInputs.forEach(input => {
        input.addEventListener('change', () => {
            settingsData.theme = input.value;
            updateSummary();
            updateStartButtonState();
        });
    });

    elementRev.playerInputs.forEach(input => {
        input.addEventListener('change', () => {
            settingsData.player = input.value;
            updateSummary();
            updateStartButtonState();
        });
    });

    elementRev.boardInputs.forEach(input => {
        input.addEventListener('change', () => {
            settingsData.boardSize = Number(input.value);
            updateSummary();
            updateStartButtonState();
        });
    });

    updateSummary();
    initThemeHoverPreview();
}

/**
 * Enables or disables the start button depending on whether
 * all required settings have been selected.
 */
function updateStartButtonState(): void {
    const isComplete =
        settingsData.theme !== null &&
        settingsData.player !== null &&
        settingsData.boardSize !== null;

    if (elementRev.startButton) {
        elementRev.startButton.disabled = !isComplete;
    }
}

/**
 * Updates the preview image and summary list based on the current settings.
 */
function updateSummary(): void {
    updatePreviewImage();
    updateSummaryList();
}

/**
 * Updates the theme preview image based on the selected theme.
 */
function updatePreviewImage(): void {
    if (!elementRev.previewImage) return;

    if (!settingsData.theme) {
        elementRev.previewImage.src = "";
        return;
    }

    elementRev.previewImage.src =
        themePreviewMap[settingsData.theme] || '/assets/themeIT.svg';
}

/**
 * Updates the summary list that displays the selected settings.
 * If a setting is not selected yet, only the label is shown.
 */
function updateSummaryList(): void {
    if (!elementRev.summaryList) return;

    const themeText = settingsData.theme
        ? `${settingsData.theme.replace(/([A-Z])/g, ' $1').trim()}`
        : "Theme";

    const playerText = settingsData.player
        ? `${settingsData.player} Player`
        : "Player";

    const boardText = settingsData.boardSize
        ? `Board-${settingsData.boardSize} Cards`
        : "Board size";

    elementRev.summaryList.innerHTML = `
        <li>${themeText}</li>
        <li>${playerText}</li>
        <li>${boardText}</li>
    `;
}

/**
 * Initializes hover-based theme preview behavior.
 *
 * When the user hovers over a theme label, the preview image updates to show
 * the corresponding theme illustration. When the mouse leaves the label,
 * the preview resets to either the currently selected theme or an empty state
 * if no theme has been chosen yet.
 *
 * This ensures:
 * - Full hover area (label + text + radio button) triggers the preview
 * - No console errors when no theme is selected
 * - Smooth UX where the preview only becomes permanent after selection
 */
function initThemeHoverPreview(): void {
    elementRev.themeInputs.forEach((input, index) => {
        const themeKey = input.value;
        const label = input.parentElement as HTMLLabelElement;

        label.addEventListener("mouseover", () => {
            elementRev.previewImage!.src = themePreviewMap[themeKey];
        });

        label.addEventListener("mouseout", () => {
            if (!settingsData.theme) {
                elementRev.previewImage!.src = "";
                return;
            }

            elementRev.previewImage!.src = themePreviewMap[settingsData.theme];
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

