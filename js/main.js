const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const categoryButtonsContainer = document.getElementById('category-list');
const currentCategoryTitle = document.getElementById('current-category');

const showCategoryInputBtn = document.getElementById('show-category-input');
const addCategoryForm = document.getElementById('add-category-form');
const newCategoryInput = document.getElementById('new-category-input');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let categories = ['Werk', 'Persoonlijk', 'School'];
let activeCategory = 'Werk';

let categoryInputTimeout = null;

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// === Categorieën renderen ===
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
    });

    categoryButtonsContainer.appendChild(button);
  });
}

// === Taken toevoegen ===
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

// === Taken renderen ===
function renderTasks() {
  todoList.innerHTML = '';
  const filtered = tasks.filter(task => task.category === activeCategory);

  filtered.forEach(task => {
    const li = document.createElement('li');
    li.classList.add('task-item');

    const taskText = document.createElement('span');
    taskText.textContent = task.text;

    const checkBtn = document.createElement('button');
    checkBtn.classList.add('checkmark');

    checkBtn.addEventListener('click', () => {
      checkBtn.classList.add('checked');
      li.classList.add('fade-out');
      setTimeout(() => {
        const taskIndex = tasks.indexOf(task);
        tasks.splice(taskIndex, 1);
        saveTasks();
        renderTasks();
      }, 300);
    });

    li.appendChild(taskText);
    li.appendChild(checkBtn);
    todoList.appendChild(li);
  });
}

// === Toon categorie-inputveld ===
function showCategoryInput() {
  addCategoryForm.classList.remove('fade-out');
  addCategoryForm.style.display = 'flex';
  newCategoryInput.focus();
  monitorInputForTimeout(); // start timer monitor
}

// === Monitor inputveld gedrag ===
function monitorInputForTimeout() {
  if (categoryInputTimeout) clearTimeout(categoryInputTimeout);

  function checkInput() {
    if (newCategoryInput.value.trim() === '') {
      categoryInputTimeout = setTimeout(() => {
        hideCategoryInput();
      }, 10000); // 10 sec als veld leeg is
    }
  }

  // Voer check uit bij starten
  checkInput();

  // Elke keer dat je typt of veld verandert
  newCategoryInput.addEventListener('input', () => {
    if (categoryInputTimeout) clearTimeout(categoryInputTimeout);
    checkInput();
  });
}

// === Verberg categorieveld met fade-out ===
function hideCategoryInput() {
  addCategoryForm.classList.add('fade-out');
  setTimeout(() => {
    addCategoryForm.style.display = 'none';
    newCategoryInput.value = '';
    addCategoryForm.classList.remove('fade-out');
  }, 300);
}

// === Knop: categorie toevoegen tonen ===
showCategoryInputBtn.addEventListener('click', () => {
  showCategoryInput();
});

// === Nieuwe categorie toevoegen ===
addCategoryForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = newCategoryInput.value.trim();
  if (!name || categories.includes(name)) return;

  categories.push(name);
  activeCategory = name;
  renderCategories();
  currentCategoryTitle.textContent = activeCategory;
  renderTasks();
  hideCategoryInput();
});

// Init
renderCategories();
renderTasks();
