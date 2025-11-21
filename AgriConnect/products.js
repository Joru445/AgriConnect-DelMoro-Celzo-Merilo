let productsLoaded = false;
let cachedProducts = [];

function getProductImage(product) {
  if (product.image && product.image.trim() !== '') {
    return `./uploads${product.image}`;
  }

  switch (product.category) {
    case 'grains':
      return './assets/placeholder/grains.jpg';
    case 'vegetables':
      return './assets/placeholder/vegetables.jpg';
    case 'fruits':
      return './assets/placeholder/fruits.jpg';
    case 'meat':
      return './assets/placeholder/meats.jpg';
    case 'seafoods':
      return './assets/placeholder/seafoods.jpg';
    case 'herbs':
      return './assets/placeholder/herbs.jpg';
    default:
      return './assets/placeholder/placeholder/jpg';
  }
}


function showSkeleton(count = 6) {
  const container = document.querySelector('.products-grid');
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


document.addEventListener('DOMContentLoaded', () => {
  showSkeleton(5); // default skeleton
});


async function loadProducts() {
  const grid = document.querySelector('.products-grid');

  if (productsLoaded) {
    renderProducts(cachedProducts, grid);
    return;
  }
  
  try {
    const response = await fetch('backend/get_products.php');
    const products = await response.json();

    cachedProducts = products; // save to cache
    productsLoaded = true;     // mark as loaded
    renderProducts(products, grid);
  } catch (err) {
    console.error('Failed to load products:', err);
  }
}

function renderProducts(products, grid) {
  grid.innerHTML = ''; // clear grid

  if (products.length === 0) {
    grid.innerHTML = '<p class="placeholder">Products will appear here...</p>';
    return;
  }
  
  products.forEach(product => {
    const card = document.createElement('div');
    card.classList.add('product-card');

    const descHTML = product.description ? `<p>${product.description}</p>` : '';
    const priceHTML = product.price ? `<p class="product-price">₱${product.price}</p>` : '';
    const imgSrc = getProductImage(product);

    card.innerHTML = `
      <img src="${imgSrc}" alt="${product.name}">
      <h3>${product.name}</h3>
      ${descHTML}
      ${priceHTML}
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

function filterProducts(category) {
  const grid = document.querySelector('.products-grid');

  if (!productsLoaded) return; // do nothing if products haven't loaded

  const filtered = category === 'all'
    ? cachedProducts
    : cachedProducts.filter(product => product.category === category);

  renderProducts(filtered, grid);
}

document.addEventListener('DOMContentLoaded', () => {
  const productBtn = document.querySelector('button[data-target="products"]');
  productBtn.addEventListener('click', loadProducts);
});