let productsLoaded = false;
let cachedProducts = [];

function initProductsPage() {
  showSkeleton(5);
  loadProducts();
  setupCategoryButtons();
}

// Show skeletons while loading
function showSkeleton(count = 6) {
  const container = document.querySelector('.products-grid');
  if (!container) return;
  container.innerHTML = '';

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

// Load products from backend
async function loadProducts() {
  const grid = document.querySelector('.products-grid');
  if (!grid) return;

  if (productsLoaded) {
    renderProducts(cachedProducts, grid);
    return;
  }

  showSkeleton(5);

  try {
    const response = await fetch('backend/get_products.php');
    const products = await response.json();
    cachedProducts = products;
    productsLoaded = true;
    renderProducts(products, grid);
  } catch (err) {
    console.error('Failed to load products:', err);
    grid.innerHTML = '<p class="error">Failed to load products.</p>';
  }
}

// Render product cards
function renderProducts(products, grid) {
  grid.innerHTML = '';

  if (!products || products.length === 0) {
    grid.innerHTML = '<p class="placeholder">Products will appear here...</p>';
    return;
  }

  products.forEach(product => {
    const card = document.createElement('div');
    card.classList.add('product-card');
    const descHTML = product.description ? `<p>${product.description}</p>` : '';
    const priceHTML = product.price ? `<p class="product-price">₱${product.price}/kg</p>` : '';
    const farmerHTML = product.farmer_name ? `<p class="farmer-name">${product.farmer_name}</p>` : '';
    const locationHTML = product.location ? `<p class="location">${product.location}</p>` : '';
    const imgSrc = product.image && product.image.trim() !== '' ?
                  `./uploads/${product.image}` :
                  `./assets/placeholder/${product.category || 'placeholder'}.jpg`;

    card.innerHTML = `
      <img src="${imgSrc}" alt="${product.name}">
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
      <button class="add-to-cart">🛒 Add to Cart</button>
    `;

    grid.appendChild(card);
    setupQuantityControls(card, product.quantity || 1);
  });
}

// Quantity controls
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

// Category filter buttons
function setupCategoryButtons() {
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.getAttribute('data-category');
      filterProducts(category);
    });
  });
}

function filterProducts(category) {
  const grid = document.querySelector('.products-grid');
  if (!grid || !productsLoaded) return;

  const filtered = category === 'all' ? cachedProducts : cachedProducts.filter(p => p.category === category);
  renderProducts(filtered, grid);
}
