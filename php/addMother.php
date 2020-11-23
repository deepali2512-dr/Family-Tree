<?php

$servername = "127.0.0.1";
$username = "username";
$password = "password";

header('Content-Type: application/json');

$mobile_number = $_POST['mobile_number'];
$name = $_POST['name'];
$user_id = $_POST['user_id'];
$father_id = $_POST['father_id'];
$gender = 'female';

try {
    $conn = new PDO("mysql:host=$servername;dbname=family_tree", $username, $password);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $sql = "INSERT INTO users (`name`, `mobile_number`, `gender`, `spouse_id`)
    VALUES ('$name', '$mobile_number', '$gender', $father_id)";
    // use exec() because no results are returned
    $conn->exec($sql);

    $mother_id = $conn->lastInsertId();  

    $sql = "UPDATE users SET spouse_id=$mother_id WHERE id=$father_id";

    // Prepare statement
    $stmt = $conn->prepare($sql);

    // execute the query
    $stmt->execute();

    echo true;
  } catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
  }

?>