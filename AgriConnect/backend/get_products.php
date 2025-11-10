<?php
include 'db_connect.php';

header('Content-Type: application/json');

$sql = "SELECT * FROM products";
$result = $connect->query($sql);

$products = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
}

// echo json_encode($products);

?>