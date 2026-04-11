export {};

interface GameSettings {
    theme: string;
    player: string;
    boardSize: number;
}

interface GameState {
    deck: number[];
    firstCard: HTMLButtonElement | null;
    secondCard: HTMLButtonElement | null;
    lockBoard: boolean;
    matches: number;
    currentPlayer: "Blue" | "Orange";
    blueScore: number;
    orangeScore: number;
}

let settings: GameSettings;
let state: GameState;
let field: HTMLElement | null = null;
let cheatActive = false;

const ui = {
    dialog: document.getElementById("exitGame") as HTMLDialogElement,
    exitButton: document.getElementById("button-exit") as HTMLButtonElement,
    dialogBack: document.getElementById("dialog-back") as HTMLButtonElement,
    dialogExit: document.getElementById("dialog-exit") as HTMLButtonElement
};

/**
 * Loads game settings from sessionStorage.
 */
function loadSettings(): GameSettings {
    const data = sessionStorage.getItem("gameSettings");
    return data
        ? JSON.parse(data)
        : { theme: "Default", player: "Blue", boardSize: 16 };
}

/**
 * Initializes the game field container.
 */
function initField(): void {
    field = document.getElementById("field");
    if (!field) throw new Error("Field not found");
}

/**
 * Applies the correct grid layout class.
 */
function applyGridClass(): void {
    if (!field) return;
    field.classList.remove("game__field--16", "game__field--24", "game__field--36");
    field.classList.add(`game__field--${settings.boardSize}`);
}

/**
 * Creates a shuffled deck of card IDs.
 */
function createDeck(size: number): number[] {
    const ids = Array.from({ length: size / 2 }, (_, i) => i + 1);
    const deck = [...ids, ...ids];
    return deck.sort(() => Math.random() - 0.5);
}

/**
 * Initializes the game state.
 */
function initState(): void {
    state = {
        deck: createDeck(settings.boardSize),
        firstCard: null,
        secondCard: null,
        lockBoard: false,
        matches: 0,
        currentPlayer: settings.player as "Blue" | "Orange",
        blueScore: 0,
        orangeScore: 0
    };
}

/**
 * Renders the game board.
 */
function renderBoard(): void {
    if (!field) return;
    field.innerHTML = "";
    state.deck.forEach(id => {
        field!.innerHTML += `
            <button class="card card--${settings.theme}-${id}" data-image="${id}">
                <div class="card__inner">
                    <div class="card__face card__face--front"></div>
                    <div class="card__face card__face--back"></div>
                </div>
            </button>
        `;
    });
}

/**
 * Adds card click handling.
 */
function addCardEvents(): void {
    if (!field) return;
    field.addEventListener("click", e => {
        const card = (e.target as HTMLElement).closest(".card") as HTMLButtonElement;
        if (!card || state.lockBoard || card === state.firstCard) return;
        card.classList.add("is-flipped");
        if (!state.firstCard) {
            state.firstCard = card;
            return;
        }
        state.secondCard = card;
        checkMatch();
    });
}

/**
 * Updates the current player icon.
 */
function updatePlayerDisplay(): void {
    const icon = document.getElementById("current-player-icon") as HTMLImageElement;
    if (!icon) return;
    if (state.currentPlayer === "Blue") {
        icon.src = "./assets/currentBlue.svg";
        icon.alt = "Blue Player";
    } else {
        icon.src = "./assets/currentOrange.svg";
        icon.alt = "Orange Player";
    }
}

/**
 * Checks if the selected cards match.
 */
function checkMatch(): void {
    const match = state.firstCard!.dataset.image === state.secondCard!.dataset.image;
    match ? disableCards() : unflipCards();
}

/**
 * Updates the score display.
 */
function updateScore(): void {
    const blue = document.getElementById("score-blue");
    const orange = document.getElementById("score-orange");
    if (blue) blue.textContent = state.blueScore.toString();
    if (orange) orange.textContent = state.orangeScore.toString();
}

/**
 * Handles a successful match.
 */
function disableCards(): void {
    state.firstCard!.style.pointerEvents = "none";
    state.secondCard!.style.pointerEvents = "none";
    if (state.currentPlayer === "Blue") state.blueScore++;
    else state.orangeScore++;
    updateScore();
    state.matches++;
    if (state.matches === settings.boardSize / 2) endGame();
    resetTurn();
}

/**
 * Handles a failed match.
 */
function unflipCards(): void {
    state.lockBoard = true;
    setTimeout(() => {
        state.firstCard!.classList.remove("is-flipped");
        state.secondCard!.classList.remove("is-flipped");
        state.currentPlayer = state.currentPlayer === "Blue" ? "Orange" : "Blue";
        updatePlayerDisplay();
        resetTurn();
    }, 1000);
}

/**
 * Resets temporary card selection.
 */
function resetTurn(): void {
    state.firstCard = null;
    state.secondCard = null;
    state.lockBoard = false;
}

/**
 * Ends the game and stores results.
 */
function endGame(): void {
    const winner =
        state.blueScore > state.orangeScore
            ? "Blue"
            : state.orangeScore > state.blueScore
            ? "Orange"
            : "Draw";
    sessionStorage.setItem("winner", winner);
    sessionStorage.setItem("blueScore", state.blueScore.toString());
    sessionStorage.setItem("orangeScore", state.orangeScore.toString());
    window.location.href = "./game-over.html";
}

/**
 * Enables cheat mode.
 */
function initCheatMode(): void {
    document.addEventListener("keydown", e => {
        if (e.key === "c") {
            cheatActive = !cheatActive;

            document.querySelectorAll<HTMLButtonElement>(".card").forEach(card => {
                card.classList.toggle("cheat-reveal", cheatActive);
            });
        }
    });
}


/**
 * Initializes dialog events.
 */
function initDialogEvents(): void {
    ui.exitButton?.addEventListener("click", () => ui.dialog.showModal());
    ui.dialogBack?.addEventListener("click", () => ui.dialog.close());
    ui.dialogExit?.addEventListener("click", () => {
        window.location.href = "./settings.html";
    });
}

/**
 * Private initializer for the game page.
 */
function initGame(): void {
    settings = loadSettings();
    document.body.classList.add(`theme--${settings.theme}`);
    initField();
    applyGridClass();
    initState();
    updatePlayerDisplay();
    renderBoard();
    addCardEvents();
    initDialogEvents();
    initCheatMode();
}

/**
 * Public entry point for the game page.
 */
export function startGame(): void {
    initGame();
}
