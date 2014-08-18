// @codekit-prepend "vendor/keypress.min.js"

jQuery(document).ready(function($) {

    var keyBindDictionary = [

        {
            "keys": "cmd right",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOff();
                PhotoPopo.nextPhoto();
            },
        }, {
            "keys": "ctrl right",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOff();
                PhotoPopo.nextPhoto();
            },
        }, {
            "keys": "shift right",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOff();
                PhotoPopo.nextPhoto();
            },
        }, {
            "keys": "alt right",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOff();
                PhotoPopo.nextPhoto();
            },
        }, {
            "keys": "right",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOff();
                PhotoPopo.nextPhoto();
            },
        }, {
            "keys": "cmd left",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOff();
                PhotoPopo.prevPhoto();
            },
        }, {
            "keys": "ctrl left",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOff();
                PhotoPopo.prevPhoto();
            },
        }, {
            "keys": "shift left",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOff();

                PhotoPopo.prevPhoto();
            },
        }, {
            "keys": "alt left",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOff();

                PhotoPopo.prevPhoto();
            }
        }, {
            "keys": "left",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOff();

                PhotoPopo.prevPhoto();
            },
        }, {
            "keys": "cmd up",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOff();

                PhotoPopo.jumpToTail();
            },
        }, {
            "keys": "ctrl up",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOff();

                PhotoPopo.jumpToTail();
            },
        }, {
            "keys": "shift up",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOff();

                PhotoPopo.jumpToTail();
            },
        }, {
            "keys": "alt up",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOff();

                PhotoPopo.jumpToTail();
            }
        }, {
            "keys": "up",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOff();

                PhotoPopo.jumpToTail();
            },
        }, {
            "keys": "cmd down",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOff();

                PhotoPopo.jumpToHead();
            },
        }, {
            "keys": "ctrl down",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOff();

                PhotoPopo.jumpToHead();
            },
        }, {
            "keys": "shift down",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOff();

                PhotoPopo.jumpToHead();
            },
        }, {
            "keys": "alt down",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOff();

                PhotoPopo.jumpToHead();
            }
        }, {
            "keys": "down",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOff();

                PhotoPopo.jumpToHead();
            },
        },{
            "keys": "space",
            "is_exclusive": false,
            "on_keydown": function() {
                PhotoPopo.slideshowOn();
            },
        }


    ];
    var keylistener = new keypress.Listener().register_many(keyBindDictionary);
});