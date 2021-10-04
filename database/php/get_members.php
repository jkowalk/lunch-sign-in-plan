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


// Get all members
$results = $db->query("SELECT * FROM members");
$members = array();

while ($res = $results->fetchArray(1)) {
    array_push($members, $res);
}

echo json_encode($members);
exit();