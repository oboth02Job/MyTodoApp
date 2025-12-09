
document.addEventListener("DOMContentLoaded", () => {

  // Load NAV
  fetch("components/nav.html")
    .then(res => res.text())
    .then(html => {
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
  loadDailyQuote();

  // ----------------------------
  // ADD TASK
  // ----------------------------
  document.getElementById("taskForm").addEventListener("submit", function(e) {
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
      item.className = "list-group-item d-flex justify-content-between align-items-center";

      const label = document.createElement("span");
      label.textContent = task.text;

      if (task.completed) {
        label.classList.add("text-decoration-line-through");
      }

      const btns = document.createElement("div");

      const doneBtn = document.createElement("button");
      doneBtn.className = "btn btn-success btn-sm me-2";
      doneBtn.textContent = "Done";
      doneBtn.onclick = () => toggleComplete(task.id);

      const delBtn = document.createElement("button");
      delBtn.className = "btn btn-danger btn-sm";
      delBtn.textContent = "Delete";
      delBtn.onclick = () => deleteTask(task.id);

      btns.appendChild(doneBtn);
      btns.appendChild(delBtn);

      item.appendChild(label);
      item.appendChild(btns);

      list.appendChild(item);
    });
  }

  function toggleComplete(id) {
    tasks = tasks.map(t => {
      if (t.id === id) {
        t.completed = !t.completed;
        if (t.completed) {
          completedTasks.push(t);
          saveCompletedToLocalStorage();
        }
      }
      return t;
    });

    saveTasksToLocalStorage();
    renderTasks();
  }

  function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasksToLocalStorage();
    renderTasks();
  }

  function saveTasksToLocalStorage() {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }

  function saveCompletedToLocalStorage() {
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(completedTasks));
  }

  function loadTasksFromLocalStorage() {
    const saved = JSON.parse(localStorage.getItem(TASKS_KEY));
    if (saved) tasks = saved;

    const completed = JSON.parse(localStorage.getItem(COMPLETED_KEY));
    if (completed) completedTasks = completed;
  }

  function loadDailyQuote() {
    fetch("https://api.quotable.io/random")
      .then(res => res.json())
      .then(data => {
        const box = document.createElement("div");
        box.className = "alert alert-info text-center mt-4";
        box.textContent = "${data.content}" - "${data.author}";
        document.querySelector(".container").prepend(box);
      });
  }

});

