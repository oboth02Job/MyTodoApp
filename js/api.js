// -------------------- RANDOM USER API --------------------
function loadRandomUser() {
  const box = document.getElementById("randomUserBox");
  const img = document.getElementById("randomUserImg");
  const loc = document.getElementById("randomUserLocation");

  if (!box || !img || !loc) return;

  box.textContent = "Loading user...";

  fetch("https://randomuser.me/api/")
    .then(res => res.json())
    .then(data => {
      const user = data.results[0];

      img.src = user.picture.large;
      box.textContent = `${user.name.first}` `${user.name.last}`;
      loc.textContent = `${user.location.city}`, `${user.location.country}`;
    })
    .catch(() => {
      box.textContent = "Failed to load user.";
    });
}

// -------------------- CAT FACT API --------------------
async function loadCatFact() {
  const box = document.getElementById("catFactBox");
  if (!box) return;

  box.textContent = "Loading fact...";

  try {
    const res = await fetch("https://catfact.ninja/fact");
    const data = await res.json();
    box.textContent = data.fact;
  } catch {
    box.textContent = "Failed to load cat fact.";
  }
}

// -------------------- API EVENTS --------------------
document.getElementById("newUserBtn")?.addEventListener("click", loadRandomUser);
document.getElementById("newCatFactBtn")?.addEventListener("click", loadCatFact);
