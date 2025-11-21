<?php
session_start();
include "db_connect.php";

/*if (isset($_SESSION['user_id']) || $_SESSION['role'] != 'farmer') {
    die("Access denied.");
}*/

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $category = $_POST['category'];
    $price = $_POST['price'];

    // Handle image upload
    if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
        $filename = time() . "_" . basename($_FILES['image']['name']);
        $target = "../assets/images/uploads/" . $filename;

        if (move_uploaded_file($_FILES['image']['tmp_name'], $target)) {
            $stmt = $connect->prepare("INSERT INTO products (name, category, price, image) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("ssds", $name, $category, $price, $filename);
            $stmt->execute();
            header("Location: ../dashboard.php");
            exit;
        } else {
            echo "Failed to upload image.";
        }
    } else {
        echo "No image uploaded.";
    }
}
?>