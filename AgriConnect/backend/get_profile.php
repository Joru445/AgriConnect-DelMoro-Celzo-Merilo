<?php
include 'db_connect.php';

header('Content-Type: application/json');

$farmer_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

$stmt = $connect->prepare("
    SELECT
        users.id AS farmer_id,
        users.username,
        users.email,
        users.barangay,
        users.city,
        users.province,
        CONCAT(users.barangay, ', ', users.city, ', ', users.province) AS location,

        products.id AS product_id,
        products.name,
        products.price,
        products.quantity,
        products.image
    FROM users
    LEFT JOIN products ON products.farmer_id = users.id
    WHERE users.id = ?
");

$stmt->bind_param("i", $farmer_id);
$stmt->execute();
$result = $stmt->get_result();

$profile = [
    "farmer" => null,
    "products" => []
];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {

        // assign farmer only once
        if ($profile["farmer"] === null) {
            $profile["farmer"] = [
                "id"       => $row["farmer_id"],
                "name"     => $row["username"], // ✅ fixed
                "email"    => $row["email"],
                "location" => $row["location"]
            ];
        }

        // collect products
        if (!empty($row["product_id"])) {
            $profile["products"][] = [
                "id"       => $row["product_id"],
                "name"     => $row["name"], // ✅ fixed
                "price"    => $row["price"],
                "quantity" => $row["quantity"],
                "image"    => $row["image"]
            ];
        }
    }
}

echo json_encode($profile);
