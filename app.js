/**
 * ================================================
 * TASK MANAGER - LOGIQUE JAVASCRIPT
 * Auteur: Wassim Azinne
 * Description: Gestion complète des tâches avec localStorage
 * ================================================
 */

// ================================================
// SÉLECTION DES ÉLÉMENTS DOM
// ================================================
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const filterBtns = document.querySelectorAll('.filter-btn');

// Compteurs
const countAll = document.getElementById('countAll');
const countActive = document.getElementById('countActive');
const countCompleted = document.getElementById('countCompleted');

// ================================================
// VARIABLES GLOBALES
// ================================================
let tasks = [];
let currentFilter = 'all'; // 'all', 'active', 'completed'
const STORAGE_KEY = 'taskManagerTasks';

// ================================================
// CLASSE TASK (POO - Programmation Orientée Objet)
// ================================================
class Task {
    constructor(text) {
        this.id = Date.now() + Math.random(); // ID unique
        this.text = text;
        this.completed = false;
        this.createdAt = new Date().toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// ================================================
// INITIALISATION DE L'APPLICATION
// ================================================
function init() {
    console.log('🚀 Initialisation du Task Manager...');
    
    // Charger les tâches depuis localStorage
    loadTasksFromStorage();
    
    // Afficher les tâches
    renderTasks();
    
    // Attacher les événements
    attachEventListeners();
    
    console.log('✅ Application initialisée avec succès');
}

// ================================================
// GESTION DES ÉVÉNEMENTS
// ================================================
function attachEventListeners() {
    // Ajouter une tâche via le bouton
    addTaskBtn.addEventListener('click', handleAddTask);
    
    // Ajouter une tâche via la touche Entrée
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleAddTask();
        }
    });
    
    // Boutons d'action globale
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);
    clearAllBtn.addEventListener('click', clearAllTasks);
    
    // Filtres
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filter = e.target.dataset.filter;
            setFilter(filter);
        });
    });
}

// ================================================
// AJOUTER UNE TÂCHE
// ================================================
function handleAddTask() {
    const text = taskInput.value.trim();
    
    // Validation
    if (text === '') {
        showNotification('⚠️ Veuillez entrer une tâche', 'warning');
        taskInput.focus();
        return;
    }
    
    if (text.length < 3) {
        showNotification('⚠️ La tâche doit contenir au moins 3 caractères', 'warning');
        return;
    }
    
    // Créer la nouvelle tâche
    const newTask = new Task(text);
    tasks.push(newTask);
    
    // Sauvegarder dans localStorage
    saveTasksToStorage();
    
    // Afficher les tâches
    renderTasks();
    
    // Réinitialiser le champ
    taskInput.value = '';
    taskInput.focus();
    
    // Notification
    showNotification('✅ Tâche ajoutée avec succès', 'success');
}

// ================================================
// SUPPRIMER UNE TÂCHE
// ================================================
function deleteTask(taskId) {
    // Confirmation
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
        return;
    }
    
    // Trouver l'index de la tâche
    const index = tasks.findIndex(task => task.id === taskId);
    
    if (index !== -1) {
        // Retirer la tâche du tableau
        tasks.splice(index, 1);
        
        // Sauvegarder
        saveTasksToStorage();
        
        // Ré-afficher
        renderTasks();
        
        // Notification
        showNotification('🗑️ Tâche supprimée', 'info');
    }
}

// ================================================
// MARQUER UNE TÂCHE COMME COMPLÉTÉE/NON COMPLÉTÉE
// ================================================
function toggleTaskComplete(taskId) {
    // Trouver la tâche
    const task = tasks.find(t => t.id === taskId);
    
    if (task) {
        // Inverser le statut
        task.completed = !task.completed;
        
        // Sauvegarder
        saveTasksToStorage();
        
        // Ré-afficher
        renderTasks();
        
        // Notification
        const message = task.completed 
            ? '✅ Tâche terminée' 
            : '🔄 Tâche réactivée';
        showNotification(message, 'info');
    }
}

// ================================================
// SUPPRIMER TOUTES LES TÂCHES TERMINÉES
// ================================================
function clearCompletedTasks() {
    const completedCount = tasks.filter(t => t.completed).length;
    
    if (completedCount === 0) {
        showNotification('ℹ️ Aucune tâche terminée à supprimer', 'info');
        return;
    }
    
    if (!confirm(`Supprimer ${completedCount} tâche(s) terminée(s) ?`)) {
        return;
    }
    
    // Garder seulement les tâches non terminées
    tasks = tasks.filter(task => !task.completed);
    
    // Sauvegarder
    saveTasksToStorage();
    
    // Ré-afficher
    renderTasks();
    
    // Notification
    showNotification(`🗑️ ${completedCount} tâche(s) supprimée(s)`, 'success');
}

// ================================================
// SUPPRIMER TOUTES LES TÂCHES
// ================================================
function clearAllTasks() {
    if (tasks.length === 0) {
        showNotification('ℹ️ Aucune tâche à supprimer', 'info');
        return;
    }
    
    if (!confirm('⚠️ ATTENTION : Supprimer TOUTES les tâches ?')) {
        return;
    }
    
    // Vider le tableau
    tasks = [];
    
    // Sauvegarder
    saveTasksToStorage();
    
    // Ré-afficher
    renderTasks();
    
    // Notification
    showNotification('🗑️ Toutes les tâches ont été supprimées', 'info');
}

