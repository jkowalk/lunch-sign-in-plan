import Users from "./model/users.js";
import Info from "./view/info.js";
import SignUp from "./view/signup.js";
import CleaningList from "./view/cleaning_list.js";
import Statistics from "./view/statistics.js";
import LoadingOverlay from "./view/helpers/loading_overlay.js";
import CustomAlert from "./view/helpers/custom_alert.js";
import Customization from "./controller/customization.js";

load();
var last_updated = new Date();

/**
 * Starts the app
 */
async function load() {
    LoadingOverlay.show();
    var x = [];
    x.push(Users.build());
    x.push(Info.build());
    x.push(SignUp.build());
    var cl = CleaningList.build();
    x.push(Statistics.build());

    x.forEach(async element => {
        try {
            await element;
        } catch (error) {
            console.error(error);
            CustomAlert.alert(LANG.error_explanation, LANG.error);
        }
    });
    try {
        await cl;
    } catch (error) {
        console.warn(error);
        CustomAlert.toast(LANG.flatastic_error, "", CustomAlert.ERROR);
    }
    LoadingOverlay.hide();

    if(DEFAULTS.enable_customization) {
        window.setTimeout(() => {new Customization();}, 750);
    } else {
        document.getElementById("change_user_button").style.display = "none";
    }
    

    /**
     * Autoupdates the data
     */
    window.setInterval(async function () {
        if (last_updated.toLocaleDateString() !== new Date().toLocaleDateString()) {
            try {
                (await Info.build()).update_data();
                (await CleaningList.build()).update_data();
                (await Statistics.build()).update_data();
            } catch (error) {
                CustomAlert.alert(LANG.error_explanation, LANG.error);
            }
        }
        try {
            (await SignUp.build()).update_data();
        } catch (error) {
            CustomAlert.alert(LANG.error_explanation, LANG.error);
        }
        last_updated = new Date();
    }, DEFAULTS.auto_refresh_time);
}