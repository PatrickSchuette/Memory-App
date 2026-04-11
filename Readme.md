## 🧠 Memory Game
A modern, theme‑driven memory game built with TypeScript, SCSS, and Vite, featuring a modular architecture, dynamic UI theming, multiple board sizes, and a polished multi‑page flow including Settings, Game, Winner, and Game‑Over screens.

## Features
🎨 Theme system with four visual styles (IT, Gaming, DA, Food), each providing its own colors and icons.

🧩 Three board sizes (16, 24, 36 cards) for different difficulty levels.

👥 Two‑player mode with automatic turn switching and live score tracking.

⭐ Winner screen with theme‑based visuals and score evaluation.

🧪 Developer cheat mode (press C) to reveal all cards instantly.

⚡ Vite development environment with fast HMR and optimized builds.

📱 Responsive layout for desktop and mobile devices.

🧼 Clean architecture with strict TypeScript rules (max 17 lines per function, JSDoc, no global logic).

## Project Structure
```
Memory-App/
│
├── public/                 # Static assets (icons, images)
├── src/
│   ├── scripts/            # TypeScript modules
│   │   ├── game.ts         # Game engine (single-object architecture)
│   │   ├── settings.ts     # Settings logic
│   │   ├── winner.ts       # Winner screen logic
│   │   └── game-over.ts    # Game-over logic
│   │
│   ├── scss/               # SCSS architecture
│   │   ├── abstract/       # Mixins, variables
│   │   ├── base/           # Fonts, resets
│   │   ├── components/     # Buttons, cards
│   │   └── pages/          # Page-specific styles
│   │
│   └── main.ts             # Global entry point
│
├── index.html              # Start screen
├── settings.html           # Settings page
├── game.html               # Game page
├── winner.html             # Winner screen
├── game-over.html          # Game-over screen
│
├── vite.config.ts
├── package.json
└── tsconfig.json
```

## Technologies
TypeScript for strict, modular game logic

SCSS with mixins, variables, and theme‑based styling

Vite for fast development and optimized builds

CSS variables for dynamic theme assets

HTML5 for clean, semantic structure

## Gameplay Overview
Players choose theme, player color, and board size.

Cards are shuffled and placed face‑down.

Players flip two cards:

Match → point + same player continues

No match → turn switches

Game ends when all pairs are found.

Winner screen displays

Theme‑based icon

## Developer Tools
Cheat mode: Press C during gameplay to reveal all cards.

Strict TS rules


## Installation
Clone the repository
```
git clone https://github.com/YOUR-USERNAME/Memory-App.git
cd Memory-App
```
Install dependencies
```
npm install
Start development server
```
npm run dev
```
Build for production
bash
npm run build
```

## License
Created as part of the DeveloperAcademy program.
Free to use and extend.
