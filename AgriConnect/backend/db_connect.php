<?php

$host = "localhost";
$user = "root";
$password = "";
$database = "agriconnect";

$connect = new mysqli($host, $user, $password, $database);

if ($connect->connect_error) {
    die("Connection failed: " . $connect->connect_error);
}

?>