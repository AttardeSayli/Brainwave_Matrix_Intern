
document.addEventListener('DOMContentLoaded', function () {
    const addTaskBtn = document.getElementById('add-task-btn');
    const colorOptions = document.getElementById('color-options');
    const darkModeBtn = document.getElementById('dark-mode-btn');
    const body = document.body;
    const taskInputBar = document.getElementById('task-input-bar');
    const taskContainer = document.getElementById('task-container');

    // Show color options when clicking the + button
    addTaskBtn.addEventListener('click', () => {
        colorOptions.classList.toggle('hidden');
    });

    // Toggle dark mode
    darkModeBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
    });

    // Add new task when clicking a color (with Genie effect)
    document.querySelectorAll('#color-options .color').forEach((colorDiv) => {
        colorDiv.addEventListener('click', function () {
            const color = this.style.backgroundColor;
            flyAndAddTask(this, color);
            colorOptions.classList.add('hidden');
        });
    });

    // Function to handle the genie effect and add task
    function flyAndAddTask(colorDiv, color) {
        const taskText = taskInputBar.value.trim();
        if (taskText === '') {
            alert('Please enter a task description.');
            return;
        }

        // Create a cloned element to fly
        const flyingColor = colorDiv.cloneNode(true);
        flyingColor.classList.add('fly');
        flyingColor.style.position = 'fixed';
        flyingColor.style.zIndex = '999';
        document.body.appendChild(flyingColor);

        // Get the position of the color and the task container
        const colorRect = colorDiv.getBoundingClientRect();
        const taskContainerRect = taskContainer.getBoundingClientRect();

        // Set the initial position of the cloned element
        flyingColor.style.left = `${colorRect.left}px`;
        flyingColor.style.top = `${colorRect.top}px`;
        flyingColor.style.width = `${colorRect.width}px`;
        flyingColor.style.height = `${colorRect.height}px`;

        // Animate the flying color to the task container
        setTimeout(() => {
            flyingColor.style.transition = 'all 0.8s ease-out';
            flyingColor.style.left = `${taskContainerRect.left + 10}px`;
            flyingColor.style.top = `${taskContainerRect.top + 10}px`;
            flyingColor.style.transform = 'scale(1.2)';
            flyingColor.style.borderRadius = '90px'; // Start transforming into a card
        }, 0);

        // Once the animation ends, add the task card
        flyingColor.addEventListener('transitionend', function () {
            // Remove the flying element
            flyingColor.remove();

            // Add the task card
            addTask(color);
        });
    }

    // Function to add new task with date
    function addTask(color) {
        const taskText = taskInputBar.value.trim();
        const taskCard = document.createElement('div');
        taskCard.classList.add('task-card');
        taskCard.style.backgroundColor = color;

        // Get the current date
        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

        // Add date and task text to the task card
        taskCard.innerHTML = `
            <div class="task-date">${formattedDate}</div>
            <p>${taskText}</p>
            <div class="task-actions">
                <button class="edit-task">✎</button>
                <button class="complete-task">✓</button>
                <button class="delete-task">✗</button>
            </div>
        `;

        taskContainer.appendChild(taskCard);

        // Add animations
        taskCard.style.opacity = 0;
        setTimeout(() => {
            taskCard.style.opacity = 1;
            taskCard.style.transition = 'opacity 0.3s ease-in-out';
        }, 0);

        // Reset input bar
        taskInputBar.value = '';

        // Add task actions
        const editBtn = taskCard.querySelector('.edit-task');
        const completeBtn = taskCard.querySelector('.complete-task');
        const deleteBtn = taskCard.querySelector('.delete-task');

        // Edit task
        editBtn.addEventListener('click', () => {
            const currentText = taskCard.querySelector('p').textContent;
            const newText = prompt('Edit task:', currentText);
            if (newText && newText.trim() !== '') {
                taskCard.querySelector('p').textContent = newText;
            }
        });

        // Complete task
        completeBtn.addEventListener('click', () => {
            taskCard.classList.toggle('completed');
            if (taskCard.classList.contains('completed')) {
                taskCard.querySelector('p').style.textDecoration = 'line-through';
                taskCard.querySelector('p').style.opacity = '0.7';
            } else {
                taskCard.querySelector('p').style.textDecoration = 'none';
                taskCard.querySelector('p').style.opacity = '1';
            }
        });

        // Delete task with fly-away effect
        deleteBtn.addEventListener('click', () => {
            taskCard.classList.add('fly-away');
            setTimeout(() => {
                taskContainer.removeChild(taskCard);
            }, 800);
        });
    }
});
