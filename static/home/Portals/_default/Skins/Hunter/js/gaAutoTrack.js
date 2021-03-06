(function ($) {
    var defaults = {
        categoryAttribute: 'data-ga-category',
        actionAttribute: 'data-ga-action',
        labelAttribute: 'data-ga-label',
        valueAttribute: 'data-ga-value',
        noninteractiveAttribute: 'data-ga-noninteractive',
        trackVisibleAttribute: 'data-ga-trackvisible',
        eventAttribute: 'data-ga-event',
        once: false,
        event: 'click.gaAutoTrack',
        category: '',
        action: 'click',
        label: '',
        value: null,
        nonInteractive: false,
        eventAddedKey: 'ga-auto-track-enabled'
    };
    $.extend({
        ga: {
            trackEvent: function (args) {
                args = $.extend({}, defaults, args);
                if (!args.category || !args.action || !args.label) {
                    return;
                }
                if (typeof ga !== 'undefined') {
                    ga('send', 'event', args.category, args.action, args.label, args.value, {'nonInteraction': args.nonInteractive});
                }
                if (typeof _gaq !== 'undefined') {
                    _gaq.push(['_trackEvent', args.category, args.action, args.label, args.value, args.nonInteractive]);
                }
            }, trackElement: function (elem, settings) {
                settings = settings || defaults;
                var $elem = $(elem);
                var category = $elem.attr(settings.categoryAttribute) || settings.category;
                var action = $elem.attr(settings.actionAttribute) || settings.action;
                var label = $elem.attr(settings.labelAttribute) || settings.label;
                var value = $elem.attr(settings.valueAttribute);
                var nonInteractive = $elem.attr(settings.noninteractiveAttribute) || settings.nonInteractive;
                var args = {category: category, action: action, nonInteractive: nonInteractive};
                if (label) {
                    args.label = label;
                    if (value) {
                        args.value = +value;
                    }
                }
                $.ga.trackEvent(args);
            }
        }
    });
    $.fn.extend({
        'gaAutoTrack': function (options) {
            var settings = $.extend({}, defaults, options);
            return this.each(function () {
                var _this = $(this);
                var eventName = _this.attr(settings.eventAttribute) || settings.event;
                var constructedFunction = function (e) {
                    var $elem = $(e.target || e).closest('.gaAutoTrack');
                    $.ga.trackElement($elem, settings);
                    if (settings.once) {
                        _this.off(e);
                    }
                };
                if (!_this.data(settings.eventAddedKey)) {
                    _this.on(eventName, constructedFunction);
                    _this.data(settings.eventAddedKey, true);
                }
            });
        }
    });

    function defaultBinding() {
        $('a.gaAutoTrack, button.gaAutoTrack, input[type="submit"].gaAutoTrack').gaAutoTrack();
    };$(document).ajaxComplete(defaultBinding);
    $(document).ready(defaultBinding);
})(jQuery);