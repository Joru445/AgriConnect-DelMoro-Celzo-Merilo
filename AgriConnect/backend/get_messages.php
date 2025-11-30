<?php
session_start();
include "db_connect.php";

$user_id = $_SESSION['user_id'] ?? null;
$other_user_id = $_GET['conversation_with'] ?? null;

if (!$user_id || !$other_user_id) {
    echo json_encode([]);
    exit;
}

$stmt = $connect->prepare("
    SELECT sender_id, message, users.username
    FROM messages
    JOIN users ON users.id = messages.sender_id
    WHERE (sender_id = ? AND receiver_id = ?)
        OR (sender_id = ? AND receiver_id = ?)
    ORDER BY sent_at ASC
");
$stmt->bind_param("iiii", $user_id, $other_user_id, $other_user_id, $user_id);
$stmt->execute();
$result = $stmt->get_result();

$messages = [];
while ($row = $result->fetch_assoc()) {
    $messages[] = [
        'is_sender' => ($row['sender_id'] == $user_id),
        'username' => $row['username'],
        'message' => $row['message']
    ];
}

echo json_encode($messages);
