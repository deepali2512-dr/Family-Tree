<?php

$servername = "127.0.0.1";
$username = "username";
$password = "password";

header('Content-Type: application/json');

$mobile_number = $_POST['mobile_number'];
$name = $_POST['name'];
$gender = $_POST['gender'];

try {
    $conn = new PDO("mysql:host=$servername;dbname=family_tree", $username, $password);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $sql = "INSERT INTO users (`name`, `mobile_number`, `gender`)
    VALUES ('$name', '$mobile_number', '$gender')";
    // use exec() because no results are returned
    $conn->exec($sql);
    echo true;
  } catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
  }

?>