// ================================================
// CHANGER LE FILTRE
// ================================================
function setFilter(filter) {
    currentFilter = filter;
    
    // Mettre à jour les boutons actifs
    filterBtns.forEach(btn => {
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Ré-afficher les tâches
    renderTasks();
}

// ================================================
// AFFICHER LES TÂCHES
// ================================================
function renderTasks() {
    // Vider la liste
    taskList.innerHTML = '';
    
    // Filtrer les tâches selon le filtre actif
    let filteredTasks = tasks;
    
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }
    
    // Afficher l'état vide si nécessaire
    if (filteredTasks.length === 0) {
        emptyState.classList.remove('hidden');
        
        // Mettre à jour le message selon le filtre
        if (currentFilter === 'active' && tasks.length > 0) {
            emptyState.querySelector('p').textContent = '🎉 Toutes les tâches sont terminées !';
            emptyState.querySelector('.empty-subtitle').textContent = 'Vous avez tout accompli !';
        } else if (currentFilter === 'completed') {
            emptyState.querySelector('p').textContent = '📋 Aucune tâche terminée';
            emptyState.querySelector('.empty-subtitle').textContent = 'Commencez à cocher vos tâches !';
        } else {
            emptyState.querySelector('p').textContent = '🎯 Aucune tâche pour le moment';
            emptyState.querySelector('.empty-subtitle').textContent = 'Ajoutez votre première tâche ci-dessus !';
        }
    } else {
        emptyState.classList.add('hidden');
    }
    
    // Créer les éléments DOM pour chaque tâche
    filteredTasks.forEach(task => {
        const li = createTaskElement(task);
        taskList.appendChild(li);
    });
    
    // Mettre à jour les compteurs
    updateCounters();
}

// ================================================
// CRÉER L'ÉLÉMENT HTML D'UNE TÂCHE
// ================================================
function createTaskElement(task) {
    // Créer l'élément <li>
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.taskId = task.id;
    
    // Ajouter la classe 'completed' si nécessaire
    if (task.completed) {
        li.classList.add('completed');
    }
    
    // Créer la checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTaskComplete(task.id));
    
    // Créer le texte de la tâche
    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = task.text;
    
    // Créer la date
    const dateSpan = document.createElement('span');
    dateSpan.className = 'task-date';
    dateSpan.textContent = task.createdAt;
    
    // Créer le bouton de suppression
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-delete';
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.setAttribute('aria-label', 'Supprimer la tâche');
    deleteBtn.addEventListener('click', () => deleteTask(task.id));
    
    // Assembler l'élément
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(dateSpan);
    li.appendChild(deleteBtn);
    
    return li;
}

// ================================================
// METTRE À JOUR LES COMPTEURS
// ================================================
function updateCounters() {
    const total = tasks.length;
    const active = tasks.filter(t => !t.completed).length;
    const completed = tasks.filter(t => t.completed).length;
    
    countAll.textContent = total;
    countActive.textContent = active;
    countCompleted.textContent = completed;
}

// ================================================
// LOCALSTORAGE - SAUVEGARDER
// ================================================
function saveTasksToStorage() {
    try {
        const tasksJSON = JSON.stringify(tasks);
        localStorage.setItem(STORAGE_KEY, tasksJSON);
        console.log('💾 Tâches sauvegardées dans localStorage');
    } catch (error) {
        console.error('❌ Erreur lors de la sauvegarde:', error);
        showNotification('⚠️ Erreur lors de la sauvegarde', 'error');
    }
}

// ================================================
// LOCALSTORAGE - CHARGER
// ================================================
function loadTasksFromStorage() {
    try {
        const tasksJSON = localStorage.getItem(STORAGE_KEY);
        
        if (tasksJSON) {
            tasks = JSON.parse(tasksJSON);
            console.log(`📂 ${tasks.length} tâche(s) chargée(s) depuis localStorage`);
        } else {
            console.log('📂 Aucune tâche sauvegardée');
            tasks = [];
        }
    } catch (error) {
        console.error('❌ Erreur lors du chargement:', error);
        tasks = [];
    }
}

// ================================================
// SYSTÈME DE NOTIFICATIONS
// ================================================
function showNotification(message, type = 'info') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : 
                     type === 'warning' ? '#f59e0b' : 
                     type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        font-weight: 500;
        max-width: 300px;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Supprimer après 3 secondes
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Ajouter les animations pour les notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ================================================
// STATISTIQUES CONSOLE (BONUS)
// ================================================
function showStats() {
    console.log('📊 STATISTIQUES DU TASK MANAGER');
    console.log('================================');
    console.log(`📋 Total de tâches: ${tasks.length}`);
    console.log(`✅ Tâches terminées: ${tasks.filter(t => t.completed).length}`);
    console.log(`⏳ Tâches actives: ${tasks.filter(t => !t.completed).length}`);
    console.log(`🗂️ Filtre actif: ${currentFilter}`);
    console.log('================================');
}

// Exposer la fonction stats dans la console
window.taskManagerStats = showStats;

// ================================================
// DÉMARRAGE DE L'APPLICATION
// ================================================
document.addEventListener('DOMContentLoaded', () => {
    init();
    console.log('💡 Tapez "taskManagerStats()" dans la console pour voir les statistiques');
});

// ================================================
// GESTION DE LA FERMETURE DE LA PAGE
// ================================================
window.addEventListener('beforeunload', (e) => {
    // Les données sont déjà sauvegardées automatiquement
    // Mais on peut ajouter un avertissement si des tâches ne sont pas terminées
    const activeTasks = tasks.filter(t => !t.completed).length;
    
    if (activeTasks > 0) {
        // Note: Les navigateurs modernes ne permettent plus de personnaliser ce message
        e.preventDefault();
        e.returnValue = '';
    }
});

// ================================================
// EXPORT POUR TESTS (OPTIONNEL)
// ================================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Task,
        handleAddTask,
        deleteTask,
        toggleTaskComplete,
        saveTasksToStorage,
        loadTasksFromStorage
    };
}
