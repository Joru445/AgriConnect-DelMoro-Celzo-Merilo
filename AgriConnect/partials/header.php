<header class="main-header">
  <img src="logo.png" alt="AgriConnect">
  <nav class="navigation">
    <form action="search.php" method="get">
      <div class="search">
        <i class="search-icon material-symbols-rounded">search</i>
        <input class="search-input" type="text" name="search" id="search" placeholder="Search">
      </div>
    </form>
    <button data-target="inbox">
      <i class="material-symbols-rounded">chat</i>
      <p>Inbox</p>
    </button>
    <button data-target="settings">
      <i class="material-symbols-rounded">settings</i>
      <p>Settings</p>
    </button>
    <?php if ($loggedIn): ?>
    <p><?php echo $user['username']; ?></p>
    <?php endif; ?>
  </nav>
</header>