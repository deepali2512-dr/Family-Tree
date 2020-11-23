<?php

$servername = "127.0.0.1";
$username = "username";
$password = "password";

header('Content-Type: application/json');

$id = $_GET['id'];
$DATA = [];

try {
    $conn = new PDO("mysql:host=$servername;dbname=family_tree", $username, $password);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $stmt = $conn->prepare("SELECT * FROM users WHERE id = $id");
    $stmt->execute();

    // set the resulting array to associative
    $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
    foreach((new RecursiveArrayIterator($stmt->fetchAll())) as $k=>$self) {
        $DATA['self'] = $self;

        if($self['father_id']) {
            $stmt = $conn->prepare("SELECT * FROM users WHERE id = ".$self['father_id']);
            $stmt->execute();
            $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
            foreach((new RecursiveArrayIterator($stmt->fetchAll())) as $k=>$father) {
                $DATA['father'] = $father;

                if($father['spouse_id']) {
                    $stmt = $conn->prepare("SELECT * FROM users WHERE id = ".$father['spouse_id']);
                    $stmt->execute();
                    $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
                    foreach((new RecursiveArrayIterator($stmt->fetchAll())) as $k=>$mother) {
                        $DATA['mother'] = $mother;
                    }
                }

                $DATA['siblings'] = [];

                $stmt3 = $conn->prepare("SELECT * FROM users WHERE father_id = ".$father['id']." AND id <> ".$self['id']);
                $stmt3->execute();
                $result3 = $stmt3->setFetchMode(PDO::FETCH_ASSOC);
                foreach((new RecursiveArrayIterator($stmt3->fetchAll())) as $k=>$sibling) {
                    array_push($DATA['siblings'], $sibling);
                }
            }
        }

        if($self['spouse_id']) {
            $stmt = $conn->prepare("SELECT * FROM users WHERE id = ".$self['spouse_id']);
            $stmt->execute();
            $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
            foreach((new RecursiveArrayIterator($stmt->fetchAll())) as $k=>$spouse) {
                $DATA['spouse'] = $spouse;
            }
        }

        if($self['gender'] == 'female' && $self['spouse_id']) {
            $stmt = $conn->prepare("SELECT * FROM users WHERE father_id = ".$self['spouse_id']);
        } else {
            $stmt = $conn->prepare("SELECT * FROM users WHERE father_id = ".$self['id']);
        }
        $stmt->execute();
        $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $DATA['children'] = [];
        foreach((new RecursiveArrayIterator($stmt->fetchAll())) as $k=>$child) {
            if($child['spouse_id']) {
                $stmt2 = $conn->prepare("SELECT * FROM users WHERE id = ".$child['spouse_id']);
                $stmt2->execute();
                $result2 = $stmt2->setFetchMode(PDO::FETCH_ASSOC);
                foreach((new RecursiveArrayIterator($stmt2->fetchAll())) as $k=>$spouse) {
                    $child['spouse'] = $spouse;
                }
            }
            array_push($DATA['children'], $child);
        }
    }
    echo json_encode($DATA);
  } catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
  }

?>