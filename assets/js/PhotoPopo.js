// @codekit-prepend "vendor/circular-doubly-linked-list.js"
// @codekit-prepend "vendor/doubly-linked-list.js"
// @codekit-prepend "FBPhotoCollector"

//required jquery and utils.js

var PhotoPopo = (function() {

    'use strict';

    var container = new CircularDoublyLinkedList();

    var timeline = new DoublyLinkedList();

    var timelinePointer = null;

    var currPhoto = null;

    var holder = $('.slideshow-container');

    var MAIN_TIMER;

    var SlideShow = true;

    var _CAPTION_SIZE = 200; // characters

    var isRunning = true;

    var CONFIG = {
        DEFAULT_TIME: 12000,
        ADJUSTED_TIME: 1000,
        FULLPAGE: false,
        CAPTION: true,
        FROM: {}
    };

    var _haveInit = false;

    function init() {
        //container = new FBPhotoCollector('humansofnewyork').collect(insertToPage);
        if (_haveInit) {
            return;
        }
        _haveInit = true;

        _getConfig();

        $.each(CONFIG.FROM, function(index, val) {

            container.insert(new FBPhotoCollector(val.id));
        });
        MAIN_TIMER = setTimer(1000, nextPhoto);

        load(container);

        ControlPanel.init();

    }

    function _getConfig() {
        //getting config files;
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

    var _loadRunning = false;

    function load(container) {

        if (_loadRunning) {
            console.log('load is already running, return');
            return;
        }
        console.log('load is already running? ' + _loadRunning);
        _loadRunning = true;
        var _count = 0;
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
        var imageSource = (!isUndefined(photo.images) && photo.images.length > 0) ? photo.images[0].source : '';
        name = !isUndefined(photo.name) ? photo.name : '';
        var source = "";
        if (!isUndefined(fromCollector) && !isUndefined(fromCollector.source)) {
            source = fromCollector.source;
        }
        var htmlString = '<li id="' + photo.id + '" data-source="' + source + '"><span class="slideshow-img' + (CONFIG.FULLPAGE ? "" : " fit ") + '" style="background-image:url(' + imageSource + ')">' + photo.id + '</span><div class="slideshow-caption' + (CONFIG.CAPTION ? "" : " hidden ") + '">' + (name === "" ? "" : '<span class="name">' + name + '</span></div></li>');
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