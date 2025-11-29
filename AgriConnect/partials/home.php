<?php
session_start();
include "../backend/db_connect.php";

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

<section id="home" class="page">
  <header class="home-header" style="background-image: url('https://i.pinimg.com/1200x/10/c2/6c/10c26c307302dd487a3fe8b8653da27e.jpg');">
    <h1 class="text"><span class="agri">agri</span><span class="connect">connect</span></h1>
  </header>
  <div class="home-info">
    <p class="tagline">"Connecting Farmers, Growing Futures"</p>
    <p class="short-desc">Empowering local farmers and bringing fresh produce straight to your table.</p>
<!-- GROW WITH US SECTION-->
<?php if (!$loggedIn): ?>
    <section class="grow-section">
      <h2>Ready to Grow with Us?</h2>
      <p>
        Whether you're a local grower or a conscious consumer, join our mission to
        cultivate a better food future.
      </p>
      <div class="grow-buttons">
        <a href="register.html?role=customer"><button class="buyer-button">Become a Buyer</button></a>
        <a href="register.html?role=farmer"><button class="farmer-button">Partner With Us</button></a>
      </div>
    </section>
<?php else: ?>
<!-- FEATURED SECTION-->
    <d class="featured-section">
    <h2>Stores near you</h2>
    <div class="stores-near-you">
      <div class="store-card"></div>
      <div class="store-card"></div>
      <div class="store-card"></div>
    </div>
    </d>
<?php endif; ?>
    <article id="about">
      <h1>About Us</h1>
      <p>
        AgriConnect is a platform that brigdes farmers and buyers by providing direct access to products, fair trade opportunities, and sustainable market practices.
        Our mission is to empower local farmers while ensuring buyers get fresh and affordable produce.
      </p>
      <h1>Our Services</h1>
        <ul>
          <li>Direct farmer-to-buyer marketplace</li>
          <li>Fair pricing and transparent transactions</li>
          <li>Educational resources for farmers</li>
        </ul>
    </article>
  </div>
</section>