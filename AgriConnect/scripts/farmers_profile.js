let profileOffset = 0;
let profileLoading = false;
let profileObserver = null;
let profileAllProducts = [];
let currentFarmerId = null;

function getProfileImgSrc(fileName, category = 'placeholder', type = 'products') {
  if (fileName && fileName.trim() !== '') {
    if (type === 'profiles') {
      return `./uploads/profiles/${fileName}.jpg`;
    }
    return `./uploads/${fileName}`;
  }

  const exts = ['jpg', 'jpeg', 'png', 'webp'];
  const folder = type === 'profiles' ? 'profiles' : '';
  return `./assets/placeholder/${folder ? folder + '/' : ''}${category}.${exts[0]}`;
}

async function loadProfile(farmerId) {
  currentFarmerId = farmerId;
  profileOffset = 0;
  profileAllProducts = [];

  const profileBox = document.querySelector(".profile-info");
  const profilePic = document.querySelector(".profile-image-placeholder");
  const grid = document.querySelector(".products-grid");

  if (!profileBox || !grid) return;

  grid.innerHTML = "";
  profileBox.innerHTML = "<p class='loading-message'>Loading profile...</p>";

  try {
    const res = await fetch(`backend/get_profile.php?id=${farmerId}&offset=0&limit=1`);
    const data = await res.json();
    if (!data || !data.farmer) return;

    const profilePicSrc = getProfileImgSrc(data.farmer.profile_pic, 'profile_pic', 'profiles');
    profilePic.innerHTML = `<img src="${profilePicSrc}" loading="lazy" alt="${data.farmer.username}">`;

    profileBox.innerHTML = `
      <h1>${data.farmer.username}</h1>
      <div class="location">📍 ${data.farmer.location}</div>
      <div class="about">${data.farmer.about || ""}</div>
    `;

    loadMoreProfileProducts();

  } catch (err) {
    console.error("Profile load failed:", err);
    profileBox.innerHTML = "<p class='error'>Failed to load profile.</p>";
  }
}

function setupProfileObserver() {
  const grid = document.querySelector(".products-grid");
  let sentinel = document.getElementById("profileScrollEnd");
  if (!sentinel) {
    sentinel = document.createElement("div");
    sentinel.id = "profileScrollEnd";
    grid.appendChild(sentinel);
  }

  profileObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) loadMoreProfileProducts();
  }, { rootMargin: "300px" });

  profileObserver.observe(sentinel);
}

async function loadMoreProfileProducts() {
  if (profileLoading) return;
  profileLoading = true;

  const grid = document.querySelector(".products-grid");

  try {
    const res = await fetch(`backend/get_profile.php?id=${currentFarmerId}&offset=${profileOffset}&limit=5`);
    const data = await res.json();
    const products = data.products || [];

    if (products.length === 0) {
      if (profileObserver) profileObserver.disconnect();
      profileLoading = false;
      return;
    }

    profileOffset += products.length;
    renderProfileProducts(grid, products);

    if (!profileObserver) setupProfileObserver();

  } catch (err) {
    console.error("Failed to load products:", err);
  }

  profileLoading = false;
}

function renderProfileProducts(grid, products) {
  products.forEach(p => {
    if (grid.querySelector(`.product-card[data-id='${p.id}']`)) return;

    const card = document.createElement("div");
    card.classList.add("product-card");
    card.dataset.id = p.id;

    const imgSrc = getProfileImgSrc(p.image, p.category || 'placeholder', 'products');

    card.innerHTML = `
      <img src="${imgSrc}" loading="lazy" alt="${p.name}">
      <h3>${p.name}</h3>
      <p class="price">₱${p.price}/kg</p>
      <button class="message-farmer-btn"
        data-farmer-id="${currentFarmerId}"
        data-product-name="${p.name}">
        Message Farmer
      </button>
    `;

    grid.appendChild(card);
  });

  const sentinel = document.getElementById("profileScrollEnd");
  if (sentinel) grid.appendChild(sentinel);
}
