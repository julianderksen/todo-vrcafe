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
const filterSelect = document.getElementById('filter-select');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let categories = ['Werk', 'Persoonlijk', 'School'];
let activeCategory = 'Werk';

// Sla taken op in localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Toon de categorieknoppen in de sidebar
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
  // Voeg nieuwe taak toe met standaard voortgang 0%
  tasks.push({ text: todoInput.value.trim(), category: activeCategory, done: false, createdAt: Date.now(), progress: 0 });
  saveTasks();
  todoInput.value = '';
  renderTasks();
});

// Toon de takenlijst en afgeronde taken
function renderTasks() {
  todoList.innerHTML = '';
  completedList.innerHTML = '';
  let filteredTasks = tasks.filter(t => t.category === activeCategory);

  // Sorteer taken op basis van geselecteerde optie
  const sortOption = filterSelect.value;
  if (sortOption === 'alphabetical') {
    filteredTasks.sort((a, b) => a.text.localeCompare(b.text));
  } else if (sortOption === 'alphabetical-reverse') {
    filteredTasks.sort((a, b) => b.text.localeCompare(a.text));
  } else if (sortOption === 'date') {
    filteredTasks.sort((a, b) => a.createdAt - b.createdAt);
  } else if (sortOption === 'date-reverse') {
    filteredTasks.sort((a, b) => b.createdAt - a.createdAt);
  }

  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.classList.add('task-item');
    // Maak en toon de voortgangsbalk
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.style.width = (task.progress || 0) + '%';
    // Toon percentage in het midden van de voortgangsbalk
    const percentLabel = document.createElement('span');
    percentLabel.className = 'progress-label';
    percentLabel.textContent = (task.progress || 0) + '%';
    progressBar.appendChild(percentLabel);
    li.appendChild(progressBar);

    const taskText = document.createElement('span');
    taskText.textContent = task.text;
    taskText.style.zIndex = 2;
    li.appendChild(taskText);

    if (!task.done) {
      // Slider altijd zichtbaar onder niet-afgeronde taken
      const slider = document.createElement('input');
      slider.type = 'range';
      slider.min = 0;
      slider.max = 100;
      slider.value = task.progress || 0;
      slider.className = 'progress-slider';
      slider.addEventListener('input', () => {
        task.progress = parseInt(slider.value);
        saveTasks();
        progressBar.style.width = task.progress + '%';
        percentLabel.textContent = task.progress + '%';
        // Automatisch afronden als 100%
        if (task.progress === 100 && !task.done) {
          li.classList.add('complete-animate');
          const todoWrapper = document.querySelector('.todo-wrapper');
          todoWrapper.classList.add('animate-gradient');
          setTimeout(() => {
            task.done = true;
            saveTasks();
            renderTasks();
          }, 300);
          setTimeout(() => {
            todoWrapper.classList.remove('animate-gradient');
          }, 5000);
        }
      });
      slider.addEventListener('change', () => {
        saveTasks();
        renderTasks();
      });
      li.appendChild(slider);
      todoList.appendChild(li);
    } else {
      // Alleen tekst en prullenbakje bij afgeronde taken
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '🗑️';
      deleteBtn.classList.add('delete-task');
      deleteBtn.addEventListener('click', () => {
        li.classList.add('delete-animate');
        setTimeout(() => {
          tasks = tasks.filter(t => t !== task);
          saveTasks();
          renderTasks();
        }, 300);
      });
      li.classList.add('completed');
      li.innerHTML = '';
      const taskTextCompleted = document.createElement('span');
      taskTextCompleted.textContent = task.text;
      li.appendChild(taskTextCompleted);
      li.appendChild(deleteBtn);
      completedList.appendChild(li);
    }
  });
}

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

// Swipe gesture voor mobiel: sluit sidebar bij swipe naar links
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX);
document.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  if (touchEndX < touchStartX - 50) {
    closeSidebar();
  }
});

// Sorteer taken bij wijziging van de filter
filterSelect.addEventListener('change', renderTasks);

// Help button functionaliteit
const helpBtn = document.getElementById('help-btn');
const helpOverlay = document.getElementById('help-overlay');
const closeHelp = document.getElementById('close-help');
if (helpBtn && helpOverlay && closeHelp) {
  helpBtn.addEventListener('click', () => {
    helpOverlay.style.display = 'flex';
  });
  closeHelp.addEventListener('click', () => {
    helpOverlay.style.display = 'none';
  });
  helpOverlay.addEventListener('click', (e) => {
    if (e.target === helpOverlay) helpOverlay.style.display = 'none';
  });
}

renderCategories();
renderTasks();
