<?php
session_start();
include "db_connect.php";

$farmer_id = $_SESSION['user_id'];

/*if (isset($_SESSION['user_id']) || $_SESSION['role'] != 'farmer') {
    die("Access denied.");
}*/

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $category = $_POST['category'];
    $price = $_POST['price'];
    $quantity = $_POST['quantity'];
    var_dump($_FILES['image']);

    // Handle image upload
    if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
        $filename = time() . "_" . basename($_FILES['image']['name']);
        $target = "../uploads/" . $filename;

        if (move_uploaded_file($_FILES['image']['tmp_name'], $target)) {
            $stmt = $connect->prepare("INSERT INTO products (name, category, price, quantity, farmer_id, image) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("ssdiis", $name, $category, $price, $quantity, $farmer_id, $filename);
            $stmt->execute();
            header("Location: ../index.php#products");
            exit;
        } else {
            header("Location: ../index.php#products?error=upload_failed");
            exit;
        }
    } else {
        header("Location: ../index.php#products");
        exit;
    }
}
?>