const winner = sessionStorage.getItem("winner") || "Draw";
const text = document.getElementById("winner-text") as HTMLElement;

if (winner === "Blue") {
    text.textContent = "The winner is Blue Player";
    text.classList.add("winner--blue");
} else if (winner === "Orange") {
    text.textContent = "The winner is Orange Player";
    text.classList.add("winner--orange");
} else {
    text.textContent = "It's a draw!";
}
