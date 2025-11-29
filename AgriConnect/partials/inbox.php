<?php
session_start();
$loggedIn = isset($_SESSION['user_id']);
?>

<section id="inbox" class="page">
  <header class="inbox-header">
    <h1>Inbox</h1>
  </header>

  <?php if ($loggedIn): ?>

  <div class="inbox-container">

    <!-- Sidebar / Conversation List -->
    <aside class="conversation-list">
      <div class="conversation active">
        <h4>Admin</h4>
        <p>Welcome to your inbox</p>
      </div>

      <div class="conversation">
        <h4>Support</h4>
        <p>How can we help you?</p>
      </div>

      <div class="conversation">
        <h4>Farmer Group</h4>
        <p>New updates today</p>
      </div>
    </aside>

    <!-- Message Area -->
    <main class="message-area">

      <div class="messages">
        <div class="message received">
          <strong>Admin:</strong>
          <p>Welcome to the platform!</p>
        </div>

        <div class="message sent">
          <strong>You:</strong>
          <p>Thanks! Glad to be here.</p>
        </div>
      </div>

      <!-- Message Input -->
      <form class="message-form" method="post">
        <input 
          type="text" 
          name="message"
          placeholder="Type your message..."
          required
        >
        <button type="submit">Send</button>
      </form>

    </main>

  </div>

  <?php else: ?>
    <p>Please log in first. <a href="login.html">Go to Login</a></p>
  <?php endif; ?>
</section>
