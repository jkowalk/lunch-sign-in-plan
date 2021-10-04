import DatabaseConnection from "../database/database_connection.js";
import MyDate from "../model/date.js";
import Users from "../model/users.js";
import HandleAction from "../controller/handle_action.js";
import Info from "./info.js";
import Statistics from "./statistics.js";

/**
 * The Sign Up Sheet
 */
export default class SignUp {
    static instance;

    start_date = new MyDate();
    today = new MyDate();
    cooks_week;
    cleaners_week;
    eaters_table;
    guests_week;
  
    constructor(data){
        if(SignUp.instance){
            return SignUp.instance;
        }
        if (typeof data === 'undefined') {
            throw new Error('Cannot be called directly');
        }
        this._set_data(data);
        SignUp.instance = this;
    }

    /**
     * Builds the class
     * Needs to be called in async function with await
     * Function will either return an obj directly or waits till data is received
     * @returns SignUp Singleton
     */
    static async build() {
        if(SignUp.instance){
            return SignUp.instance;
        }
        var data = await DatabaseConnection.get_sign_in(new MyDate());
        if(!data) {
            throw "Error getting Sign Up table";
        }
        return new SignUp(data);
    }

    /**
     * Updates data for the current start_date
     * Gets data from database and displays it
     */
     async update_data() {
        if (this.today.toLocaleDateString() !== new MyDate().toLocaleDateString()) {
            this.start_date=this.start_date.next_day();
            this.today = new MyDate();
        }
        var data = await DatabaseConnection.get_sign_in(this.start_date);
        if(!data) {
            throw "Error getting Userdata";
            return false;
        }
        this._set_data(data);
        return true;       
    }

    /**
     * Sets the data
     * @param {*} data 
     */
    _set_data(data) {
        this.cooks_week = data[0];
        this.cleaners_week = data[1];
        this.eaters_table = data[2];
        this.guests_week = data[3];

        this._display_sign_up();
    }

    /**
     * Navigates one week back
     */
    back_one_week() {
        this.start_date = this.start_date.next_day(-7);
        return this.update_data();
    }

    // Navigates one week further
    next_week() {
        this.start_date = this.start_date.next_day(7);
        return this.update_data();
    }

    /**
     * Changes the Sign Up
     * @param {int} id 
     * @param {int} day
     */
    async change_sign_up(id, day, checked) {
        var date = this.start_date.next_day(day);
        var success = await DatabaseConnection.set_sign_up(id, date, checked);
        if(day <= 1) (await Info.build()).update_data();
        if(day == 0) (await Statistics.build()).update_data();

        return success ? true : false;
    }

    /**
     * Changes the Cook
     * @param {int} id 
     * @param {int} day
     */
    async change_cook(id, day) {
        var date = this.start_date.next_day(day);
        var success = await DatabaseConnection.set_cook(id, date);
        this.update_data();
        if(day <= 1) (await Info.build()).update_data();
        if(day == 0) (await Statistics.build()).update_data();

        return success ? true : false;
    }

    /**
     * Changes the Cleaner
     * @param {int} id 
     * @param {int} day
     */
    async change_cleaner(id, day) {
        var date = this.start_date.next_day(day);
        var success = await DatabaseConnection.set_cleaner(id, date);
        if(day <= 1) (await Info.build()).update_data();
        if(day == 0) (await Statistics.build()).update_data();
        
        return success ? true : false;
    }

    /**
     * Changes the Guests
     * @param {int} guests 
     * @param {int} day
     */
    async change_guests(guests, day) {
        var difference = (guests - this.get_amount_guests(day));

        var date = this.start_date.next_day(day);
        var success = await DatabaseConnection.set_guests(difference, date);
        this.update_data();
        if(day <= 1) (await Info.build()).update_data();
        if(day == 0) (await Statistics.build()).update_data();
            
        return success ? true : false;
    }
  
