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