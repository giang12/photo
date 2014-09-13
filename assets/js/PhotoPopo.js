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

    var SlideShow = true;

    var _CAPTION_SIZE = 200; // characters

    var CONFIG = {
        DEFAULT_TIME: 12000,
        ADJUSTED_TIME: 1000,
        FULLSCREEN: false,
        CAPTION: true,
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
                enabled: false,
            }

        }
    };

    var _haveInit = false;

    function init() {
        //container = new FBPhotoCollector('humansofnewyork').collect(insertToPage);
        if (_haveInit) {
            return;
        }
        _haveInit = true;
        $.each(CONFIG.FROM, function(index, val) {

            container.insert(new FBPhotoCollector(val.id));
        });
        MAIN_TIMER = setTimer(1000, nextPhoto);
        load(container);

    }

    function _getConfig() {
        //getting config files;
    }

    var _loadRunning = false;

    function load(container) {

        if (_loadRunning) {
            console.log('load is already running, return');
            return;
        }
        console.log('load is already running? ' + _loadRunning);
        _loadRunning = true;
        _count = 0;
        _loadHelper(container, null);

        function _loadHelper(pool, curr) {

            if (_count >= container.length) {
                _loadRunning = false;
                return;
            }
            console.log("loading count: " + _count);

            if (curr === null)
                curr = pool.head;
            else
                curr = curr.next;

            curr.datum.collect(insertToPage, function() {
                _loadHelper(pool, curr); //always callbacks
            }, function() { //done callbacks
                _count++;
            });
        }

        return;
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
        htmlString = '<li id="' + photo.id + '" data-source="' + source + '"><span class="slideshow-img' + (CONFIG.FULLSCREEN ? "" : " fit ") + '" style="background-image:url(' + imageSource + ')">' + photo.id + '</span><div class="slideshow-caption' + (CONFIG.CAPTION ? "" : " hidden ") + '"><span class="name">' + name + '</span></div></li>';
        holder.append(htmlString);
    }

    /**
     * get a container
     * @param  {[type]} exception [description]
     * @return {[type]}           [description]
     */
    var _currPhotoCollector = null;

    function getNextPhotoCollector() {
        var __currPhotoCollector_counter = 0;

        function _getNextPhotoCollector_helper() {
            if (__currPhotoCollector_counter >= container.length) {

                return null;
            }

            if (isNull(_currPhotoCollector) || isUndefined(_currPhotoCollector)) {
                _currPhotoCollector = container.head;

            } else {
                _currPhotoCollector = _currPhotoCollector.next;
            }
            if (!CONFIG.FROM[_currPhotoCollector.datum.id].enabled) {

                __currPhotoCollector_counter++;
                return _getNextPhotoCollector_helper();
            } else {

                return _currPhotoCollector.datum;
            }
        }

        return _getNextPhotoCollector_helper();
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
            if (SlideShow) {
                MAIN_TIMER = setTimer(1000, nextPhoto, MAIN_TIMER);
            }
            return;
        }
        if (SlideShow) {
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
                //every container is disabled or all is removed
                console.log("no container");

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
            if (SlideShow) {
                MAIN_TIMER = setTimer(1000, nextPhoto, MAIN_TIMER);
            }
            return;
        }

        if (SlideShow) {
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



        nameElm = $(elm.find('.name'));
        name = !isUndefined(photo.datum.name) ? photo.datum.name : '';
        if (name.length <= _CAPTION_SIZE) {

            nameElm.css('font-size', '1.5em');
            console.log(name.length + ' 1.5em');
        } else if (name.length <= _CAPTION_SIZE * 2) {
            nameElm.css('font-size', '1.2em');
            console.log(name.length + ' 1.2em');
        } else {
            nameElm.css('font-size', '1em');
            console.log(name.length + ' 1em');

        }


        if (photo.datum.link) {
            $("#CurrPhotoLink").html('Picture Link: <a href=' + photo.datum.link + ' target="_blank">' + photo.datum.id + '</a>');
        } else {
            $("#CurrPhotoLink").empty();
        }
        if (photo.datum.from) {
            $("#CurrPhotoFromName").html('From: <a href=http://facebook.com/' + photo.datum.from.id + ' target="_blank">' + photo.datum.from.name + '</a>');
        } else {
            $("#CurrPhotoFromName").empty();
        }

        $("#CurrPhotoCaption").html('Caption: <div style="max-height: 150px; overflow-y: auto;">'+ name +'</div>');

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
        SlideShow = false;
        if (typeof MAIN_TIMER !== 'undefined' && typeof MAIN_TIMER.clearTimer === 'function') {
            MAIN_TIMER.clearTimer();
        }
        return;
    }

    function slideshowOn() {
        console.log('spacebar on');
        if (!SlideShow) {
            SlideShow = true;
            nextPhoto();
        }
        return;
    }

    function toggleCaption() {
        if (!CONFIG.CAPTION) {
            CONFIG.CAPTION = true;
            $('.slideshow-caption').removeClass('hidden');
        } else {
            CONFIG.CAPTION = false;
            $('.slideshow-caption').addClass('hidden');
        }
        return isCaption();

    }

    function isCaption() {
        return CONFIG.CAPTION;
    }

    /**
     * toggleFullScreen
     * @return {[true]} iff fullscreen
     */
    function toggleFullScreen() {
        if (!CONFIG.FULLSCREEN) {
            CONFIG.FULLSCREEN = true;
            $('.slideshow-img').removeClass('fit');
        } else {
            CONFIG.FULLSCREEN = false;
            $('.slideshow-img').addClass('fit');
        }
        return isFullScreen();

    }

    function isFullScreen() {
        return CONFIG.FULLSCREEN;
    }

    function getAdjustedTime() {
        return CONFIG.ADJUSTED_TIME;
    }

    function setAdjustedTime(time) {
        if (typeof time === 'number') {
            CONFIG.ADJUSTED_TIME = time;
        }
        return getAdjustedTime();
    }

    function getFROM() {
        return CONFIG.FROM;
    }

    function removeFROM(id) {
        _count = 0;

        function _removeFROM_helper(pool, curr) {
            if (_count >= container.length) {

                return false;
            }
            if (curr === null) {

                curr = pool.head;
            } else {

                curr = curr.next;
            }

            if (curr.datum.id == id) {

                curr.datum.disabled = true;
                container.remove(curr.datum);
                delete CONFIG.FROM[id];
                console.log(id + " removed");

                return true;
            } else {

                _count++;
                return _removeFROM_helper(pool, curr);
            }
        }
        var _result = _removeFROM_helper(container, null);

        return _result;
    }

    function addFROMS1(id, src) {
        console.log(id);
        return;
    }

    function addFROMS2(id, src) {
        console.log(id);
        return;
    }

    function toggleFROM(id) {
        if (typeof CONFIG.FROM[id] !== 'object') {
            return false;
        }
        var obj = CONFIG.FROM[id];
        obj.enabled = !obj.enabled;

        return true;
    }

    function saveSetting() {
        console.log(CONFIG);
    }
    return {
        prevPhoto: prevPhoto,
        nextPhoto: nextPhoto,
        init: init,
        jumpToTail: jumpToTail,
        jumpToHead: jumpToHead,
        slideshowOn: slideshowOn,
        slideshowOff: slideshowOff,
        toggleFullScreen: toggleFullScreen,
        getAdjustedTime: getAdjustedTime,
        setAdjustedTime: setAdjustedTime,
        isFullScreen: isFullScreen,
        toggleCaption: toggleCaption,
        isCaption: isCaption,
        getFROM: getFROM,
        removeFROM: removeFROM,
        toggleFROM: toggleFROM,

        containter: container,
        addFROMS1: addFROMS1,
        addFROMS2: addFROMS2,
        saveSetting: saveSetting,
    };
}).call(this);