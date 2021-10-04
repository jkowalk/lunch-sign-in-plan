
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
$date = $_GET['date'];
$date_to = $_GET['date_to'];


$db = new MyDB();
if(!$db){
    echo $db->lastErrorMsg();
} else{
    //echo "Opened the database.";
}
$table=array();

// Get cooks for the week
$stmt = $db->prepare("SELECT * FROM cook WHERE date >= :date AND date <= :todate");
$stmt->bindValue(':date', $date, SQLITE3_TEXT);
$stmt->bindValue(':todate', $date_to, SQLITE3_TEXT);
$results = $stmt->execute();
$data = array();

while ($res = $results->fetchArray(1)) {
    array_push($data, $res);
}
array_push($table, $data);

// Get cleaners for the week
$stmt = $db->prepare("SELECT * FROM clean WHERE date >= :date AND date <= :todate");
$stmt->bindValue(':date',  $date, SQLITE3_TEXT);
$stmt->bindValue(':todate',  $date_to, SQLITE3_TEXT);
$results = $stmt->execute();
$data = array();

while ($res = $results->fetchArray(1)) {
    array_push($data, $res);
}
array_push($table, $data);

// Get all members
$results = $db->query("SELECT * FROM members");
$members = array();

while ($res = $results->fetchArray(1)) {
    array_push($members, $res);
}
//array_push($table,$members);

// Get eating dates for all members for the week
$eaters_data = array();
for ($i=0; $i<count($members); $i++) {
    $stmt = $db->prepare("SELECT * FROM eaters WHERE member_id=:id AND date >= :date AND date <= :todate");
    $stmt->bindValue(':date', $date, SQLITE3_TEXT);
    $stmt->bindValue(':todate', $date_to, SQLITE3_TEXT);
    $stmt->bindValue(':id', $members[$i]["id"], SQLITE3_INTEGER);

    $results = $stmt->execute();
    $data = array();
    while ($res = $results->fetchArray(1)) {
        array_push($data, $res);
    }
    array_push($eaters_data, $data);
}
array_push($table, $eaters_data);

// Get guests for the week
$stmt = $db->prepare("SELECT * FROM guest_eaters WHERE date >= :date AND date <= :todate");
$stmt->bindValue(':date', $date, SQLITE3_TEXT);
$stmt->bindValue(':todate', $date_to, SQLITE3_TEXT);
$results = $stmt->execute();
$data = array();

while ($res = $results->fetchArray(1)) {
    array_push($data, $res);
}
array_push($table, $data);

echo json_encode($table);
exit();