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

$db = new MyDB();
if(!$db){
    echo $db->lastErrorMsg();
} else{
    //echo "Opened the database.";
}

$stmt = $db->prepare("DELETE FROM members  WHERE id=:id; ");
$stmt->bindValue(':id', $id, SQLITE3_INTEGER);
$stmt->execute();

/*
$stmt = $db->prepare("DELETE FROM eaters  WHERE member_id=:id; ");
$stmt->bindValue(':id', $id, SQLITE3_INTEGER);
$stmt->execute();
*/

$stmt = $db->prepare("DELETE FROM cook  WHERE member_id=:id; ");
$stmt->bindValue(':id', $id, SQLITE3_INTEGER);
$stmt->execute();

$stmt = $db->prepare("DELETE FROM clean  WHERE member_id=:id; ");
$stmt->bindValue(':id', $id, SQLITE3_INTEGER);
$stmt->execute();

$stmt = $db->prepare("DELETE FROM dietary_needs  WHERE member_id=:id;");
$stmt->bindValue(':id', $id, SQLITE3_INTEGER);
$stmt->execute();

exit();