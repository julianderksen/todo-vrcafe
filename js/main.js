const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const completedList = document.getElementById('completed-list');
const categoryButtonsContainer = document.getElementById('category-list');
const currentCategoryTitle = document.getElementById('current-category');
const addCategoryForm = document.getElementById('add-category-form');
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menu-toggle');
const sidebarOverlay = document.getElementById('sidebar-overlay');

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
      closeSidebar();
    });
    categoryButtonsContainer.appendChild(button);
  });
}

todoForm.addEventListener('submit', e => {
  e.preventDefault();
  if (!todoInput.value.trim()) return;
  tasks.push({ text: todoInput.value.trim(), category: activeCategory, done: false });
  saveTasks();
  todoInput.value = '';
  renderTasks();
});

function renderTasks() {
  todoList.innerHTML = '';
  completedList.innerHTML = '';
  tasks.filter(t => t.category === activeCategory).forEach(task => {
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
        tasks = tasks.filter(t => t !== task);
        saveTasks();
        renderTasks();
      });
      li.classList.add('completed');
      li.appendChild(taskText);
      li.appendChild(deleteBtn);
      completedList.appendChild(li);
    }
  });
}

// Toevoegen categorie via form
addCategoryForm.addEventListener('submit', e => {
  e.preventDefault();
  const input = document.getElementById('new-category-input');
  const name = input.value.trim();
  if (!name || categories.includes(name)) return;
  categories.push(name);
  activeCategory = name;
  renderCategories();
  currentCategoryTitle.textContent = activeCategory;
  renderTasks();
  input.value = '';
  closeSidebar();
});

// Burger menu toggle
menuToggle.addEventListener('click', () => {
  sidebar.classList.toggle('visible');
  sidebarOverlay.classList.toggle('visible');
});

sidebarOverlay.addEventListener('click', closeSidebar);

function closeSidebar() {
  sidebar.classList.remove('visible');
  sidebarOverlay.classList.remove('visible');
}

// Swipe gesture (mobiel)
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX);
document.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  if (touchEndX < touchStartX - 50) {
    closeSidebar();
  }
});

renderCategories();
renderTasks();
