// UPDATED script.js
const input = document.querySelector("input");
const addButton = document.querySelector(".add-button");
const todosHtml = document.querySelector(".todos");
const emptyImage = document.querySelector(".empty-image");
const deleteAllButton = document.querySelector(".delete-all");
const filters = document.querySelectorAll(".filter");
const modeToggle = document.querySelector(".mode-toggle");
const taskCounter = document.querySelector(".task-counter");
const sortButton = document.querySelector(".sort-button");

let todosJson = JSON.parse(localStorage.getItem("todos")) || [];
let filter = localStorage.getItem("filter") || '';
let sortAsc = true;

showTodos();

function getTodoHtml(todo, index) {
  if (filter && filter != todo.status) {
    return '';
  }
  let checked = todo.status == "completed" ? "checked" : "";
  return /* html */ `
    <li class="todo">
      <label for="${index}">
        <input id="${index}" onclick="updateStatus(this)" type="checkbox" ${checked}>
        <span ondblclick="editTask(${index}, this)" class="${checked}">${todo.name}</span>
      </label>
      <button class="delete-btn" data-index="${index}" onclick="remove(this)"><i class="fa fa-times"></i></button>
    </li>
  `; 
}

function showTodos() {
  if (todosJson.length == 0) {
    todosHtml.innerHTML = '';
    emptyImage.style.display = 'block';
  } else {
    let sortedTodos = [...todosJson];
    if (sortAsc) {
      sortedTodos.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      sortedTodos.sort((a, b) => b.name.localeCompare(a.name));
    }
    todosHtml.innerHTML = sortedTodos.map(getTodoHtml).join('');
    emptyImage.style.display = 'none';
  }
  updateCounter();
}

function addTodo(todo) {
  input.value = "";
  todosJson.unshift({ name: todo, status: "pending" });
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}

input.addEventListener("keyup", e => {
  let todo = input.value.trim();
  if (!todo || e.key != "Enter") {
    return;
  }
  addTodo(todo);
});

addButton.addEventListener("click", () => {
  let todo = input.value.trim();
  if (!todo) {
    return;
  }
  addTodo(todo);
});

function updateStatus(todo) {
  let todoName = todo.parentElement.lastElementChild;
  if (todo.checked) {
    todoName.classList.add("checked");
    todosJson[todo.id].status = "completed";
  } else {
    todoName.classList.remove("checked");
    todosJson[todo.id].status = "pending";
  }
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}

function remove(todo) {
  const index = todo.dataset.index;
  todosJson.splice(index, 1);
  showTodos();
  localStorage.setItem("todos", JSON.stringify(todosJson));
}

filters.forEach(function (el) {
  el.addEventListener("click", (e) => {
    if (el.classList.contains('active')) {
      el.classList.remove('active');
      filter = '';
    } else {
      filters.forEach(tag => tag.classList.remove('active'));
      el.classList.add('active');
      filter = e.target.dataset.filter;
    }
    localStorage.setItem("filter", filter);
    showTodos();
  });
});

deleteAllButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all tasks?")) {
    todosJson = [];
    localStorage.setItem("todos", JSON.stringify(todosJson));
    showTodos();
  }
});

modeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
});

sortButton.addEventListener("click", () => {
  sortAsc = !sortAsc;
  sortButton.textContent = sortAsc ? "Sort A-Z" : "Sort Z-A";
  showTodos();
});

function updateCounter() {
  const pendingCount = todosJson.filter(t => t.status === "pending").length;
  const completedCount = todosJson.filter(t => t.status === "completed").length;
  taskCounter.textContent = `${pendingCount} pending, ${completedCount} completed`;
}

function editTask(index, span) {
  const currentText = span.innerText;
  const inputEdit = document.createElement("input");
  inputEdit.type = "text";
  inputEdit.value = currentText;
  inputEdit.className = "edit-input";
  span.replaceWith(inputEdit);
  inputEdit.focus();

  inputEdit.addEventListener("blur", () => {
    todosJson[index].name = inputEdit.value.trim() || currentText;
    localStorage.setItem("todos", JSON.stringify(todosJson));
    showTodos();
  });
}
