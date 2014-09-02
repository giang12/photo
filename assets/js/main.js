// @codekit-prepend "vendor/jquery.js"
// @codekit-prepend "vendor/bootstrap.js"
// @codekit-prepend "utils.js"
// @codekit-prepend "PhotoPopo.js"
// @codekit-prepend "app_keybind.js"
// @codekit-prepend "ControlPanel.js"

jQuery(document).ready(function($) {


    //setInterval(detechNetwork, 6000);
    PhotoPopo.init();

});

function detechNetwork() {
    if (navigator.onLine) {

    } else {
        console.log("Network Connection Loss");
    }
}
