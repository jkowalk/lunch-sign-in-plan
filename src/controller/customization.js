import CookieManager from "./cookie_manager.js";
import Users from "../model/users.js";
import CleaningList from "../view/cleaning_list.js";
import CustomAlert from "../view/helpers/custom_alert.js";
import Statistics from "../view/statistics.js";

/**
 * Adding Customization to the list
 * Features: Colored row and notifications if statistic is bad or cleaning list is bad
 */
export default class Customization {
    static instance;
    user_cname = "user";
    cleaning_notify_cname = "cleaning_notification";
    statistics_notify_cname = "statistics_notification";
    
    user;
    current_editor;

    /**
     * Initializes class, gets current user from cookie or prompt
     * @returns 
     */
    constructor(){
        if(Customization.instance){
            return Customization.instance;
        }
        Customization.instance = this;
        this.check_cookie();
    }

    /**
     * Checks if initialized
     * @returns false or Customization instance
     */
    static is_initialized() {
        return (typeof Customization.instance != undefined) ? Customization.instance : false;
    }

    /**
     * Gets current user
     * @returns current user
     */
    async get_username(){
        if(!this.user)
            return false;
        try {
            return (await Users.build()).get_user_from_id(this.user).name;
        } catch (error) {
            console.warn(error);
            return false;
        }   
    }

    /**
     * Checks if user cookie is set
     */
    async check_cookie() {
        let username = CookieManager.get_cookie(this.user_cname);
        if (username != "") {
            this.user = parseInt(username);
            this.current_editor = this.user;
            this.set_custom_view();
        } else {
            this.user = await this.prompt_username();
        }
    }

    /**
     * Prompts to get username and saves it as cookie
     * @returns returns Promise with userid
     */
    async prompt_username() {
        return new Promise(async (res, rej) => {
            this.user = await CustomAlert.prompt_select(LANG.username_prompt, LANG.username_prompt_title, (await Users.build()).get());
            if(this.user) {
                CookieManager.set_cookie(this.user_cname, this.user, 365);
                try {
                    var list = await CleaningList.build();
                    list.display_cleaning_list();
                } catch (error) {
                    console.warn(error);
                }
            } else {
                return;
            }
            this.current_editor = this.user;
            this.set_custom_view();
            CustomAlert.toast(LANG.welcome_toast + await this.get_username(), "", CustomAlert.SUCCESS);
            res(this.user);
        });
    }

    /**
     * Adds highlighted rows
     * @returns 
     */
    set_custom_view() {
        if(!this.user ||this.user == -1)
            return;

        var css = '.row_id_' + this.user + ' {background: #94b1d5 !important;}',
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet){
        style.styleSheet.cssText = css;
        } else {
        style.appendChild(document.createTextNode(css));
        }
        head.appendChild(style);
    }

    /**
     * Checks if user action was potentially by accident -> bool
     * Checks if user is overdue with his cleaning -> toast
     * Checks if user has a bad statistic -> toast
     * @param {int} id 
     * @returns true if current_user or current_editor == id
     */
    async check_useraction(id) {
        if(!this.user || id == "-1") return true;
        if(this.current_editor != id && this.user != id) { // check if edit was not wanted
            return false;
        }

        try {
            // if user has overdue cleaning tasks
            var is_overdue = await (await CleaningList.build()).is_overdue(id);
            if(is_overdue && CookieManager.get_cookie(this.cleaning_notify_cname) == "") {
                CustomAlert.toast(LANG.overdue_cleaning_msg, LANG.overdue_cleaning_title + (await this.get_username()), CustomAlert.WARN);
                CookieManager.set_cookie(this.cleaning_notify_cname, true, 1);
                return true;
            }
        } catch (error) {
            console.warn(error);
        }

        try {
            // if user is on top of the statistics list
            var has_bad_statistics = await (await Statistics.build()).is_worst(id);
            if(has_bad_statistics && CookieManager.get_cookie(this.statistics_notify_cname) == "") { 
                CustomAlert.toast(LANG.bad_statistics_msg, LANG.bad_statistics_title + (await this.get_username()), CustomAlert.WARN);
                CookieManager.set_cookie(this.statistics_notify_cname, true, 2);
            }
        } catch (error) {
            console.warn(error);
        }
        return true;
    }

    /**
     * Sets the current_editor
     * @param {int} editor id 
     */
    set_current_editor(editor) {
        this.current_editor = editor;
    }

    /**
     * Changes the user
     */
    change_user() {
        if(this.user) {
            var css = document.getElementsByTagName("style");
            css[css.length-1].innerText = "";
        }
        this.prompt_username();
    }
}