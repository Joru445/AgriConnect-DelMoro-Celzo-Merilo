<?php
session_start();
$loggedIn = isset($_SESSION['user_id']);
$user = $loggedIn ? [
    'username' => $_SESSION['username'] ?? '',
    'email' => $_SESSION['email'] ?? '',
    'role' => $_SESSION['role'] ?? '',
    'province' => $_SESSION['province'] ?? '',
    'city' => $_SESSION['city'] ?? '',
    'barangay' => $_SESSION['barangay'] ?? '',
] : null;
?>

<section class="page" id="settings">
  <h1>Settings</h1>
  <?php if ($loggedIn): ?>
    <div class="settings-container">
      <h2>Your Profile</h2>
      <p><strong>Username:</strong> <?php echo htmlspecialchars($user['username']); ?></p>
      <p><strong>Email:</strong> <?php echo htmlspecialchars($user['email']); ?></p>
      <p><strong>Account type:</strong> <?php echo htmlspecialchars($user['role']); ?></p>
      <p><strong>Province:</strong> <?php echo $user['province'] ?: 'Not Set'; ?></p>
      <p><strong>City:</strong> <?php echo $user['city'] ?: 'Not Set'; ?></p>
      <p><strong>Barangay:</strong> <?php echo $user['barangay'] ?: 'Not Set'; ?></p>
      <h2>Other Settings</h2>
      <button id="dark-toggle">Light/Dark Mode Toggle</button>
      <form action="backend/logout.php" method="post" style="margin-top: 20px;">
        <button type="submit">Log Out</button>
      </form>
    </div>
  <?php else: ?>
    <p>Please log in first. <a href="login.html">Go to Login</a></p>
  <?php endif; ?>
</section>