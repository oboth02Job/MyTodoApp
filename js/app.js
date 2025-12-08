 //Load navbar + footer
    fetch("components/nav.html")
      .then(res => res.text())
      .then(html => document.getElementById("navbar").innerHTML = html);

    fetch("components/footer.html")
      .then(res => res.text())
      .then(html => document.getElementById("footer").innerHTML = html);
  
// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();


/*************************************************
 * GLOBAL STATE
 *************************************************/

let tasks = [];            // Array of task objects (JSON)
let completedTasks = [];   // For stats or completed.html

// LocalStorage Keys
const TASKS_KEY = "todo_tasks";
const COMPLETED_KEY = "todo_completed";

/*************************************************
 * LOAD INITIAL DATA
 *************************************************/

document.addEventListener("DOMContentLoaded", () => {
  loadTasksFromLocalStorage();
  renderTasks();
  loadDailyQuote();    // API call
});

/*************************************************
 * EVENT 1: Add a new task (form submit)
 *************************************************/

document.getElementById("taskForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const taskInput = document.getElementById("taskInput");
  const taskText = taskInput.value.trim();

  if (taskText === "") return;

  const newTask = {
    id: Date.now(),
    text: taskText,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  saveTasksToLocalStorage();

  renderTasks();

  taskInput.value = "";
});

/*************************************************
 * RENDER TASK LIST
 *************************************************/

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach(task => {
    const item = document.createElement("div");
    item.className = "list-group-item d-flex align-items-center justify-content-between fade-in";

    // Task text
    const label = document.createElement("span");
    label.textContent = task.text;
    if (task.completed) {
      label.classList.add("text-decoration-line-through", "text-muted");
    }

    // BUTTONS container
    const btnGroup = document.createElement("div");

    // EVENT 2: Mark as complete
    const completeBtn = document.createElement("button");
    completeBtn.className = "btn btn-success btn-sm me-2";
    completeBtn.textContent = "Done";
    completeBtn.addEventListener("click", () => toggleComplete(task.id));

    // EVENT 3: Delete task
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-danger btn-sm";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    btnGroup.appendChild(completeBtn);
    btnGroup.appendChild(deleteBtn);

    item.appendChild(label);
    item.appendChild(btnGroup);

    list.appendChild(item);
  });
}

/*************************************************
 * MARK TASK COMPLETE
 *************************************************/

function toggleComplete(id) {
  tasks = tasks.map(t => {
    if (t.id === id) {
      t.completed = !t.completed;

      // Save completed task separately
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

/*************************************************
 * DELETE TASK
 *************************************************/

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasksToLocalStorage();
  renderTasks();
}

/*************************************************
 * SAVE / LOAD — LOCAL STORAGE
 *************************************************/

function saveTasksToLocalStorage() {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

function saveCompletedToLocalStorage() {
  localStorage.setItem(COMPLETED_KEY, JSON.stringify(completedTasks));
}

function loadTasksFromLocalStorage() {
  const saved = localStorage.getItem(TASKS_KEY);
  const savedCompleted = localStorage.getItem(COMPLETED_KEY);

  if (saved) tasks = JSON.parse(saved);
  if (savedCompleted) completedTasks = JSON.parse(savedCompleted);
}

/*************************************************
 * EVENT 4 & 5: Load quote from API (3rd Party Fetch)
 *************************************************/

function loadDailyQuote() {
  fetch("https://api.quotable.io/random")  // 3rd-party API
    .then(res => res.json())
    .then(data => {
      const quoteBox = document.createElement("div");
      quoteBox.className = "alert alert-info mt-4 fade-in text-center";
      quoteBox.textContent = "${data.content}" - "${data.author}";

      document.querySelector(".container").prepend(quoteBox);
    })
    .catch(err => console.log("Quote API error:", err));
}

