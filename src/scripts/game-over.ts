const blue = document.getElementById("blue-final");
const orange = document.getElementById("orange-final");

const blueScore = sessionStorage.getItem("blueScore") || "0";
const orangeScore = sessionStorage.getItem("orangeScore") || "0";

if (blue) blue.textContent = blueScore;
if (orange) orange.textContent = orangeScore;

// Nach 2 Sekunden weiterleiten
setTimeout(() => {
    //window.location.href = "/winner.html";
}, 2000);
