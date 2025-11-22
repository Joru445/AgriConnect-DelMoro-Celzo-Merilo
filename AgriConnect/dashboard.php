<?php
session_start();
include "backend/db_connect.php";

$loggedIn = false;
$user = null;

if (isset($_SESSION['user_id'])) {
    $loggedIn = true;
    $user_id = $_SESSION['user_id'];

    $stmt = $connect->prepare("SELECT username, email, role FROM users WHERE id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <title>AgriConnect</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@1&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Symbols+Rounded" />
  <link rel="stylesheet" href="styles/styles.css">
</head>

<body>
  <?php include "partials/header.php"; ?>
  <?php include "partials/sidebar.php"; ?>

  <main class="main-content" id="main-content">
    <p class="loading-message">Loading...</p>
  </main>

  <footer>
    <p>© 2025 AgriConnect | Empowering Farmers and Consumers</p>
  </footer>

  <script src="navigation.js"></script>
  <script src="products.js"></script>
  <script src="settings.js"></script>
</body>
</html>