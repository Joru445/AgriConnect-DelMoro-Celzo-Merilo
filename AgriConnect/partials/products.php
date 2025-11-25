<?php
session_start();
$isPartner = isset($_SESSION['role']) && $_SESSION['role'] === 'farmer';
?>

<section id="products" class="page">
  <header>
    <h1 class="text">Our Products</h1>
    <p class="text-muted">Fresh from the farm — quality produce for everyone.</p>
  </header>

<!-- Product Upload Form for Partners -->
  
<?php include "upload_product.php" ?>

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