// === ETHERA - APPLICATION PRINCIPALE ===

// État global de l'application
const appState = {
    currentPage: 'today',
    currentTheme: 'dark',
    user: null
};

// === INITIALISATION ===
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌟 Ethera initialisée');
    
    // Charger le thème sauvegardé
    loadTheme();
    
    // Initialiser la navigation
    initNavigation();
    
    // Charger la page par défaut
    loadPage('today');
});

// === NAVIGATION ===
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Retirer la classe active de tous les items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Ajouter la classe active à l'item cliqué
            item.classList.add('active');
            
            // Charger la page correspondante
            const page = item.getAttribute('data-page');
            loadPage(page);
        });
    });
}

// === CHARGEMENT DES PAGES ===
function loadPage(pageName) {
    appState.currentPage = pageName;
    const container = document.getElementById('content-container');
    
    // Animation de sortie
    container.style.opacity = '0';
    
    setTimeout(() => {
        // Charger le contenu selon la page
        switch(pageName) {
            case 'today':
                container.innerHTML = getTodayContent();
                break;
            case 'calendar':
                container.innerHTML = getCalendarContent();
                break;
            case 'journal':
                container.innerHTML = getJournalContent();
                break;
            case 'projects':
                container.innerHTML = getProjectsContent();
                break;
            case 'insights':
                container.innerHTML = getInsightsContent();
                break;
            default:
                container.innerHTML = '<h2>Page non trouvée</h2>';
        }
        
        // Animation d'entrée
        container.style.opacity = '1';
    }, 300);
}

// === CONTENU DES PAGES (TEMPORAIRE - MVP) ===

function getTodayContent() {
    const today = new Date();
    const dateStr = today.toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    return `
        <div class="page-header fade-in">
            <h1>Aujourd'hui</h1>
            <p class="date">${dateStr}</p>
        </div>
        
        <div class="today-grid scale-in">
            <div class="quick-journal card">
                <h3>✍️ Journal rapide</h3>
                <textarea placeholder="Comment vous sentez-vous aujourd'hui ?"></textarea>
                <button class="btn-primary">Sauvegarder</button>
            </div>
            
            <div class="tasks-today card">
                <h3>📋 Tâches du jour</h3>
                <ul>
                    <li>Aucune tâche pour aujourd'hui</li>
                </ul>
                <button class="btn-secondary">+ Ajouter une tâche</button>
            </div>
            
            <div class="mood-tracker card">
                <h3>😊 Humeur</h3>
                <div class="mood-selector">
                    <span class="mood-icon">😊</span>
                    <span class="mood-icon">😐</span>
                    <span class="mood-icon">😢</span>
                </div>
            </div>
        </div>
    `;
}

function getCalendarContent() {
    return `
        <div class="page-header fade-in">
            <h1>Calendrier</h1>
        </div>
        <div class="calendar-view scale-in">
            <p>📆 Vue calendrier à venir...</p>
        </div>
    `;
}

function getJournalContent() {
    return `
        <div class="page-header fade-in">
            <h1>Journal</h1>
        </div>
        <div class="journal-view scale-in">
            <div class="journal-editor card">
                <h3>Nouvelle entrée</h3>
                <input type="text" placeholder="Titre..." class="journal-title">
                <textarea placeholder="Écrivez vos pensées..." class="journal-content"></textarea>
                <button class="btn-primary">Sauvegarder l'entrée</button>
            </div>
        </div>
    `;
}

function getProjectsContent() {
    return `
        <div class="page-header fade-in">
            <h1>Projets</h1>
        </div>
        <div class="projects-view scale-in">
            <p>📊 Gestion de projets à venir...</p>
        </div>
    `;
}

function getInsightsContent() {
    return `
        <div class="page-header fade-in">
            <h1>Insights</h1>
        </div>
        <div class="insights-view scale-in">
            <p>📈 Statistiques et insights à venir...</p>
        </div>
    `;
}

// === UTILITAIRES ===
function loadTheme() {
    const savedTheme = localStorage.getItem('ethera-theme') || 'dark';
    document.body.className = `theme-${savedTheme}`;
    appState.currentTheme = savedTheme;
}

console.log('✨ Ethera App chargée avec succès');
