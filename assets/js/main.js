// @codekit-prepend "vendor/circular-doubly-linked-list.js"
// @codekit-prepend "vendor/jquery.js"
// @codekit-prepend "vendor/bootstrap.js"
// @codekit-prepend "plugins.js"
// @codekit-prepend "utils.js"
// @codekit-prepend "FBPhotoCollector"
// @codekit-prepend "app_keybind.js"
jQuery(document).ready(function($) {


    init();
    //MAIN_TIMER = setTimer(2000, nextPhoto);

});

var POOL = new CircularDoublyLinkedList();
var container = new CircularDoublyLinkedList();

var currPhoto = null;

var holder = $('.slideshow-container');

var MAIN_TIMER;


var CONFIG = {
    DEFAULT_TIME: 12000,
    ADJUSTED_TIME: 1000,
    FROM: {

        '102099916530784': {
            id: '102099916530784',
            name: 'Humans of New York',
            source: 'facebook',
            link: 'https://www.facebook.com/humansofnewyork',
            enabled: true,
        },
        '122067744547121': {
            id: '122067744547121',
            name: 'Scarlett Johansson',
            source: "facebook",
            link: 'https://www.facebook.com/pages/Scarlett-Johansson/122067744547121',
            enabled: true,
        }

    }
};

function init() {
        //container = new FBPhotoCollector('humansofnewyork').collect(insertToPage);

    $.each(CONFIG.FROM, function(index, val) {
        if(val.enabled === false){
            return true;
        }
        var newCon = new FBPhotoCollector(val.id);
        container.insert(newCon);
        POOL.insert(newCon);
    });

    while(POOL.length !== 0){

        /*curr = POOL.next();
        if(curr.datum.done === true){
            POOL.remove(curr);
        }else{
            curr.datum.collect(insertToPage);
        }*/
    }
}

/**
 * object containing the photo info
 * @param  {object} photo photo object
 * @return {void}       void
 */
function insertToPage(photo) {
    console.log("inserting to page");
    if ($("#" + photo.id).length > 0) {
        console.log('photo already exist');
        return;
    }
    imageSource = (!isUndefined(photo.images) && photo.images.length > 0) ? photo.images[0].source : '';
    name = !isUndefined(photo.name) ? photo.name : '';

    htmlString = '<li id="' + photo.id + '"><span class="slideshow-img" style="background-image:url(' + imageSource + ')">' + photo.id + '</span><div class="slideshow-caption"><span class="name">' + name + '</span></div></li>';
    holder.append(htmlString);
}

/**
 * get a container
 * @param  {[type]} exception [description]
 * @return {[type]}           [description]
 */
function getAPhotoContainer(exception) {

}

function prevPhoto() {

    photoToHide = currPhoto; //cache prevToHide

    //get next photo
    if (isUndefined(currPhoto) || isNull(currPhoto)) {
        currPhoto = container.FBPhotoContainer.tail;
    } else {
        currPhoto = currPhoto.prev;
    }

    if (hidePhoto(photoToHide)) {
        //hide sucess
    } else {

    }

    if (showPhoto(currPhoto)) {
        //show success
    } else {
        console.log('none to display');
        MAIN_TIMER = setTimer(2000, nextPhoto, MAIN_TIMER);
        return;
    }

    MAIN_TIMER = setTimer(calculateTimeRead(currPhoto), nextPhoto, MAIN_TIMER);
}

function nextPhoto() {

    photoToHide = currPhoto; //cache prevToHide

    if (isUndefined(currPhoto) || currPhoto === null) {
        currPhoto = container.FBPhotoContainer.head;
    } else {
        currPhoto = currPhoto.next;
    }


    if (hidePhoto(photoToHide)) {
        //hide sucess
    } else {

    }

    if (showPhoto(currPhoto)) {
        //show success
    } else {
        console.log('none to display');
        MAIN_TIMER = setTimer(2000, nextPhoto, MAIN_TIMER);
        return;
    }


    MAIN_TIMER = setTimer(calculateTimeRead(currPhoto), nextPhoto, MAIN_TIMER);

}

function calculateTimeRead(currPhoto) {
    time = -1;
    if (currPhoto.datum.name) {
        time = currPhoto.datum.name.length * 35 + CONFIG.ADJUSTED_TIME;
    }
    console.log("Calculated time: " + time / 1000 + " seconds");
    return time < CONFIG.DEFAULT_TIME ? CONFIG.DEFAULT_TIME : time;
}

/**
 * show photo elm
 * @param  {elm} elm jquery elm obj
 * @return {bool}     [true iff show]
 */
function showPhoto(photo) {

    if (isUndefined(photo) || isNull(photo)) {
        return false;
    }

    elm = $('#' + photo.datum.id);

    elm.addClass('show');
    elm.find('.slideshow-img').animate({
        'opacity': '1'
    }, 800);
    elm.find('.slideshow-caption').animate({
        'opacity': '1'
    }, 800);

    return true;
}

/**
 * hide photo elm
 * @param  {elm} elm jquery elm obj
 * @return {bool}     [true if hide]
 */
function hidePhoto(photo) {

    if (isUndefined(photo) || isNull(photo)) {
        return false;
    }

    elm = $('#' + photo.datum.id);

    elm.removeClass('show');
    elm.find('.slideshow-img').animate({
        'opacity': '0'
    }, 800);
    elm.find('.slideshow-caption').animate({
        'opacity': '0'
    }, 800);

    return true;
}