    /**
     * Sets the day headers with different colors for weekends and today
     */
    _set_day_colors() {
        document.getElementById('signup_heading').innerText = LANG.signup_heading;
        var back = document.getElementById('back_button');
        back.innerText = LANG.back_button;
        var refresh = document.getElementById('refresh_button');
        refresh.innerText = LANG.refresh_button;
        var next = document.getElementById('next_button');
        next.innerText = LANG.next_button;
        var d=this.start_date;
        for (var i=1; i<=7; i++) {
            if (d.toLocaleDateString() == this.today.toLocaleDateString()) { // today
                document.getElementById("day_"+i).style.backgroundColor = 'aliceblue';
                document.getElementById("day_"+i).style.color = 'black';
            } else {
                if (d.to_weekday() == LANG.saturday) {
                    document.getElementById("day_"+i).style.backgroundColor = 'rgb(99 99 99)';
                } else if (d.to_weekday() === LANG.sunday) {
                    document.getElementById("day_"+i).style.backgroundColor = '#828282';
                } else {
                    document.getElementById("day_"+i).style.backgroundColor = "";
                }
                document.getElementById("day_"+i).style.color = "";
            }
            document.getElementById("day_"+i).innerText = d.get_date_string();
            d = d.next_day();
        }
    }

    /**
     * Displays the Table
     */
    async _display_sign_up() {
        var users = await Users.build();
        this._init_display();
        this._set_day_colors();
        this._displayCooks(users);
        this._displayCleaner(users);
        this._displayTable(users);
        this._displayGuests(users);
        HandleAction.initSignUp();
    }

    /**
     * Inits the display
     */
    _init_display() {
        let html = '<h2 id=signup_heading></h2>' +
        '<div id="nav">' +
            '<button id="back_button"></button>'+
            '<button id="refresh_button"></button>'+
            '<button id="next_button"></button>' +
        '</div>' +
        '<div style="height: 10px"></div>' + 
        '<div class="twrapper">' +
        '<table>' +
            '<thead>' +
            '<tr>' +
                '<th></th><th id="day_1"></th> <th id="day_2"></th> <th id="day_3"></th> <th id="day_4"></th> <th id="day_5"></th> <th id="day_6"></th> <th id="day_7"></th>'+
            '</tr>'+
            '</thead>'+
            '<tbody id="sign_in"></tbody>'+
        '</table>'+
        '</div>';
        document.getElementById("signup").innerHTML = html;
    }

    /**
     * Displays the Cook row
     */
    _displayCooks(users) {
        var html = "<tr>";
        html += "<th>" + LANG.cook + "</th>";
    
        var x = 0;
        for (var i = 0; i < 7; i++) {
            // Checks if editing should be allowed
            if (this.start_date.next_day(i + DEFAULTS.disabled_after) <= new Date()) {
                html += "<td><select id='cook_day_" + i + "' disabled><option value='x'>-</option> \n";
            } else {
                html += "<td><select id='cook_day_" + i + "'><option value='x'>-</option> \n";
            }
            if (this.cooks_week[x] && this.start_date.next_day(i).to_database_format() === this.cooks_week[x]['date']) { // Cook cooks on the day
                // Selected option
                for (var y = 0; y < users.get().length; y++) {
                    if (users.get()[y].id === this.cooks_week[x].member_id) {
                        html += "<option selected value=\"" + users.get()[y]["id"] + "\">" + users.get()[y]["name"] + "</option>\n";
                    } else {
                        html += "<option value=\"" + users.get()[y]["id"] + "\">" + users.get()[y]["name"] + "</option>\n";
                    }
                }
                html += "</select></td>";
                x++;
            } else { // No cook on the day
                for (var y = 0; y < users.get().length; y++) {
                    html += "<option value=\"" + users.get()[y]["id"] + "\">" + users.get()[y]["name"] + "</option>\n"
                }
                html += "</select></td>";
            }
        }
        html += "</tr>"
        let table = document.getElementById("sign_in");
        table.innerHTML = html;
    }
    
    /**
     * Displays the Cleaner row
     */
    _displayCleaner(users) {
        var html = "<tr>";
        html += "<th>" + LANG.cleaner + "</th>";
        
        var x = 0;
        for (var i = 0; i < 7; i++) {
            // Checks if editing should be allowed
            if (this.start_date.next_day(i + DEFAULTS.disabled_after) <= new Date()) {
                html += "<td><select id='clean_day_" + i + "'disabled><option value='x'>-</option> \n";
            } else {
                html += "<td><select id='clean_day_" + i + "'><option value='x'>-</option>\n";
            }
            if (this.cleaners_week[x] && this.start_date.next_day(i).to_database_format() === this.cleaners_week[x]['date']) { // Cleaner cleans on the day
                // Selected option
                for (var y = 0; y < users.get().length; y++) {
                    if (users.get()[y]["id"] === this.cleaners_week[x]['member_id']) {
                        html += "<option selected value=\"" + users.get()[y]["id"] + "\">" + users.get()[y]["name"] + "</option>\n";
                    } else {
                        html += "<option value=\"" + users.get()[y]["id"] + "\">" + users.get()[y]["name"] + "</option>\n";
                    }
                }
                html += "</select></td>";
                x++;
            } else { // No cook on the day
                for (var y = 0; y < users.get().length; y++) {
                    html += "<option value=\"" + users.get()[y]["id"] + "\">" + users.get()[y]["name"] + "</option>\n"
                }
                html += "</select></td>";
            }
        }
        html += "</tr>"
        var table = document.getElementById("sign_in");
        table.innerHTML = table.innerHTML + html;
    }
    
