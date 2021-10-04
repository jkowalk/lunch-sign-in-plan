import DatabaseConnection from "../database/database_connection.js";
import HandleAction from "../controller/handle_action.js";

/**
 * The eating, cleaning and cooking statistics
 */
export default class Statistics {
    static instance = false;

    stats;

    constructor(data){
        if(Statistics.instance){
            return Statistics.instance;
        }
        if (typeof data === 'undefined') {
            throw new Error('Cannot be called directly');
        }
        this.stats = data;
        this._display_statistics();

        Statistics.instance = this;
    }

    /**
     * Builds the class
     * Needs to be called in async function with await
     * Function will either return an obj directly or waits till data is received
     * @returns Users Singleton
     */
    static async build() {
        if(Statistics.instance){
            return Statistics.instance;
        }
        var data = await DatabaseConnection.get_statistics();
        if(!data) {
            throw "Error getting Statistics data";
        }
        return new Statistics(data);
    }

    /**
     * Updates the data from the database
     */
    async update_data() {
        this.stats = await DatabaseConnection.get_statistics();
        if(!this.stats) {
            throw "Error getting Statistics data";
        }
        this._display_statistics();
    }

    /**
     * Displays the statistics
     */
    _display_statistics() {
        this._init_display();
        var html = "";
    
        for (var a = 0; a < this.stats.length; a++) {
            var ec_value = this.stats[a].ec_value;
            var cook_count = this.stats[a].cook_count;
            var clean_count = this.stats[a].clean_count;
            var eat_count = this.stats[a].eat_count;
            var name = this.stats[a].name;
            var id = this.stats[a].id

            html += "<tr class='row_id_" + id + "'>";
            html += "<th>" + name + "</th>";
            html += "<td>" + eat_count + "</td>";
            html += "<td>" + cook_count + "</td>";
            html += "<td>" + clean_count + "</td>";
            html += "<td><strong>" + ec_value + "</strong></td>";
            html += "</tr>";
        }
        document.getElementById("data").innerHTML = html;
    }

    /**
     * Prepares the view
     */
    _init_display() {
        let html = '<h2 id=statistic_header></h2>' +
        '<div class="twrapper">'+
        '<table>'+
           ' <thead>'+
            '<tr id="statistic_columns">'+
            '</tr>'+
            '</thead>'+
            '<tbody id="data"></tbody>'+
        '</table>'+
        '</div>'+
        '<p style="text-align: center;">'+
            '<button id="change_user_button"></button>'+
        '</p>';
        document.getElementById("statistics").innerHTML = html;
        document.getElementById("statistic_header").innerText = LANG.statistic_header;
        document.getElementById("statistic_columns").innerHTML = "<th>" + LANG.name + "</th><th>" +
                LANG.eat_count + "</th><th>" + LANG.cook_count + "</th><th>" + LANG.clean_count + "</th><th>" + LANG.ec_value + "</th>";
        document.getElementById("change_user_button").innerText = LANG.change_user;
        HandleAction.initSettings();
    }

    /**
     * Gets the user with the worst eat/cook+clean value
     * @returns the user on top of the list
     */
    get_worst() {
        return {id: this.stats[0].id, name: this.stats[0].name};
    }

    /**
     * Checks if user has the worst eat/cook+clean value
     * @returns bool
     */
     is_worst(id) {
        return this.stats[0].id == id;
    }
}