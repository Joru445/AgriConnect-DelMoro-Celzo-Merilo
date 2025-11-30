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
    SELECT username, role, province, city, barangay
    FROM users
    WHERE role = 'farmer' AND province = ? AND city = ? AND barangay = ?
    ORDER BY username ASC
    LIMIT 3
");

$stmt->bind_param("sss", $province, $city, $barangay);
$stmt->execute();
$result = $stmt->get_result();

$farmers = [];
while ($row = $result->fetch_assoc()) {
  $farmers[] = $row;
}

echo json_encode($farmers);
?>