    /**
     * Displays the Sign Up Checkboxes
     */
    _displayTable(users) {
        var html = "";
        for(var i = 1; i < users.get().length; i++) { // rows of users
            html += "<tr class='row_id_" + users.get()[i]["id"] + "'><th>" + users.get()[i]["name"] + "</th>";
            var row = this.eaters_table[i];
    
            var x = 0;
            for(var d = 0; d < 7; d++) { // days of the week
                if(row[x] && this.start_date.next_day(d).to_database_format() === row[x]['date']) {
                    if (this.start_date.next_day(d + DEFAULTS.disabled_after) <= new Date()) {
                        html += "<td><input id='check_" + i + "_" + d + "' class='option-input checkbox' type='checkbox' checked disabled></td>";
                    } else {
                        html += "<td><input id='check_" + i + "_" + d + "' class='option-input checkbox' type='checkbox' checked></td>";
                    }
                    x++;
                } else {
                    if (this.start_date.next_day(d + DEFAULTS.disabled_after) <= new Date()) {
                        html += "<td><input id='check_" + i + "_" + d + "' class=\"option-input checkbox\" type=\"checkbox\" disabled></td>";
                    } else {
                        html += "<td><input id='check_" + i + "_" + d + "' class=\"option-input checkbox\" type=\"checkbox\"></td>";
                    }
                }
            }
            
        }
        html += "</tr>"
        var table = document.getElementById("sign_in");
        table.innerHTML = table.innerHTML + html;
    }
    
    /**
     * Displays the guest row
     */
    _displayGuests(users) {
        var html = "<tr>";
        html += "<th>" + LANG.guests + "</th>";
    
        var x = 0;
        for (var i = 0; i < 7; i++) {
            if (this.guests_week[x] && this.start_date.next_day(i).to_database_format() === this.guests_week[x]['date']) { // Guests on the day
                // Checks if editing should be allowed
                if (this.start_date.next_day(i + DEFAULTS.disabled_after) <= new Date()) {
                    html += "<td><select id='guest_day_" + i + "' disabled>\n";
                } else {
                    html += "<td><select id='guest_day_" + i + "' >\n";
                }
                // Selected option
                for (var y = 0; y <= DEFAULTS.max_guests; y++) {
                    if (y === this.guests_week[x]['amount']) {
                        html += "<option selected value=\"" + y + "\">" + y + "</option>\n";
                    } else {
                        html += "<option value=\"" + y + "\">" + y + "</option>\n";
                    }
                }
                html += "</select></td>";
                x++;
            } else { // No guest on the day
                if (this.start_date.next_day(i + DEFAULTS.disabled_after) <= new Date()) {
                    html += "<td><select id='guest_day_" + i + "' disabled>\n";
                } else {
                    html += "<td><select id='guest_day_" + i + "'>\n";
                }
                for (var y = 0; y <= DEFAULTS.max_guests; y++) {
                    if (y === 0) {
                        html += "<option selected value=\"" + y + "\">" + y + "</option>\n";
                    } else {
                        html += "<option value=\"" + y + "\">" + y + "</option>\n";
                    }
                }
                html += "</select></td>";
            }
        }
        html += "</tr>"
        var table = document.getElementById("sign_in");
        table.innerHTML = table.innerHTML + html;
    }

    /**
     * Returns the amount of guests signed in on a day
     * @param {int} day 
     * @returns amount
     */
    get_amount_guests(day) {
        var date = this.start_date.next_day(day).to_database_format();
        for(var i = 0; i < this.guests_week.length; i++) {
            var obj = this.guests_week[i];
            if(obj["date"] == date) {
                return parseInt(obj["amount"]);
            }
        }
        return 0;
    }
  }