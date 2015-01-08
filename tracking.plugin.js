$.fn.actionTracking = function () {
    var self = $(this);

    self.click(function (evt) {
        window.analytics.triggerAction.apply(window.analytics, self.data('tracking-data'));
    });
};

$.fn.saveJobActionTracking = function () {
    var self = $(this);

    self.click(function (evt) {
        if ($(fo.constants.SRP_CONTAINER).length === 1) {
            if ($(fo.constants.SRP_CONTAINER).hasClass('mini')) {
                window.analytics.triggerAction('JOBS.SAVE_JOB.FROM_SRP_OVERVIEW');
            } else {
                window.analytics.triggerAction('JOBS.SAVE_JOB.FROM_SRP_DETAILED');
            }
        } else {
            window.analytics.triggerAction('JOBS.SAVE_JOB.FROM_JOB');
        }
    });
};

$.fn.viewJobActionTracking = function () {
    var self = $(this);

    self.click(function (evt) {
        if ($(fo.constants.SRP_CONTAINER).hasClass('mini')) {
            window.analytics.triggerAction('JOBS.SEARCH.VIEW_JOB.FROM_TITLE_OVERVIEW');
        } else {
            window.analytics.triggerAction('JOBS.SEARCH.VIEW_JOB.FROM_TITLE_DETAILED');
        }
    });
};

$.fn.saveSearchActionTracking = function () {
    var self = $(this);

    self.click(function (evt) {
        if ($(fo.constants.SRP_CONTAINER).hasClass('mini')) {
            window.analytics.triggerAction('JOBS.SEARCH.SAVE_SEARCH.OVERVIEW_VIEW');
        } else {
            window.analytics.triggerAction('JOBS.SEARCH.SAVE_SEARCH.DETAILED_VIEW');
        }
    });
};

$.fn.onLoadTracking = function () {
    window.analytics.triggerAction.apply(window.analytics, $(this).data('tracking-data'));
};

$.fn.pageActionTracking = function () {
    var self = $(this),
        pageTrackingData = self.data('page-tracking-data'),
        i;
    for (i = 0; i < pageTrackingData.length; i = i + 1) {
        switch (pageTrackingData[i].type) {
            case 'PAGE_BOTTOM_REACHED':
                triggerPageBottomReached(pageTrackingData[i]);
                break;
            case 'PAGE_LOAD':
                if (typeof(pageTrackingData[i].action) == 'string') {
                    window.analytics.triggerAction(pageTrackingData[i].action);
                } else {
                    window.analytics.triggerAction.apply(window.analytics, pageTrackingData[i].action);
                }
                break;
            case 'PAGE_SCROLL_DOWN':
                triggerPageScroll(pageTrackingData[i]);
                break;
        }
    }
};

