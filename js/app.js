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
                    </label>
                </div>
                <div class="habit-item">
                    <label>
                        <input type="checkbox" ${appState.habits.meditation ? 'checked' : ''} onchange="toggleHabit('meditation')">
                        🧘 Méditation
                    </label>
                </div>
            </div>
            
            <!-- OBJECTIFS DU JOUR -->
            <div class="daily-goals card">
                <h3>🎯 Objectif principal</h3>
                <input type="text" id="mainGoal" placeholder="Quel est votre objectif principal aujourd'hui ?" class="goal-input">
                <button class="btn-secondary" onclick="saveGoal()">Définir l'objectif</button>
            </div>
            
            <!-- CITATION INSPIRANTE -->
            <div class="quote-card card">
                <h3>💫 Citation du jour</h3>
                <blockquote id="dailyQuote">
                    "La vie est faite de petits bonheurs."
                </blockquote>
                <button class="btn-secondary" onclick="getNewQuote()">🔄 Nouvelle citation</button>
            </div>
        </div>
    `;
}

// === INTERACTIONS PAGE AUJOURD'HUI ===
function initTodayInteractions() {
    // Word counter pour journal rapide
    const journalTextarea = document.getElementById('quickJournal');
    if (journalTextarea) {
        journalTextarea.addEventListener('input', updateWordCount);
    }
}

function updateWordCount() {
    const text = document.getElementById('quickJournal').value;
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    document.querySelector('.word-count').textContent = `${wordCount} mot${wordCount > 1 ? 's' : ''}`;
}

function saveQuickJournal() {
    const text = document.getElementById('quickJournal').value;
    if (text.trim()) {
        localStorage.setItem(`ethera-journal-${new Date().toDateString()}`, text);
        alert('✅ Journal sauvegardé !');
    }
}

// === GESTION DES TÂCHES ===
function addTask() {
    const input = document.getElementById('newTask');
    const taskText = input.value.trim();
    
    if (taskText) {
        appState.tasks.push({ text: taskText, completed: false });
        saveTasks();
        loadPage('today');
    }
}

function handleTaskEnter(event) {
    if (event.key === 'Enter') {
        addTask();
    }
}

function toggleTask(index) {
    appState.tasks[index].completed = !appState.tasks[index].completed;
    saveTasks();
    loadPage('today');
}

function deleteTask(index) {
    appState.tasks.splice(index, 1);
    saveTasks();
    loadPage('today');
}

function saveTasks() {
    localStorage.setItem('ethera-tasks', JSON.stringify(appState.tasks));
}

// === GESTION HUMEUR ===
function selectMood(mood) {
    appState.mood = mood;
    localStorage.setItem('ethera-mood-today', mood);
    loadPage('today');
}

// === GESTION HABITUDES ===
function incrementWater() {
    if (appState.habits.water < 8) {
        appState.habits.water++;
        document.getElementById('waterCount').textContent = appState.habits.water;
        saveHabits();
    }
}

function decrementWater() {
    if (appState.habits.water > 0) {
        appState.habits.water--;
        document.getElementById('waterCount').textContent = appState.habits.water;
        saveHabits();
    }
}

function toggleHabit(habit) {
    appState.habits[habit] = !appState.habits[habit];
    saveHabits();
}

function saveHabits() {
    localStorage.setItem('ethera-habits', JSON.stringify(appState.habits));
}

// === OBJECTIFS ===
function saveGoal() {
    const goal = document.getElementById('mainGoal').value;
    if (goal.trim()) {
        localStorage.setItem('ethera-goal-today', goal);
        alert('🎯 Objectif défini !');
    }
}

// === CITATIONS ===
const quotes = [
    "La vie est faite de petits bonheurs.",
    "Chaque jour est une nouvelle chance.",
    "Crois en toi et tout devient possible.",
    "Le bonheur est un voyage, pas une destination.",
    "Fais de ta vie un rêve, et d'un rêve, une réalité.",
    "La seule limite est celle que tu te fixes."
];

function getNewQuote() {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('dailyQuote').textContent = `"${randomQuote}"`;
}

// === AUTRES PAGES (simplifié pour l'instant) ===
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
                <input type="text" id="journalTitle" placeholder="Titre..." class="journal-title">
                <textarea id="journalContent" placeholder="Écrivez vos pensées..." class="journal-content"></textarea>
                <button class="btn-primary" onclick="saveJournalEntry()">Sauvegarder l'entrée</button>
            </div>
        </div>
    `;
}

function initJournalInteractions() {
    // À implémenter
}

function saveJournalEntry() {
    const title = document.getElementById('journalTitle').value;
    const content = document.getElementById('journalContent').value;
    
    if (content.trim()) {
        const entry = {
            title: title || 'Sans titre',
            content: content,
            date: new Date().toISOString()
        };
        
        // Sauvegarder l'entrée
        let entries = JSON.parse(localStorage.getItem('ethera-journal-entries') || '[]');
        entries.push(entry);
        localStorage.setItem('ethera-journal-entries', JSON.stringify(entries));
        
        alert('✅ Entrée de journal sauvegardée !');
        document.getElementById('journalTitle').value = '';
        document.getElementById('journalContent').value = '';
    }
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
