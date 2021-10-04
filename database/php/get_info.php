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

$today = $_GET['today'];
$tomorrow = $_GET['tomorrow'];
$array = array();


$db = new MyDB();
if(!$db){
    echo $db->lastErrorMsg();
} else{
    //echo "Opened the database.";
}

// Get cook today
$stmt = $db->prepare("SELECT m.id, m.name FROM cook a INNER JOIN members m ON a.member_id=m.id WHERE date = :date");
$stmt->bindValue(':date', $today, SQLITE3_TEXT);
$results = $stmt->execute()->fetchArray(1);

array_push($array, $results);

// Get cook tomorrow
$stmt = $db->prepare("SELECT m.id, m.name FROM cook a INNER JOIN members m ON a.member_id=m.id WHERE date = :date");
$stmt->bindValue(':date',$tomorrow, SQLITE3_TEXT);
$results = $stmt->execute()->fetchArray(1);

array_push($array, $results);

// Get cleaner today
$stmt = $db->prepare("SELECT m.id, m.name FROM clean a INNER JOIN members m ON a.member_id=m.id WHERE date = :date");
$stmt->bindValue(':date', $today, SQLITE3_TEXT);
$results = $stmt->execute()->fetchArray(1);

array_push($array, $results);

// Get cleaner tomorrow
$stmt = $db->prepare("SELECT m.id, m.name FROM clean a INNER JOIN members m ON a.member_id=m.id WHERE date = :date");
$stmt->bindValue(':date', $today, SQLITE3_TEXT);
$results = $stmt->execute()->fetchArray(1);

array_push($array, $results);

// Get eaters today
$stmt = $db->prepare("SELECT m.id, m.name FROM eaters a INNER JOIN members m ON a.member_id=m.id WHERE date = :date");
$stmt->bindValue(':date', $today, SQLITE3_TEXT);
$result = $stmt->execute()->fetchArray(1);
$data = array();
$results = $stmt->execute();
while ($res = $results->fetchArray(1)) {
//insert row into array
    array_push($data, $res);
}
array_push($array, $data);

// Get eaters tomorrow
$stmt = $db->prepare("SELECT m.id, m.name FROM eaters a INNER JOIN members m ON a.member_id=m.id WHERE date = :date");
$stmt->bindValue(':date', $tomorrow, SQLITE3_TEXT);
$result = $stmt->execute()->fetchArray(1);
$data = array();
$results = $stmt->execute();
while ($res = $results->fetchArray(1)) {
//insert row into array
    array_push($data, $res);
}
array_push($array, $data);

// Get dietaries today
$stmt = $db->prepare("SELECT m.id, m.name, d.description FROM dietary_needs d INNER JOIN members m ON d.member_id=m.id INNER JOIN eaters e ON e.member_id=d.member_id WHERE e.date = :date");
$stmt->bindValue(':date', $today, SQLITE3_TEXT);
$result = $stmt->execute()->fetchArray(1);
$data = array();
$results = $stmt->execute();
while ($res = $results->fetchArray(1)) {
//insert row into array
    array_push($data, $res);
}
array_push($array, $data);

// Get guests today
$stmt = $db->prepare("SELECT amount FROM guest_eaters WHERE date = :date");
$stmt->bindValue(':date', $today, SQLITE3_TEXT);
$results = $stmt->execute()->fetchArray(1);

array_push($array, $results);

// Get guests tomorrow
$stmt = $db->prepare("SELECT amount FROM guest_eaters WHERE date = :date");
$stmt->bindValue(':date', $tomorrow, SQLITE3_TEXT);
$results = $stmt->execute()->fetchArray(1);

array_push($array, $results);

echo json_encode($array);
exit();