import DatabaseConnection from "../database/database_connection.js";
import HandleAction from "../controller/handle_action.js";
import Customization from "../controller/customization.js";

/**
 * Important Information for Today and Tomorrow
 */
 export default class Info {
    static instance = false;

    cook_today;
    cook_tomorrow;
    cleaner_today;
    cleaner_tomorrow;
    eaters_today;
    eaters_tomorrow;
    dietarys_today;
    guests_today;
    guests_tomorrow;

    constructor(data){
        if (typeof data === 'undefined') {
            throw new Error('Cannot be called directly');
        }
        this.info = data;

        this.cook_today = this.info[0];
        this.cook_tomorrow = this.info[1];
        this.cleaner_today = this.info[2];
        this.cleaner_tomorrow = this.info[3];
        this.eaters_today = this.info[4];
        this.eaters_tomorrow = this.info[5];
        this.dietarys_today = this.info[6];
        this.guests_today = !this.info[7] ? 0 : this.info[7]["amount"];
        this.guests_tomorrow = !this.info[8] ? 0 : this.info[8]["amount"];

        this._display_info();

        Info.instance = this;
    }

    /**
     * Builds the class
     * Needs to be called in async function with await
     * Function will either return an obj directly or waits till data is received
     * @returns Info Singleton
     */
    static async build() {
        if(Info.instance){
            return Info.instance;
        }
        var data = await DatabaseConnection.get_info();
        if(!data) {
            throw "Error getting Info";
        }
        return new Info(data);
    }

    /**
     * Gets the current info data from the database
     */
    async update_data() {
        this.info = await DatabaseConnection.get_info();
        if(!this.info) {
            throw "Error getting Info data";
        }
        this.cook_today = this.info[0];
        this.cook_tomorrow = this.info[1];
        this.cleaner_today = this.info[2];
        this.cleaner_tomorrow = this.info[3];
        this.eaters_today = this.info[4];
        this.eaters_tomorrow = this.info[5];
        this.dietarys_today = this.info[6];
        this.guests_today = !this.info[7] ? 0 : this.info[7]["amount"];
        this.guests_tomorrow = !this.info[8] ? 0 : this.info[8]["amount"];

        this._display_info();
    }

    /**
     * Displays the Info
     */
    _display_info() {
        var user;
        if(Customization.is_initialized()) {
            user = Customization.is_initialized().get_user();
        }
        var eaters_today_str = "";
        for (var i = 0; i < this.eaters_today.length; i++) {
            eaters_today_str += this.eaters_today[i]["name"] + ", ";
        }
        eaters_today_str = eaters_today_str.substring(0, eaters_today_str.length - 2);
        if(this.guests_today !== 0) {
            eaters_today_str += " + " + this.guests_today + " "
            eaters_today_str += this.guests_today == 1 ? LANG.guest : LANG.guests; 
        }

        // Today
        var html = "<br><h2>" + LANG.today + "</h2>" +
                    "<table class='info-table'>" +
                        "<colgroup><col span='1' style='width: 30%;'><col span='1' style='width: 70%;'></colgroup>";
        if (this.cook_today === false) {
            html += '<p class="no_help">+++  ' + LANG.no_one_cooking +   "  +++";
            html += ((typeof user != undefined) ? ("<br><button id='no_cook_today'>     " + LANG.i_will_do_it + "</button>") : "") + "</p>"
        } else {
            html += "<tr>" +
                        "<td>" + LANG.today_cooks + "</td><td><strong>" + this.cook_today['name'] + "</strong></td>" + 
                    "</tr>" + 
                    "<tr>" + 
                        "<td>" + LANG.for + "</td><td>"+ (this.eaters_today.length + this.guests_today) + " " + LANG.persons + "<br> (" + eaters_today_str + ").</td>" + 
                    "</tr>";
        }

        if (this.cleaner_today === false) {
            html += '<p class="no_help">+++  ' + LANG.no_one_cleaning +  "  +++";
            html += ((typeof user != undefined) ? ("<br><button id='no_cleaner_today'>" + LANG.i_will_do_it + "</button>") : "") + "</p>"
        } else {
            html += "<tr>" + 
                        "<td>" + LANG.cleaner + ":</td><td><strong>" + this.cleaner_today['name'] + "</strong></td>" + 
                    "</tr>";
        }
        html += "</table>";

        // Dietary Button
        if(this.dietarys_today.length != 0) {
            html += "<p id='dietaries'></p><div id='dietary-button'><button><img src='warning_black_18dp.svg' alt='Dietary'></button></div>";
        }

        // Tomorrow
        html += "<h2>" + LANG.tomorrow + "</h2>" + 
                    "<table class='info-table'>" + 
                        "<colgroup><col span='1' style='width: 30%;'><col span='1' style='width: 70%;'></colgroup>";
        if (this.info[1] === false) {
            html += '<p class="no_help">+++  ' + LANG.no_one_cooking_tomorrow + "  +++";
            html += ((typeof user != undefined) ? ("<br><button id='no_cook_tomorrow'>     " + LANG.i_will_do_it + "</button>") : "") + "</p>";
        } else {
            html +=     "<tr>" +
                            "<td>" + LANG.tomorrow_cooks + "</td><td><strong>" + this.cook_tomorrow['name'] + "</strong></td>" +
                        "</tr>" +
                        "<tr>" + 
                            "<td>" + LANG.for + "</td><td> " + (this.eaters_tomorrow.length + this.guests_tomorrow) + " " + LANG.persons + ".</td>" +
                        "</tr>" + 
                    "</table><br><br>";
        }

        document.getElementById("info").innerHTML = html;
        HandleAction.initInfo();
    }

    /**
     * Returns dietary information
     * 
     */
    get_dietaries() {
        return this.dietarys_today;
    }
}