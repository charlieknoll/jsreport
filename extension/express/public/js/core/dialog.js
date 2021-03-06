﻿/*!
 * Copyright(c) 2014 Jan Blaha 
 */
/* globals _ */

(function ($) {
    $.fn.dialog = function (options) {
        var dialogSelector = options.error ? "#errorDialog" : "#standardDialog";
        if (!_.isObject(options)) {
            var method = options;
            switch (method) {
                case "hide":
                    $(dialogSelector + " #modalDialog").find(".close").trigger("click");
            }
        }

        $(dialogSelector + " #modalDialog").modal();
        $(dialogSelector + " #dialogStorno").show();

        $(dialogSelector + " #dialogHeader").html(options.header);
        $(dialogSelector + " #dialogContent").html(options.content);
        
        $(dialogSelector + " #dialogSubmit").unbind("click").click(function () {
            if (options.onSubmit != null)
                options.onSubmit();

            $(dialogSelector + " #modalDialog").modal('hide');
        });

        if (options.hideButtons) {
            $(dialogSelector + " #dialogButtons").html("");
        }

        if (options.hideSubmit) {
            $(dialogSelector + " #dialogSubmit").hide();
        }

        return $(dialogSelector + " #modalDialog");
    };

    $.extend({
        dialog: $.fn.dialog
    });
})(jQuery);