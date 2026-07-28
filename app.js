const STORAGE_KEY = "tasks";

const taskList = document.getElementById("task-list");
const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const clearCompletedBtn = document.getElementById("clear-completed-btn");

let tasks = loadTasks();

function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function toggleDone(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
  render();
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({ text, done: false });
  saveTasks();
  taskInput.value = "";
  render();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  render();
}

function clearCompleted() {
  tasks = tasks.filter((task) => !task.done);
  saveTasks();
  render();
}

function render() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.addEventListener("change", () => toggleDone(index));

    const text = document.createElement("span");
    text.className = "task-text" + (task.done ? " done" : "");
    text.textContent = task.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "×";
    deleteBtn.setAttribute("aria-label", `Delete ${task.text}`);
    deleteBtn.addEventListener("click", () => deleteTask(index));

    li.append(checkbox, text, deleteBtn);
    taskList.appendChild(li);
  });

  clearCompletedBtn.style.display = tasks.some((task) => task.done) ? "" : "none";
}

addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});
clearCompletedBtn.addEventListener("click", clearCompleted);

render();