<?php

include '../config/database.php';
header('Content-Type: application/json');

$result = $connect->query("SELECT * FROM products");
$rows = [];
while($row = $result->fetch_assoc()) {
    $rows[] = $row;
}
echo json_encode($rows);

?>