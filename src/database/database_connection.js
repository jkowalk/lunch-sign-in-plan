import MyDate from "../model/date.js";

/**
 * Sends requests to the database and gets the data
 */
export default class DatabaseConnection {
    static root = "/database/php/";

    /**
     * Makes a request
     * @param {string} url 
     * @returns Promise
     */
    static _makeRequest(url) {
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300 && !this.responseText.includes('Error')) {
                    var json;
                    try {
                        json = JSON.parse(this.responseText);
                    } catch (error) {
                        json = this.responseText;
                    }
                    resolve(json);
                } else {
                    console.error("Error\n status:" + this.status + " - " + xhr.statusText + "\n" + this.responseText + "[" + url + "]");
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.onerror = function () {
                console.error("Error " + this.status + ":\n" + xhr.statusText + "\n[" + url + "]");
                console.error(xhr.response);
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };
            xhr.send();
        });
    }

    /**
     * Gets the user from the database
     * @returns user list
     */
    static get_users() {
        var url = this.root + "get_members.php";
        var result = this._makeRequest(url);
        if(result) {
            return result;
        } else {
            throw "Error getting users";
        }
    }

    /**
     * Gets info data from the database
     * @returns info data
     */
    static get_info() {
        var url = this.root + "get_info.php?today=" + new MyDate().to_database_format() + '&tomorrow=' + new MyDate().next_day().to_database_format();
        var result = this._makeRequest(url);
        if(result) {
            return result;
        } else {
            throw "Error getting Info";
        }
    }

    /**
     * Gets the sign in table from the database
     * @param {string} date YYYY-MM-DD
     * @returns sign in table
     */
    static get_sign_in(date) {
        var url = this.root +  'get_sign_in.php?date=' + date.to_database_format() + '&date_to=' + date.next_day(7).to_database_format();
        var result = this._makeRequest(url);
        if(result) {
            return result;
        } else {
            throw "Error getting sign in";
        }
    }

    /**
     * Gets the statistics table from the database
     * @returns statistics table
     */
    static get_statistics() {
        var url = this.root +  "get_statistics.php";
        var result = this._makeRequest(url);
        if(result) {
            return result;
        } else {
            throw "Error getting statistics";
        }
    }

    /**
     * Changes sign up for a person
     * @param {int} id user
     * @param {string} date YYYY-MM-DD
     * @param {bool} checked 
     * @returns result
     */
    static set_sign_up(id, date, checked) {
        var url = this.root +  "set_sign_in.php?id=" + id + '&date=' + date.to_database_format() + '&checked=' + checked;
        var result = this._makeRequest(url);
        if(result) {
            return result;
        }
        throw "Error setting sign up";
    }

    /**
     * Sets the cook for a day
     * @param {int} id user
     * @param {string} date YYYY-MM-DD 
     * @returns result
     */
    static set_cook(id, date) {
        var url = this.root +  "set_cook.php?id=" + id + '&date=' + date.to_database_format();
        var result = this._makeRequest(url);
        if(result) {
            return result;
        } else {
            throw "Error setting cook";
        }
    }

    /**
     * Sets the cleaner for a day
     * @param {int} id user
     * @param {string} date YYYY-MM-DD 
     * @returns result
     */
    static set_cleaner(id, date) {
        var url = this.root +  "set_cleaner.php?id=" + id + '&date=' + date.to_database_format();
        var result = this._makeRequest(url);
        if(result) {
            return result;
        } else {
            throw "Error setting cleaner";
        }
    }

    /**
     * Sets the amount of guests
     * @param {int} difference from previous value to current value
     * @param {string} date YYYY-MM-DD 
     * @returns result
     */
    static set_guests(difference, date) {
        var url = this.root +  "set_guest.php?amount=" + difference + '&date=' + date.to_database_format();
        var result = this._makeRequest(url);
        if(result) {
            return result;
        } else {
            throw "Error setting guests";
        }
    }

    /**
     * Gets the dietary needs from the database
     * @returns dietary list
     */
     static get_dietary() {
        var url = this.root + "get_dietary.php";
        var result = this._makeRequest(url);
        if(result) {
            return result;
        } else {
            throw "Error getting dietary";
        }
    }

    /**
     * Adds a user
     * @param {string} username 
     * @param {int} id where it starts searching for not used id
     * @returns result
     */
    static add_user(username, id) {
        var url = this.root + "add_user.php?id=" + id + "&user=" + username;
        var result = this._makeRequest(url);
        if(result) {
            return result;
        } else {
            throw "Error adding user";
        }
    }

    /**
     * Removes a user. Eater information will stay.
     * @param {int} id
     * @returns result
     */
     static remove_user(id) {
        var url = this.root + "remove_user.php?id=" + id;
        var result = this._makeRequest(url);
        if(result) {
            return result;
        } else {
            throw "Error removing user";
        }
    }

    /**
     * Adds a new dietary need
     * @param {int} id user
     * @param {string} description 
     * @returns result
     */
    static add_dietary(id, description) {
        var url = this.root + "add_dietary.php?id=" + id + "&description=" + description;
        var result = this._makeRequest(url);
        if(result) {
            return result;
        } else {
            throw "Error adding user";
        }
    }

    /**
     * Removes a dietary need. Eater information will stay.
     * @param {int} id
     * @returns result
     */
     static remove_dietary(id) {
        var url = this.root + "add_dietary.php?id=" + id + "&description=%empty%";
        var result = this._makeRequest(url);
        if(result) {
            return result;
        } else {
            throw "Error removing dietary";
        }
    }
}