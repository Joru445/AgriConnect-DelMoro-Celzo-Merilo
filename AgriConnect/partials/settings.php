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
    'profile_pic' => $_SESSION['profile_pic'] ?? '',
] : null;
?>

<section class="page" id="profile">
  <h1>Settings</h1>
  <?php if ($loggedIn): ?>
    <h2>Your Profile</h2>
    <div class="profile-header">
      <div class="profile-image-placeholder">
        <img src="<?php
          echo !empty($user['profile_pic'])
          ? './uploads/profiles/' . htmlspecialchars($user['profile_pic'] . '.jpg')
          : './assets/placeholder/profiles/profile_pic.jpg';
          ?>" loading="lazy" alt="<?php echo htmlspecialchars($user['username']); ?>">
      </div>
      <div class="profile-info">
        <p><strong>Username: </strong><?php echo htmlspecialchars($user['username']); ?></p>
        <p><strong>Email: </strong><?php echo htmlspecialchars($user['email']); ?></p>
        <p><strong>User type: </strong><?php echo htmlspecialchars($user['role']); ?></p>
      </div>
    </div>
    <div class="profile-info">
      <h3>Address</h3>
      <p><strong>Province: </strong><?php echo $user['province'] ?: 'Not Set'; ?></p>
      <p><strong>City: </strong><?php echo $user['city'] ?: 'Not Set'; ?></p>
      <p><strong>Barangay: </strong><?php echo $user['barangay'] ?: 'Not Set'; ?></p>
    </div>
    <h2>Other Settings</h2>
    <button id="dark-toggle">Light/Dark Mode Toggle</button>
    <form action="backend/logout.php" method="post" style="margin-top: 20px;">
        <button type="submit">Log Out</button>
      </form>
  <?php else: ?>
    <p>Please log in first. <a href="login.html">Go to Login</a></p>
  <?php endif; ?>
</section>