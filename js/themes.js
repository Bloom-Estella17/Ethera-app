// === ETHERA - GESTION DES THÈMES ===

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
});

// === INITIALISATION DU TOGGLE THEME ===
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    
    if (!themeToggle) {
        console.error('Bouton theme toggle introuvable');
        return;
    }
    
    // Mettre à jour le texte du bouton selon le thème actuel
    updateThemeButton();
    
    // Écouter les clics sur le bouton
    themeToggle.addEventListener('click', toggleTheme);
}

// === TOGGLE ENTRE DARK ET LIGHT ===
function toggleTheme() {
    const currentTheme = document.body.classList.contains('theme-dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Appliquer le nouveau thème
    document.body.classList.remove(`theme-${currentTheme}`);
    document.body.classList.add(`theme-${newTheme}`);
    
    // Sauvegarder dans localStorage
    localStorage.setItem('ethera-theme', newTheme);
    
    // Mettre à jour le bouton
    updateThemeButton();
    
    // Animation de transition
    createThemeTransitionEffect();
    
    console.log(`🎨 Thème changé : ${newTheme}`);
}

// === METTRE À JOUR LE TEXTE DU BOUTON ===
function updateThemeButton() {
    const themeToggle = document.getElementById('themeToggle');
    const isDark = document.body.classList.contains('theme-dark');
    
    if (isDark) {
        themeToggle.innerHTML = '🌙 Mode Sombre';
    } else {
        themeToggle.innerHTML = '☀️ Mode Clair';
    }
}

// === EFFET VISUEL DE TRANSITION ===
function createThemeTransitionEffect() {
    // Créer un overlay temporaire pour une transition douce
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--accent-primary);
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
        z-index: 9999;
    `;
    
    document.body.appendChild(overlay);
    
    // Fade in
    setTimeout(() => {
        overlay.style.opacity = '0.3';
    }, 10);
    
    // Fade out et supprimer
    setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(overlay);
        }, 300);
    }, 200);
}

// === DÉTECTER LA PRÉFÉRENCE SYSTÈME (optionnel) ===
function detectSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

// === APPLIQUER LE THÈME SYSTÈME SI AUCUNE PRÉFÉRENCE SAUVEGARDÉE ===
function applySystemThemeIfNeeded() {
    const savedTheme = localStorage.getItem('ethera-theme');
    
    if (!savedTheme) {
        const systemTheme = detectSystemTheme();
        document.body.classList.add(`theme-${systemTheme}`);
        localStorage.setItem('ethera-theme', systemTheme);
        console.log(`🎨 Thème système appliqué : ${systemTheme}`);
    }
}

console.log('🎨 Module themes.js chargé');
