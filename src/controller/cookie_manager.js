/**
 * Sets and gets Cookies
 */
export default class CookieManager {
    /**
     * Sets a cookie
     * @param {str} cname 
     * @param {*} cvalue 
     * @param {int} exdays
     */
    static set_cookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";SameSite=Strict;path=/";
    }
    
    /**
     * Gets a Cookies data
     * @param {str} cname 
     * @returns cookie data
     */
    static get_cookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
    }
}