// ---------------------------
// Load Navbar + Footer
// ---------------------------
loadNavbar();
loadFooter();

// ---------------------------
// Theme Buttons
// ---------------------------
const darkBtn = document.getElementById("darkThemeBtn");
const lightBtn = document.getElementById("lightThemeBtn");

// Apply theme instantly when page loads
applySavedTheme();

darkBtn.addEventListener("click", () => {
  document.body.classList.add("dark-theme");
  document.body.classList.remove("light-theme");

  localStorage.setItem("theme", "dark");

  alert("Dark theme applied!");
});

lightBtn.addEventListener("click", () => {
  document.body.classList.add("light-theme");
  document.body.classList.remove("dark-theme");

  localStorage.setItem("theme", "light");

  alert("Light theme applied!");
});

// ---------------------------
// Apply saved theme
// ---------------------------
function applySavedTheme() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
  } else if (savedTheme === "light") {
    document.body.classList.add("light-theme");
  }
}

// ---------------------------
// Reset / Clear All Tasks
// ---------------------------
const resetBtn = document.getElementById("resetDataBtn");

resetBtn.addEventListener("click", () => {
  const confirmDelete = confirm("Are you sure you want to clear all tasks?");

  if (confirmDelete) {
    localStorage.removeItem("tasks");
    alert("All tasks cleared!");
  }
});
 