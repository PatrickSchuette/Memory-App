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
}

let settings: GameSettings;
let state: GameState;
let field: HTMLElement | null = null;

document.addEventListener('DOMContentLoaded', () => {
    settings = loadSettings();
    initField();
    initState();
    renderBoard();
    addCardEvents();
});

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
        matches: 0
    };
}

const images = [
    "/assets/food/food_01.svg",
    "/assets/food/food_02.svg",
    "/assets/food/food_03.svg",
    "/assets/food/food_04.svg",
    "/assets/food/food_05.svg",
    "/assets/food/food_06.svg",
    "/assets/food/food_07.svg",
    "/assets/food/food_08.svg"
];

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

function renderBoard() {
    if (!field) return;
    
    field.innerHTML = "";

    state.deck.forEach(img => {
        if (!field) return;
        field.innerHTML += `
            <button class="card" data-image="${img}">
                <div class="card__inner">
                    <div class="card__face"></div>
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

function checkMatch() {
    const match = state.firstCard!.dataset.image === state.secondCard!.dataset.image;
    match ? disableCards() : unflipCards();
}

function disableCards() {
    state.firstCard!.style.pointerEvents = "none";
    state.secondCard!.style.pointerEvents = "none";

    state.matches++;
    resetTurn();
}

function unflipCards() {
    state.lockBoard = true;

    setTimeout(() => {
        state.firstCard!.classList.remove('is-flipped');
        state.secondCard!.classList.remove('is-flipped');
        resetTurn();
    }, 1000);
}

function resetTurn() {
    state.firstCard = null;
    state.secondCard = null;
    state.lockBoard = false;
}
