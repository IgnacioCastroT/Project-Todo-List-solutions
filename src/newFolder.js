import { deleteTasksByCategory, store, addFolderToStore, removeFolderFromStore } from './store.js';
import { renderTasks } from './allTasks.js';

export function buildFolderDOM(folderName, folderColor) {
    const folderSection = document.querySelector(".folder.menu-section");
    const newFolderBtn = document.querySelector("#add_folder");

    if (folderName && folderSection && newFolderBtn) {
        const folderId = "folder-" + folderName.toLowerCase().replace(/\s+/g, '-');

        const newFolderDiv = document.createElement("div");
        newFolderDiv.className = "box-aside box-folder";
        newFolderDiv.id = folderId;
        newFolderDiv.dataset.folder = folderName;

        const icon = document.createElement("i");
        icon.className = `fa-solid fa-folder folder-color-${folderColor}`;

        const textSpan = document.createElement("span");
        textSpan.textContent = folderName;

        const trashIcon = document.createElement("i");
        trashIcon.className = "fa-solid fa-trash folder-action";

        newFolderDiv.appendChild(icon);
        newFolderDiv.appendChild(document.createTextNode(" "));
        newFolderDiv.appendChild(textSpan);
        newFolderDiv.appendChild(trashIcon);

        newFolderDiv.addEventListener("click", (evt) => {
            if (evt.target.classList.contains("folder-action")) return;
            store.currentCategory = folderName;
            document.querySelectorAll('.box-aside').forEach(el => el.classList.remove('active'));
            newFolderDiv.classList.add('active');
            renderTasks(folderName);
        });

        trashIcon.addEventListener("click", (evt) => {
            evt.stopPropagation();
            newFolderDiv.remove();
            
            deleteTasksByCategory(folderName);
            removeFolderFromStore(folderName);
            
            const taskCategorySelect = document.querySelector("#task-category");
            if (taskCategorySelect) {
                for (let i = 0; i < taskCategorySelect.options.length; i++) {
                    if (taskCategorySelect.options[i].value === folderName) {
                        taskCategorySelect.remove(i);
                        break;
                    }
                }
            }

            if (store.currentCategory === folderName) {
                document.querySelector("#all_Tasks").click();
            } else {
                renderTasks(store.currentCategory);
            }
        });

        folderSection.insertBefore(newFolderDiv, newFolderBtn);
        
        const taskCategorySelect = document.querySelector("#task-category");
        if (taskCategorySelect) {
            const newOption = document.createElement("option");
            newOption.value = folderName;
            newOption.textContent = folderName;
            taskCategorySelect.appendChild(newOption);
        }
    }
}

export function initializeFolderForm() {
    const modal = document.querySelector("#folder-modal");
    const addFolderBtn = document.querySelector("#add_folder");
    const closeBtn = document.querySelector("#close-folder-modal-btn");
    const cancelBtn = document.querySelector("#cancel-folder-btn");
    const form = document.querySelector("#new-folder-form");

    if (addFolderBtn && modal) {
        addFolderBtn.addEventListener("click", () => {
            modal.showModal();
        });
    }

    const closeModal = () => {
        if (modal) modal.close();
        if (form) form.reset();
    };

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const folderName = document.querySelector("#folder-name").value;
            const folderColor = document.querySelector("#folder-color").value;
            
            buildFolderDOM(folderName, folderColor);
            addFolderToStore(folderName, folderColor);
            
            closeModal();
        });
    }
}
