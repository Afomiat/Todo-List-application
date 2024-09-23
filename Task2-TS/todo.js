document.addEventListener('DOMContentLoaded', function () {
    // Fix the id selection to match the HTML
    var taskInput = document.getElementById('text-inp');
    var addButton = document.getElementById('add-btn');
    var updateButton = document.getElementById('edit-btn');
    var container = document.getElementById('list-add');
    var empty = document.getElementById('empty');
    function addTask(task) {
        var tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        var newTask = {
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
        var taskElement = document.createElement('div');
        taskElement.classList.add('task-item');
        taskElement.innerHTML = "\n            <div class=\"output\">\n                <i class=\"fa-duotone fa-solid fa-feather-pointed\"></i>\n                <p>".concat(task.task, "</p>\n                <div class=\"btns\">\n                    <button class=\"edit-btn\" onclick=\"editTask('").concat(task.id, "')\">\n                        <i class=\"fa-solid fa-edit\"></i>\n                    </button>\n                    <button class=\"delete-btn\" onclick=\"deleteTask('").concat(task.id, "')\">\n                        <i class=\"fa-solid fa-trash\"></i>\n                    </button>\n                    <button class=\"done-btn\" onclick=\"doneTask('").concat(task.id, "')\">\n                        <i class=\"fa-solid fa-check\"></i>\n                    </button>\n                </div>\n            </div>\n        ");
        container.appendChild(taskElement);
    }
    addButton === null || addButton === void 0 ? void 0 : addButton.addEventListener('click', function () {
        console.log('Add button clicked');
        var task = taskInput === null || taskInput === void 0 ? void 0 : taskInput.value.trim();
        console.log('Task input value:', task);
        if (task)
            addTask(task);
    });
});
