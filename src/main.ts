import './styles/style.scss';

document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page;

    switch (page) {
        case "settings":
            import('./scripts/settings');
            break;
        case "game":
            import('./scripts/game');
            break;
        default:
            // Startseite → nichts tun
            break;
    }
});
