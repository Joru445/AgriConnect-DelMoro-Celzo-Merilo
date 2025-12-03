<?php
include 'db_connect.php';

header('Content-Type: application/json');

$limit = 10;
$offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;

$stmt = $connect->prepare("
    SELECT
        p.*,
        u.username AS farmer_name,
        u.id AS farmer_id,
        CONCAT(u.barangay, ', ', u.city, ', ', u.province) AS location
    FROM products p
    JOIN users u ON p.farmer_id = u.id
    ORDER BY u.id
    DESC
    LIMIT ?, ?
");

$stmt->bind_param("ii", $offset, $limit);
$stmt->execute();

$result = $stmt->get_result();

echo json_encode($result->fetch_all(MYSQLI_ASSOC));
?>
