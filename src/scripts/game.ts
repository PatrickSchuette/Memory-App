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

const images = [
    "/assets/food/card_1.svg",
    "/assets/food/card_2.svg",
    "/assets/food/card_3.svg",
    "/assets/food/card_4.svg",
    "/assets/food/card_5.svg",
    "/assets/food/card_6.svg",
    "/assets/food/card_7.svg",
    "/assets/food/card_8.svg",
    "/assets/food/card_9.svg",
    "/assets/food/card_10.svg",
    "/assets/food/card_11.svg",
    "/assets/food/card_12.svg",
    "/assets/food/card_13.svg",
    "/assets/food/card_14.svg",
    "/assets/food/card_15.svg",
    "/assets/food/card_16.svg",
    "/assets/food/card_17.svg",
    "/assets/food/card_18.svg"
];

const elementRev = {
    dialog: document.getElementById("exitGame") as HTMLDialogElement,
    exitButton: document.getElementById("button-exit") as HTMLButtonElement,
    dialogBack: document.getElementById("dialog-back") as HTMLButtonElement,
    dialogExit: document.getElementById("dialog-exit") as HTMLButtonElement
};


function startGame() {
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


function loadSettings(): GameSettings {
    const data = sessionStorage.getItem('gameSettings');
    return data ? JSON.parse(data) : {
        theme: "Default",
        player: "Blue",
        boardSize: 16
    };
}

function initState() {
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

function createDeck(size: number) {
    const pairCount = size / 2;
    const ids = Array.from({ length: pairCount }, (_, i) => i + 1);
    const deck = [...ids, ...ids];
    return deck.sort(() => Math.random() - 0.5);
}

function initField() {
    field = document.getElementById('field');
    if (!field) throw new Error("Field not found");
}

function applyGridClass() {
    if (!field) return;

    field.classList.remove("game__field--16", "game__field--24", "game__field--36");

    field.classList.add(`game__field--${settings.boardSize}`);
}


function renderBoard() {
    if (!field) return;

    field.innerHTML = "";

    state.deck.forEach(id => {
        field!.innerHTML += `
            <button class="card" data-image="${id}">
                <div class="card__inner">
                    <div class="card__face card__face--front"></div>
                    <div class="card__face card__face--back"></div>
                </div>
            </button>
        `;
    });
}


function addCardEvents() {
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

function updatePlayerDisplay() {
    const playerElement = document.querySelector(".current-player");
    if (!playerElement) return;

    playerElement.classList.remove("game__player--blue", "game__player--orange");

    if (state.currentPlayer === "Blue") {
        playerElement.classList.add("game__player--blue");
        playerElement.textContent = "Current Player: Blue";
    } else {
        playerElement.classList.add("game__player--orange");
        playerElement.textContent = "Current Player: Orange";
    }
}


function checkMatch() {
    const match = state.firstCard!.dataset.image === state.secondCard!.dataset.image;
    match ? disableCards() : unflipCards();
}

function updateScore() {
    const blue = document.getElementById("score-blue");
    const orange = document.getElementById("score-orange");

    if (blue) blue.textContent = state.blueScore.toString();
    if (orange) orange.textContent = state.orangeScore.toString();
}

function disableCards() {
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


function unflipCards() {
    state.lockBoard = true;

    setTimeout(() => {
        state.firstCard!.classList.remove('is-flipped');
        state.secondCard!.classList.remove('is-flipped');

        state.currentPlayer = state.currentPlayer === "Blue" ? "Orange" : "Blue";
        updatePlayerDisplay();
        
        resetTurn();
    }, 1000);
}

function resetTurn() {
    state.firstCard = null;
    state.secondCard = null;
    state.lockBoard = false;
}

function endGame() {
    const winner =
        state.blueScore > state.orangeScore
            ? "Blue"
            : state.orangeScore > state.blueScore
            ? "Orange"
            : "Draw";

    sessionStorage.setItem("winner", winner);
    sessionStorage.setItem("blueScore", state.blueScore.toString());
    sessionStorage.setItem("orangeScore", state.orangeScore.toString());

    // Game-Over-Seite öffnen
    window.location.href = "/game-over.html";
}

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

    // Open dialog
    elementRev.exitButton?.addEventListener("click", () => {
        elementRev.dialog.showModal();
    });

    // Close dialog
    elementRev.dialogBack?.addEventListener("click", () => {
        elementRev.dialog.close();
    });

    // Exit to settings page
    elementRev.dialogExit?.addEventListener("click", () => {
        window.location.href = "settings.html";
    });
}
