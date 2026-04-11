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

const elementRev = {
    dialog: document.getElementById("exitGame") as HTMLDialogElement,
    exitButton: document.getElementById("button-exit") as HTMLButtonElement,
    dialogBack: document.getElementById("dialog-back") as HTMLButtonElement,
    dialogExit: document.getElementById("dialog-exit") as HTMLButtonElement
};

/**
 * Starts the game by loading settings, applying the theme,
 * initializing the game field, state, board, and all event listeners.
 */
function startGame(): void {
    settings = loadSettings();
    document.body.classList.add(`theme--${settings.theme}`);
    initField();
    applyGridClass();
    initState();
    updatePlayerDisplay();
    renderBoard();
    addCardEvents();
    initDialogEvents();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startGame);
} else {
    startGame();
}

/**
 * Loads game settings from sessionStorage.
 * Returns default settings if none are found.
 */
function loadSettings(): GameSettings {
    const data = sessionStorage.getItem('gameSettings');
    return data ? JSON.parse(data) : {
        theme: "Default",
        player: "Blue",
        boardSize: 16
    };
}

/**
 * Initializes the game state including deck, player turn,
 * score counters, and board lock state.
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
        orangeScore: 0,
    };
}

/**
 * Creates a shuffled deck of card IDs based on the board size.
 * Each ID appears exactly twice.
 */
function createDeck(size: number): number[] {
    const pairCount = size / 2;
    const ids = Array.from({ length: pairCount }, (_, i) => i + 1);
    const deck = [...ids, ...ids];
    return deck.sort(() => Math.random() - 0.5);
}

/**
 * Retrieves and validates the game field container element.
 * Throws an error if the field cannot be found.
 */
function initField(): void {
    field = document.getElementById('field');
    if (!field) throw new Error("Field not found");
}

/**
 * Applies the correct grid layout class to the game field
 * based on the selected board size.
 */
function applyGridClass(): void {
    if (!field) return;

    field.classList.remove("game__field--16", "game__field--24", "game__field--36");

    field.classList.add(`game__field--${settings.boardSize}`);
}

/**
 * Renders the game board by generating card elements
 * with theme‑specific classes and image IDs.
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
 * Adds click event handling for all cards.
 * Handles flipping logic and prevents invalid interactions.
 */
function addCardEvents(): void {
    if (!field) return;

    field.addEventListener('click', e => {
        const card = (e.target as HTMLElement).closest(".card") as HTMLButtonElement;
        if (!card || state.lockBoard || card === state.firstCard) return;

        card.classList.add('is-flipped');

        if (!state.firstCard) {
            state.firstCard = card;
            return;
        }

        state.secondCard = card;
        checkMatch();
    });
}

/**
 * Updates the UI to reflect the current player's turn by switching
 * the displayed player icon instead of text.
 */
function updatePlayerDisplay(): void {
    const icon = document.getElementById("current-player-icon") as HTMLImageElement;
    if (!icon) return;

    if (state.currentPlayer === "Blue") {
        icon.src = "/assets/currentBlue.svg";
        icon.alt = "Blue Player";
    } else {
        icon.src = "/assets/currentOrange.svg";
        icon.alt = "Orange Player";
    }
}

/**
 * Checks whether the two flipped cards match
 * and triggers the appropriate follow‑up action.
 */
function checkMatch(): void {
    const match = state.firstCard!.dataset.image === state.secondCard!.dataset.image;
    match ? disableCards() : unflipCards();
}

/**
 * Updates the score display for both players.
 */
function updateScore(): void {
    const blue = document.getElementById("score-blue");
    const orange = document.getElementById("score-orange");

    if (blue) blue.textContent = state.blueScore.toString();
    if (orange) orange.textContent = state.orangeScore.toString();
}

/**
 * Handles a successful match by disabling the matched cards,
 * updating scores, and checking for game completion.
 */
function disableCards(): void {
    state.firstCard!.style.pointerEvents = "none";
    state.secondCard!.style.pointerEvents = "none";

    if (state.currentPlayer === "Blue") {
        state.blueScore++;
    } else {
        state.orangeScore++;
    }
    updateScore();
    state.matches++;
    if (state.matches === settings.boardSize / 2) {
        endGame();
    }
    resetTurn();
}

/**
 * Handles a failed match by flipping the cards back
 * and switching the active player.
 */
function unflipCards(): void {
    state.lockBoard = true;

    setTimeout(() => {
        state.firstCard!.classList.remove('is-flipped');
        state.secondCard!.classList.remove('is-flipped');

        state.currentPlayer = state.currentPlayer === "Blue" ? "Orange" : "Blue";
        updatePlayerDisplay();
        
        resetTurn();
    }, 1000);
}

/**
 * Resets the temporary card selection state
 * so the next turn can begin.
 */
function resetTurn(): void {
    state.firstCard = null;
    state.secondCard = null;
    state.lockBoard = false;
}

/**
 * Ends the game by determining the winner,
 * storing final scores, and navigating to the Game Over screen.
 */
function endGame():void {
    const winner =
        state.blueScore > state.orangeScore
            ? "Blue"
            : state.orangeScore > state.blueScore
            ? "Orange"
            : "Draw";

    sessionStorage.setItem("winner", winner);
    sessionStorage.setItem("blueScore", state.blueScore.toString());
    sessionStorage.setItem("orangeScore", state.orangeScore.toString());

    window.location.href = "/game-over.html";
}

/**
 * add Cheat Mode for Testing. All Cards will show the 
 */
document.addEventListener("keydown", (e) => {
    if (e.key === "c") {
        console.warn("CHEAT MODE: All cards revealed");

        document.querySelectorAll<HTMLButtonElement>(".card").forEach(card => {
            card.classList.add("cheat-reveal");
        });
    }
});

/**
 * Initializes all event listeners related to the exit dialog.
 * Handles opening, closing, and navigating back to the settings page.
 */
function initDialogEvents(): void {
    elementRev.exitButton?.addEventListener("click", () => {
        elementRev.dialog.showModal();
    });

    elementRev.dialogBack?.addEventListener("click", () => {
        elementRev.dialog.close();
    });

    elementRev.dialogExit?.addEventListener("click", () => {
        window.location.href = "settings.html";
    });
}
