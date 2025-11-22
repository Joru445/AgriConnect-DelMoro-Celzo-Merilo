<?php
session_start();
$loggedIn = isset($_SESSION['user_id']);
?>

<section id="inbox" class="page">
  <header>
    <h1>Inbox</h1>
  </header>
  <?php if ($loggedIn): ?>
    <div class="inbox-container">
      <p>Mama mo</p>
    </div>
  <?php else: ?>
    <p>Please log in first. <a href="login.html">Go to Login</a></p>
  <?php endif; ?>
</section>