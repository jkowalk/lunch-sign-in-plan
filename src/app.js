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
    if(DEFAULTS.enable_customization) {
        new Customization();
    } else {
        document.getElementById("change_user_button").style.display = "none";
    }
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

    
    

    /**
     * Autoupdates the data
     */
     window.setInterval(async function () {
        if (last_updated.toLocaleDateString() !== new Date().toLocaleDateString()) {
            try {
                (await CleaningList.build()).update_data();
            } catch (error) {
                console.warn(error);
                CustomAlert.toast(LANG.flatastic_error, "", CustomAlert.ERROR);
            }
        }
        await HandleAction.refresh();
        last_updated = new Date();
    }, DEFAULTS.auto_refresh_time);
}