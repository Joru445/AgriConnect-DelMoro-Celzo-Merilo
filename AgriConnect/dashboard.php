<?php
session_start();
// if (!isset($_SESSION["user_id"])) {
//   header("Location: login.html");
//   exit;
// }
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


  <main>
<!--MAIN CONTENT SECTION-->
    <?php include "partials/hero.php"; ?>
<!-- PRODUCTS SECTION-->
    <?php include "partials/products.php"; ?>
<!-- FEEDBACK SECTION-->
    <?php include "partials/feedback.php"; ?>
<!-- SETTINGS SECTION-->
    <?php include "partials/settings.php"; ?>
<!-- INBOX SECTION-->
    <?php include "partials/inbox.php"; ?>
  </main>

  <footer>
    <p>© 2025 AgriConnect | Empowering Farmers and Consumers</p>
  </footer>

  <script src="navigation.js"></script>
  <script src="products.js"></script>
</body>
</html>