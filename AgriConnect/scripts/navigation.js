const buttons = document.querySelectorAll('.navigation button');
const mainContainer = document.getElementById('main-content');
let timeout;

/* ==============================
   AJAX PAGE LOADER
================================ */
async function loadPage(pageName, push = true) {
  if (!mainContainer) return;

  mainContainer.innerHTML = "<p class='loading-message'>Loading...</p>";

  try {
    const response = await fetch(`partials/${pageName}.php`);
    if (!response.ok)
      throw new Error(`HTTP error! status: ${response.status}`);

    const html = await response.text();
    mainContainer.innerHTML = html;

    // Init page-specific JS
    switch (pageName) {
      case "settings":
        if (typeof initSettingsPage === "function") initSettingsPage();
        break;
        
      case "products":
        requestAnimationFrame(() => initProductsPage());
        break;

      case "feedback":
        if (typeof initFeedbackPage === "function") initFeedbackPage();
        break;

      case "home":
        initHeroPage();
        break;
    }

    buttons.forEach(b => b.classList.remove("active"));
    const activeBtn = document.querySelector(
      `.navigation button[data-target="${pageName}"]`
    );
    if (activeBtn) activeBtn.classList.add("active");

    // Update hash
    if (push) location.hash = pageName;

    return true;

  } catch (err) {
    mainContainer.innerHTML = "<p class='error'>Failed to load page.</p>";
    console.error("Failed to load partial:", err);
  }
}

/* ==============================
   HERO PAGE : LOAD FARMERS
================================ */
function initHeroPage() {
  fetch("backend/get_farmers.php")
    .then(res => res.json())
    .then(farmers => {
      const container = document.querySelector("#farmers-container");
      container.innerHTML = "";

      if (!farmers.length) {
        container.innerHTML = "<p>No farmers found near you.</p>";
        return;
      }
      
      farmers.forEach(f => {
        const profilePicSrc = f.profile_pic && f.profile_pic.trim() !== ""
        ? `./uploads/profiles/${f.profile_pic}.jpg`
        : `./assets/placeholder/profiles/profile_pic.jpg`;

        container.innerHTML += `
          <div class="farmer-card" data-id="${f.id}">
            <div class="image-container"><img srcset="${profilePicSrc}" loading="lazy"></div>
            <h3>${f.username}</h3>
            <p>${f.barangay}, ${f.city}, ${f.province}</p>
            <button class="view-profile-btn" data-id="${f.id}">
              View Profile
            </button>
          </div>
        `;
      });
    })
    .catch(err => console.error("Error fetching farmers:", err));
}

/* ==============================
   SIDEBAR NAVIGATION
================================ */
buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.target;
    if (target) loadPage(target);
  });
});

/* ==============================
   SIDEBAR TOGGLE
================================ */
document.querySelectorAll('.chevron-button').forEach(btn => {
  btn.addEventListener('click', () => {
    const container = btn.closest(".sidebar");
    container.classList.toggle('expanded');
    const icon = btn.querySelector('.chevron');
    icon.classList.toggle('right');
    icon.classList.toggle('left');
  });
});

/* ==============================
   AUTO LOGOUT TIMER
================================ */
function resetTimer() {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    fetch("backend/logout.php").then(() => {
      window.location.href = "login.html";
    });
  }, 15 * 60 * 1000);
}

window.onload = resetTimer;
document.onmousemove = resetTimer;
document.onkeypress = resetTimer;

/* ==============================
   HASH ROUTING
================================ */
document.addEventListener("click", e => {
  const btn = e.target.closest(".view-profile-btn");
  if (!btn) return;

  const farmerId = btn.dataset.id;
  if (!farmerId) return;
  
  location.hash = `profile-${farmerId}`;
});

function handleHashChange() {
  const hash = location.hash.replace('#','');

  if(hash.startsWith("profile-")) {
    const farmerId = hash.split("-")[1];
    loadPage("profile", false).then(() => loadProfile(farmerId));
    loadProfile()
  } else {
    loadPage(hash || "home", false);
  }
}

window.addEventListener("hashchange", handleHashChange);
document.addEventListener("DOMContentLoaded", handleHashChange);