(function() {
    'use strict';

    var fo = window.fo = window.fo || {},
        trackingTrigger = fo.trackingTrigger = fo.trackingTrigger || {},

        /**
         * Creates callback to be triggered on the specified action.
         *
         * @param gaTrackingAction Action code
         * @returns {Function}
         */
        triggerFactory = function (gaTrackingAction) {
            return function () {
                var options = Array.prototype.slice.call(arguments, 1);
                trackingTrigger.trigger.apply(trackingTrigger, [gaTrackingAction].concat(options));
            };
        };

    trackingTrigger.action = {
        "TRACK_RUN_REFINED_SEARCH": "JOBS.SEARCH.RUN_REFINED_SEARCH",
        "TRACK_RUN_SAVED_SEARCH": "JOBS.SEARCH.RUN_SAVED_SEARCH",
        "TRACK_RUN_SEARCH": "JOBS.SEARCH.RUN_SEARCH",
        "TRACK_SEARCH_TERM": "JOBS.SEARCH.SEARCH_TERM",
        "TRACK_OVERVIEW_VIEW": "JOBS.SEARCH.TOGGLE_VIEW.OVERVIEW_VIEW",
        "TRACK_DETAILED_VIEW": "JOBS.SEARCH.TOGGLE_VIEW.DETAILED_VIEW",
        "TRACK_OVERVIEW_VIEW_LOAD": "JOBS.SEARCH.PAGE_LOAD_VIEW.OVERVIEW_VIEW",
        "TRACK_DETAILED_VIEW_LOAD": "JOBS.SEARCH.PAGE_LOAD_VIEW.DETAILED_VIEW",
        "TRACK_AJAX_ERROR": "ERROR.TRACK_AJAX_ERROR",
        "TRACK_APPLY_PROCESSED": "JOBS.APPLY_PROCESSED",
        "TRACK_CV_UPLOAD": "JOBS.CV_UPLOADED",
        "TRACK_VIEW_NEWS_LATEST": "EDITORIAL.CLICK_NEWS.LATEST",
        "TRACK_VIEW_NEWS_POPULAR": "EDITORIAL.CLICK_NEWS.MOST_POPULAR",
        "TRACK_VIEW_NEWS_ALL": "EDITORIAL.CLICK_VIEW_ALL_BUTTON",
        "TRACK_NEWS_TAB_POPULAR": "EDITORIAL.CLICK_TAB.MOST_POPULAR",
        "TRACK_NEWS_TAB_LATEST": "EDITORIAL.CLICK_TAB.LATEST"
    };

    /**
     * Triggers the specified event
     *
     * @param action    Action value, for example "JOBS.SEARCH.RUN_REFINED_SEARCH", not action key
     * @param options   Event options
     */
    trackingTrigger.trigger = function (action, options) {
        var passedOptionsArray = Array.prototype.slice.call(arguments, 1),
            populatedOptionsArray = passedOptionsArray.concat(action || []);

        if(action) {
            window.analytics.triggerAction.apply(window.analytics, populatedOptionsArray);
        }
    };

    fo.eventHandler.subscribe(fo.eventHandler.events.NEWS_VIEW_POPULAR_CLICK, function (trigger, data) {
        trackingTrigger.trigger(trackingTrigger.action.TRACK_VIEW_NEWS_POPULAR, data);
    });

    fo.eventHandler.subscribe(fo.eventHandler.events.NEWS_VIEW_LATEST_CLICK, function (trigger, data) {
        trackingTrigger.trigger(trackingTrigger.action.TRACK_VIEW_NEWS_LATEST, data);
    });

    fo.eventHandler.subscribe(fo.eventHandler.events.NEWS_VIEW_ALL_CLICK, function (trigger) {
        trackingTrigger.trigger(trackingTrigger.action.TRACK_VIEW_NEWS_ALL);
    });

    fo.eventHandler.subscribe(fo.eventHandler.events.NEWS_TAB_POPULAR_CLICK, function (trigger) {
        trackingTrigger.trigger(trackingTrigger.action.TRACK_NEWS_TAB_POPULAR);
    });

    fo.eventHandler.subscribe(fo.eventHandler.events.NEWS_TAB_LATEST_CLICK, function (trigger) {
        trackingTrigger.trigger(trackingTrigger.action.TRACK_NEWS_TAB_LATEST);
    });

    /**
     * subscribe to 'DETAILED_VIEW_SELECTED' business event
     */
    fo.eventHandler.subscribe(fo.eventHandler.events.DETAILED_VIEW_SELECTED,
        triggerFactory(trackingTrigger.action.TRACK_DETAILED_VIEW));

    /**
     * subscribe to 'OVERVIEW_VIEW_SELECTED' business event
     */
    fo.eventHandler.subscribe(fo.eventHandler.events.OVERVIEW_VIEW_SELECTED,
        triggerFactory(trackingTrigger.action.TRACK_OVERVIEW_VIEW));

    /**
     * subscribe to 'AJAX_ERROR' business event
     */
    fo.eventHandler.subscribe(fo.eventHandler.events.AJAX_ERROR,
        triggerFactory(trackingTrigger.action.TRACK_AJAX_ERROR));

    /**
     * Subscribing to "PAGE_LOADED" event for srp page.
     * On page load, one of TRACK_RUN_SEARCH or TRACK_RUN_SAVED_SEARCH or TRACK_SEARCH_TERM event will be triggered.
     *
     * Additionally, view state will be tracked with either TRACK_OVERVIEW_VIEW_LOAD or TRACK_DETAILED_VIEW_LOAD
     * event trigger.
     */
    fo.eventHandler.subscribe(fo.eventHandler.events.PAGE_LOADED, function() {
        var
            /**
             * Srp container
             * @type {*|jQuery|HTMLElement}
             */
            srpContainer = $(fo.constants.SRP_CONTAINER),

            /**
             * Srp form element
             * @type {*|jQuery|HTMLElement}
             */
            srpFormEl = srpContainer.find('form#srpForm'),

            /**
             * Value of the keyword input field
             *
             * @type {*}
             */
            keywordInputValue = srpFormEl.find('input#keywords').val(),

            /**
             * Keyword to be tracked
             * @type {XML|string|void}
             */
            trackedKeyword = (keywordInputValue && keywordInputValue.length > 0)
                ? keywordInputValue.replace(' ', '+')
                : 'EMPTY-KEYWORD-SEARCH-PERFORMED',

            /**
             * Dirty workaround to check whether srp page has been opened
             *
             * todo[n.luschitsky] : refactor it
             */
            isCurrentPageSrp = srpContainer.length === 1,

            /**
             * Indicates whether the saved search is opened or not.
             * If yes, refrashable container has data-savedsearch="true" attribute
             *
             * @type {boolean}
             */
            isSavedSearchOpened =
                srpContainer.find('nav[data-efctype*="refreshable"][data-savedsearch="true"]').length > 0,

            /**
             * Tracking code
             * @type {string}
             */
             lastJobSearchTrackingCode = isSavedSearchOpened
                ? trackingTrigger.action.TRACK_RUN_SAVED_SEARCH
                : trackingTrigger.action.TRACK_RUN_SEARCH,

            /**
             * Function to get current domain.
             *
             * @returns {string}
             */
            getReferrerDomain = function() {
                var domain = document.referrer.match(/:\/\/(.[^/]+)/);
                return (domain === null) ? "" : domain[1];
            };

        if (isCurrentPageSrp) {
            if (getReferrerDomain().indexOf('efinancialcareers') <= -1) {
                trackingTrigger.trigger(lastJobSearchTrackingCode, {
                    label: "/" + srpFormEl.serialize()
                });
                trackingTrigger.trigger(trackingTrigger.action.TRACK_SEARCH_TERM, {
                    label: "/search?keywords=" + trackedKeyword
                });
            }
            if (srpContainer.hasClass('mini')) {
                trackingTrigger.trigger(trackingTrigger.action.TRACK_OVERVIEW_VIEW_LOAD);
            } else {
                trackingTrigger.trigger(trackingTrigger.action.TRACK_DETAILED_VIEW_LOAD);
            }
        }
    });

    /**
     * Subscribe to 'SUBMIT-FORM' event.
     *
     */
    fo.eventHandler.subscribe(fo.eventHandler.events.FORM_SUBMITTED, function (trigger, data) {

        var
           /**
            * Srp container
            * @type {*|jQuery|HTMLElement}
            */
            srpContainer = $(fo.constants.SRP_CONTAINER),

            /**
             * Code of the event to be tracked
             */
            trackingCode;

        if (data.target.attr('name') !== 'page') {
            trackingCode = trackingTrigger.action.TRACK_RUN_REFINED_SEARCH;
        } else if (srpContainer.find('nav[data-efctype*="refreshable"][data-savedsearch="true"]').length > 0) {
            trackingCode = trackingTrigger.action.TRACK_RUN_SAVED_SEARCH;
        } else {
            trackingCode = trackingTrigger.action.TRACK_RUN_SEARCH;
        }
        trackingTrigger.trigger(trackingCode, {
            label: '/' + data.params
        });

    });
}());
