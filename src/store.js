import { Job } from './jobs.js';

const storedTasks = JSON.parse(localStorage.getItem("todo_tasks") || "null");
const storedFolders = JSON.parse(localStorage.getItem("todo_folders") || "[]");

const defaultTasks = [
    new Job("Finish quarterly report", "Compile the Q3 financial data and prepare slides for the board meeting.", "High", "2026-04-15", "Work"),
    new Job("Buy groceries", "Milk, eggs, bread, coffee, and detergent.", "Medium", "2026-04-04", "Home"),
    new Job("Gym routine", "Leg day, intense session.", "Low", "2026-04-05", "Personal"),
    new Job("Study for finals", "Review chapters 4, 5, and 6 of the Macroeconomics book.", "High", "2026-04-10", "University")
];

export const store = {
    tasks: storedTasks || defaultTasks,
    folders: storedFolders,
    currentCategory: "All Tasks",
    searchQuery: ""
};

if (!storedTasks) {
    saveState();
}

export function saveState() {
    localStorage.setItem("todo_tasks", JSON.stringify(store.tasks));
    localStorage.setItem("todo_folders", JSON.stringify(store.folders));
}

export function addTask(task) {
    store.tasks.push(task);
    saveState();
}

export function addFolderToStore(name, color) {
    store.folders.push({ name, color });
    saveState();
}

export function removeFolderFromStore(name) {
    store.folders = store.folders.filter(f => f.name !== name);
    saveState();
}

export function getTasks(category) {
    let result = [];
    if (category === "Done") {
        result = store.tasks.filter(task => task.checkList === true);
    } else if (category === "All Tasks" || category === "All") {
        result = store.tasks;
    } else {
        result = store.tasks.filter(task => task.category === category);
    }
    if (store.searchQuery) {
        const query = store.searchQuery.toLowerCase();
        result = result.filter(task =>
            task.title.toLowerCase().includes(query) ||
            (task.description && task.description.toLowerCase().includes(query))
        );
    }
    return result.sort((a, b) => {
        if (a.checkList === b.checkList) return 0;
        return a.checkList ? 1 : -1;
    });
}

export function deleteTasksByCategory(category) {
    store.tasks = store.tasks.filter(task => task.category !== category);
    saveState();
}

export function deleteTask(taskId) {
    store.tasks = store.tasks.filter(t => t.id !== taskId);
    saveState();
}

export function updateTask(taskId, updatedVals) {
    let task = store.tasks.find(t => t.id === taskId);
    if (task) {
        Object.assign(task, updatedVals);
        saveState();
    }
}
