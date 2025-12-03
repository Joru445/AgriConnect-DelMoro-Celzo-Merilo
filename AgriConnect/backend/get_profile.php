<?php
include 'db_connect.php';
header('Content-Type: application/json');

$farmer_id = isset($_GET['id']) ? intval($_GET['id']) : 0;
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 8;
$offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;

// Fetch farmer info
$stmtFarmer = $connect->prepare("
    SELECT id, username, email, barangay, city, province, about, profile_pic,
        CONCAT(barangay, ', ', city, ', ', province) AS location
    FROM users
    WHERE id = ?
");
$stmtFarmer->bind_param("i", $farmer_id);
$stmtFarmer->execute();
$resultFarmer = $stmtFarmer->get_result();
$farmer = $resultFarmer->fetch_assoc();

// Fetch farmer's products with limit & offset
$stmtProducts = $connect->prepare("
    SELECT id, name, price, category, quantity, image
    FROM products
    WHERE farmer_id = ?
    ORDER BY id DESC
    LIMIT ? OFFSET ?
");
$stmtProducts->bind_param("iii", $farmer_id, $limit, $offset);
$stmtProducts->execute();
$resultProducts = $stmtProducts->get_result();
$products = $resultProducts->fetch_all(MYSQLI_ASSOC);

$response = [
    "farmer" => $farmer ?: null,
    "products" => $products
];

echo json_encode($response);
?>
