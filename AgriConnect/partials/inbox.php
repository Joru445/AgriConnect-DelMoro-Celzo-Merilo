<?php
session_start();
include "../backend/db_connect.php";

$loggedIn = isset($_SESSION['user_id']);
$user_id  = $loggedIn ? $_SESSION['user_id'] : null;

$conversations = [];

if ($loggedIn) {
    $stmt = $connect->prepare("
        SELECT 
            u.id,
            u.username,
            m.message AS last_message
        FROM users u
        INNER JOIN (
            SELECT 
                IF(sender_id = ?, receiver_id, sender_id) AS other_user_id,
                MAX(sent_at) AS last_time
            FROM messages
            WHERE sender_id = ? OR receiver_id = ?
            GROUP BY other_user_id
        ) latest ON latest.other_user_id = u.id
        INNER JOIN messages m 
            ON (
                (m.sender_id = ? AND m.receiver_id = u.id)
                OR
                (m.sender_id = u.id AND m.receiver_id = ?)
            )
           AND m.sent_at = latest.last_time
        ORDER BY latest.last_time DESC
    ");

    $stmt->bind_param("iiiii", $user_id, $user_id, $user_id, $user_id, $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        $conversations[] = $row;
    }
}
?>

<section id="inbox" class="page">
  <header class="inbox-header">
    <h1>Inbox</h1>
  </header>

<?php if ($loggedIn): ?>

<div class="inbox-container">

<aside class="conversation-list">

<?php if (empty($conversations)): ?>

  <p class="no-conversations">
    No conversations yet.
  </p>

<?php else: ?>

  <?php foreach ($conversations as $conv): ?>
    <button class="conversation"
        type="button"
        data-user-id="<?= $conv['id'] ?>">
      <h4><?= htmlspecialchars($conv['username']) ?></h4>
      <p>Click to open chat</p>
    </button>
  <?php endforeach; ?>

<?php endif; ?>

</aside>

<main class="message-area">
  <div class="messages">
    <p class="no-messages">
      Select a conversation to start chatting.
    </p>
  </div>

  <form 
    class="message-form"
    method="post"
    action="../backend/send_message.php"
    data-user-id=""
  >
    <input
      type="text"
      name="message"
      placeholder="Type your message..."
      autocomplete="off"
      required
    >

    <button type="submit">
      Send
    </button>
  </form>

</main>

</div>

<?php else: ?>

<p class="login-warning">
  Please log in first.
  <a href="login.html">Go to Login</a>
</p>

<?php endif; ?>

</section>