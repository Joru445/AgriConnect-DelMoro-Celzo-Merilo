<?php
session_start();
include "db_connect.php";

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'Not logged in']);
    exit;
}

$userId = $_SESSION['user_id'];
$productId = $_POST['product_id'] ?? null;

if (!$productId) {
    echo json_encode(['success' => false, 'error' => 'No product specified']);
    exit;
}

// First, check if the product belongs to the logged-in user
$stmt = $connect->prepare("SELECT image FROM products WHERE id = ? AND farmer_id = ?");
$stmt->bind_param("ii", $productId, $userId);
$stmt->execute();
$result = $stmt->get_result();
$product = $result->fetch_assoc();

if (!$product) {
    echo json_encode(['success' => false, 'error' => 'Product not found or access denied']);
    exit;
}

// Delete the product image file if it exists
if (!empty($product['image'])) {
    $imagePath = "../uploads/" . $product['image'];
    if (file_exists($imagePath)) {
        unlink($imagePath);
    }
}

// Delete the product from database
$stmt = $connect->prepare("DELETE FROM products WHERE id = ? AND farmer_id = ?");
$stmt->bind_param("ii", $productId, $userId);
$stmt->execute();

echo json_encode(['success' => true]);
