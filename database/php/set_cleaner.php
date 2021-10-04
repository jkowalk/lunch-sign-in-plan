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
$date = $_GET['date'];

$db = new MyDB();
if(!$db){
    echo $db->lastErrorMsg();
} else{
    //echo "Opened the database.";
}

$stmt = $db->prepare("DELETE FROM clean WHERE date=:date; ");
$stmt->bindValue(':date', $date, SQLITE3_TEXT);
$stmt->execute();


if ($id != "x") {
    $stmt = $db->prepare("INSERT INTO clean (date, member_id) VALUES (:date, :id); ");
    $stmt->bindValue(':date', $date, SQLITE3_TEXT);
    $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
    $stmt->execute();
}



exit();