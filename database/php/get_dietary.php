<?php
error_reporting(E_ALL);

class MyDB extends sqlite3{
    function __construct(){
        $this->open('../food');
    }
}

$db = new MyDB();
if(!$db){
    echo $db->lastErrorMsg();
} else{
    //echo "Opened the database.";
}

$stmt = $db->prepare("SELECT m.id, m.name, d.description FROM dietary_needs d INNER JOIN members m WHERE d.member_id=m.id");
$results = $stmt->execute();
//Create array to keep all results
$dietary = array();

// Fetch Associated Array (1 for SQLITE3_ASSOC)
while ($res = $results->fetchArray(1)) {
//insert row into array
    array_push($dietary, $res);
}

echo json_encode($dietary);
exit();