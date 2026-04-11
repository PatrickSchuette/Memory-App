import { defineConfig } from "vite";

export default defineConfig({
  base: "/Memory/",
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        settings: "settings.html",
        game: "game.html",
        winner: "winner.html",
        gameover: "game-over.html"
      }
    }
  }
});
