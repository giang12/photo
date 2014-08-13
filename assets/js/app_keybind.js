// @codekit-prepend "vendor/keypress.min.js"
jQuery(document).ready(function($) {

	var keyBindDictionary = [{
        "keys": "cmd right",
        "is_exclusive": false,
        "on_keydown": function() {
            nextPhoto();
        },
    }, {
        "keys": "ctrl right",
        "is_exclusive": false,
        "on_keydown": function() {
            nextPhoto();
        },
    }, {
        "keys": "shift right",
        "is_exclusive": false,
        "on_keydown": function() {
            nextPhoto();
        },
    }, {
        "keys": "alt right",
        "is_exclusive": false,
        "on_keydown": function() {
            nextPhoto();
        },
    }, {
        "keys": "right",
        "is_exclusive": false,
        "on_keydown": function() {
            nextPhoto();
        },
    }, {
        "keys": "cmd left",
        "is_exclusive": false,
        "on_keydown": function() {
            prevPhoto();
        },
    }, {
        "keys": "ctrl left",
        "is_exclusive": false,
        "on_keydown": function() {
            prevPhoto();
        },
    }, {
        "keys": "shift left",
        "is_exclusive": false,
        "on_keydown": function() {
            prevPhoto();
        },
    }, {
        "keys": "alt left",
        "is_exclusive": false,
        "on_keydown": function() {
            prevPhoto();
        }
    }, {
        "keys": "left",
        "is_exclusive": false,
        "on_keydown": function() {
            prevPhoto();
        },
    }];
    var keylistener = new keypress.Listener().register_many(keyBindDictionary);
});