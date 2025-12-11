<?php
session_start();
$loggedIn = isset($_SESSION['user_id']);
$user = $loggedIn ? [
    'id' => $_SESSION['user_id'],
    'username' => $_SESSION['username'] ?? '',
    'email' => $_SESSION['email'] ?? '',
    'role' => $_SESSION['role'] ?? '',
    'province' => $_SESSION['province'] ?? '',
    'city' => $_SESSION['city'] ?? '',
    'barangay' => $_SESSION['barangay'] ?? '',
    'profile_pic' => $_SESSION['profile_pic'] ?? '',
    'about' => $_SESSION['about'] ?? '',
] : null;
?>

<section class="page" id="profile">
  <h1>Settings</h1>
  <?php if ($loggedIn): ?>
    <div class="profile-header">
      <div class="profile-emphasize">
        <h2>Your Profile</h2>
        <div class="profile-image-placeholder">
          <img id="profilePreview" src="<?php echo !empty($user['profile_pic']) ?
          './uploads/profiles/' . htmlspecialchars($user['profile_pic'] . '.jpg') :
          './assets/placeholder/profiles/profile_pic.jpg'; ?>"
              loading="lazy"
              alt="<?php echo htmlspecialchars($user['username']); ?>">
        </div>
      </div>
      <div class="profile-info">
        <form action="backend/update_profile.php" method="post" enctype="multipart/form-data">
          <label>
            Change Username:
          </label>
          <input type="text" name="username" value="<?php echo htmlspecialchars($user['username']); ?>">
          <label>
            Change Bio:
          </label>
          <input type="text" name="about" value="<?php echo $user['about'] ?: 'Not Set'; ?>">
          <label>
            Update Profile Picture:
          </label>
          <input type="file" name="profile_pic" id="profilePicInput" accept="image/*">
          <button type="submit">Save Changes</button>
        </form>
        <h3>Address</h3>
        <p><strong>Province: </strong><?php echo $user['province'] ?: 'Not Set'; ?></p>
        <p><strong>City: </strong><?php echo $user['city'] ?: 'Not Set'; ?></p>
        <p><strong>Barangay: </strong><?php echo $user['barangay'] ?: 'Not Set'; ?></p>
      </div>
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

<script>
const profileInput = document.getElementById('profilePicInput');
const profilePreview = document.getElementById('profilePreview');

profileInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    profilePreview.src = reader.result;
  };
  reader.readAsDataURL(file);
});

</script>
