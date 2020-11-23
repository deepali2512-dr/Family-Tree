<?php

$servername = "127.0.0.1";
$username = "username";
$password = "password";

header('Content-Type: application/json');

$mobile_number = $_POST['mobile_number'];
$name = $_POST['name'];
$user_id = $_POST['user_id'];
$gender = $_POST['gender'];
$user_gender = $_POST['user_gender'];
$spouse_id = $_POST['spouse_id'];

try {
    $conn = new PDO("mysql:host=$servername;dbname=family_tree", $username, $password);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    if($user_gender == 'male') {
      $sql = "INSERT INTO users (`name`, `mobile_number`, `gender`, `father_id`)
      VALUES ('$name', '$mobile_number', '$gender', $user_id)";
    } else {
      $sql = "INSERT INTO users (`name`, `mobile_number`, `gender`, `father_id`)
      VALUES ('$name', '$mobile_number', '$gender', $spouse_id)";
    }
    // use exec() because no results are returned
    $conn->exec($sql);

    echo true;
  } catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
  }

?>