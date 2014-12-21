// @codekit-prepend "vendor/circular-doubly-linked-list.js"
// @codekit-prepend "vendor/doubly-linked-list.js"
// @codekit-prepend "FBPhotoCollector"

//required jquery and utils.js

/**
 * This is a singleton app controller/policing the app, hence the name :D
 * Uses circular doubly linked list as a PhotoCollectors container
 * Uses doubly linked list to implement photos history/timeline
 * @return public functions
 */
var PhotoPopo = (function() {

    'use strict';

    /* container for PhotoCollectors for each source */
    var container = new CircularDoublyLinkedList();

    /* history/timeline of photos presented , used for prev photos,etc */
    var timeline = new DoublyLinkedList();

    /* used to indicate where in history we are at, null if we are at most current photo */
    var timelinePointer = null;

    /* Photo object of the currently presented photo */
    var currPhoto = null;

    var holder = $('.slideshow-container');

    /* Main timer for slideshow */
    var MAIN_TIMER;

    var SlideShow = true;

    /* used to quick and dirty adjust font size for caption */
    var _CAPTION_SIZE = 200; // characters

    /**
     * app status
     * @type {Boolean}
     * false -> no photos to show, no sources enabled
     * true -> there are photos to show <3
     *
     * cough cough, even if slideshow is stopped, app may still be running, dont get confused:D
     */
    var isRunning = true;

    /**
     * app config
     * DEFAULT_TIME: to show next photo (in ms), set by app, doesnt change
     * ADJUSTED_TIME: time added to DEFAULT_TIME for individual setting, change by user
     * FROM: JSON object contains info for each photo source, e.g
     *  {
     *      '102099916530784': {
     *          id: '102099916530784',
     *          name: 'Humans of New York',
     *          source: 'facebook',
     *          link: 'https://www.facebook.com/humansofnewyork',
     *          enabled: true,
     *      }
     *  }
     */
    var CONFIG = {
        DEFAULT_TIME: 12000,
        ADJUSTED_TIME: 1000,
        FULLPAGE: false,
        CAPTION: true,
        FROM: {}
    };

    /* make sure only 1 instance running */
    var _haveInit = false;

    function init() {
        //container = new FBPhotoCollector('humansofnewyork').collect(insertToPage);
        if (_haveInit) {
            return;
        }
        _haveInit = true;

        _getConfig();

        $.each(CONFIG.FROM, function(index, val) {
            switch(val.source){
                case "facebook":
                case "fb":
                    container.insert(new FBPhotoCollector(val.id));
                    break;
                default:
                    console.log("sr mate source not recognized");

            }
        });

        /**
         * initially wait 1s then attempt to load initial photo, due to latency of loading first photo
         * Possible improvement: implement custom event "has photo, go ahead mate"
         * then add custom event handler to start slideshow
         */
        MAIN_TIMER = setTimer(1000, nextPhoto);

        /* start lazy loading photos from different sources */
        load(container);

        /* init main UI controller interface */
        ControlPanel.init();

    }

    /**
     * get unique user config and set app config based on that
     */
    function _getConfig() {
        //using local storage for now
        //TODO: ajax loading from server when authentication is implemented
        if (isNull(localStorage.getItem('config'))) {

            CONFIG = {
                DEFAULT_TIME: 12000,
                ADJUSTED_TIME: 1000,
                FULLPAGE: false,
                CAPTION: true,
                FROM: {

                    '102099916530784': {
                        id: '102099916530784',
                        name: 'Humans of New York',
                        source: 'facebook',
                        link: 'https://www.facebook.com/humansofnewyork',
                        enabled: true,
                    },
                    '536533713027444': {
                        id: '536533713027444',
                        name: '100WorldKisses',
                        source: 'facebook',
                        link: 'https://www.facebook.com/100WorldKisses',
                        enabled: true
                    },
                    '434849653264439': {
                        id: '434849653264439',
                        name: 'Portraits of America',
                        source: 'facebook',
                        link: 'https://www.facebook.com/portraitsofamerica',
                        enabled: true,
                    },
                    '658036584238559': {
                        id: '658036584238559',
                        name: 'Humans of UW-Madison',
                        source: 'facebook',
                        link: 'https://www.facebook.com/humansofuwmadison',
                        enabled: true
                    },
                    '110335168981694': {
                        id: '110335168981694',
                        name: 'Wandering Earl',
                        source: 'facebook',
                        link: 'https://www.facebook.com/WanderingEarl',
                        enabled: true
                    },
                    '295969823862536': {
                        id: '295969823862536',
                        name: 'Earth Porn',
                        source: 'facebook',
                        link: 'https://www.facebook.com/earthporndotus',
                        enabled: false,
                    }

                }
            };
        } else {
            CONFIG = JSON.parse(localStorage.getItem('config'));
        }
    }

    /* make sure only 1 loading worker is running to avoid duplicate */
    var _loadRunning = false;

    function load(container) {

        if (_loadRunning) {
            console.log('load is already running, return');
            return;
        }

        console.log('load is already running? ' + _loadRunning);
        
        _loadRunning = true;
        
        /* indicate number of sources where all photos from those sources have been loaded */
        var _count = 0;
        
        _loadHelper(container, null);

        /**
         * loader helper called recursively to load from 1 source at a time to avoid hogging up connection,
         * especially on mobile devices
         * @param  {[container]} pool [a pool of PhotoCollector objects to collect photos from]
         * @param  {PhotoCollector} curr [current PhotoCollector, location within the pool]
         * @return {nothing}      nothing
         */
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

            /* curr is a node within circularly double linked list container, curr.datum->PhotoCollector */
            curr.datum.collect(insertToPage, function() {
                /* when done loading a batch of photos from 1 source, move on next */
                _loadHelper(pool, curr); //always callbacks
            }, function() { //done callbacks
                /* increment count when all photo from a source have been loaded */
                _count++;
            });
        }

        return;
    }

    /**
     * insert each photo to page, handed to each PhotoCollector to use
     * @param  {object} photo [photo object]
     * @param  {object} PhotoCollector [where the photo come from]
     * @return {void}       void
     */
    function insertToPage(photo, fromCollector) {
        console.log("inserting to page");
        if ($("#" + photo.id).length > 0) {
            console.log('photo already exist');
            return;
        }
        /* link of the photo */
        var imageSource = (!isUndefined(photo.images) && photo.images.length > 0) ? photo.images[0].source : '';
        
        /* photo caption */
        var name = !isUndefined(photo.name) ? photo.name : '';
        var source = "";
        if (!isUndefined(fromCollector) && !isUndefined(fromCollector.source)) {
            source = fromCollector.source;
        }
        var htmlString = '<li id="' + photo.id + '" data-source="' + source + '"><span class="slideshow-img' + (CONFIG.FULLPAGE ? "" : " fit ") + '" style="background-image:url(' + imageSource + ')">' + photo.id + '</span><div class="slideshow-caption' + (CONFIG.CAPTION ? "" : " hidden ") + '">' + (name === "" ? "" : '<span class="name">' + name + '</span></div></li>');
        holder.append(htmlString);
    }

    /**
     * get an enabled PhotoCollector
     * 
     * @return {[null]}           [if there is no PhotoCollector enabled]
     * @return {[PhotoCollector]} [an enabled PhotoCollector]
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

            if (isUndefined(CONFIG.FROM[_currPhotoCollector.datum.id]) || isNull(CONFIG.FROM[_currPhotoCollector.datum.id]) || !CONFIG.FROM[_currPhotoCollector.datum.id].enabled) {

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

        isRunning = true;

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

                isRunning = false;

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
                MAIN_TIMER = setTimer(250, nextPhoto, MAIN_TIMER);
            }
            return;
        }

        if (SlideShow) {
            MAIN_TIMER = setTimer(calculateTimeRead(currPhoto), nextPhoto, MAIN_TIMER);
        }

    }

    function calculateTimeRead(photo) {
        var time = -1;
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

        var elm = $('#' + photo.datum.id);

        elm.addClass('show');

        elm.find('.slideshow-img').animate({
            'opacity': '1'
        }, 800);
        elm.find('.slideshow-caption').animate({
            'opacity': '1'
        }, 800);



        var nameElm = $(elm.find('.name'));
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

        $("#CurrPhotoCaption").html('Caption: <div style="max-height: 150px; overflow-y: auto;">' + name + '</div>');

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

        var elm = $('#' + photo.datum.id);

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
     * toggleFULLPAGE
     * @return {[true]} iff FULLPAGE
     */
    function toggleFULLPAGE() {
        if (!CONFIG.FULLPAGE) {
            CONFIG.FULLPAGE = true;
            $('.slideshow-img').removeClass('fit');
        } else {
            CONFIG.FULLPAGE = false;
            $('.slideshow-img').addClass('fit');
        }
        return isFULLPAGE();

    }

    function isFULLPAGE() {
        return CONFIG.FULLPAGE;
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
        var _count = 0;

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

                //add more advance later
                _currPhotoCollector = null; //reset, to avoid stuck in removed circular object
                
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

    function addSource(id, src, success, fail) {

        console.log(id + src);

        function s(srcObj) {
            load(container);

            if (!isRunning) {
                nextPhoto();
            }
            if (typeof success === 'function') {

                success(srcObj);
            }
        }

        switch (src) {
            case "facebook":
            case "fb":
                _addFromFaceBook(id, s, fail);
                break;
            default:
                if (typeof fail === 'function') {

                    fail("Source Not Regcognized");
                }
                return;
        }
    }

    /**
     * test if source has photo
     * @param  {[type]} id [description]
     * @return {[boolean]}    true or false
     */
    function _testSourceFromFaceBook(id, callback) {

        $.ajax({
            url: 'https://graph.facebook.com/' + id + '/photos/uploaded',
            type: 'GET',
            asyn: false,
            success: function(data) {
                if (data.data.length < 1) {
                    console.log(data.data.length);
                    if (typeof callback === 'function') {
                        callback(false);
                    }
                    return false;
                } else {
                    if (typeof callback === 'function') {
                        callback(true);
                    }
                }

            }
        });
    }

    function _addFromFaceBook(id, success, fail) {

        console.log('add from facebook for id + "' + id + '"');

        if (id.length < 1) {

            console.log('add empty');
            if (typeof fail === 'function') {

                fail("ID Cannot Be Blank");
            }
            return;
        }

        var srcObj = {
            id: '',
            name: '',
            source: 'facebook',
            link: '',
            enabled: true,
        };

        $.ajax({
            url: 'http://graph.facebook.com/?metadata=1&id=' + id,
            type: 'GET',
            success: function(data) {

                srcObj.name = data['name'];
                srcObj.id = data['id'];
                srcObj.link = data['link'];

                _testSourceFromFaceBook(srcObj.id, function(hasPhoto) {
                    if (!hasPhoto) {
                        askConfirm(srcObj.name + " does not have any public photos. Add anyway?",
                            function() {
                                //yes
                                getFROM()[srcObj.id] = srcObj;

                                container.insert(new FBPhotoCollector(srcObj.id));

                                if (typeof success === 'function') {

                                    success(getFROM()[srcObj.id]);
                                }

                            }, function() {
                                //no
                                if (typeof success === 'function') {

                                    success(null);
                                }
                                return;
                            });

                    } else {
                        getFROM()[srcObj.id] = srcObj;

                        container.insert(new FBPhotoCollector(srcObj.id));

                        if (typeof success === 'function') {

                            success(getFROM()[srcObj.id]);
                        }

                    }

                });


            },
            error: function(data) {

                var object = eval("(" + data['responseText'] + ")");

                console.log(object['error']['code'] + ": " + object['error']['message']);

                if (typeof fail === 'function') {

                    fail("The alias you requested does not exist: " + id);
                }
            },
            dataType: "json"
        });
    }

    function toggleFROM(id) {
        if (typeof CONFIG.FROM[id] !== 'object') {
            return false;
        }
        var obj = CONFIG.FROM[id];
        obj.enabled = !obj.enabled;

        if (!isRunning) {
            nextPhoto();
        }
        return true;
    }

    function saveSetting() {
        console.log(CONFIG);
        localStorage.setItem("config", JSON.stringify(CONFIG));
    }
    return {
        prevPhoto: prevPhoto,
        nextPhoto: nextPhoto,
        init: init,
        jumpToTail: jumpToTail,
        jumpToHead: jumpToHead,
        slideshowOn: slideshowOn,
        slideshowOff: slideshowOff,
        toggleFULLPAGE: toggleFULLPAGE,
        isFULLPAGE: isFULLPAGE,
        getAdjustedTime: getAdjustedTime,
        setAdjustedTime: setAdjustedTime,
        toggleCaption: toggleCaption,
        isCaption: isCaption,
        getFROM: getFROM,
        removeFROM: removeFROM,
        toggleFROM: toggleFROM,

        containter: container,
        addSource: addSource,
        saveSetting: saveSetting,
    };

}).call(this);