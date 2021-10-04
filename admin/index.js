var members;
var dietary;

// Onload function
function load() {
    getData();
}

// Gets a JSON of the users
function getData() {
    var ajax = new XMLHttpRequest();
    var url = "get_data.php";

    executeStatement(url, "", "[Loading data] Error ", displayData);
}

// Displays the members in a table including remove button
function displayData(response) {
    members = JSON.parse(response)[0];
    dietary = JSON.parse(response)[1];

    //display members
    html = "<table>";
    for(var i = 0; i < members.length; i++) {
        var obj = members[i];
        html += "<tr><td>" + obj["name"] + "</td><td><button style='margin: 1em' onclick='removeUser(" + obj["id"] + ")'>Remove</button></td></tr>";
    }
    html += "</table><p><input type='text' id='add-user' name='add-user'><button onclick='addUser()'>Add user</button></p>";
    document.getElementById("users").innerHTML = html;

    //display dietary needs
    html = "<table>";
    for(var i = 0; i < dietary.length; i++) {
        var obj = dietary[i];
        html += "<tr><td>" + obj["name"] + "</td><td>" + obj["description"] + "</td><td><button style='margin: 1em' onclick='removeDietary(" + obj["id"] + ")'>Remove</button></td></tr>";
    }
    html += "</table>" +
            "<p><label for='dietary-name'>User:</label> <select name = 'dietary-name' id='dietary-name'>&nbsp;";
    
    for(var i = 0; i < members.length; i++) {
        var obj = members[i];
        html += "<option value=" + obj["id"] + ">" + obj["name"] + "</option>";
    }
    
    html += "</select> <input type='text' id='dietary-description' name='dietary-description'><button onclick='addDietary()'>Add dietary need</button></p>";
    document.getElementById("dietary").innerHTML = html;
}

// Adds a user with username
function addUser() {
    var user = document.getElementById("add-user").value;
    var url = "add_user.php?id=" + (members[members.length-1]['id']+1) + "&user=" + user;

    executeStatement(url, "Successfully added " + user, "[Add user] Error ", getData);
}

// Removes a user including all data in the database
function removeUser(id) {
    if(id === -1) {
        showSnackbar("You cannot remove the Guest user!", ERROR);
        return;
    }
    if (confirm("Are you sure you want to remove all data linked to this user?")) {
        var url = "remove_user.php?id=" + id;

        executeStatement(url, "Successfully removed", "[Remove user] Error ", getData);
    }
}

// Adds a new dietary entry
function addDietary() {
    var user = document.getElementById("dietary-name").value;
    var description = document.getElementById("dietary-description").value;
    var url = "add_dietary.php?id=" + user + "&description=" + description;

    executeStatement(url, "Successfully added", "[Add user] Error ", getData);
}

// Removes a dietary information
function removeDietary(id) {
    var url = "add_dietary.php?id=" + id + "&description=%empty%";

    executeStatement(url, "Removed Dietary from " + getUserFromId(id), "[remove dietary] Error", getData);
}

function getUserFromId(id) {
    for(var i = 0; i < members.length; i++) {
        var obj = members[i];
        if(obj["id"] === id) {
            return obj["name"];
        }
    }
    return null;
}