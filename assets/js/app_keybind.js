// @codekit-prepend "vendor/keypress.min.js"

jQuery(document).ready(function($) {

    var keyBindDictionary = [

        {
            "keys": "cmd right",
            "is_exclusive": false,
            "on_keydown": function() {

                PhotoPopo.slideshowOff();
                $(".control-panel-resume-button,.resumeMenu").show();
                PhotoPopo.nextPhoto();
            },
        }, {
            "keys": "ctrl right",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOff();
                $(".control-panel-resume-button,.resumeMenu").show();
                PhotoPopo.nextPhoto();
            },
        }, {
            "keys": "shift right",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOff();
                $(".control-panel-resume-button,.resumeMenu").show();
                PhotoPopo.nextPhoto();
            },
        }, {
            "keys": "alt right",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOff();
                $(".control-panel-resume-button,.resumeMenu").show();
                PhotoPopo.nextPhoto();
            },
        }, {
            "keys": "right",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOff();
                $(".control-panel-resume-button,.resumeMenu").show();
                PhotoPopo.nextPhoto();
            },
        }, {
            "keys": "cmd left",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOff();
                $(".control-panel-resume-button,.resumeMenu").show();
                PhotoPopo.prevPhoto();
            },
        }, {
            "keys": "ctrl left",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOff();
                $(".control-panel-resume-button,.resumeMenu").show();
                PhotoPopo.prevPhoto();
            },
        }, {
            "keys": "shift left",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOff();
                $(".control-panel-resume-button,.resumeMenu").show();
                PhotoPopo.prevPhoto();
            },
        }, {
            "keys": "alt left",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOff();
                $(".control-panel-resume-button,.resumeMenu").show();
                PhotoPopo.prevPhoto();
            }
        }, {
            "keys": "left",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOff();
                $(".control-panel-resume-button,.resumeMenu").show();
                PhotoPopo.prevPhoto();
            },
        }, {
            "keys": "cmd up",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOff();
                $(".control-panel-resume-button,.resumeMenu").show();
                PhotoPopo.jumpToTail();
            },
        }, {
            "keys": "ctrl up",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOff();
                $(".control-panel-resume-button,.resumeMenu").show();
                PhotoPopo.jumpToTail();
            },
        }, {
            "keys": "shift up",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOff();
                $(".control-panel-resume-button,.resumeMenu").show();
                PhotoPopo.jumpToTail();
            },
        }, {
            "keys": "alt up",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOff();
                $(".control-panel-resume-button,.resumeMenu").show();
                PhotoPopo.jumpToTail();
            }
        }, {
            "keys": "up",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOff();
                $(".control-panel-resume-button,.resumeMenu").show();
                PhotoPopo.jumpToTail();
            },
        }, {
            "keys": "cmd down",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOff();
                $(".control-panel-resume-button,.resumeMenu").show();
                PhotoPopo.jumpToHead();
            },
        }, {
            "keys": "ctrl down",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOff();
                $(".control-panel-resume-button,.resumeMenu").show();
                PhotoPopo.jumpToHead();
            },
        }, {
            "keys": "shift down",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOff();
                $(".control-panel-resume-button,.resumeMenu").show();
                PhotoPopo.jumpToHead();
            },
        }, {
            "keys": "alt down",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOff();
                $(".control-panel-resume-button,.resumeMenu").show();
                PhotoPopo.jumpToHead();
            }
        }, {
            "keys": "down",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOff();
                $(".control-panel-resume-button,.resumeMenu").show();
                PhotoPopo.jumpToHead();
            },
        },{
            "keys": "space",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOn();
                $(".control-panel-resume-button,.resumeMenu").hide();
            },
        }


    ];
    var keylistener = new keypress.Listener().register_many(keyBindDictionary);
});