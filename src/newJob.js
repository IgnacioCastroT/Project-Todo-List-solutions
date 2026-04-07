import { Job } from './jobs.js';
import { addTask, store, updateTask } from './store.js';
import { renderTasks } from './allTasks.js';

let editingTaskId = null;

export function openTaskFormForEdit(task) {
    const modal = document.querySelector("#task-modal");
    if (!modal) return;
    
    document.querySelector("#task-title").value = task.title;
    document.querySelector("#task-desc").value = task.description || "";
    document.querySelector("#task-date").value = task.date;
    document.querySelector("#task-priority").value = task.priority;
    document.querySelector("#task-category").value = task.category;
    
    editingTaskId = task.id;
    
    const submitBtn = document.querySelector("#new-task-form button[type='submit']");
    if(submitBtn) submitBtn.textContent = "Save Changes";
    const headerTitle = document.querySelector(".modal-header h2");
    if(headerTitle) headerTitle.textContent = "Edit Task";
    
    modal.showModal();
}

function initializeTaskForm() {
    const modal = document.querySelector("#task-modal");
    const addTaskBtn = document.querySelector("#add-task-btn");
    const closeBtn = document.querySelector("#close-modal-btn");
    const cancelBtn = document.querySelector("#cancel-task-btn");
    const form = document.querySelector("#new-task-form");

    if (addTaskBtn && modal) {
        addTaskBtn.addEventListener("click", () => {
            const today = new Date().toISOString().split('T')[0];
            const dateInput = document.querySelector("#task-date");
            if (dateInput) dateInput.value = today;
            
            modal.showModal();
        });
    }

    const closeModal = () => {
        if (modal) modal.close();
        if (form) form.reset();
        
        // Reset editing state
        editingTaskId = null;
        const submitBtn = form?.querySelector("button[type='submit']");
        if(submitBtn) submitBtn.textContent = "Create Task";
        const headerTitle = document.querySelector(".modal-header h2");
        if(headerTitle) headerTitle.textContent = "New Task";
    };

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const title = document.querySelector("#task-title").value;
            const description = document.querySelector("#task-desc").value;
            const date = document.querySelector("#task-date").value;
            const priority = document.querySelector("#task-priority").value;
            const category = document.querySelector("#task-category").value;

            if (editingTaskId) {
                updateTask(editingTaskId, { title, description, priority, date, category });
            } else {
                const newJob = new Job(title, description, priority, date, category);
                addTask(newJob);
            }
            
            renderTasks(store.currentCategory);
            closeModal();
        });
    }
}

export { initializeTaskForm };