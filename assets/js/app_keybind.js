// @codekit-prepend "vendor/keypress.min.js"

jQuery(document).ready(function($) {

    var keyBindDictionary = [

        {
            "keys": "right",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOff();
                $(".control-panel-resume-button,.resumeMenu").show();
                PhotoPopo.nextPhoto();
            },
        }, {
            "keys": "left",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOff();
                $(".control-panel-resume-button,.resumeMenu").show();
                PhotoPopo.prevPhoto();
            },
        }, {
            "keys": "up",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOff();
                $(".control-panel-resume-button,.resumeMenu").show();
                PhotoPopo.jumpToTail();
            },
        }, {
            "keys": "down",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOff();
                $(".control-panel-resume-button,.resumeMenu").show();
                PhotoPopo.jumpToHead();
            },
        }, {
            "keys": "space",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOn();
                $(".control-panel-resume-button,.resumeMenu").hide();
            },
        }, {
            "keys": "esc",
            "is_exclusive": false,
            "on_keydown": function() {
                $('.control-panel').hide();
                $('.control-panel-close').hide();
            },
        }, {
            "keys": "meta c",
            "is_exclusive": false,
            "on_keydown": function() {
                $('.control-panel').show();
                $('.control-panel-close').show();
            },
        }


    ];
    var keylistener = new keypress.Listener().register_many(keyBindDictionary);
});