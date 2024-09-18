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

    function appendTaskToDOM(task) {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task-item');
        taskElement.innerHTML = `
            <div>
                <p>${task}</p>
                <button class="edit-btn" onclick="editTask('${task.replace(/'/g, "\\'")}')">
                    <i class="fa-solid fa-edit"></i>
                </button>
                <button class="delete-btn" onclick="deleteTask('${task.replace(/'/g, "\\'")}')">
                    <i class="fa-solid fa-trash"></i>
                </button>
                <button class="done-btn" onclick="doneTask('${task.replace(/'/g, "\\'")}')">
                    <i class="fa-solid fa-check"></i>
                </button>
            <div/>
        `;
        container.appendChild(taskElement);
    }
    
    function renderTasks(tasks) {
        container.innerHTML = '';
        if (tasks.length === 0) {
            container.appendChild(empty);
        } else {
            empty.remove();
            tasks.forEach(task => appendTaskToDOM(task));
        }
    }

    function addTask(task) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        appendTaskToDOM(task);
        taskInput.value = '';
        empty.style.display = 'none';
    }

    function updateTask(oldTask, newTask) {
        console.log(oldTask, newTask, 'Internal');
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        
        tasks = tasks.map(task => task === oldTask ? newTask : task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks(tasks);
        
        toggleButtons(false);
        taskInput.value = '';
        editingItem = null;
    }
    
    function deleteTask(target) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

        const cleanTask = target.replace(/<\/?s>/g, '');

        tasks = tasks.filter(task => {
            const cleanStoredTask = task.replace(/<\/?s>/g, '');
            return cleanStoredTask !== cleanTask;
        });

        localStorage.setItem('tasks', JSON.stringify(tasks));

        renderTasks(tasks);
    }

    function doneTask(task) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

        const isDone = task.startsWith('<s>') && task.endsWith('</s>');
        const updatedTask = isDone ? task.replace(/<\/?s>/g, '') : `<s>${task}</s>`;


        tasks = tasks.map(t => t === task ? updatedTask : t);
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

    window.doneTask = function(task) {
        doneTask(task);
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

    renderTasks(JSON.parse(localStorage.getItem('tasks')) || []);
});
