<?php if ($isPartner): ?>
<section class="upload-section">
  <div class="upload-header">
    <h2>Upload a Product</h2>
    <button class="upload-button">
      <i class="chevron material-symbols-rounded close">chevron_right</i>
    </button>
  </div>
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