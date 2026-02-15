import './styles/style.scss'

let amountCard = 4;

let selectedCards: { card1: string | null, card2: string | null } = {
    card1: null,
    card2: null
}
    ; (window as any).selectedCards = selectedCards

document.addEventListener("DOMContentLoaded", () => {
    init()
})

function init() {
    crateCards();
    createListener();
}

function createListener() {
    const fieldRef = document.getElementById("field");
    if (!fieldRef) return;

    fieldRef.addEventListener("click", e => {
        const target = e.target as HTMLElement
        const card = target.closest<HTMLButtonElement>(".card")
        if (!card) return;

        const id = card.id

        if (selectedCards.card2 != null) {return;}

        card.classList.add("is-flipped")

        selectCard(id)
    })
}

function crateCards() {
    const fieldRef = document.getElementById("field");
    if (!fieldRef) return;

    fieldRef.innerHTML = "";
    for (let index = 1; index <= amountCard; index++) {
        fieldRef.innerHTML += renderCard(index);
    }
}

function flipCardBack(id: string) {
    const card = document.getElementById(id)
    if (card) {
        card.classList.remove("is-flipped")
    }
}

function selectCard(id: string) {
    if (selectedCards.card1 === null) {
        selectedCards.card1 = id;
        return;
    }

    selectedCards.card2 = id;

    // Beide Karten ausgewählt → zurückdrehen
    setTimeout(() => {
        flipCardBack(selectedCards.card1!)
        flipCardBack(selectedCards.card2!)
        selectedCards.card1 = null;
        selectedCards.card2 = null;
    }, 1000)
}

function renderCard(i: number) {
    return `
        <button class="card" id="card_${i}">
            <div class="card__inner">
                <div class="card__face card__face--front"></div>
                <div class="card__face card__face--back"></div>
            </div>
        </button>
    `;
}
