<?php
include "db_connect.php";
session_start();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = trim($_POST["email"]);
    $password = trim($_POST["password"]);

    $stmt = $connect->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();

        if (password_verify($password, $user["password"])) {

            $_SESSION["user_id"]  = $user["id"];
            $_SESSION["username"] = $user["username"];
            $_SESSION["email"] = $user["email"];
            $_SESSION["role"]     = $user["role"];
            
            $_SESSION["province"]     = $user["province"];
            $_SESSION["city"]     = $user["city"];
            $_SESSION["barangay"]     = $user["barangay"];

            $_SESSION["profile_pic"]     = $user["profile_pic"];
            $_SESSION["about"]     = $user["about"];

            header("Location: ../index.php");
            exit;

        } else {
            header("Location: ../login.html?error=wrongpassword");
            exit;
        }

    } else {
        header("Location: ../login.html?error=notfound");
        exit;
    }
}
?>