// @codekit-prepend "vendor/bootstrap-switch.js"
// @codekit-prepend "vendor/handlebars-v1.3.0.js"
// @codekit-prepend "vendor/screenfull.min.js"

jQuery(document).ready(function($) {

    $('.control-panel-prev-button').click(function(event) {

        $(".control-panel-resume-button,.resumeMenu").show();
        PhotoPopo.slideshowOff();
        PhotoPopo.prevPhoto();

    });

    $('.control-panel-next-button').click(function(event) {
        $(".control-panel-resume-button,.resumeMenu").show();
        PhotoPopo.slideshowOff();
        PhotoPopo.nextPhoto();

    });
    $('.control-panel-resume-button').click(function(event) {

        $(".control-panel-resume-button,.resumeMenu").hide();
        PhotoPopo.slideshowOn();
    });

    $('.control-panel-open').click(function(event) {
        $('.control-panel').show();
        $('.control-panel-close').show();
    }).hover(function() {
        $('.control-panel-open').addClass('fa-spin');
    }, function() {
        $('.control-panel-open').removeClass('fa-spin');
    });

    $('.control-panel-close').click(function(event) {
        $('.control-panel').hide();
        $('.control-panel-close').hide();
    });
    
    if (screenfull.enabled && device.desktop()) {
        $('.control-panel-fullscreen-button').click(function(event) {

            screenfull.toggle($('body')[0]);
        });
        $('body').on(screenfull.raw.fullscreenchange, function(event) {
            $('.control-panel-fullscreen-button i').toggleClass('fa-expand fa-times');
        });

    } else {
        $('.control-panel-fullscreen-button').hide();
    }


    $('body').hover(function() {
        /* Stuff to do when the mouse enters the element */
        $('.control-panel-open').show();
        $('.control-panel-prev-button').show();
        $('.control-panel-next-button').show();
        if((screenfull.enabled && device.desktop())){
            $('.control-panel-fullscreen-button').show();
        }
    }, function() {
        /* Stuff to do when the mouse leaves the element */
        $('.control-panel-open').hide();
        $('.control-panel-prev-button').hide();
        $('.control-panel-next-button').hide();
        $('.control-panel-fullscreen-button').hide();
    });

    $("#Caption").bootstrapSwitch({
        state: PhotoPopo.isCaption()
    }).on('switchChange.bootstrapSwitch', function(event, state) {
        PhotoPopo.toggleCaption();
    });

    $("#FullPage").bootstrapSwitch({
        state: PhotoPopo.isFULLPAGE()
    }).on('switchChange.bootstrapSwitch', function(event, state) {
        PhotoPopo.toggleFULLPAGE();
    });

    $("#ADJUSTED_TIME").val(PhotoPopo.getAdjustedTime() / 1000).blur(function(event) {
        elm = $(this);
        time = elm.val();
        if ($.isNumeric(time)) {
            time *= 1000;
            PhotoPopo.setAdjustedTime(time);
        }
        elm.val(PhotoPopo.getAdjustedTime() / 1000);
    });


    $('#saveSetting').click(function(event) {
        PhotoPopo.saveSetting();
    });

    renderControlSources();


});

function renderControlSources() {
    var source = $("#sources-template").html();
    var template = Handlebars.compile(source);
    var html = template(PhotoPopo.getFROM());
    $("#sources").html(html);

    $("input[name=enable-btn]").change(function(event) {
        PhotoPopo.toggleFROM($(this).parent().data('id'));
    });

    $("button[name=remove-btn]").click(function(event) {
        var self = this;
        $(self).addClass('disabled');
        askConfirm("Do you really want to remove " + $(self).parent().data('name') + "?", function() {
            //yes
            var result = PhotoPopo.removeFROM($(self).parent().data('id'));
            if (result) {
                $(self).parent().remove();
            } else {
                $(self).removeClass('disabled');
            }

        }, function() {
            $(self).removeClass('disabled');
        });

    });
}