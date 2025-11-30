<?php
session_start();
header('Content-Type: application/json');

include 'db_connect.php';

$response = ['success' => false, 'error' => ''];

if (!isset($_SESSION['user_id'])) {
    $response['error'] = 'User not logged in';
    echo json_encode($response);
    exit;
}

$sender = $_SESSION['user_id'];
$receiver = isset($_POST['receiver_id']) ? intval($_POST['receiver_id']) : 0;
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

if ($receiver <= 0 || $message === '') {
    $response['error'] = 'Invalid input';
    echo json_encode($response);
    exit;
}

$stmt = $connect->prepare("INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)");
if ($stmt) {
    $stmt->bind_param("iis", $sender, $receiver, $message);
    if ($stmt->execute()) {
        $response['success'] = true;
    } else {
        $response['error'] = 'Database insert failed';
    }
    $stmt->close();
} else {
    $response['error'] = 'Database prepare failed';
}

echo json_encode($response);
exit;
