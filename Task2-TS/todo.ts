interface TodoItem {
    id: number;
    task: string;
    
}

let editingItem: number | null = null;


function renderTasks(tasks: TodoItem[]) {
    const container = document.getElementById('list-add') as HTMLDivElement | null;
    const empty = document.getElementById('empty') as HTMLDivElement | null;

    if (container) {
        container.innerHTML = '';
        if (tasks.length === 0) {
            if (empty) container.appendChild(empty);
        } else {
            empty?.remove();
            tasks.forEach(task => appendTaskToDOM(task));
        }
    }
}

// Function to edit a task
(window as any).editTask = function(taskId: number) {
    console.log('Editing task:', taskId);
    let tasks: TodoItem[] = JSON.parse(localStorage.getItem('tasks') || '[]');
    const task = tasks.find(t => t.id === taskId);
    
    if (task) {
        const taskInput = document.getElementById('text-inp') as HTMLInputElement | null;
        if (taskInput) {
            taskInput.value = task.task.replace(/<\/?s>/g, '');  
        }
        editingItem = taskId; 
        toggleButtons(true);  
    }
};

// Function to delete a task
(window as any).deleteTask = function(taskId: number) {
    console.log('Deleting task:', taskId);
    let tasks: TodoItem[] = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks = tasks.filter(task => task.id !== taskId); 
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks(tasks); 
};

(window as any).doneTask = function(taskId: number) {
    let tasks: TodoItem[] = JSON.parse(localStorage.getItem('tasks') || '[]');


    tasks = tasks.map(task => {
        if (task.id === taskId) {
            const isDone = task.task.startsWith('<s>') && task.task.endsWith('</s>');
            const updatedTask = isDone ? task.task.replace(/<\/?s>/g, '') : `<s>${task.task}</s>`;
            return { ...task, task: updatedTask }; 
        }
        return task; 
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks(tasks);
};


function toggleButtons(isEditing: boolean) {
    const addButton = document.getElementById('add-btn') as HTMLButtonElement | null;
    const updateButton = document.getElementById('edit-btn') as HTMLButtonElement | null;

    if (isEditing) {
        if (addButton) addButton.style.display = 'none';
        if (updateButton) updateButton.style.display = 'inline-flex';
    } else {
        if (addButton) addButton.style.display = 'inline-flex';
        if (updateButton) updateButton.style.display = 'none';
    }
}

// Function to update a task
function updateTask(newTask: string, oldTaskId: number) {
    let tasks: TodoItem[] = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks = tasks.map(task => (task.id === oldTaskId ? { ...task, task: newTask } : task));
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks(tasks);
    toggleButtons(false);
    const taskInput = document.getElementById('text-inp') as HTMLInputElement | null;
    if (taskInput) taskInput.value = '';
    editingItem = null;
}

// Function to add a task
function addTask(task: string) {
    let tasks: TodoItem[] = JSON.parse(localStorage.getItem('tasks') || '[]');
    const newTask: TodoItem = {
        id: Date.now(),
        task: task,
        
    };
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    appendTaskToDOM(newTask);
    const taskInput = document.getElementById('text-inp') as HTMLInputElement | null;
    if (taskInput) taskInput.value = '';
    const empty = document.getElementById('empty') as HTMLDivElement | null;
    if (empty) empty.style.display = 'none';
}

// Function to append a task to the DOM
function appendTaskToDOM(task: TodoItem) {
    const container = document.getElementById('list-add') as HTMLDivElement | null;
    if (!container) return;

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
    const taskInput = document.getElementById('text-inp') as HTMLInputElement | null;
    const addButton = document.getElementById('add-btn') as HTMLButtonElement | null;
    const updateButton = document.getElementById('edit-btn') as HTMLButtonElement | null;

    // Load existing tasks from local storage
    const tasks: TodoItem[] = JSON.parse(localStorage.getItem('tasks') || '[]');
    renderTasks(tasks);

    addButton?.addEventListener('click', () => {
        const task = taskInput?.value.trim();
        if (task) addTask(task);
    });
    
    updateButton?.addEventListener('click', () => {
        const task = taskInput?.value.trim();
        if (task && editingItem !== null) {
            updateTask(task, editingItem);
        }
    });
});
