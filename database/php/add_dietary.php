<?php
error_reporting(E_ALL);
// I don't know if you need to wrap the 1 inside of double quotes.
ini_set("display_startup_errors",1);
ini_set("display_errors",1);

class MyDB extends sqlite3{
    function __construct(){
        $this->open('../food');
    }
}
$id = $_GET['id'];
$description = $_GET['description'];

$db = new MyDB();
if(!$db){
    echo $db->lastErrorMsg();
} else{
    //echo "Opened the database.";
}

$stmt = $db->prepare("DELETE FROM dietary_needs  WHERE member_id=:id; ");
$stmt->bindValue(':id', $id, SQLITE3_INTEGER);
$stmt->execute();

if ($description == "") {
    header("HTTP/1.1 500 Description empty");
    exit();
}

if ($description != "%empty%") {
    $stmt = $db->prepare("INSERT INTO dietary_needs (member_id, description) VALUES (:member_id, :description); ");
    $stmt->bindValue(':member_id', $id, SQLITE3_INTEGER);
    $stmt->bindValue(':description', $description, SQLITE3_TEXT);
    $stmt->execute();
    if ($stmt) {
        header("HTTP/1.1 200 OK");
        exit();
    } else {
        header("HTTP/1.1 500 Database Error");
    }
}
exit();