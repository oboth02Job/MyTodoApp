function setTheme(theme) {
  document.body.className = "theme-" + theme;
  localStorage.setItem("theme", theme);
}

function loadTheme() {
  const saved = localStorage.getItem("theme") || "light";
  document.body.className = "theme-" + saved;
}

loadTheme();
