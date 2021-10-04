import DatabaseConnection from "../database/database_connection.js";

/**
 * Dietary needs list
 */
 export default class Dietary {
    static instance;
    dietary;
  
    constructor(data){
        if(Dietary.instance){
            return Dietary.instance;
        }
        if (typeof data === 'undefined') {
            throw new Error('Cannot be called directly');
        }
        this.dietary = data;
        Dietary.instance = this;
    }

    /**
     * Builds the class
     * Needs to be called in async function with await
     * Function will either return an obj directly or waits till data is received
     * @returns Users Singleton
     */
    static async build() {
        if(Dietary.instance){
            return Dietary.instance;
        }
        var data = await DatabaseConnection.get_dietary();
        if(!data) {
            throw "Error getting Userdata";
        }
        return new Dietary(data);
    }

    /**
     * Gets the dietary list from the database
     */
     async update_data() {
        this.dietary = await DatabaseConnection.get_dietary();
        if(!this.dietary) {
            throw "Error getting Dietary needs";
        }
    }

    /**
     * @returns the bare dietary list
     */
    get() {
      return this.dietary;
    }
}