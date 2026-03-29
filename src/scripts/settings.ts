export {};

interface GameSettings {
    theme: string,
    player: string,
    boardSize: number
}

let settingsData: GameSettings = {
    theme: "Code Vibes Theme",
    player: "Blue",
    boardSize: 11
};

let elementRev = {
    startButton : document.getElementById('button-start'),

    previewImage : document.querySelector<HTMLImageElement>('.settings__preview'),
    summaryList : document.querySelector('.settings__summary ul'),

    themeInputs : document.querySelectorAll<HTMLInputElement>('input[name="theme"]'),
    playerInputs : document.querySelectorAll<HTMLInputElement>('input[name="player"]'),
    boardInputs : document.querySelectorAll<HTMLInputElement>('input[name="board"]')
 
}
const themePreviewMap: Record<string, string> = {
    CodeVibesTheme: '/assets/themeIT.svg',
    GamingTheme: '/assets/themeGaming.svg',
    DAProjectsTheme: '/assets/themeDA.svg',
    FoodsTheme:'/assets/themeFood.svg'
}

document.addEventListener('DOMContentLoaded', () => {
    initSettings();
})

elementRev.startButton?.addEventListener('click', () => {
    sessionStorage.setItem('gameSettings', JSON.stringify(settingsData));
})

function initSettings(){
    elementRev.themeInputs.forEach(input => {
        input.addEventListener('change', () => {
            settingsData.theme = input.value;
            updateSummary();
        });
    })
    elementRev.playerInputs.forEach(input => {
        input.addEventListener('change', () => {
            settingsData.player = input.value;
            updateSummary();
        });
    })
    elementRev.boardInputs.forEach(input => {
        input.addEventListener('change', () => {
            settingsData.boardSize = Number(input.value);
            updateSummary();
        });
    })
    updateSummary();
}

function updateSummary() {
    if (elementRev.previewImage) {
        const themeKey = settingsData.theme; 
        elementRev.previewImage.src = themePreviewMap[themeKey] || '/assets/themeIT.svg';
    }

    if (elementRev.summaryList) {
        const displayTheme = settingsData.theme.replace(/([A-Z])/g, ' $1').trim();
        
        elementRev.summaryList.innerHTML = `
            <li>${displayTheme}</li>
            <li>${settingsData.player}</li>
            <li>${settingsData.boardSize} Cards</li>
        `;
    }
}
