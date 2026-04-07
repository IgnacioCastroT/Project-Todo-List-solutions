class Job {
    constructor(title, description, priority, date, category) {
        this.id = "task-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.date = date;
        this.category = category;
        this.checkList = false;
    }
}

export { Job }