<?php
session_start();
$loggedIn = isset($_SESSION['user_id']);
?>

<section id="feedback" class="page">
  <?php if ($loggedIn): ?>
  <div class="hero">
    <div class="logo-img">
      <img src="logo.png" alt="AgriConnect Logo">
    </div>
    <div>
      <h1>Buyer Feedback</h1>
      <p class="lead">Your feedback helps farmers improve their products.</p>
    </div>
  </div>
  <form>
    <label>Full Name</label>
    <input type="text" placeholder="Enter your name">
    <label>Email Address</label>
    <input type="email" placeholder="Enter your email" required>
    <div class="row">
      <div class="col">
        <label>Product Category</label>
        <select id="product-category" onchange="updatePlaceholder()" style="padding:12px;border-radius:10px;border:1px solid #d9e8df;">
          <option value="" selected disabled>Select category</option>
          <option value="vegetables">Vegetables</option>
          <option value="fruits">Fruits</option>
          <option value="meat">Meat</option>
          <option value="grains">Grains</option>
          <option value="dairy">Dairy</option>
          <option value="others">Others</option>
        </select>
      </div>
      <div class="col">
        <label>Item Purchased</label>
        <input type="text" id="item-name" placeholder="Select category first">
      </div>
    </div>
    <label>Rate Your Experience</label>
    <div class="rating">
      <button type="button">1</button>
      <button type="button">2</button>
      <button type="button">3</button>
      <button type="button">4</button>
      <button type="button">5</button>
    </div>
    <label>Feedback Message</label>
    <textarea placeholder="Write your feedback here..."></textarea>
    <button class="btn primary">Submit Feedback</button>
  </form>
  <?php else: ?>
  <p>Please log in first. <a href="login.html">Go to Login</a></p>
  <?php endif; ?>
</section>
<script>
    function updatePlaceholder() {
      const category = document.getElementById('product-category').value;
      const itemInput = document.getElementById('item-name');

      const placeholders = {
        vegetables: "e.g. Carrots, Spinach, Eggplant",
        fruits: "e.g. Mango, Banana, Apple",
        meat: "e.g. Chicken breast, Pork belly",
        grains: "e.g. Rice, Corn, Wheat",
        dairy: "e.g. Milk, Cheese, Butter",
        others: "Specify the purchased item"
      };

      itemInput.placeholder = placeholders[category] || "Enter item name";
    }
</script>