<?php 
session_start();
include "db_connect.php";

if (!isset($_SESSION['user_id'])) {
    header("Location: ../login.html");
    exit;
}

$userId = $_SESSION['user_id'];

if (isset($_POST['username']) || isset($_POST['about'])) {

    $stmt = $connect->prepare("SELECT username, about FROM users WHERE id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $current = $stmt->get_result()->fetch_assoc();

    $newUsername = trim($_POST['username'] ?? "");
    $newAbout    = trim($_POST['about'] ?? "");

    $updates = [];
    $params  = [];
    $types   = "";

    if ($newUsername !== "" && $newUsername !== $current['username']) {
        $updates[] = "username=?";
        $params[]  = $newUsername;
        $types    .= "s";
    }

    if ($newAbout !== "" && $newAbout !== "Not set" && $newAbout !== $current['about']) {
        $updates[] = "about=?";
        $params[]  = $newAbout;
        $types    .= "s";
    }

    if (!empty($updates)) {
        $params[] = $userId;
        $types  .= "i";

        $sql = "UPDATE users SET " . implode(",", $updates) . " WHERE id=?";
        $stmt = $connect->prepare($sql);
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
    }
}

if (isset($_FILES['profile_pic']) && $_FILES['profile_pic']['error'] === 0) {

    $tmpName = $_FILES['profile_pic']['tmp_name'];

    $info = getimagesize($tmpName);
    if (!$info) die("Uploaded file is not a valid image.");

    switch ($info['mime']) {
        case 'image/jpeg': $img = imagecreatefromjpeg($tmpName); break;
        case 'image/png':  $img = imagecreatefrompng($tmpName);  break;
        case 'image/webp': $img = imagecreatefromwebp($tmpName); break;
        default:
            die("Unsupported image format. Only JPG, PNG, WEBP allowed.");
    }

    $targetDir  = "../uploads/profiles/";
    $filename   = $userId . ".jpg";
    $targetPath = $targetDir . $filename;

    if (imagejpeg($img, $targetPath, 90)) {
        imagedestroy($img);

        $stmt = $connect->prepare("UPDATE users SET profile_pic=? WHERE id=?");
        $stmt->bind_param("si", $userId, $userId);
        $stmt->execute();

        $_SESSION['profile_pic'] = $userId;
    } else {
        die("Failed to save the image.");
    }
}

header("Location: ../index.php#settings");
exit;
?>
