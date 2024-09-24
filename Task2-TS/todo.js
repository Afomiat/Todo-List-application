"use strict";
let editingItem = null;
// Function to render tasks
function renderTasks(tasks) {
    const container = document.getElementById('list-add');
    const empty = document.getElementById('empty');
    if (container) {
        container.innerHTML = '';
        if (tasks.length === 0) {
            if (empty)
                container.appendChild(empty);
        }
        else {
            empty === null || empty === void 0 ? void 0 : empty.remove();
            tasks.forEach(task => appendTaskToDOM(task));
        }
    }
}
// Function to edit a task
window.editTask = function (taskId) {
    console.log('Editing task:', taskId);
    let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        const taskInput = document.getElementById('text-inp');
        if (taskInput) {
            taskInput.value = task.task;
        }
        editingItem = taskId;
        toggleButtons(true);
    }
};
// Function to delete a task
window.deleteTask = function (taskId) {
    console.log('Deleting task:', taskId);
    let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks = tasks.filter(task => task.id !== taskId); // Remove the task from the list
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks(tasks);
};
// Function to toggle buttons visibility
function toggleButtons(isEditing) {
    const addButton = document.getElementById('add-btn');
    const updateButton = document.getElementById('edit-btn');
    if (isEditing) {
        if (addButton)
            addButton.style.display = 'none';
        if (updateButton)
            updateButton.style.display = 'inline-flex';
    }
    else {
        if (addButton)
            addButton.style.display = 'inline-flex';
        if (updateButton)
            updateButton.style.display = 'none';
    }
}
// Function to update a task
function updateTask(newTask, oldTaskId) {
    let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks = tasks.map(task => (task.id === oldTaskId ? Object.assign(Object.assign({}, task), { task: newTask }) : task));
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks(tasks);
    toggleButtons(false);
    const taskInput = document.getElementById('text-inp');
    if (taskInput)
        taskInput.value = '';
    editingItem = null;
}
// Function to add a task
function addTask(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const newTask = {
        id: Date.now(),
        task: task,
        isCompleted: false,
    };
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    appendTaskToDOM(newTask);
    const taskInput = document.getElementById('text-inp');
    if (taskInput)
        taskInput.value = '';
    const empty = document.getElementById('empty');
    if (empty)
        empty.style.display = 'none';
}
// Function to append a task to the DOM
function appendTaskToDOM(task) {
    const container = document.getElementById('list-add');
    if (!container)
        return;
    const taskElement = document.createElement('div');
    taskElement.classList.add('task-item');
    taskElement.innerHTML = `
        <div class="output">
            <i class="fa-duotone fa-solid fa-feather-pointed"></i>
            <p>${task.task}</p>
            <div class="btns">
                <button class="edit-btn" onclick="editTask(${task.id})">
                    <i class="fa-solid fa-edit"></i>
                </button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">
                    <i class="fa-solid fa-trash"></i>
                </button>
                <button class="done-btn" onclick="doneTask(${task.id})">
                    <i class="fa-solid fa-check"></i>
                </button>
            </div>
        </div>
    `;
    container.appendChild(taskElement);
}
// Event listener for DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('text-inp');
    const addButton = document.getElementById('add-btn');
    const updateButton = document.getElementById('edit-btn');
    // Load existing tasks from local storage
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    renderTasks(tasks);
    addButton === null || addButton === void 0 ? void 0 : addButton.addEventListener('click', () => {
        const task = taskInput === null || taskInput === void 0 ? void 0 : taskInput.value.trim();
        if (task)
            addTask(task);
    });
    updateButton === null || updateButton === void 0 ? void 0 : updateButton.addEventListener('click', () => {
        const task = taskInput === null || taskInput === void 0 ? void 0 : taskInput.value.trim();
        if (task && editingItem !== null) {
            updateTask(task, editingItem);
        }
    });
});
