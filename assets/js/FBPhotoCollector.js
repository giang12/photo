// @codekit-prepend "vendor/jquery.js"
// @codekit-prepend "vendor/circular-doubly-linked-list.js"

function FBPhotoCollector(fbID) {
    if (typeof fbID === 'undefined' || typeof fbID === null) {
        throw new Error("FB ID cannot be " + typeof fbID);

    }
    this.fbID = fbID;
    this.FBPhotoContainer = new CircularDoublyLinkedList();
    this.photoFeedLink = "https://graph.facebook.com/" + this.fbID + "/photos/uploaded";
    this.runCount = 0;
    this.id = Math.random();
    this.done = false;
    return this;
}

FBPhotoCollector.prototype.isEmpty = function(){
	return this.FBPhotoContainer.length === 0;
};

FBPhotoCollector.prototype.collect = function(eachPhotoCallBack, failCallBack, doneCallBack) {
    self = this;
    if (self.photoFeedLink === null || self.runCount > 1) {
        self.done = true;
        console.log("done scrapping");
        if (typeof doneCallBack === 'function') {
            doneCallBack();
        }
        return self;
    } else {
        $.ajax({
            url: self.photoFeedLink,
            type: 'GET',
            dataType: 'json',
        }).done(function(data) {
            $.each(data.data, function(index, val) {
                self.FBPhotoContainer.insert(val);
                if (typeof eachPhotoCallBack === 'function') {
                    eachPhotoCallBack(val);
                }
            });
            self.photoFeedLink = null;
            if (typeof data.paging !== 'undefined' && typeof data.paging.next === "string" && data.paging.next.length > 0) {
                self.photoFeedLink = data.paging.next;
            }
        }).fail(function(error) {
            if (typeof failCallBack === 'function') {
                failCallBack(error);
            }
            console.log(error);
        }).always(function() {
            console.log("Complete Run #:" + (++self.runCount) + "| Total photos: " + self.FBPhotoContainer.length);
        });
    }
    return self;
};