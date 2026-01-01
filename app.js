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
const tasklist = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const clearCompleteBtn = document.getElementById('clearCompleteBtn');
const clearAllBtn = document.getElementById('cleanAllBtn');
const filterBtns = document.getElementById('filterBtns');

// Comteurs
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

    //Afficher les tâches
    renderTasks();

    // Attacher les événements
    attachEventListers();

    console.log('✅ Application initialisée avec succès');
}