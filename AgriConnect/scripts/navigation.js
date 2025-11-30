const buttons = document.querySelectorAll('.navigation button');
const mainContainer = document.getElementById('main-content'); // AJAX injects content here
let timeout;

// Load a partial into main content
async function loadPage(pageName, push = true) {
  if (!mainContainer) return;

  mainContainer.innerHTML = "<p class='loading-message'>Loading...</p>";

  try {
    const response = await fetch(`partials/${pageName}.php`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const html = await response.text();
    mainContainer.innerHTML = html;

    // Call initialization functions if they exist
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

    // Update active button
    buttons.forEach(b => b.classList.remove('active'));
    const activeBtn = document.querySelector(`.navigation button[data-target="${pageName}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    // Update URL hash if needed
    if(push) location.hash = pageName;

  } catch (err) {
    mainContainer.innerHTML = "<p class='error'>Failed to load page.</p>";
    console.error("Failed to load partial:", err);
  }
}

// Handle sidebar navigation buttons
buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetPage = btn.dataset.target;
    if (targetPage) loadPage(targetPage);
  });
});

// Toggle sidebar expand/collapse
document.querySelectorAll('.chevron-button').forEach(btn => {
  btn.addEventListener('click', () => {
    const container = btn.closest(".sidebar");
    container.classList.toggle('expanded');

    const icon = btn.querySelector('.chevron');
    icon.classList.toggle('right');
    icon.classList.toggle('left');
  });
});

// Auto logout after 15 minutes of inactivity
function resetTimer() {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    fetch("backend/logout.php").then(() => {
      window.location.href = "login.php";
    });
  }, 15 * 60 * 1000); // 15 minutes
}

// Attach activity listeners
window.onload = resetTimer;
document.onmousemove = resetTimer;
document.onkeypress = resetTimer;

// Load page based on hash (supports refresh/bookmark)
function handleHashChange() {
  const page = location.hash.replace('#', '') || 'home';
  loadPage(page, false); // false = don’t push new hash
}

// Listen for hash changes
window.addEventListener('hashchange', handleHashChange);

// Initial load
document.addEventListener('DOMContentLoaded', () => {
  handleHashChange();
});
