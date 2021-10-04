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

$today= date("Y-m-d");
$datetime = new DateTime('tomorrow');
$tomorrow =  $datetime->format('Y-m-d');
$array = array();


$db = new MyDB();
if(!$db){
    echo $db->lastErrorMsg();
} else{
    //echo "Opened the database.";
}
$stmt = $db->prepare("SELECT * FROM cook a INNER JOIN members m ON a.member_id=m.id WHERE date = :date");
$stmt->bindValue(':date', $today, SQLITE3_TEXT);
$results = $stmt->execute()->fetchArray(1);

array_push($array, $results);

$stmt = $db->prepare("SELECT * FROM cook a INNER JOIN members m ON a.member_id=m.id WHERE date = :date");
$stmt->bindValue(':date',$tomorrow, SQLITE3_TEXT);
$results = $stmt->execute()->fetchArray(1);

array_push($array, $results);

$stmt = $db->prepare("SELECT * FROM eaters a INNER JOIN members m ON a.member_id=m.id WHERE date = :date");
$stmt->bindValue(':date', $today, SQLITE3_TEXT);
$result = $stmt->execute()->fetchArray(1);
$data = array();
$results = $stmt->execute();
while ($res = $results->fetchArray(1)) {
//insert row into array
    array_push($data, $res);
}
array_push($array, $data);

$stmt = $db->prepare("SELECT * FROM eaters a INNER JOIN members m ON a.member_id=m.id WHERE date = :date");
$stmt->bindValue(':date', $tomorrow, SQLITE3_TEXT);
$result = $stmt->execute()->fetchArray(1);
$data = array();
$results = $stmt->execute();
while ($res = $results->fetchArray(1)) {
//insert row into array
    array_push($data, $res);
}
array_push($array, $data);

$stmt = $db->prepare("SELECT * FROM clean a INNER JOIN members m ON a.member_id=m.id WHERE date = :date");
$stmt->bindValue(':date', $today, SQLITE3_TEXT);
$results = $stmt->execute()->fetchArray(1);

array_push($array, $results);

echo json_encode($array);
exit();