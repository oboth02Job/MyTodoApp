document.addEventListener("DOMContentLoaded", () => {
  // Load navbar + footer
  fetch("components/nav.html")
    .then((res) => res.text())
    .then((html) => (document.getElementById("navbar").innerHTML = html));

  fetch("components/footer.html")
    .then((res) => res.text())
    .then((html) => (document.getElementById("footer").innerHTML = html));

  // LocalStorage key
  const COMPLETED_KEY = "todo_completed";

  // Load completed tasks
  const saved = localStorage.getItem(COMPLETED_KEY);
  let completedTasks = saved ? JSON.parse(saved) : [];

  renderCompletedTasks();

  /***********************************************
   * RENDER COMPLETED TASKS
   ***********************************************/
  function renderCompletedTasks() {
    const list = document.getElementById("completedList");
    list.innerHTML = "";

    if (completedTasks.length === 0) {
      const empty = document.createElement("div");
      empty.className = "alert alert-secondary text-center";
      empty.textContent = "No completed tasks yet.";
      list.appendChild(empty);
      return;
    }

    completedTasks.forEach((task) => {
      const item = document.createElement("div");
      item.className =
        "list-group-item d-flex justify-content-between align-items-center fade-in";

      const label = document.createElement("span");
      label.textContent = task.text;
      label.classList.add("text-success", "fw-semibold");

      const date = document.createElement("small");
      date.textContent = new Date(task.createdAt).toLocaleString();
      date.classList.add("text-muted");

      item.appendChild(label);
      item.appendChild(date);

      list.appendChild(item);
    });
  }
});
