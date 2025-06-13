const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const addTaskBtn = document.getElementById("addTaskBtn");
const filterBtns = document.querySelectorAll(".filter-btn");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const taskCountDisplay = document.getElementById("taskCount");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";


function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}


function renderTasks() {
  taskList.innerHTML = "";

  const filtered = tasks.filter(t => {
    if (currentFilter === "active") return !t.completed;
    if (currentFilter === "completed") return t.completed;
    return true;
  });

  filtered.forEach((task, i) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
      <span class="task-text" ondblclick="editTask(${i}, this)">${task.text}</span>
      <div>
        <button onclick="toggleTask(${i})" class="btn btn-sm btn-outline-success me-1">✔</button>
        <button onclick="deleteTask(${i})" class="btn btn-sm btn-danger">🗑</button>
      </div>
    `;
    taskList.appendChild(li);
  });

  updateTaskCount();
}


function addTask() {
  const text = taskInput.value.trim();
  if (text === "") return;

  tasks.push({ text, completed: false });
  taskInput.value = "";
  saveTasks();
  renderTasks();
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}


function editTask(index, span) {
  const input = document.createElement("input");
  input.type = "text";
  input.value = tasks[index].text;
  input.className = "form-control form-control-sm";
  span.replaceWith(input);
  input.focus();

  input.addEventListener("blur", () => {
    tasks[index].text = input.value.trim() || tasks[index].text;
    saveTasks();
    renderTasks();
  });

  input.addEventListener("keypress", e => {
    if (e.key === "Enter") input.blur();
  });
}


function updateTaskCount() {
  const count = tasks.filter(t => !t.completed).length;
  taskCountDisplay.innerText = `${count} task${count !== 1 ? "s" : ""} left`;
}


clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  renderTasks();
});


filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});


addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", e => {
  if (e.key === "Enter") addTask();
});


renderTasks();
