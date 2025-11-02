function getProductImage(product) {
  if (product.image && product.image.trim() !== '') {
    return `./assets/images/${product.image}`;
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

async function loadProducts() {
  try {
    const response = await fetch('backend/get_products.php');
    const products = await response.json();

    const grid = document.querySelector('.products-grid');

    products.forEach(product => {
      const card = document.createElement('div');
      card.classList.add('product-card');

      let descHTML = '';
      if (product.description) {
        descHTML = `<p>${product.description}</p>`;
      }

      let priceHTML = '';
      if (product.price) {
        priceHTML = `<p class="product-price">₱${product.price}</p>`;
      }

      const imgSrc = getProductImage(product);
      card.innerHTML = `
        <img src="${imgSrc}" alt="${product.name}">
        <h3>${product.name}</h3>
        ${descHTML}
        ${priceHTML}
        <div class="quantity">
          <button class="qty-btn">-</button>
          <span class="qty-value">1</span>
          <button class="qty-btn">+</button>
        </div>
        <button class="add-to-cart">🛒 Add to Cart</button>
      `;

      grid.appendChild(card);
    });
  } catch (err) {
    console.error('Failed to load products:', err);
  }
}


document.querySelector('button[data-target="products"]').addEventListener('click', loadProducts);