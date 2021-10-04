/**
 * Standard Date class extended by useful functions
 */
export default class MyDate extends Date {
    /**
     * Translates a date to the weekday
     * @returns short name for the weekday
     */
     to_weekday() {
        switch (this.getDay()) {
            case 0:
                return LANG.sunday;
            case 1:
                return LANG.monday;
            case 2:
                return LANG.tuesday;
            case 3:
                return LANG.wednesday;
            case 4:
                return LANG.thursday;
            case 5:
                return LANG.friday;
            case 6:
                return LANG.saturday;
        }
    }

    /**
     * Returns database readable format of date for requests
     * @returns YYYY-MM-DD
     */
    to_database_format() {
        var d = this.toLocaleDateString().split('.');
        if (d[1] < 10) {
            d[1] = "0" + d[1];
        }
        if (d[0] < 10) {
            d[0] = "0" + d[0];
        }
        return d[2] + "-" + d[1] + "-" + d[0];
    }
    

    /**
     * Returns a date string
     * @returns weekday and date
     */
    get_date_string() {
        return this.to_weekday() + " " + this.toLocaleDateString();
    }

    /**
     * Calculates the next i days
     * @param {int} i 
     * @returns new Date
     */
    next_day(i = 1) {
        if (i===0) {
            return this;
        }
        return new MyDate(this.valueOf() + 86400000 * i)
    }
}