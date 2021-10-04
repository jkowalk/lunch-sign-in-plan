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
$user = $_GET['user'];

$db = new MyDB();
if(!$db){
    echo $db->lastErrorMsg();
} else{
    //echo "Opened the database.";
}


if ($user != "") {
    $check_id=true;
    while($check_id) {
        $stmt = $db->prepare("SELECT * FROM eaters WHERE member_id=:id");
        $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
        $response = $stmt->execute();
        if(json_encode($response->fetchArray(1)) == "false") {
            $check_id=false;
        } else {
            $id++;
        }
    }
        



    $stmt = $db->prepare("INSERT INTO members (id, name) VALUES (:id, :name); ");
    $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
    $stmt->bindValue(':name', $user, SQLITE3_TEXT);
    $stmt->execute();
    if ($stmt) {
        header("HTTP/1.1 200 OK");
        exit();
    } else {
        header("HTTP/1.1 500 Database Error");
    }
}


header("HTTP/1.1 500 username empty");
exit();