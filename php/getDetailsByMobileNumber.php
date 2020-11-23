<?php

$servername = "127.0.0.1";
$username = "username";
$password = "password";

header('Content-Type: application/json');

$mobile_number = $_POST['mobile_number'];

try {
    $conn = new PDO("mysql:host=$servername;dbname=family_tree", $username, $password);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $stmt = $conn->prepare("SELECT * FROM users WHERE mobile_number = '$mobile_number'");
    $stmt->execute();

    // set the resulting array to associative
    $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
    $DATA = [];
    foreach((new RecursiveArrayIterator($stmt->fetchAll())) as $k=>$v) {
        array_push($DATA, $v);
    }
    echo json_encode($DATA);
  } catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
  }

?>