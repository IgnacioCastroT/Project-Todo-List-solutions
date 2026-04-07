import "./styles.css";
import { store, deleteTasksByCategory } from './store.js';
import { renderTasks } from './allTasks.js';

// Initialize the form modals
import { initializeTaskForm } from './newJob.js';
import { initializeFolderForm, buildFolderDOM } from './newFolder.js';

initializeTaskForm();
initializeFolderForm();

// Render persisted custom folders
if (store.folders && store.folders.length > 0) {
    store.folders.forEach(f => {
        buildFolderDOM(f.name, f.color);
    });
}

const taskSection = document.querySelector(".task");
const folderSection = document.querySelector(".folder");

// Helper function to setup active state and render
function routeTo(category, element) {
    store.currentCategory = category;
    document.querySelectorAll('.box-aside').forEach(el => el.classList.remove('active'));
    if (element) element.classList.add('active');
    renderTasks(category);
}

// 1. Initial Render & Global Listeners
document.addEventListener("DOMContentLoaded", () => {
    // Select the "All Tasks" button to be active
    const allBtn = document.querySelector("#all_Tasks");
    if (allBtn) {
        routeTo("All Tasks", allBtn);
    }

    // Bind search bar
    const searchInput = document.querySelector(".search-container input");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            store.searchQuery = e.target.value.trim();
            renderTasks(store.currentCategory);
        });
    }
});

// 2. Setup standard routing for static folders
document.querySelectorAll(".box-aside").forEach(item => {
    // Only bind static items we have not generated dynamically 
    // (dynamic ones are bound in newFolder.js)
    if (item.id === "all_Tasks") {
        item.addEventListener("click", () => routeTo("All Tasks", item));
    }
    
    if (item.id === "done_Tasks") {
        item.addEventListener("click", () => routeTo("Done", item));
    }
    
    // The dataset.folder comes from template.html for Work, Personal, etc.
    if (item.dataset.folder) {
        item.addEventListener("click", (e) => {
            if (e.target.classList.contains("folder-action")) return; // exclude trash icon click
            routeTo(item.dataset.folder, item);
        });
        
        // Bind trash icon for static items
        const trashBtn = item.querySelector(".folder-action");
        if (trashBtn) {
            trashBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                const folderName = item.dataset.folder;
                
                item.remove();
                deleteTasksByCategory(folderName);
                
                // Remove from the task form select dropdown
                const select = document.querySelector("#task-category");
                if (select) {
                    for (let i = 0; i < select.options.length; i++) {
                        if (select.options[i].value === folderName) {
                            select.remove(i);
                            break;
                        }
                    }
                }
                
                // If viewing deleted folder, fallback to All Tasks
                if (store.currentCategory === folderName) {
                    const allBtn = document.querySelector("#all_Tasks");
                    if (allBtn) routeTo("All Tasks", allBtn);
                } else {
                    renderTasks(store.currentCategory);
                }
            });
        }
    }
});