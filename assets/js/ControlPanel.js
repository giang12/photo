// @codekit-prepend "vendor/bootstrap-switch.js"
// @codekit-prepend "vendor/handlebars-v1.3.0.js"
jQuery(document).ready(function($) {
    $('#saveSetting').click(function(event) {
        PhotoPopo.saveSetting();
    });
    $('.control-panel-open').click(function(event) {
        $('.control-panel').fadeIn('400');
    }).hover(function() {
        $('.control-panel-open').addClass('fa-spin');
    }, function() {
        $('.control-panel-open').removeClass('fa-spin');
    });
    $('.control-panel-close').click(function(event) {
        $('.control-panel').fadeOut('400');
    });
    $('body').dblclick(function(event) {
        $('.control-panel').fadeIn('400');
    });

    $("#FullScreen").bootstrapSwitch({
        state: PhotoPopo.isFullScreen()
    }).on('switchChange.bootstrapSwitch', function(event, state) {
        PhotoPopo.toggleFullScreen();
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
        askConfirm("Do you really want to remove "+$(self).parent().data('name')+"?", function() {
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