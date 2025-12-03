<?php
session_start();
include 'db_connect.php';


if (!isset($_SESSION["user_id"])) {
  echo json_encode(['error' => 'no session found']);
  exit;
}

$user_id = $_SESSION['user_id'];
$province = $_SESSION["province"];
$city = $_SESSION["city"];
$barangay = $_SESSION["barangay"];

$stmt = $connect->prepare("
    SELECT id, username, role, province, city, barangay, profile_pic
    FROM users
    WHERE id != ? AND role = 'farmer' AND province = ? AND city = ?
    ORDER BY username ASC
    LIMIT 15
");

$stmt->bind_param("iss", $user_id, $province, $city);
$stmt->execute();
$result = $stmt->get_result();

$farmers = [];
while ($row = $result->fetch_assoc()) {
  $farmers[] = $row;
}

echo json_encode($farmers);
?>
