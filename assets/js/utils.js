function askConfirm(msg, yes, no) {
    var html = '<div class="modal confirm-modal" data-backdrop="static">' +
        '<div class="modal-dialog">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<button type="button" class="close confirm-modal-close" aria-hidden="true">×</button>' +
        '<h4 class="modal-title">Confirm</h4>' +
        '</div>' +
        '<div class="modal-body">' +
        '<p>' + msg + '</p>' +
        '</div>' +
        '<div class="modal-footer">' +
        '<button type="button" class="btn btn-default confirm-modal-close">Cancel</button>' +
        '<button type="button" class="btn btn-primary confirm-modal-ok">Ok</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    $('body').append(html);
    $('.confirm-modal').modal();
    $('.confirm-modal-close').click(function() {
            $('.confirm-modal').modal('hide');
            $('.confirm-modal').remove();
            if(typeof no === 'function'){
                no();
            }
    });
    $('.confirm-modal-ok').click(function() {
            $('.confirm-modal').modal('hide');
            $('.confirm-modal').remove();
            if(typeof yes === 'function'){
                yes();
            }

    });
}
/**
 * test if object is undefined
 * @param  {object}  object object to test
 * @return {true}        iff undefined
 */
function isUndefined(object) {
    return typeof object === 'undefined';
}
/**
 * test if object is null
 * @param  {object}  object object to test
 * @return {true}        iff null
 */
function isNull(object) {
    return object === null;
}

/**
 * set time out with update and complete callbacks and way to clear timer
 * @param  {time} time     time in milliseconds
 * @param  {function} complete function to call when timeout completed
 * @param  {obj} Timer timer to be cleared
 * @param  {function} update   function to call during time decreasing
 * @return {obj}          the timer object
 */
function setTimer(time, complete, handle, update) {
    console.log("SET TIMER: " + time / 1000 + " seconds | Update Callback: " + getFnName(update) + " | Complete Callback: " + getFnName(complete));
    if (typeof handle !== 'undefined' && typeof handle.clearTimer === 'function') {
        handle.clearTimer();
    }

    return new Timer(time, complete, update);
}

function Timer(t, c, u) {
    var start = new Date().getTime();
    var interval = setInterval(function() {
        var now = t - (new Date().getTime() - start);
        if (now <= 0) {
            clearInterval(interval);
            if (typeof c === "function") {
                c();
            }
        } else if (typeof u === "function") {
            u(Math.floor(now / 1000));

        }
    }, 100); // the smaller this number, the more accurate the timer will be
    this.clearTimer = function clearTimer() {
        clearInterval(interval);
    };
    this.id = Math.random();
}


/**
 * get function name
 * @param  {string} fn string of function
 * @return {string}      name of function
 */
