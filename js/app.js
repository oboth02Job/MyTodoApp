
document.addEventListener("DOMContentLoaded", () => {

  // Load NAV
  fetch("components/nav.html")
    .then((res) => res.text())
    .then((html) => {
      document.getElementById("navbar").innerHTML = html;
    });

  // Load FOOTER + set year AFTER it loads
  fetch("components/footer.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("footer").innerHTML = html;
      document.getElementById("year").textContent = new Date().getFullYear();
    });

  // ----------------------------
  // GLOBAL STATE
  // ----------------------------
  let tasks = [];
  let completedTasks = [];

  const TASKS_KEY = "todo_tasks";
  const COMPLETED_KEY = "todo_completed";

  // ----------------------------
  // LOAD SAVED DATA
  // ----------------------------
  loadTasksFromLocalStorage();
  renderTasks();
  

  // ----------------------------
  // ADD TASK
  // ----------------------------
  document.getElementById("taskForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const taskInput = document.getElementById("taskInput");
    const text = taskInput.value.trim();
    if (!text) return;

    const newTask = {
      id: Date.now(),
      text,
      completed: false
    };

    tasks.push(newTask);
    saveTasksToLocalStorage();
    renderTasks();

    taskInput.value = "";
  });

  // ----------------------------
  function renderTasks() {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach(task => {
      const item = document.createElement("div");
      item.className =
        "list-group-item d-flex justify-content-between align-items-center";

      const label = document.createElement("span");
      label.textContent = task.text;

      if (task.completed) {
        label.classList.add("text-decoration-line-through");
      }

      // BUTTONS

      const btns = document.createElement("div");

      const doneBtn = document.createElement("button");
      doneBtn.className = "btn btn-success btn-sm me-2";
      doneBtn.textContent = "Done";
      doneBtn.onclick = () => toggleComplete(task.id);

      const delBtn = document.createElement("button");
      delBtn.className = "btn btn-danger btn-sm";
      delBtn.textContent = "Delete";
      delBtn.onclick = () => deleteTask(task.id);

      // EVENT: Edit Task
      const editBtn = document.createElement("button");
      editBtn.className = "btn btn-warning btn-sm me-2";
      editBtn.textContent = "Edit";
      editBtn.addEventListener("click", () => editTask(task.id));

      btns.appendChild(doneBtn);
      btns.appendChild(delBtn);
      btns.appendChild(editBtn);

      item.appendChild(label);
      item.appendChild(btns);

      list.appendChild(item);

      item.className =
        "list-group-item d-flex align-items-center justify-content-between fade-in slide-in";
    });
  }

  function toggleComplete(id) {
    // Toggle completed flag
    tasks = tasks.map((t) => {
      if (t.id === id) {
        t.completed = !t.completed;
        // Ensure createdAt exists and is valid
        if (!t.createdAt || isNaN(Date.parse(t.createdAt))) {
          t.createdAt = new Date().toISOString();
        }
      }
      return t;
    });

    // Rebuild completedTasks array (no duplicates)
    completedTasks = tasks.filter((t) => t.completed);

    saveCompletedToLocalStorage();
    saveTasksToLocalStorage();
    renderTasks();
  }


  function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasksToLocalStorage();
    renderTasks();
  }

  function editTask(id) {
    const task = tasks.find((t) => t.id === id);
    const updatedText = prompt("Edit task:", task.text);

    if (updatedText !== null && updatedText.trim() !== "") {
      task.text = updatedText.trim();
      saveTasksToLocalStorage();
      renderTasks();
    }
  }

  function saveTasksToLocalStorage() {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }

  function saveCompletedToLocalStorage() {
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(completedTasks));
  }

  function loadTasksFromLocalStorage() {
    try {
      const savedRaw = localStorage.getItem(TASKS_KEY);
      const savedCompletedRaw = localStorage.getItem(COMPLETED_KEY);

      // Parse safely
      const saved = savedRaw ? JSON.parse(savedRaw) : null;
      const savedCompleted = savedCompletedRaw
        ? JSON.parse(savedCompletedRaw)
        : null;

      // Ensure arrays
      if (Array.isArray(saved)) {
        // Migration: ensure every task has a valid createdAt
        tasks = saved.map((t) => {
          if (!t.createdAt || isNaN(Date.parse(t.createdAt))) {
            // If missing or invalid, set now (or you could set to Date.now())
            t.createdAt = new Date().toISOString();
          }
          return t;
        });
      } else {
        tasks = [];
      }

      if (Array.isArray(savedCompleted)) {
        completedTasks = savedCompleted.map((t) => {
          if (!t.createdAt || isNaN(Date.parse(t.createdAt))) {
            t.createdAt = new Date().toISOString();
          }
          return t;
        });
      } else {
        completedTasks = [];
      }
    } catch (err) {
      console.error(
        "Failed to load tasks from localStorage — resetting keys.",
        err
      )}
}
})