<?php
include "db_connect.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $username = trim($_POST["username"]);
    $email    = trim($_POST["email"]);
    $password = trim($_POST["password"]);
    $role = isset($_POST['role']) ? $_POST['role'] : 'customer';


    if (empty($username) || empty($email) || empty($password)) {
        echo "Please fill in all required fields.";
        exit;
    }

    $check = $connect->prepare("SELECT id FROM users WHERE email = ?");
    $check->bind_param("s", $email);
    $check->execute();
    $checkResult = $check->get_result();

    if ($checkResult->num_rows > 0) {
        echo "Email is already registered. Please login or use a different email.";
        exit;
    }

    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $connect->prepare("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $username, $email, $hashed_password, $role);

    if ($stmt->execute()) {
        echo "Registration successful! You can now <a href='../login.html'>log in</a>.";

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
