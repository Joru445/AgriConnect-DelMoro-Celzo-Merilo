<?php
session_start();
$isPartner = isset($_SESSION['role']) && $_SESSION['role'] === 'farmer';
?>

<section id="products" class="page">
  <header>
    <h1 class="text">Our Products</h1>
    <p class="text-muted">Fresh from the farm — quality produce for everyone.</p>
  </header>

  <?php if ($isPartner): ?>
  <!-- Product Upload Form for Partners -->
  <section class="upload-section">
    <h2>Upload a Product</h2>
    <form action="backend/upload_product.php" method="post" enctype="multipart/form-data">
      <input type="text" name="name" placeholder="Product Name" required>
      <select name="category" required>
        <option value="grains">Grains</option>
        <option value="vegetables">Vegetables</option>
        <option value="fruits">Fruits</option>
        <option value="meat">Meat</option>
        <option value="seafoods">Seafoods</option>
      </select>
      <input type="number" step="0.01" name="price" placeholder="Price" required>
      <input type="number" name="quantity" placeholder="Available Quantity" min="0" required>
      <input type="file" name="image" accept="image/*" required>
      <button type="submit">Upload Product</button>
    </form>
  </section>
  <?php endif; ?>

  <!-- Product Categories & Grid -->
  <section class="products-section">
    <div class="product-categories">
      <button class="category-btn active" data-category="all">All</button>
      <button class="category-btn" data-category="grains">Grains</button>
      <button class="category-btn" data-category="vegetables">Vegetables</button>
      <button class="category-btn" data-category="fruits">Fruits</button>
      <button class="category-btn" data-category="meat">Meat</button>
      <button class="category-btn" data-category="seafoods">Seafoods</button>
    </div>
    <div class="products-grid"></div>
  </section>
</section>