// === ETHERA - APPLICATION PRINCIPALE ===

// État global de l'application
const appState = {
    currentPage: 'today',
    currentTheme: 'dark',
    user: null,
    tasks: [],
    mood: null,
    journalEntry: '',
    habits: {
        water: 0,
        exercise: false,
        meditation: false
    }
};

// Prompts quotidiens pour le journal
const dailyPrompts = [
    "Qu'est-ce qui vous rend reconnaissant(e) aujourd'hui ?",
    "Quel est votre objectif principal pour aujourd'hui ?",
    "Comment vous sentez-vous en ce moment ?",
    "Quelle est la meilleure chose qui vous est arrivée récemment ?",
    "Qu'avez-vous appris aujourd'hui ?",
    "Qu'est-ce qui vous inspire en ce moment ?",
    "Quel petit plaisir vous êtes-vous accordé aujourd'hui ?",
    "Qu'aimeriez-vous accomplir cette semaine ?"
];

// === INITIALISATION ===
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌟 Ethera initialisée');
    
    // Charger les données sauvegardées
    loadSavedData();
    
    // Charger le thème
    loadTheme();
    
    // Initialiser la navigation
    initNavigation();
    
    // Charger la page par défaut
    loadPage('today');
});

// === CHARGEMENT DES DONNÉES ===
function loadSavedData() {
    const savedTasks = localStorage.getItem('ethera-tasks');
    const savedMood = localStorage.getItem('ethera-mood-today');
    
    if (savedTasks) {
        appState.tasks = JSON.parse(savedTasks);
    }
    
    if (savedMood) {
        appState.mood = savedMood;
    }
}

// === NAVIGATION ===
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            const page = item.getAttribute('data-page');
            loadPage(page);
        });
    });
}

// === CHARGEMENT DES PAGES ===
function loadPage(pageName) {
    appState.currentPage = pageName;
    const container = document.getElementById('content-container');
    
    container.style.opacity = '0';
    
    setTimeout(() => {
        switch(pageName) {
            case 'today':
                container.innerHTML = getTodayContent();
                initTodayInteractions();
                break;
            case 'calendar':
                container.innerHTML = getCalendarContent();
                break;
            case 'journal':
                container.innerHTML = getJournalContent();
                initJournalInteractions();
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
        
        container.style.opacity = '1';
    }, 300);
}

// === CONTENU PAGE AUJOURD'HUI ===
function getTodayContent() {
    const today = new Date();
    const dateStr = today.toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    const randomPrompt = dailyPrompts[Math.floor(Math.random() * dailyPrompts.length)];
    
    const tasksHTML = appState.tasks.length > 0 
        ? appState.tasks.map((task, index) => `
            <li class="task-item ${task.completed ? 'completed' : ''}">
                <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${index})">
                <span class="task-text">${task.text}</span>
                <button class="delete-task" onclick="deleteTask(${index})">🗑️</button>
            </li>
        `).join('')
        : '<li class="no-tasks">Aucune tâche pour aujourd\'hui</li>';
    
    return `
        <div class="page-header fade-in">
            <h1>Aujourd'hui</h1>
            <p class="date">${dateStr}</p>
        </div>
        
        <div class="today-grid scale-in">
            <!-- JOURNAL RAPIDE -->
            <div class="quick-journal card">
                <h3>✍️ Journal rapide</h3>
                <p class="journal-prompt">${randomPrompt}</p>
                <textarea id="quickJournal" placeholder="Écrivez vos pensées..."></textarea>
                <div class="word-count">0 mots</div>
                <button class="btn-primary" onclick="saveQuickJournal()">Sauvegarder</button>
            </div>
            
            <!-- TÂCHES DU JOUR -->
            <div class="tasks-today card">
                <h3>📋 Tâches du jour</h3>
                <ul class="task-list">
                    ${tasksHTML}
                </ul>
                <div class="add-task-container">
                    <input type="text" id="newTask" placeholder="Nouvelle tâche..." onkeypress="handleTaskEnter(event)">
                    <button class="btn-secondary" onclick="addTask()">+ Ajouter</button>
                </div>
            </div>
            
            <!-- HUMEUR -->
            <div class="mood-tracker card">
                <h3>😊 Comment vous sentez-vous ?</h3>
                <div class="mood-selector">
                    <span class="mood-icon ${appState.mood === 'ecstatic' ? 'selected' : ''}" onclick="selectMood('ecstatic')">🤩</span>
                    <span class="mood-icon ${appState.mood === 'happy' ? 'selected' : ''}" onclick="selectMood('happy')">😊</span>
                    <span class="mood-icon ${appState.mood === 'good' ? 'selected' : ''}" onclick="selectMood('good')">🙂</span>
                    <span class="mood-icon ${appState.mood === 'neutral' ? 'selected' : ''}" onclick="selectMood('neutral')">😐</span>
                    <span class="mood-icon ${appState.mood === 'sad' ? 'selected' : ''}" onclick="selectMood('sad')">😔</span>
                    <span class="mood-icon ${appState.mood === 'angry' ? 'selected' : ''}" onclick="selectMood('angry')">😡</span>
                    <span class="mood-icon ${appState.mood === 'tired' ? 'selected' : ''}" onclick="selectMood('tired')">😴</span>
                </div>
            </div>
            
            <!-- HABITUDES -->
            <div class="habits-tracker card">
                <h3>🎯 Habitudes quotidiennes</h3>
                <div class="habit-item">
                    <span>💧 Eau (8 verres)</span>
                    <div class="water-tracker">
                        <button onclick="decrementWater()">-</button>
                        <span id="waterCount">${appState.habits.water}</span>
                        <button onclick="incrementWater()">+</button>
                    </div>
                </div>
                <div class="habit-item">
                    <label>
                        <input type="checkbox" ${appState.habits.exercise ? 'checked' : ''} onchange="toggleHabit('exercise')">
                        💪 Exercice
