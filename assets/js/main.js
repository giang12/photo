// @codekit-prepend "vendor/circular-doubly-linked-list.js"
// @codekit-prepend "vendor/doubly-linked-list.js"
// @codekit-prepend "vendor/jquery.js"
// @codekit-prepend "vendor/bootstrap.js"
// @codekit-prepend "plugins.js"
// @codekit-prepend "utils.js"
// @codekit-prepend "FBPhotoCollector"
// @codekit-prepend "app_keybind.js"
jQuery(document).ready(function($) {


    //setInterval(detechNetwork, 6000);
    init();
    MAIN_TIMER = setTimer(2000, nextPhoto);

});

function detechNetwork() {
    if (navigator.onLine) {

    } else {
        console.log("Network Connection Loss");
    }
}
var container = new CircularDoublyLinkedList();

var timeline = new DoublyLinkedList();
var timelinePointer = null;

var currPhoto = null;

var holder = $('.slideshow-container');

var MAIN_TIMER;


var CONFIG = {
    DEFAULT_TIME: 5000,
    ADJUSTED_TIME: 1000,
    FROM: {

        '102099916530784': {
            id: '102099916530784',
            name: 'Humans of New York',
            source: 'facebook',
            link: 'https://www.facebook.com/humansofnewyork',
            enabled: true,
        },
        '295969823862536': {
            id: '295969823862536',
            name: 'Earth Porn',
            source: 'facebook',
            link: 'https://www.facebook.com/earthporndotus',
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
        if (val.enabled === false) {
            return true;
        }
        container.insert(new FBPhotoCollector(val.id));
    });

    load(container);


}

function load(container) {

    count = container.length;
    loadHelper(container, null);

    function loadHelper(pool, curr) {
        console.log("loading count: " + count);
        if (count <= 0) {
            return;
        }
        if (curr === null)
            curr = pool.head;
        else
            curr = curr.next;

        curr.datum.collect(insertToPage, function() {
            loadHelper(pool, curr); //always callbacks
        }, function() {//done callbacks
            count--;
            loadHelper(pool, curr);
        });
    }

}

/**
 * object containing the photo info
 * @param  {object} photo photo object
 * @param  {object} object collector the collector the photo come from
 * @return {void}       void
 */
function insertToPage(photo, fromCollector) {
    console.log("inserting to page");
    if ($("#" + photo.id).length > 0) {
        console.log('photo already exist');
        return;
    }
    imageSource = (!isUndefined(photo.images) && photo.images.length > 0) ? photo.images[0].source : '';
    name = !isUndefined(photo.name) ? photo.name : '';
    source = "";
    if (!isUndefined(fromCollector) && !isUndefined(fromCollector.source)) {
        source = fromCollector.source;
    }
    htmlString = '<li id="' + photo.id + '" data-source="' + source + '"><span class="slideshow-img" style="background-image:url(' + imageSource + ')">' + photo.id + '</span><div class="slideshow-caption"><span class="name">' + name + '</span></div></li>';
    holder.append(htmlString);
}

/**
 * get a container
 * @param  {[type]} exception [description]
 * @return {[type]}           [description]
 */
var currContainer = null;
function getNextPhotoCollector() {
    if (isNull(currContainer) || isUndefined(currContainer)) {
        currContainer = container.head;
    }else{
        currContainer = currContainer.next;
    }
    return currContainer.datum;
}


function prevPhoto() {

    photoToHide = currPhoto; //cache prevToHide

    //get next photo
    if (timeline.size() === 0) {
        //No History Call Next photo
        nextPhoto();
        return;
    }

    if (isNull(timelinePointer)) {
        timelinePointer = timeline.getTail();
    } else {
        timelinePointer = timelinePointer.prev;
    }

    if (isUndefined(timelinePointer) || photoCollector.timelinePointer === null) {
        nextPhoto();
        return;
    }
    currPhoto = timelinePointer.data;

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

    if (!isNull(timelinePointer) && !isNull(timeline.next)) {

        timelinePointer = timeline.next;
        currPhoto = timelinePointer;
    } else {

        photoCollector = getNextPhotoCollector();
        if (isUndefined(photoCollector.currPhoto) || photoCollector.currPhoto === null) {
            photoCollector.currPhoto = photoCollector.FBPhotoContainer.head;
        } else {
            photoCollector.currPhoto = photoCollector.currPhoto.next;
        }
        currPhoto = photoCollector.currPhoto;
        timeline.add(currPhoto);
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