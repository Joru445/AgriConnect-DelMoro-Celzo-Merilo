<?php
session_start();
$loggedIn = isset($_SESSION['user_id']);
?>

<section id="feedback" class="page">
  <h1>Feedback</h1>
  <?php if ($loggedIn): ?>
  <form action="../backend/feedback.php" method="post">
    <div class="star-rating">
      <p>Rate us</p>
      <input type="radio" id="one-star" name="rating" value="one">
      <label for="one-star">⭐</label><br>

      <input type="radio" id="two-star" name="rating" value="two">
      <label for="two-star">⭐⭐</label><br>

      <input type="radio" id="three-star" name="rating" value="three">
      <label for="three-star">⭐⭐⭐</label><br>

      <input type="radio" id="four-star" name="rating" value="four">
      <label for="four-star">⭐⭐⭐⭐</label><br>

      <input type="radio" id="five-star" name="rating" value="five">
      <label for="five-star">⭐⭐⭐⭐⭐</label><br>
    </div>
    <textarea placeholder="Write your comment here..." rows="4" cols="50"></textarea>
    <button type="submit">Submit</button>
  </form>
  <?php else: ?>
    <p>Please log in first. <a href="login.html">Go to Login</a></p>
  <?php endif; ?>
</section>