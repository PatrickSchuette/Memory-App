export {};

interface GameSettings {
    theme: string;
    player: string;
    boardSize: number;
}

interface GameState {
    deck: string[];
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
    "/assets/food/food_01.svg",
    "/assets/food/food_02.svg",
    "/assets/food/food_03.svg",
    "/assets/food/food_04.svg",
    "/assets/food/food_05.svg",
    "/assets/food/food_06.svg",
    "/assets/food/food_07.svg",
    "/assets/food/food_08.svg",
    "/assets/food/food_09.svg",
    "/assets/food/food_10.svg",
    "/assets/food/food_11.svg",
    "/assets/food/food_12.svg",
    "/assets/food/food_13.svg",
    "/assets/food/food_14.svg",
    "/assets/food/food_15.svg",
    "/assets/food/food_16.svg",
];

function startGame() {
    settings = loadSettings();
    initField();
    applyGridClass();
    initState();
    updatePlayerDisplay();
    renderBoard();
    addCardEvents();

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
    const selected = images.slice(0, pairCount);
    const deck = [...selected, ...selected];
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

    state.deck.forEach(img => {
        if (!field) return;
        field.innerHTML += `
        <button class="card" data-image="${img}">
            <div class="card__inner">
                <div class="card__face card__face--front"></div>
                <div class="card__face card__face--back">
                    <img src="${img}">
                </div>
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
