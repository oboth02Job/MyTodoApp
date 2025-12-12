// Load nav & footer
fetch("nav.html")
  .then(res => res.text())
  .then(data => (document.getElementById("nav-placeholder").innerHTML = data));

fetch("footer.html")
  .then(res => res.text())
  .then(data => (document.getElementById("footer-placeholder").innerHTML = data));


// Load tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Update stats
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;

  const rate = total === 0 ? 0 : Math.round((completed / total) * 100);

  // Tasks added today
  const today = new Date().toISOString().split("T")[0];
  const tasksToday = tasks.filter(t => t.createdAt.startsWith(today)).length;

  // Inject values into HTML
  document.getElementById("totalTasks").textContent = total;
  document.getElementById("completedTasks").textContent = completed;
  document.getElementById("pendingTasks").textContent = pending;
  document.getElementById("completionRate").textContent = rate + "%";
  document.getElementById("tasksToday").textContent = tasksToday;
}


updateStats();