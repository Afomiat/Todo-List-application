"use strict";
let editingItem = null;
// Define the editTask function outside the DOMContentLoaded listener
window.editTask = function (taskId) {
    let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        const taskInput = document.getElementById('text-inp');
        if (taskInput) {
            taskInput.value = task.task; // Set the input value to the task's text
        }
        editingItem = taskId; // Set the editing item ID
        toggleButtons(true); // Show the update button
    }
};
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
document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('text-inp');
    const addButton = document.getElementById('add-btn');
    const updateButton = document.getElementById('edit-btn');
    const container = document.getElementById('list-add');
    const empty = document.getElementById('empty');
    function renderTasks(tasks) {
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
    function updateTask(newTask, oldTaskId) {
        let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks = tasks.map(task => (task.id === oldTaskId ? Object.assign(Object.assign({}, task), { task: newTask }) : task));
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks(tasks);
        toggleButtons(false);
        if (taskInput)
            taskInput.value = '';
        editingItem = null;
    }
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
        if (taskInput)
            taskInput.value = '';
        if (empty)
            empty.style.display = 'none';
    }
    function appendTaskToDOM(task) {
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
