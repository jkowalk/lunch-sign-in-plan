/**
 * Displays a Loading Overlay with spinner
 * Disables user input
 */
export default class LoadingOverlay {
    /**
     * Shows the overlay
     */
    static show() {
        document.getElementById("openModalLoading").style = "opacity: 1";
        document.getElementsByTagName("body")[0].style = "pointer-events: none"; // disable user input
    }

    /**
     * Hides the overlay
     */
    static hide() {
        document.getElementById("openModalLoading").style = "opacity: 0";
        document.getElementsByTagName("body")[0].style = "pointer-events: auto"; // enable user input
    }
}