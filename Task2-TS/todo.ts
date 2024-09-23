document.addEventListener('DOMContentLoaded', () => {
    // Fix the id selection to match the HTML
    const taskInput = document.getElementById('text-inp') as HTMLInputElement | null;
    const addButton = document.getElementById('add-btn') as HTMLButtonElement | null;
    const updateButton = document.getElementById('edit-btn') as HTMLButtonElement | null;
    const container = document.getElementById('list-add') as HTMLDivElement | null;
    const empty = document.getElementById('empty') as HTMLDivElement | null;

    interface TodoItem {
        id: number;
        task: string;
        isCompleted: boolean;
    }

    function addTask(task: string) {
        let tasks: TodoItem[] = JSON.parse(localStorage.getItem('tasks') || '[]');

        const newTask: TodoItem = {
            id: Date.now(),
            task: task,
            isCompleted: false,
        };

        tasks.push(newTask);

        localStorage.setItem('tasks', JSON.stringify(tasks));

        appendTaskToDOM(newTask);

        if (taskInput) taskInput.value = '';

        if (empty) empty.style.display = 'none';
    }

    function appendTaskToDOM(task: TodoItem) {
        if (!container) return;

        const taskElement = document.createElement('div');
        taskElement.classList.add('task-item');
        taskElement.innerHTML = `
            <div class="output">
                <i class="fa-duotone fa-solid fa-feather-pointed"></i>
                <p>${task.task}</p>
                <div class="btns">
                    <button class="edit-btn" onclick="editTask('${task.id}')">
                        <i class="fa-solid fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteTask('${task.id}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                    <button class="done-btn" onclick="doneTask('${task.id}')">
                        <i class="fa-solid fa-check"></i>
                    </button>
                </div>
            </div>
        `;
        container.appendChild(taskElement);
    }

    addButton?.addEventListener('click', () => {
        console.log('Add button clicked');
        const task = taskInput?.value.trim();
        console.log('Task input value:', task);

        if (task) addTask(task);
    });
});
