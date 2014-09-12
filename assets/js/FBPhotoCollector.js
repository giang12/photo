//required CircularDoublyLinkedList

function FBPhotoCollector(ID) {
    if (typeof ID === 'undefined' || typeof ID === null) {
        throw new Error("FB ID cannot be " + typeof ID);

    }
    this.currPhoto = null;
    this.source = 'facebook';
    this.id = ID;
    this.FBPhotoContainer = new CircularDoublyLinkedList();
    this.photoFeedLink = "https://graph.facebook.com/" + this.id + "/photos/uploaded";
    this.runCount = 0;
    this.nothingimportant = Math.random();
    this.done = false;
    this.disabled = false;
    return this;
}

FBPhotoCollector.prototype.getContainer = function() {
    return this.FBPhotoContainer;
};
FBPhotoCollector.prototype.isEmpty = function() {
    return this.FBPhotoContainer.length === 0;
};
/**
 * collect photo
 * @param  {function} eachPhotoCallBack function to call for each photo loaded
 * @param  {function} alwaysCallBack    function to call after each run
 * @param  {function} doneCallBack      function to call after getting ALL photos
 * @param  {function} failCallBack      function to call when error
 * @return {self}                   self
 */
FBPhotoCollector.prototype.collect = function(eachPhotoCallBack, alwaysCallBack, doneCallBack, failCallBack) {
    self = this;
    if (self.done || self.disabled) {
        if (typeof doneCallBack === 'function') {
            doneCallBack(self);
        }
        if (typeof alwaysCallBack === 'function') {
            alwaysCallBack(self);
        }
        return self;
    }
    if (self.photoFeedLink === null || self.runCount > 0) {
        self.done = true;
        console.log("done scrapping for " + self.id);

        if (typeof doneCallBack === 'function') {
            doneCallBack(self);
        }
        if (typeof alwaysCallBack === 'function') {
            alwaysCallBack(self);
        }
        return self;
    }
    $.ajax({
        url: self.photoFeedLink,
        type: 'GET',
        dataType: 'json',
    }).done(function(data) {
        $.each(data.data, function(index, val) {
            self.FBPhotoContainer.insert(val);
            if (typeof eachPhotoCallBack === 'function') {
                eachPhotoCallBack(val, self);
            }
        });
        self.photoFeedLink = null;
        if (typeof data.paging !== 'undefined' && typeof data.paging.next === "string" && data.paging.next.length > 0) {
            self.photoFeedLink = data.paging.next;
        }
    }).fail(function(error) {
        console.log(error);

        if (typeof failCallBack === 'function') {
            failCallBack(error, self);
        }
    }).always(function() {
        console.log(self.id + " Complete Run #:" + (++self.runCount) + "| Total photos: " + self.FBPhotoContainer.length);

        if (typeof alwaysCallBack === 'function') {
            alwaysCallBack(self);
        }
        return self;
    });

};