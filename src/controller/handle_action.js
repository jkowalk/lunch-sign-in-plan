import Customization from "./customization.js";
import Users from "../model/users.js";
import CustomAlert from "../view/helpers/custom_alert.js";
import Info from "../view/info.js";
import LoadingOverlay from "../view/helpers/loading_overlay.js";
import SignUp from "../view/signup.js";
import Statistics from "../view/statistics.js";

/**
 * Handles User Input
 */
export default class HandleAction {

    /**
     * Adds EventListener for Info
     */
    static initInfo() {
        try {
            document.getElementById('dietary-button').addEventListener('click', this.show_dietaries);
        } catch (error) {} 
    }

    /**
     * Adds EventListener for SignUp
     */
    static initSignUp() {
        // Buttons
        let back = document.getElementById('back_button');
        back.addEventListener("click", this.back_one_week);
        let refresh = document.getElementById('refresh_button');
        refresh.addEventListener("click", this.refresh);
        let next = document.getElementById('next_button');
        next.addEventListener("click", this.next_week);

        // Cook
        for(let i=0; i < 7; i++) {
            document.getElementById("cook_day_" + i).addEventListener("change", () => {this.change_cook(i)});
        }

        // Cleaner
        for(let i=0; i < 7; i++) {
            document.getElementById("clean_day_" + i).addEventListener("change", () => {this.change_cleaner(i)});
        }

        // Table
        for(let column=0; column < 7; column++) {
            let bool = true;
            let row=1;
            while(bool) {
                let r = row;
                let c = column;
                try {
                    document.getElementById("check_" + row + "_" + column).addEventListener("change", () => {this.change_sign_up(r, c)});
                } catch (error) {
                    bool = false;
                }
                row++;
            }
        }

        // Guests
        for(let i=0; i<7; i++) {
            document.getElementById("guest_day_" + i).addEventListener("change", () => {this.change_guests(i)});
        }
    }

    /**
     * Adds EventListener for Info
     */
     static initSettings() {
        document.getElementById('change_user_button').addEventListener('click', this.change_user);
    }

    /**
     * Moves SignUp Sheet back a week
     */
    static async back_one_week() {
        LoadingOverlay.show();
        try {
            let signup = await SignUp.build();
            await signup.back_one_week();
        } catch (error) {
            console.error(error);
            CustomAlert.alert(error, LANG.error);
        }
        LoadingOverlay.hide();
    }

    /**
     * Moves SignUp Sheet one week further
     */
    static async next_week() {
        LoadingOverlay.show();
        try {
            let signup = await SignUp.build();
            await signup.next_week();
        } catch (error) {
            console.error(error);
            CustomAlert.alert(LANG.error_explanation, LANG.error);
        }
        LoadingOverlay.hide();
    }

    /**
     * Refreshes the SignUp
     */
    static async refresh() {
        LoadingOverlay.show();
        try {
            let signup = await SignUp.build();
            let statistics = await Statistics.build();
            signup = signup.update_data();
            statistics = statistics.update_data();
        } catch (error) {
            console.error(error);
            CustomAlert.alert(LANG.error_explanation, LANG.error);
        }
        LoadingOverlay.hide();
    }

    /**
     * Checks if user action was potentially by accident -> bool -> prompt/callback(bool)
     * Checks if user is overdue with his cleaning -> toast
     * Checks if user has a bad statistic -> toast
     * @param {int} id 
     */
    static async checkUseraction(id, callback) {
        if(id == "x") {
            callback(true);
            return;
        }
        let initialized = Customization.is_initialized();
        if(initialized) {
            initialized.check_useraction(id).then(async (bool) => {
                if(!bool) {
                    CustomAlert.prompt(LANG.editing_prompt_msg, LANG.editing_prompt_title + (await Users.build()).get_user_from_id(id).name, callback);
                } else {
                    callback(true);
                }
            });
        } else {
            callback(true);
        }
    }

    /**
     * Changes the cook
     * @param {*} value select obj 
     */
    static async change_cook(day) {
        let obj = document.getElementById("cook_day_" + day);
        let id = obj.value;
        HandleAction.checkUseraction(id, async (bool) => {
            if(bool) {
                Customization.is_initialized() ? Customization.is_initialized().set_current_editor(id) : null;
                LoadingOverlay.show();
                try {
                    let signup = await SignUp.build();
                    await signup.change_cook(id, day);
                    CustomAlert.toast(LANG.success_toast, "", CustomAlert.SUCCESS);
                } catch (error) {
                    console.error(error);
                    CustomAlert.alert(LANG.error_explanation, LANG.error);
                }
                LoadingOverlay.hide();
            } else {
                HandleAction.refresh();
            }
        });
    }

    /**
     * Changes the cleaner
     * @param {*} value select obj
     */
    static async change_cleaner(day) {
        let obj = document.getElementById("clean_day_" + day);
        let id = obj.value;
        HandleAction.checkUseraction(id, async (bool) => {
            if(bool) {
                Customization.is_initialized() ? Customization.is_initialized().set_current_editor(id) : null;
                LoadingOverlay.show();
                try {
                    let signup = await SignUp.build();
                    await signup.change_cleaner(id, day);
                    CustomAlert.toast(LANG.success_toast, "", CustomAlert.SUCCESS);
                } catch (error) {
                    console.error(error);
                    CustomAlert.alert(LANG.error_explanation, LANG.error);
                }
                LoadingOverlay.hide();
            } else {
                HandleAction.refresh();
            }
        });
    }

    /**
     * Changes the SignUp
     * @param {*} value input obj
     */
    static async change_sign_up(row, column) {
        let obj = document.getElementById("check_" + row + "_" + column);
        let day = column;
        let checked = obj.checked;

        try {
            let id = (await Users.build()).get()[row].id;
            HandleAction.checkUseraction(id, async (bool) => {
                if(bool) {
                    Customization.is_initialized() ? Customization.is_initialized().set_current_editor(id) : null;
                    LoadingOverlay.show();
                    try {
                        let signup = await SignUp.build();
                        await signup.change_sign_up(id, day, checked);
                        CustomAlert.toast(LANG.success_toast, "", CustomAlert.SUCCESS);
                    } catch (error) {
                        console.error(error);
                        CustomAlert.alert(LANG.error_explanation, LANG.error);
                    }
                    LoadingOverlay.hide();
                } else {
                    HandleAction.refresh();
                }
            });
        } catch (error) {
            console.error(error);
            CustomAlert.alert(LANG.error_explanation, LANG.error);
        }
        LoadingOverlay.hide();
    }

    /**
     * Changes the guest amount
     * @param {*} value select obj
     */
    static async change_guests(day) {
        let obj = document.getElementById("guest_day_" + day);
        let amount = obj.value;
        LoadingOverlay.show();
        try {
            let signup = await SignUp.build();
            await signup.change_guests(amount, day);
            CustomAlert.toast(LANG.success_toast, "", CustomAlert.SUCCESS);        
        } catch (error) {
            console.error(error);
            CustomAlert.alert(LANG.error_explanation, LANG.error);
        }
        
        LoadingOverlay.hide();
    }

    /**
     * Displays the dieatary needs in an Alert
     */
    static async show_dietaries() {
        let dietaries = (await Info.build()).get_dietaries();
        let msg = "<table>";
        dietaries.forEach(d => {
            msg += '<tr><td>' + d.name + '</td><td>' + d.description + '</td></tr>';
        });
        msg += "</table>"
        CustomAlert.alert(msg, LANG.dietaries);
    }

    static async change_user() {
        Customization.is_initialized() ? Customization.is_initialized().change_user() : null;
    }
}