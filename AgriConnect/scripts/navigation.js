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
      case "products":
        if (typeof initProductsPage === "function") initProductsPage();
        break;

      case "feedback":
        if (typeof initFeedbackPage === "function") initFeedbackPage();
        break;

      case "home":
        initHeroPage();
        break;

      case "profile":
        // profile data will load separately
        break;
    }

    // Active nav button highlight
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
        container.innerHTML += `
          <div class="farmer-card">
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
   PROFILE BUTTON HANDLER
================================ */

document.addEventListener("click", e => {

  const btn = e.target.closest(".view-profile-btn");
  if (!btn) return;

  const farmerId = btn.dataset.id;
  if (!farmerId) return;
  
  location.hash = `profile-${farmerId}`;
});



/* ==============================
   FETCH PROFILE + PRODUCTS
================================ */

async function loadProfile(farmerId) {

  fetch(`backend/get_profile.php?id=${farmerId}`)
    .then(res => res.json())
    .then(data => {

      if (!data || !data.farmer) return;

      const profileBox = document.querySelector(".profile-info");
      const grid = document.querySelector(".products-grid");

      if (!profileBox || !grid) {
        console.warn("Profile DOM not loaded yet");
        return;
      }

      profileBox.innerHTML = `
        <h1>${data.farmer.name}</h1>
        <div class="location">📍 ${data.farmer.location}</div>
        <div class="about">
          ${data.farmer.about || " "}
        </div>

        <div class="stats">
          <div class="stat">
            <span class="label">Products</span>
            <span class="value">${data.products.length}</span>
          </div>
        </div>
      `;

      grid.innerHTML = "";

      if (!data.products.length) {
        grid.innerHTML = "<p>No products available.</p>";
        return;
      }

      data.products.forEach(p => {

      const img = p.image && p.image.trim() !== '' ?
                  `./uploads/${p.image}` :
                  `./assets/placeholder/${p.category || 'placeholder'}.jpg`;
        grid.innerHTML += `
          <div class="product-card">
            <img srcset="${img}" loading="lazy" alt="${p.name}">
            <h3>${p.name}</h3>
            <p class="price">₱${p.price}</p>
            <button class="message-farmer-btn"
              data-farmer-id="${data.farmer.id}"
              data-product-name="${p.name}">
              Message Farmer
            </button>
          </div>
        `;

      });

    })
    .catch(err => console.error("Profile load failed:", err));
}
document.addEventListener("click", e => {

  const btn = e.target.closest(".message-farmer-btn");
  if(!btn) return;

  const receiverId = btn.dataset.farmerId;
  const productName = btn.dataset.productName;

  if(!receiverId || !productName) return;

  const formData = new FormData();
  formData.append("receiver_id", receiverId);
  formData.append("message", `Hi! I'm interested in your product: ${productName}`);

  fetch("backend/send_messages.php", {
    method: "POST",
    body: formData,
  })
  .then(res => res.json())
  .then(data => {
    if(data.success) {
      alert("Message sent successfully!");
    } else {
      alert("Failed to send message: " + (data.error || "Unknown error"));
    }
  })
  .catch(err => {
    console.error("Error sending message:", err);
    alert("Error sending message.");
  });

});



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

    fetch("backend/logout.php")
      .then(() => {
        window.location.href = "login.php";
      });

  }, 15 * 60 * 1000);

}

window.onload = resetTimer;
document.onmousemove = resetTimer;
document.onkeypress = resetTimer;


/* ==============================
   HASH ROUTING
================================ */

function handleHashChange() {
  const hash = location.hash.replace('#','');

  if(hash.startsWith("profile-")) {
    const farmerId = hash.split("-")[1];
    loadPage("profile", false).then(() => loadProfile(farmerId));
  } else {
    loadPage(hash || "home", false);
  }
}

window.addEventListener("hashchange", handleHashChange);
document.addEventListener("DOMContentLoaded", handleHashChange);

