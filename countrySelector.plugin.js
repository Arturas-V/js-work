/**
 * @description Country selector plugin to show modal window which suggest to select proper country.
 */
(function($) {
    'use strict';

    var
        /**
         * Namespace definition
         *
         * @namespace Front office namespace
         * @type {{}|*|window.fo}
         */
        fo = window.fo = window.fo || {},

        /**
         * Country selector plugin namespace declaration
         *
         * @type {{}|*}
         */
        countrySelector = fo.countrySelector = fo.countrySelector || {};

    /**
     * Constants object
     *
     * @type {{}}
     */
    countrySelector.constants = {
        MODAL_ID: "countrySelectorModal",
        REMEMBER_SELECTION_CHECKBOX_ID: "rememberCountrySelection",
        CONTINUE_BUTTON_ID: "continueCountrySelection"
    };

    /**
     * Shows modal dialog.
     * Modal content is passed as a parameter and is escaped.
     *
     * @param escapedContent
     */
    countrySelector.show = function(escapedContent) {
        var
            /**
             * Escaped content local variable declaration to be sure it's not undefined.
             *
             * @type {*|string}
             */
            escContent = escapedContent || "",

            /**
             * Modal selector window content.
             *
             * @type {*|string}
             */
            content = countrySelector.decode(escContent),

            /**
             * Cookie name
             *
             * @type {*|string}
             */
            countrySelectorCookieName = window.johnBrennansBrainchildPixelCookie || "countrySelectorModalShown",

            /**
             * Set of links for country change
             */
            countryChangeLinks,

            /**
             * jQuery reference to modal window.
             *
             * @type {jQuery}
             */
            modal,

            /**
             * jQuery reference to 'remember me' checkbox.
             *
             * @type {jQuery}
             */
            rememberMeCheckbox,

            /**
             * jQuery reference to 'continue' button.
             *
             * @type {jQuery}
             */
            continueButton;

        $('body').append(content);

        modal = $("#" + countrySelector.constants.MODAL_ID);
        rememberMeCheckbox = modal.find("#" + countrySelector.constants.REMEMBER_SELECTION_CHECKBOX_ID);
        continueButton = modal.find("#" + countrySelector.constants.CONTINUE_BUTTON_ID);
        countryChangeLinks = modal.find('li a');

        countryChangeLinks.click(function (evt) {
            evt.preventDefault();

            countryChangeLinks.removeClass('active');
            $(this).addClass('active');
        });

        continueButton.bind('click', function () {
            var link = modal.find('li a.active'),
                href = link.attr('href');

            $.fn.setlocaldata(countrySelectorCookieName, 1);

            if (rememberMeCheckbox.is(':checked')) {
                $.cookie(countrySelectorCookieName, '1', {expires: 365, path: '/'});
                if (!link.hasClass('currentSite')) {
                    $.cookie('countrySitePreference', link.attr('href'), {expires: 365, path: '/'});
                }
            }
            if (!link.hasClass('currentSite')) {
                href += ((href.indexOf('?') > -1) ? '&' : '?') + 'countrySelector=true';
                link.attr('href', href);

                window.analytics.triggerAction(link[0]);
            }
        });
    };

    /**
     * Decodes xml string.
     * Uses this approach:
     * <a href="http://stackoverflow.com/questions/1912501/unescape-html-entities-in-javascript">stackoverflow</a>
     *
     * @param xml String to be unescaped
     * @return {String} unescaped string
     */
    countrySelector.decode = function(xml) {
        var source = xml || "";

        return $('<div/>').html(source).text();
    };
})(jQuery);