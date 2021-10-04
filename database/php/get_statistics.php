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



$db = new MyDB();
if(!$db){
    echo $db->lastErrorMsg();
} else{
    //echo "Opened the database.";
}

$stmt = $db->prepare("SELECT * FROM statistics WHERE id != -1");
$results = $stmt->execute();
$data = array();

// Fetch Associated Array (1 for SQLITE3_ASSOC)
while ($res = $results->fetchArray(1)) {
//insert row into array
    array_push($data, $res);
}
echo json_encode($data);

exit();