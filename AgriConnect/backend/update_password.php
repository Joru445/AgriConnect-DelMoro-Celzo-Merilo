<?php
include "db_connect.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $email    = trim($_POST["email"]);
  $password = trim($_POST["password"]);

  $stmt = $connect->prepare("SELECT * FROM users WHERE email = ?");
  $stmt->bind_param("s", $email);
  $stmt->execute();
  $result = $stmt->get_result();
  
  if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();

    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $connect->prepare("UPDATE users SET password = ? WHERE email = ?");
    $stmt->bind_param("ss", $hashed_password, $email);

    if ($stmt->execute()) {
      header("Location: ../login.html");
    exit;
    } else {
      echo "Error: " . $stmt->error;
    }
  } else {
    header("Location: ../login.html?error=notfound");
    exit;
  }
} else {
  echo "Invalid request method.";
}
?>