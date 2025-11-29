<?php
include "db_connect.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $username = trim($_POST["username"]);
    $email    = trim($_POST["email"]);
    $password = trim($_POST["password"]);
    $role = isset($_POST['role']) ? $_POST['role'] : 'customer';

    $province = !empty($_POST['province']) ? $_POST['province'] : NULL;
    $city     = !empty($_POST['city']) ? $_POST['city'] : NULL;
    $barangay = !empty($_POST['barangay']) ? $_POST['barangay'] : NULL;

    if (empty($username) || empty($email) || empty($password)) {
        echo "Please fill in all required fields.";
        exit;
    }

    $check = $connect->prepare("SELECT id FROM users WHERE email = ?");
    $check->bind_param("s", $email);
    $check->execute();
    $checkResult = $check->get_result();

    if ($checkResult->num_rows > 0) {
        header("Location: ../register.html?error=email-already-exist");
        exit;
    }

    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $connect->prepare("INSERT INTO users (username, email, password, role, province, city, barangay) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssss", $username, $email, $hashed_password, $role, $province, $city, $barangay);

    if ($stmt->execute()) {
        header("Location: ../login.html");
        exit;
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
    $check->close();
    $connect->close();
} else {
    echo "Invalid request method.";
}
?>