const buttons = document.querySelectorAll('.navigation button');
const mainContainer = document.getElementById('main-content'); // AJAX injects content here

// Load a partial into main content
async function loadPage(pageName) {
  if (!mainContainer) return;

  mainContainer.innerHTML = "<p class='loading-message'>Loading...</p>";

  try {
    const response = await fetch(`partials/${pageName}.php`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const html = await response.text();
    mainContainer.innerHTML = html;
    console.log(html);

    switch(pageName) {
      case "products":
        if (typeof initProductsPage === "function") initProductsPage();
        break;
      case "feedback":
        if (typeof initFeedbackPage === "function") initFeedbackPage();
        break;
      case "home":
        if (typeof initHeroPage === "function") initHeroPage();
        break;
    }

  } catch (err) {
    mainContainer.innerHTML = "<p class='error'>Failed to load page.</p>";
    console.error("Failed to load partial:", err);
  }
}

// Sidebar navigation buttons
buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const targetPage = btn.dataset.target;
    if (targetPage) loadPage(targetPage);
  });
});

document.querySelectorAll('.chevron-button').forEach(btn => {
  btn.addEventListener('click', () => {
    const container = btn.closest(".sidebar");
    container.classList.toggle('expanded');

    const icon = btn.querySelector('.chevron');
    icon.classList.toggle('right');
    icon.classList.toggle('left');
  });
});

// Dark mode toggle
const toggleDark = document.querySelector('#dark-toggle');
if (toggleDark) {
  toggleDark.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });
}

// Log out after 15mins of inactivity;
function resetTimer() {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    fetch("backend/logout.php").then(() => {
      window.location.href = "login.php";
    });
  }, 15 * 60 * 1000); // 15 minutes
}

window.onload = resetTimer;
document.onmousemove = resetTimer;
document.onkeypress = resetTimer;


// Load default page (home/hero) on first load
document.addEventListener('DOMContentLoaded', () => {
  loadPage("home");
});
