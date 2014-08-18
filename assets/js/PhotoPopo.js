// @codekit-prepend "vendor/circular-doubly-linked-list.js"
// @codekit-prepend "vendor/doubly-linked-list.js"
// @codekit-prepend "FBPhotoCollector"

//required jquery and utils.js

var PhotoPopo = (function() {
    var container = new CircularDoublyLinkedList();

    var timeline = new DoublyLinkedList();

    var timelinePointer = null;

    var currPhoto = null;

    var holder = $('.slideshow-container');

    var MAIN_TIMER;

    var FullScreen = false;

    var CONFIG = {
        DEFAULT_TIME: 12000,
        ADJUSTED_TIME: 1000,
        SLIDESHOW: true,
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
                enabled: false,
            },
            '122067744547121': {
                id: '122067744547121',
                name: 'Scarlett Johansson',
                source: "facebook",
                link: 'https://www.facebook.com/pages/Scarlett-Johansson/122067744547121',
                enabled: false,
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
        MAIN_TIMER = setTimer(2000, nextPhoto);
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
            }, function() { //done callbacks
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
        htmlString = '<li id="' + photo.id + '" data-source="' + source + '"><span class="slideshow-img'+(FullScreen ? "": " fit ")+'" style="background-image:url(' + imageSource + ')">' + photo.id + '</span><div class="slideshow-caption"><span class="name">' + name + '</span></div></li>';
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
        } else {
            currContainer = currContainer.next;
        }
        return currContainer.datum;
    }

    function jumpToTail() {
        timelinePointer = null; //reset pointer
        nextPhoto();
        return;
    }

    function jumpToHead() {
        if (timeline.size() === 0) {
            //No History Call Next photo
            console.log('exit timeline 0');
            nextPhoto();
            return;
        }
        timelinePointer = { //BAD, REALLY HACKY BUT OH WELL, FIX IT LATER
            next: timeline.getHead()
        };
        nextPhoto();
        return;
    }

    function prevPhoto() {

        var photoToHide = currPhoto; //cache prevToHide

        if (timeline.size() === 0) {
            //No History Call Next photo
            console.log('exit timeline 0');
            nextPhoto();
            return;
        }

        //start from tail or get prev

        if (isUndefined(timelinePointer) || isNull(timelinePointer)) {
            timelinePointer = timeline.getTail();
        }

        timelinePointer = timelinePointer.prev;

        //check if dummy head
        if (isUndefined(timelinePointer) || isNull(timelinePointer)) {
            nextPhoto();
            console.log('exit timeline null');
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
            if (CONFIG.SLIDESHOW) {
                MAIN_TIMER = setTimer(2000, nextPhoto, MAIN_TIMER);
            }
            return;
        }
        if (CONFIG.SLIDESHOW) {
            MAIN_TIMER = setTimer(calculateTimeRead(currPhoto), nextPhoto, MAIN_TIMER);
        }
    }

    function nextPhoto() {

        var photoToHide = currPhoto; //cache prevToHide
        var newPhoto = false;
        if (!isNull(timelinePointer) && !isUndefined(timelinePointer) && !isUndefined(timelinePointer.next) && !isNull(timelinePointer.next)) {

            timelinePointer = timelinePointer.next;
            currPhoto = timelinePointer.data;
        } else {

            timelinePointer = null; //reset pointer

            var photoCollector = getNextPhotoCollector();

            if (isUndefined(photoCollector) || isNull(photoCollector)) {
                //every container is disabled 

                return;
            }

            if (isUndefined(photoCollector.currPhoto) || isNull(photoCollector.currPhoto)) {

                photoCollector.currPhoto = photoCollector.FBPhotoContainer.head;
            } else {

                photoCollector.currPhoto = photoCollector.currPhoto.next;
            }
            currPhoto = photoCollector.currPhoto;

            newPhoto = true;
        }

        if (hidePhoto(photoToHide)) {
            //hide sucess
        } else {

        }

        if (showPhoto(currPhoto)) {
            if (newPhoto) { //add to history if new pictures and show successfully
                timeline.add(currPhoto);
            }
        } else {
            console.log('none to display');
            if (CONFIG.SLIDESHOW) {
                MAIN_TIMER = setTimer(2000, nextPhoto, MAIN_TIMER);
            }
            return;
        }

        if (CONFIG.SLIDESHOW) {
            MAIN_TIMER = setTimer(calculateTimeRead(currPhoto), nextPhoto, MAIN_TIMER);
        }

    }

    function calculateTimeRead(photo) {
        time = -1;
        if (photo.datum.name) {
            time = photo.datum.name.length * 35 + CONFIG.ADJUSTED_TIME;
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

    function slideshowOff() {
        console.log('slideshow off, press spacebar to turn on');
        CONFIG.SLIDESHOW = false;
        if (typeof MAIN_TIMER !== 'undefined' && typeof MAIN_TIMER.clearTimer === 'function') {
            MAIN_TIMER.clearTimer();
        }
        return;
    }

    function slideshowOn() {
        console.log('spacebar on');
        CONFIG.SLIDESHOW = true;
        nextPhoto();
        return;
    }

    /**
     * toggleFullScreen
     * @return {[true]} iff fullscreen
     */
    function toggleFullScreen() {
        if (!FullScreen) {
            FullScreen = true;
            $('.slideshow-img').removeClass('fit');
        } else {
            FullScreen = false;
            $('.slideshow-img').addClass('fit');
        }
        return FullScreen;

    }
    return {
        prevPhoto: prevPhoto,
        nextPhoto: nextPhoto,
        init: init,
        load: load,
        jumpToTail: jumpToTail,
        jumpToHead: jumpToHead,
        slideshowOn: slideshowOn,
        slideshowOff: slideshowOff,
        toggleFullScreen: toggleFullScreen,

    };
}).call(this);