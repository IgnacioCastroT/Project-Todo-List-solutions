import { store, getTasks, deleteTask, updateTask } from './store.js';
import { openTaskFormForEdit } from './newJob.js';

export function renderTasks(category = "All Tasks") {
    const mainContent = document.querySelector(".main-content");
    if (!mainContent) return;

    // Clear content
    mainContent.innerHTML = "";

    // Generate Header
    const header = document.createElement("h1");
    header.className = "main-title";
    header.textContent = category;
    
    const desc = document.createElement("p");
    desc.className = "main-description";
    if (category === "All Tasks") {
        desc.textContent = "Organize your thoughts and execute with precision. Focus on what matters most.";
    } else {
        desc.textContent = `Tasks for the ${category} folder.`;
    }

    mainContent.appendChild(header);
    mainContent.appendChild(desc);

    const tasks = getTasks(category);

    if (tasks.length === 0) {
        const emptyState = document.createElement("div");
        emptyState.className = "empty-state";
        
        const emptyIcon = document.createElement("i");
        emptyIcon.className = "fa-solid fa-list-check";
        
        const emptyText = document.createElement("h3");
        emptyText.textContent = "No tasks found";
        
        const emptySubText = document.createElement("p");
        emptySubText.textContent = "Click the + button below to create your first task.";
        
        emptyState.appendChild(emptyIcon);
        emptyState.appendChild(emptyText);
        emptyState.appendChild(emptySubText);
        
        mainContent.appendChild(emptyState);
        return;
    }

    const grid = document.createElement("div");
    grid.className = "task-grid";

    tasks.forEach(task => {
        const card = document.createElement("div");

        // Create Badge Priority class
        let badgeClass = "badge-low";
        if (task.priority === "High") badgeClass = "badge-high";
        if (task.priority === "Medium") badgeClass = "badge-medium";

        // Completed state styling
        const completedClass = task.checkList ? "completed" : "";
        const isChecked = task.checkList ? "checked" : "";
        
        card.className = `task-card ${completedClass}`;

        card.innerHTML = `
            <div class="task-header">
                <div class="task-status">
                    <input type="checkbox" class="task-checkbox" title="Mark as done" ${isChecked}>
                    <span class="badge ${badgeClass}">${task.priority} Priority</span>
                </div>
                <div class="task-actions">
                    <button class="task-action-btn task-edit-btn" data-id="${task.id}" title="Edit Task">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="task-action-btn task-delete-btn" data-id="${task.id}" title="Delete Task">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
            <div>
                <h3 class="task-title">${task.title}</h3>
                <p class="task-desc">${task.description || "No description provided."}</p>
            </div>
            <div class="task-footer">
                <div class="task-category-label">
                    <i class="fa-solid fa-folder"></i> ${task.category}
                </div>
                <div class="task-date">
                    <i class="fa-regular fa-calendar"></i> ${task.date || "N/A"}
                </div>
            </div>
        `;

        // Bind delete action
        const deleteBtn = card.querySelector(".task-delete-btn");
        deleteBtn.addEventListener("click", () => {
            deleteTask(task.id);
            renderTasks(store.currentCategory);
        });

        // Bind edit action
        const editBtn = card.querySelector(".task-edit-btn");
        editBtn.addEventListener("click", () => {
            openTaskFormForEdit(task);
        });

        // Bind checkbox toggle action
        const checkbox = card.querySelector(".task-checkbox");
        checkbox.addEventListener("change", (e) => {
            updateTask(task.id, { checkList: e.target.checked });
            renderTasks(store.currentCategory);
        });

        grid.appendChild(card);
    });

    mainContent.appendChild(grid);
}