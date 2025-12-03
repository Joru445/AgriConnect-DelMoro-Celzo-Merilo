let offset = 0;
let loading = false;
let observer = null;
let allLoadedProducts = [];
let activeCategory = 'all';

function initProductsPage() {
  showSkeleton(5);
  setupObserver();
  setupCategoryButtons();
  loadProducts();
}

function setupObserver() {
  let sentinel = document.getElementById("scrollEnd");

  observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      loadProducts();
    }
  }, { rootMargin: '300px' }); // load early, 300px before reaching the sentinel

  observer.observe(sentinel);
}

function showSkeleton(count = 6) {
  const container = document.querySelector('.products-grid');
  if (!container) return;

  const fragment = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const card = document.createElement('div');
    card.className = 'skeleton-card';
    card.innerHTML = `
      <div class="skel-img"></div>
      <div class="skel-line short"></div>
      <div class="skel-line"></div>
    `;
    fragment.appendChild(card);
  }
  container.appendChild(fragment);
}

async function loadProducts() {
  if (loading) return;
  loading = true;

  const grid = document.querySelector('.products-grid');
  if (!grid) return;

  showSkeleton(3);

  try {
    const response = await fetch(`backend/get_products.php?offset=${offset}`);
    const products = await response.json();

    if (products.length === 0) {
      if (observer) observer.disconnect();
      loading = false;
      return;
    }

    offset += products.length;
    allLoadedProducts.push(...products);

    renderProductsFromAllLoaded(grid);

  } catch (err) {
    console.error('Failed to load products:', err);
  }

  loading = false;
}

function renderProductsFromAllLoaded(grid) {
  const filtered = activeCategory === 'all'
    ? allLoadedProducts
    : allLoadedProducts.filter(p => p.category === activeCategory);

  renderProducts(filtered, grid, true); // rebuild the grid for filtering
}

function renderProducts(products, grid, clear = false) {
  if (clear) {
    grid.innerHTML = '';
  } else {
    const skeletons = grid.querySelectorAll('.skeleton-card');
    skeletons.forEach(skel => skel.remove());
  }

  products.forEach(product => {
    if (grid.querySelector(`.product-card[data-id='${product.id}']`)) return;
    
    const card = document.createElement('div');
    card.classList.add('product-card');
    card.dataset.category = product.category;

    const descHTML = product.description ? `<p>${product.description}</p>` : '';
    const priceHTML = product.price ? `<p class="product-price">₱${product.price}/kg</p>` : '';
    const farmerHTML = product.farmer_name ? `<p class="farmer-name">${product.farmer_name}</p>` : '';
    const locationHTML = product.location ? `<p class="location">${product.location}</p>` : '';
    const imgSrc = product.image && product.image.trim() !== '' 
      ? `./uploads/${product.image}` 
      : `./assets/placeholder/${product.category || 'placeholder'}.jpg`;

    card.innerHTML = `
      <img src="${imgSrc}" loading="lazy" alt="${product.name}">
      <h3>${product.name}</h3>
      ${descHTML}
      ${priceHTML}
      ${farmerHTML}
      ${locationHTML}
      <div class="quantity">
        <button class="qty-btn" data-action="decrease">-</button>
        <span class="qty-value">1</span>
        <button class="qty-btn" data-action="increase">+</button>
      </div>
      <button
        type="button"
        class="add-to-cart message-farmer-btn"
        data-farmer-id="${product.farmer_id}"
        data-product-name="${product.name}">
        Ask farmer
      </button>
    `;

    grid.appendChild(card);
    setupQuantityControls(card, product.quantity || 1);
  });
}

document.addEventListener("click", e => {
  const btn = e.target.closest(".message-farmer-btn");
  if (!btn) return;

  e.preventDefault();
  const receiverId = btn.dataset.farmerId;
  const productName = btn.dataset.productName;
  if (!receiverId || !productName) return;

  const formData = new FormData();
  formData.append("receiver_id", receiverId);
  formData.append("message", `Hi! I'm interested in your product: ${productName}`);

  fetch("backend/send_message.php", {
    method: "POST",
    body: formData,
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
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

function setupQuantityControls(card, maxQty) {
  const qtyValue = card.querySelector('.qty-value');
  const decreaseBtn = card.querySelector('button[data-action="decrease"]');
  const increaseBtn = card.querySelector('button[data-action="increase"]');
  let currentQty = 1;

  decreaseBtn.addEventListener('click', () => {
    if (currentQty > 1) {
      currentQty--;
      qtyValue.textContent = currentQty;
    }
  });

  increaseBtn.addEventListener('click', () => {
    if (currentQty < maxQty) {
      currentQty++;
      qtyValue.textContent = currentQty;
    }
  });
}

function setupCategoryButtons() {
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-category');
      renderProductsFromAllLoaded(document.querySelector('.products-grid'));
    });
  });
}
