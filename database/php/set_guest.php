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


$amount = $_GET['amount'];
$date = $_GET['date'];

$db = new MyDB();
if(!$db){
    echo $db->lastErrorMsg();
} else{
    //echo "Opened the database.";
}

// Get amount of guests
$stmt = $db->prepare("SELECT amount FROM guest_eaters WHERE date = :date");
$stmt->bindValue(':date', $date, SQLITE3_TEXT);
$results = $stmt->execute()->fetchArray(1);

// Calculate new amount from change
$new_amount = $amount;
if($results != "") {
    $new_amount += $results["amount"];
}


$stmt = $db->prepare("DELETE FROM guest_eaters WHERE date=:date; ");
$stmt->bindValue(':date', $date, SQLITE3_TEXT);
$stmt->execute();

if($new_amount != 0) {
    $stmt = $db->prepare("INSERT INTO guest_eaters (date, amount) VALUES (:date, :new_amount); ");
    $stmt->bindValue(':date', $date, SQLITE3_TEXT);
    $stmt->bindValue(':new_amount', $new_amount, SQLITE3_INTEGER);
    $stmt->execute();
}


exit();