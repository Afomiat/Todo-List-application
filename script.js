document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('text-inp');
    const addButton = document.getElementById('add-btn');
    const updateButton = document.getElementById('edit-btn');
    const container = document.getElementById('list-add');
    const empty = document.getElementById('empty');

    let editingItem = null;

    function toggleButtons(isEditing) {
        if (isEditing) {
            addButton.style.display = 'none';
            updateButton.style.display = 'inline-flex';
        } else {
            addButton.style.display = 'inline-flex';
            updateButton.style.display = 'none';
        }
    }

    function renderTasks(tasks) {
        container.innerHTML = '';
        if (tasks.length === 0) {
            container.appendChild(empty);
        } else {
            empty.remove();
            tasks.forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.classList.add('task-item');
                taskElement.innerHTML = `
                    <p>${task}</p>
                    <button class="edit-btn" onclick="editTask('${task}')">
                        <i class="fa-solid fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteTask('${task}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                `;
                container.appendChild(taskElement);
            });
        }
    }

    function addTask(task) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks(tasks);
        taskInput.value = '';
    }

    function updateTask(oldTask, newTask) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.map(task => task === oldTask ? newTask : task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks(tasks);
        toggleButtons(false);
        taskInput.value = '';
        editingItem = null;
    }

    function deleteTask(task) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(t => t !== task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks(tasks);
    }

    window.editTask = function(task) {
        taskInput.value = task;
        editingItem = task;
        toggleButtons(true);
    };

    window.deleteTask = function(task) {
        deleteTask(task);
    };

    addButton.addEventListener('click', () => {
        const task = taskInput.value.trim();
        if (task) {
            if (editingItem) {
                updateTask(editingItem, task);
            } else {
                addTask(task);
            }
        }
    });

    updateButton.addEventListener('click', () => {
        const task = taskInput.value.trim();
        if (task && editingItem) {
            updateTask(editingItem, task);
        }
    });

    // Initial load
    renderTasks(JSON.parse(localStorage.getItem('tasks')) || []);
});
