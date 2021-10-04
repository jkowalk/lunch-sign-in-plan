import DatabaseConnection from "./database/database_connection.js";
import Dietary from "./model/dietary.js";
import Users from "./model/users.js";
import CustomAlert from "./view/helpers/custom_alert.js";
import LoadingOverlay from "./view/helpers/loading_overlay.js";

/**
 * The Admin Panel
 */
export default class Admin {


    constructor() {
        this._display();
    }

    /**
     * Gets the data and displays it
     */
    async _display() {
        document.getElementById("admin_title").innerText = LANG.admin_heading;
        document.getElementById("users_heading").innerText = LANG.user_heading;
        document.getElementById("dietary_heading").innerText = LANG.dietaries_heading;

        let users;
        let dietary;
        LoadingOverlay.show();
        try {
            users = (await Users.build()).get();
            dietary = (await Dietary.build()).get();
            await users;
            await dietary;
        } catch (error) {
            LoadingOverlay.hide();
            console.error(error);
            CustomAlert.alert(LANG.error_explanation, LANG.error);
            return;
        }
        LoadingOverlay.hide();

        // display user
        let html = "<table>";
        for(var i = 0; i < users.length; i++) {
            var obj = users[i];
            html += "<tr><td>" + obj["name"] + "</td><td><button style='margin: 1em' id='remove_user_" + i + "'>Remove</button></td></tr>";
        }
        html += "</table><p class='admin_form'><span>&nbsp;&nbsp;&nbsp;</span><label for='dietary-description'>" + LANG.username + "</label><span>&nbsp;</span><input type='text' id='add-user' name='add-user'><span>&nbsp;&nbsp;&nbsp;</span><button id='add_user_button'>Add user</button></p>";
        document.getElementById("users").innerHTML = html;

        // display dietary needs
        html = "<table>";
        for(var i = 0; i < dietary.length; i++) {
            var obj = dietary[i];
            html += "<tr><td>" + obj["name"] + "</td><td>" + obj["description"] + "</td><td><button style='margin: 1em' id='remove_dietary_" + i + "'>Remove</button></td></tr>";
        }
        html += "</table>" +
                "<p class='admin_form'><label for='dietary-name'>" + LANG.user + "</label><span>&nbsp;</span><select name = 'dietary-name' id='dietary-name'>&nbsp;";
        
        for(var i = 0; i < users.length; i++) {
            var obj = users[i];
            html += "<option value=" + obj["id"] + ">" + obj["name"] + "</option>";
        }
        
        html += "</select> <span>&nbsp;&nbsp;&nbsp;</span><label for='dietary-description'>" + LANG.description + "</label><span>&nbsp;</span><input type='text' id='dietary-description' name='dietary-description'><span>&nbsp;&nbsp;&nbsp;</span><button id='add_dietary_button'>Add dietary need</button></p>";
        document.getElementById("dietary").innerHTML = html;
        
        // Add EventListener
        for(let i = 0; i < users.length; i++) {
            document.getElementById("remove_user_" + i).addEventListener("click", async () => {
                await this.remove_user(i);
                await this._update();
                this._display();
            });
        }
        document.getElementById("add_user_button").addEventListener("click", async () => {
            await this.add_user();
            await this._update();
            this._display();}
        );

        for(let i = 0; i < dietary.length; i++) {
            document.getElementById("remove_dietary_" + i).addEventListener("click", async () => {
                await this.remove_dietary(i);
                await this._update();
                this._display();
            });
        }
        document.getElementById("add_dietary_button").addEventListener("click", async () => {
            await this.add_dietary();
            await this._update();
            this._display();
        });
    }

    /**
     * Updates the data
     */
    async _update() {
        try {
            let users = (await Users.build()).update_data();
            let dietary = (await Dietary.build()).update_data();
            await users;
            await dietary;
        } catch (error) {
            console.error(error);
            CustomAlert.alert(LANG.error_explanation, LANG.error);
        }
    }

    /**
     * Adds a new user
     */
    async add_user() {
        var username = document.getElementById("add-user").value;
        if(!username || username == "") { 
            CustomAlert.toast(LANG.empty_field, "", CustomAlert.ERROR);
            throw "Empty field";
        }
        LoadingOverlay.show();
        try {
            var users = (await Users.build()).get();
            var id = users.length == 0 ? 1 : (users[users.length-1]['id']+1);
            console.log(username);
            await DatabaseConnection.add_user(username, id);
            CustomAlert.toast(LANG.success_toast, "", CustomAlert.SUCCESS);
        } catch (error) {
            console.error(error);
            CustomAlert.alert(LANG.error_explanation, LANG.error);
            return;
        }
        this._display();
    }

    /**
     * Removes a user
     * @param {int} row 
     */
    async remove_user(row) {
        var users = await Users.build();
        var user = users.get()[row];
        if(user.id === -1) {
            CustomAlert.toast(LANG.error_removing_guest, "", CustomAlert.ERROR);
            return;
        }
        CustomAlert.prompt(user.name + " " + LANG.remove_user_msg, LANG.remove_user_title, async (bool) => {
            if(bool) {
                LoadingOverlay.show();
                try {
                    await DatabaseConnection.remove_user(user.id);                
                    CustomAlert.toast(LANG.success_toast, "", CustomAlert.SUCCESS);
                    await this._update();
                    this._display();
                } catch (error) {
                    console.error(error);
                    CustomAlert.alert(LANG.error_explanation, LANG.error);
                }
            }
        });
    }

    /**
     * Adds a new dietary need
     */
    async add_dietary() {
        var id = document.getElementById("dietary-name").value;
        var description = document.getElementById("dietary-description").value;
        if(!description || description == "") { 
            CustomAlert.toast(LANG.empty_field, "", CustomAlert.ERROR);
            throw "Empty field";
        }
        LoadingOverlay.show();
        try {
            await DatabaseConnection.add_dietary(id, description);
            CustomAlert.toast(LANG.success_toast, "", CustomAlert.SUCCESS);
        } catch (error) {
            console.error(error);
            CustomAlert.alert(LANG.error_explanation, LANG.error);
        }
    }

    /**
     * Removes a dietary
     * @param {int} row 
     */
    async remove_dietary(row) {
        LoadingOverlay.show();
        var id = (await Dietary.build()).get()[row].id;

        try {
            await DatabaseConnection.remove_dietary(id);                
            CustomAlert.toast(LANG.success_toast, "", CustomAlert.SUCCESS);
            await this._display();
        } catch (error) {
            console.error(error);
            CustomAlert.alert(LANG.error_explanation, LANG.error);
        }
    }  
}

new Admin();