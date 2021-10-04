import DatabaseConnection from "../database/database_connection.js";

/**
 * The Lunch Plan Users List
 */
 export default class Users {
    static instance;
    users;
  
    constructor(data){
        if(Users.instance){
            return Users.instance;
        }
        if (typeof data === 'undefined') {
            throw new Error('Cannot be called directly');
        }
        this.users = data;
        Users.instance = this;
    }

    /**
     * Builds the class
     * Needs to be called in async function with await
     * Function will either return an obj directly or waits till data is received
     * @returns Users Singleton
     */
    static async build() {
        if(Users.instance){
            return Users.instance;
        }
        var data = await DatabaseConnection.get_users();
        if(!data) {
            throw "Error getting Userdata";
        }
        return new Users(data);
    }

    /**
     * Gets the user list from the database
     */
     async update_data() {
        this.users = await DatabaseConnection.get_users();
    }

    /**
     * @returns the bare list of users including id and name
     */
    get() {
      return this.users;
    }

    /**
     * @returns a list of the names
     */
    get_names() {
        var names = [];
        for(var i = 0; i < this.users.length; i++) {
            names.push(this.users[i].name);
        }
        return names;
    }

    /**
     * @returns a list of the ids
     */
     get_ids() {
        var ids = [];
        for(var i = 0; i < this.users.length; i++) {
            ids.push(this.users[i].id);
        }
        return ids;
    }

    /**
     * Gets a username from an id
     * @param {number} id 
     * @returns user
     */
     get_user_from_id(id) {
        for(var i = 0; i < this.users.length; i++) {
            if(this.users[i].id == id) {
                return this.users[i];
            }
        }
        return null;
    }

    /**
     * Gets an id from a username
     * @param {string} name
     * @returns user
     */
     get_user_from_name(name) {
        for(var i = 0; i < this.users.length; i++) {
            if(this.users[i].id == name) {
                return this.users[i];
            }
        }
        return null;
    }

    /**
     * @returns number of users
     */
    amount() {
        return this.users.length;
    }
  }