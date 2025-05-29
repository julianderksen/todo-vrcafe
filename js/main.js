const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const completedList = document.getElementById('completed-list');
const categoryButtonsContainer = document.getElementById('category-list');
const currentCategoryTitle = document.getElementById('current-category');
const addCategoryForm = document.getElementById('add-category-form');
const burgerMenu = document.getElementById('burger-menu');
const sidebar = document.getElementById('sidebar');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let categories = ['Werk', 'Persoonlijk', 'School'];
let activeCategory = 'Werk';

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderCategories() {
  categoryButtonsContainer.innerHTML = '';

  categories.forEach(category => {
    const button = document.createElement('button');
    button.textContent = category;
    button.classList.add('category-button');
    if (category === activeCategory) button.classList.add('active');

    button.addEventListener('click', () => {
      document.querySelectorAll('.category-button').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      activeCategory = category;
      currentCategoryTitle.textContent = activeCategory;
      renderTasks();
      sidebar.classList.remove('visible'); // Sidebar sluiten op mobiel
    });

    categoryButtonsContainer.appendChild(button);
  });
}

todoForm.addEventListener('submit', e => {
  e.preventDefault();
  if (!todoInput.value.trim()) return;

  const newTask = {
    text: todoInput.value.trim(),
    category: activeCategory,
    done: false
  };
  tasks.push(newTask);
  saveTasks();
  todoInput.value = '';
  renderTasks();
});

function renderTasks() {
  todoList.innerHTML = '';
  completedList.innerHTML = '';

  const filtered = tasks.filter(task => task.category === activeCategory);

  filtered.forEach(task => {
    const li = document.createElement('li');
    li.classList.add('task-item');

    const taskText = document.createElement('span');
    taskText.textContent = task.text;

    if (!task.done) {
      const checkBtn = document.createElement('button');
      checkBtn.classList.add('checkmark');

      checkBtn.addEventListener('click', () => {
        task.done = true;
        saveTasks();
        renderTasks();
      });

      li.appendChild(taskText);
      li.appendChild(checkBtn);
      todoList.appendChild(li);
    } else {
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '🗑️';
      deleteBtn.classList.add('delete-task');

      deleteBtn.addEventListener('click', () => {
        const index = tasks.indexOf(task);
        if (index !== -1) {
          tasks.splice(index, 1);
          saveTasks();
          renderTasks();
        }
      });

      li.classList.add('completed');
      li.appendChild(taskText);
      li.appendChild(deleteBtn);
      completedList.appendChild(li);
    }
  });
}

let inputVisible = false;
let hideTimer = null;

addCategoryForm.addEventListener('submit', e => {
  e.preventDefault();
  if (inputVisible) return;

  inputVisible = true;
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Nieuwe categorie';
  input.classList.add('new-category-input');

  addCategoryForm.appendChild(input);
  input.focus();

  function resetTimer() {
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      if (!input.value.trim()) {
        input.classList.add('fade-out');
        setTimeout(() => {
          addCategoryForm.removeChild(input);
          inputVisible = false;
        }, 300);
      }
    }, 10000);
  }

  input.addEventListener('input', resetTimer);
  resetTimer();

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const name = input.value.trim();
      if (!name || categories.includes(name)) return;

      categories.push(name);
      activeCategory = name;
      renderCategories();
      currentCategoryTitle.textContent = activeCategory;
      renderTasks();

      addCategoryForm.removeChild(input);
      inputVisible = false;
    }
  });
});

// Burger menu toggle
burgerMenu.addEventListener('click', () => {
  sidebar.classList.toggle('visible');
});

renderCategories();
renderTasks();