function getFnName(fn) {
    var f = typeof fn === 'function';
    var s = f && ((fn.name && ['', fn.name]) || fn.toString().match(/function ([^\(]+)/));
    return (!f && 'not a function') || (s && s[1] || 'anonymous');
}

/*=============================================
             Device js
=============================================*/
(function() {
  var previousDevice, _addClass, _doc_element, _find, _handleOrientation, _hasClass, _orientation_event, _removeClass, _supports_orientation, _user_agent;

  previousDevice = window.device;

  window.device = {};

  _doc_element = window.document.documentElement;

  _user_agent = window.navigator.userAgent.toLowerCase();

  device.ios = function() {
    return device.iphone() || device.ipod() || device.ipad();
  };

  device.iphone = function() {
    return _find('iphone');
  };

  device.ipod = function() {
    return _find('ipod');
  };

  device.ipad = function() {
    return _find('ipad');
  };

  device.android = function() {
    return _find('android');
  };

  device.androidPhone = function() {
    return device.android() && _find('mobile');
  };

  device.androidTablet = function() {
    return device.android() && !_find('mobile');
  };

  device.blackberry = function() {
    return _find('blackberry') || _find('bb10') || _find('rim');
  };

  device.blackberryPhone = function() {
    return device.blackberry() && !_find('tablet');
  };

  device.blackberryTablet = function() {
    return device.blackberry() && _find('tablet');
  };

  device.windows = function() {
    return _find('windows');
  };

  device.windowsPhone = function() {
    return device.windows() && _find('phone');
  };

  device.windowsTablet = function() {
    return device.windows() && (_find('touch') && !device.windowsPhone());
  };

  device.fxos = function() {
    return (_find('(mobile;') || _find('(tablet;')) && _find('; rv:');
  };

  device.fxosPhone = function() {
    return device.fxos() && _find('mobile');
  };

  device.fxosTablet = function() {
    return device.fxos() && _find('tablet');
  };

  device.meego = function() {
    return _find('meego');
  };

  device.cordova = function() {
    return window.cordova && location.protocol === 'file:';
  };

  device.nodeWebkit = function() {
    return typeof window.process === 'object';
  };

  device.mobile = function() {
    return device.androidPhone() || device.iphone() || device.ipod() || device.windowsPhone() || device.blackberryPhone() || device.fxosPhone() || device.meego();
  };

  device.tablet = function() {
    return device.ipad() || device.androidTablet() || device.blackberryTablet() || device.windowsTablet() || device.fxosTablet();
  };

  device.desktop = function() {
    return !device.tablet() && !device.mobile();
  };

  device.portrait = function() {
    return (window.innerHeight / window.innerWidth) > 1;
  };

  device.landscape = function() {
    return (window.innerHeight / window.innerWidth) < 1;
  };

  device.noConflict = function() {
    window.device = previousDevice;
    return this;
  };

  _find = function(needle) {
    return _user_agent.indexOf(needle) !== -1;
  };

  _hasClass = function(class_name) {
    var regex;
    regex = new RegExp(class_name, 'i');
    return _doc_element.className.match(regex);
  };

  _addClass = function(class_name) {
    if (!_hasClass(class_name)) {
      return _doc_element.className += " " + class_name;
    }
  };

  _removeClass = function(class_name) {
    if (_hasClass(class_name)) {
      return _doc_element.className = _doc_element.className.replace(class_name, "");
    }
  };

  if (device.ios()) {
    if (device.ipad()) {
      _addClass("ios ipad tablet");
    } else if (device.iphone()) {
      _addClass("ios iphone mobile");
    } else if (device.ipod()) {
      _addClass("ios ipod mobile");
    }
  } else if (device.android()) {
    if (device.androidTablet()) {
      _addClass("android tablet");
    } else {
      _addClass("android mobile");
    }
  } else if (device.blackberry()) {
    if (device.blackberryTablet()) {
      _addClass("blackberry tablet");
    } else {
      _addClass("blackberry mobile");
    }
  } else if (device.windows()) {
    if (device.windowsTablet()) {
      _addClass("windows tablet");
    } else if (device.windowsPhone()) {
      _addClass("windows mobile");
    } else {
      _addClass("desktop");
    }
  } else if (device.fxos()) {
    if (device.fxosTablet()) {
      _addClass("fxos tablet");
    } else {
      _addClass("fxos mobile");
    }
  } else if (device.meego()) {
    _addClass("meego mobile");
  } else if (device.nodeWebkit()) {
    _addClass("node-webkit");
  } else {
    _addClass("desktop");
  }

  if (device.cordova()) {
    _addClass("cordova");
  }

  _handleOrientation = function() {
    if (device.landscape()) {
      _removeClass("portrait");
      return _addClass("landscape");
    } else {
      _removeClass("landscape");
      return _addClass("portrait");
    }
  };

  _supports_orientation = "onorientationchange" in window;

  _orientation_event = _supports_orientation ? "orientationchange" : "resize";

  if (window.addEventListener) {
    window.addEventListener(_orientation_event, _handleOrientation, false);
  } else if (window.attachEvent) {
    window.attachEvent(_orientation_event, _handleOrientation);
  } else {
    window[_orientation_event] = _handleOrientation;
  }

  _handleOrientation();

}).call(this);



/*=============================================
            
=============================================*/