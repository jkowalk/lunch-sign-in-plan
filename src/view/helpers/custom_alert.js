/**
 * Class managing custom alerts, prompts and toasts
 */
export default class CustomAlert {
    static SUCCESS = 1;
    static ERROR = -1;
    static WARN = 0;

    /**
     * Displays the alertbox
     */
    static setup() {
        document.getElementsByTagName("main")[0].style = "pointer-events: none; filter: blur(5px) brightness(0.5);";
        var dialogbox = document.getElementById('dialogbox');
        var dialogbox_head = document.getElementById('dialogboxhead');
        
        dialogbox.style.top = "100px";
    
        dialogbox.style.display = "block";        
        dialogbox_head.style.display = 'block';
        dialogbox.style.opacity = 0;
    }

    /**
     * Creates an alert
     * @param {string} message 
     * @param {string} title 
     * @param {function} callback executed on submit
     */
    static alert(message, title, callback = ()=>{}) {
        this.setup();
        if(typeof title === 'undefined') {
        document.getElementById('dialogboxhead').style.display = 'none';
        } else {
        document.getElementById('dialogboxhead').innerHTML = '<i class="fa fa-exclamation-circle" aria-hidden="true"></i> '+ title;
        }
        document.getElementById('dialogboxbody').innerHTML = message;
        document.getElementById('dialogboxfoot').innerHTML = '<button id="custom_alert_ok" class="pure-material-button-contained active">' + LANG.OK + '</button>';
        if(title && title.includes(LANG.error)) {
                document.getElementById('custom_alert_ok').addEventListener('click', () => {location.reload();});
        } else {
            document.getElementById('custom_alert_ok').addEventListener('click', () => {this.ok(); callback();});
        }
    }

    /**
     * Creates a prompt
     * @param {string} message 
     * @param {string} title 
     * @param {function} callback executed with bool on submit
     */
    static prompt(message, title, callback) {
        this.setup();
        if(typeof title === 'undefined') {
            document.getElementById('dialogboxhead').style.display = 'none';
        } else {
            document.getElementById('dialogboxhead').innerHTML = '<i class="fa fa-exclamation-circle" aria-hidden="true"></i> '+ title;
        }
        document.getElementById('dialogboxbody').innerHTML = message;
        document.getElementById('dialogboxfoot').innerHTML = 
                '<button id="custom_alert_reject" class="pure-material-button-contained active">' + LANG.cancel + '</button><div>&nbsp;</div>' + 
                '<button id="custom_alert_accept" class="pure-material-button-contained active">' + LANG.OK + '</button>';

        document.getElementById('custom_alert_accept').addEventListener('click', () => {this.ok(); callback(true)});
        document.getElementById('custom_alert_reject').addEventListener('click', () => {this.ok(); callback(false)});
    }

    /**
     * Creates a prompt with select
     * @param {string} message 
     * @param {string} title 
     * @param {array} options list of obj where obj[0] is the value and obj[1] is the string displayed
     * @returns Promise
     */
    static prompt_select(message, title, options) {
        this.setup();
        if(typeof title === 'undefined') {
        document.getElementById('dialogboxhead').style.display = 'none';
        } else {
        document.getElementById('dialogboxhead').innerHTML = '<i class="fa fa-exclamation-circle" aria-hidden="true"></i> '+ title;
        }
        var options_str = "";
        options.forEach(obj => {
            options_str += '<option value="' + Object.values(obj)[0] + '">' + Object.values(obj)[1] + '</option>';
        });
        document.getElementById('dialogboxbody').innerHTML = '<p>' + message + '</p><select id=custom_prompt_select>' + options_str + '</select>';
        document.getElementById('dialogboxfoot').innerHTML = 
                '<button id="custom_alert_reject" class="pure-material-button-contained active">' + LANG.cancel + '</button><span>&nbsp;</span>' + 
                '<button id="custom_alert_accept" class="pure-material-button-contained active">' + LANG.OK + '</button>';
        
        return new Promise((resolve, reject) => {
            document.getElementById('custom_alert_accept').addEventListener('click', () => {
                var value = document.getElementById("custom_prompt_select").value; 
                this.ok();
                resolve(value)
            });
            document.getElementById('custom_alert_reject').addEventListener('click', () => {
                this.ok();
                resolve(false);
            });
        });
    }
    
    /**
     * Closes the alert box
     */
    static ok(){
        document.getElementById('dialogbox').style.opacity = 0;
        document.getElementById('dialogbox').style.display = "none";
        document.getElementsByTagName("main")[0].style = "pointer-events: auto";
    }

    /**
     * Creates a new toast message
     * @param {string} msg 
     * @param {string} title 
     * @param {int} status 
     */
    static toast(msg, title, status) {
        let alerts = document.getElementById("alert-container");        
        
        if (alerts.childElementCount < 2) {
           // Create alert box
           let alertBox = document.createElement("div");
           alertBox.classList.add("alert-msg", "slide-in", status);
     
           // Add message to alert box
           let alertMsg = document.createTextNode(title + msg);
           alertBox.appendChild(alertMsg);
            switch(status) {
                case this.SUCCESS:
                    alertBox.style.backgroundColor = "var(--check)";
                    alertBox.style.color = "white";
                    break;
                case this.ERROR:
                    alertBox.style.backgroundColor = "#a84b4b";
                    alertBox.style.color = "white";
                    break;
                default:
                    alertBox.style.backgroundColor = "rgb(202, 122, 21)";
                    alertBox.style.color = "white";
            }
     
           // Add alert box to parent
           alerts.insertBefore(alertBox, alerts.childNodes[0]);

           try {
               // Remove last alert box
                alerts.childNodes[1].classList.add("slide-out");
           } catch (error) {}
           
     
           setTimeout(function() {
              alerts.removeChild(alerts.lastChild);
           }, DEFAULTS.toast_time_visible);
        }
     }
} 