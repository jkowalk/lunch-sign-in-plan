import Customization from "../controller/customization.js";
import Users from "../model/users.js";

/**
 * The cleaning list from the flatastic app
 * You need to add your API key in the constants.js and set enable_cleaning_list to true
 */
export default class CleaningList {
    static instance = false;

    list;
      
    constructor(data){
        if(CleaningList.instance){
            return CleaningList.instance;
        }
        if (typeof data === 'undefined') {
            throw new Error('Cannot be called directly');
        }
        this.list = data;
        this.display_cleaning_list();

        CleaningList.instance = this;
    }

    /**
     * Builds the class
     * Needs to be called in async function with await
     * Function will either return an obj directly or waits till data is received
     * @returns CleaningList Singleton
     */
    static async build() {
        if(CleaningList.instance){
            return CleaningList.instance;
        }
        if(!DEFAULTS.enable_cleaning_list) {
            console.log("Cleaning list disabled!");
            return;
        }
        var data = await CleaningList._get_data();
        if(!data) {
            throw "Error getting Cleaning List";
        }
        return new CleaningList(data);
    }

    /**
     * Updates the data
     */
    async update_data() {
        this.list = await CleaningList._get_data();
        this.display_cleaning_list();
    }

    /**
     * Gets the data from flatastic and processes it
     * @returns sorted list with names (name), taskdescription (title) and duetime (timeLeftNext )
     */
    static async _get_data() {
        var chores = CleaningList._get_from_flatastic("chores"); // get cleaning tasks
        var wg = (await CleaningList._get_from_flatastic("wg"))['flatmates']; // get names and id (flatastic)
        chores = await chores;
        if(!chores || !wg)
            return;

        // combine cleaning tasks with ids and names
        for (var c = 0; c < chores.length; c++) {
            var id = chores[c]['currentUser'];
            for (var i = 0; i < wg.length; i++) {
                if (id.toString() === wg[i]['id'].toString()) {
                    chores[c]['name'] = wg[i]['firstName'];
                }
            }
        }
        // sort by due time left
        chores.sort(function (a, b) {
            return a.timeLeftNext - b.timeLeftNext
        });
        return chores;
    }

    /**
     * Makes XMLHttpRequest to get data from flatastic
     * @param {str} str // url appendix 
     * @returns Promise
     */
    static async _get_from_flatastic(str) {
        return await new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.open("GET", "https://api.flatastic-app.com/index.php/api/" + str);
            xhr.setRequestHeader("accept", "application/json, text/plain, */*");
            xhr.setRequestHeader("x-api-key", DEFAULTS.flatastic_API_key);
            xhr.setRequestHeader("x-api-version", "2.0.0");
            xhr.setRequestHeader("x-client-version", "2.3.20");
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300 && xhr.response != "") {
                    resolve(JSON.parse(xhr.response));
                } else {
                    console.error("Error " + this.status + ":\n" + xhr.statusText + "\n[Flatastic:" + str + "]");
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.onerror = function () {
                console.error("Error " + this.status + ":\n" + xhr.statusText + "\n[Flatastic:" + str + "]");
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };
            xhr.send();
        });
    }

    /**
     * Displays the cleaning list
     */
    async display_cleaning_list() {
        var custom;
        if(Customization.instance) {
            custom = await new Customization().get_username();
        }
        var html = "<h2>" + LANG.cleaning_list + "</h2><div class='info' id='clean_info'><table id=cleaning-plan>";
        for (var i = 0; i < this.list.length; i++) {
            var custom_html = "";
            if(custom && custom == this.list[i].name) {
                custom_html = 'style="border: solid"';
            }
            var days_left = this._to_days(this.list[i].timeLeftNext);
            if (days_left > 6) {
                break;
            } else if (days_left < -7) {
                html += "<tr class='status-red' " + custom_html + ">";
            } else if (days_left < -5) {
                html += "<tr class='status-dark-orange' " + custom_html + ">";
            } else if (days_left < -1) {
                html += "<tr class='status-orange' " + custom_html + ">";
            } else if (days_left <= 0) {
                html += "<tr class='status-light' " + custom_html + ">";
            } else {
                html += "<tr " + custom_html + ">";
            }
            html += "<td><strong>" + this.list[i].name + "</strong></td><td>" + this.list[i].title;
            html += "</td><td>";
            html += days_left;
            if (Math.abs(days_left) !== 1) {
                html += " " + LANG.days;
            } else {
                html += " " + LANG.day;
            }
            html += "</td></tr>";
        }
        html += "</table></div><div class='spacer'></div>";
        document.getElementById("cleaning_list").innerHTML = html;
    }

    /**
     * Checks if a user is late with a cleaning task
     * @param {int} id 
     * @returns boolean
     */
    async is_overdue(id) {
        var user = (await Users.build()).get_user_from_id(id);
        if(!user)
            return false;
        for (var i = 0; i < this.list.length; i++) {
            if(user.name == this.list[i].name) {
                if(this._to_days(this.list[i].timeLeftNext) < -7) 
                    return true;
                return false;
            }
        }
        return false;
    }

    /**
     * Converts time format used by flatastic to days
     * @param {int} time 
     * @returns days
     */
    _to_days(time) {
        return Math.round(time / 86400);
    }
}