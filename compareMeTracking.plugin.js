/*jslint unparam: true, browser: true, nomen: true, regexp: true, maxerr: 50, indent: 4, devel: true */
/*global jQuery:true */

/**
 * Compare me page analytics tracking plugin
 * issue https://jira.intetics.com/browse/ODT0221FO-1567
 *
 * plugin description as follows -
 *
 * -- want to be able to report on:
 * the number of users viewing 'compare profile completeness' section, active candidates vs my sector candidates
 * total number of users clicking on any of profile completeness tips
 * the number of users viewing 'compare top skills', active candidates vs my sector candidates
 * the number of users adding skills to the profile*
 *
 *
 * -- Analytics events to integrate:
 * Interaction 1: Somebody switches between 'Profile completeness' & 'Top skills' either using drop-down or arrows then fire the below event
 * Event Category: "Profile", Event Action: "Compare Me -maindropdown", Event Label: value change of what they are switching to - [concatenate] 'dropdown' or 'arrow'
 *
 * Interaction 2: Somebody switches between 'My sector candidates' & 'All sector candidates'
 * Event Category: "Profile", Event Action: "Compare Me- sub dropdown" Event Label: value change of what is there in 2nd dropdown -[Concatenate] first dropdown value
 *
 * Interaction 3: Somebody clicks on 'Add to Profile' section from 4 choices
 * Event Category: "Profile", Event Action: ''Compare Me- Add to profile section", Event Label: Name of the section ['skills', 'start-end date', 'previous employer', 'degree details']
 *
 * Interaction 4: Somebody clicks on 'Add Individual skills' section
 * Event Category: "Profile", Event Action:" Compare Me- Add Individual skills", Event Label: Name of the skill -[concatenate]value of 2nd dropdown
 *
 * Interaction 5: Somebody clicks on 'Add skills to Profile' button
 * Event Category: "Editorial", Event Action: "Compare Me- Add skills to profile button" *
 *
 */


(function(){
   'use strict';

    var fo = window.fo = window.fo || {},
        trackingTrigger = fo.trackingTrigger = fo.trackingTrigger || {};

    trackingTrigger.actionCompareMe = {
        "TRACK_COMPARE_ME_MAIN_DROP_DOWN": "PROFILE.COMPARE_ME_MAIN_DROP_DOWN",
        "TRACK_COMPARE_ME_SUB_DROP_DOWN": "PROFILE.COMPARE_ME_SUB_DROP_DOWN",
        "TRACK_COMPARE_ME_ADD_TO_PROFILE_SECTION": "PROFILE.COMPARE_ME_ADD_TO_PROFILE_SECTION",
        "TRACK_COMPARE_ME_ADD_INDIVIDUAL_SKILLS": "PROFILE.COMPARE_ME_ADD_INDIVIDUAL_SKILLS",
        "TRACK_COMPARE_ME_ADD_SKILLS_TO_PROFILE_BUTTON": "PROFILE.COMPARE_ME_ADD_SKILLS_TO_PROFILE_BUTTON"
    };

    /**
     * trigger analytics tracking with label arg
     * @param constant
     * @param item
     */
    function analyticsTrackingWithLabel(constant, item){
        window.analytics.triggerAction({
            label: item
        }, constant);
    }

    /**
     * trigger analytics tracking, no labels etc.
     * @param constant
     */
    function analyticsTracking(constant) {
        window.analytics.triggerAction(constant);
    }

    /**
     * trigger analytics on TRACK_COMPARE_ME_MAIN_DROP_DOWN event
     */
    fo.eventHandler.subscribe(fo.eventHandler.events.COMPARE_ME_MAIN_DROP_DOWN, function(trigger, item){
        analyticsTrackingWithLabel(trackingTrigger.actionCompareMe.TRACK_COMPARE_ME_MAIN_DROP_DOWN, item.label);
    });

    /**
     * trigger analytics on TRACK_COMPARE_ME_SUB_DROP_DOWN event
     */
    fo.eventHandler.subscribe(fo.eventHandler.events.COMPARE_ME_SUB_DROP_DOWN, function(trigger, item){
        analyticsTrackingWithLabel(trackingTrigger.actionCompareMe.TRACK_COMPARE_ME_SUB_DROP_DOWN, item.label);
    });

    /**
     * trigger analytics on TRACK_COMPARE_ME_ADD_TO_PROFILE_SECTION event
     */
    fo.eventHandler.subscribe(fo.eventHandler.events.COMPARE_ME_ADD_TO_PROFILE_SECTION, function(trigger, item){
        analyticsTrackingWithLabel(trackingTrigger.actionCompareMe.TRACK_COMPARE_ME_ADD_TO_PROFILE_SECTION, item.label);
    });

    /**
     * trigger analytics on TRACK_COMPARE_ME_ADD_INDIVIDUAL_SKILLS event
     */
    fo.eventHandler.subscribe(fo.eventHandler.events.COMPARE_ME_ADD_INDIVIDUAL_SKILLS, function(trigger, item){
        analyticsTrackingWithLabel(trackingTrigger.actionCompareMe.TRACK_COMPARE_ME_ADD_INDIVIDUAL_SKILLS, item.label);
    });

    /**
     * trigger analytics on TRACK_COMPARE_ME_ADD_SKILLS_TO_PROFILE_BUTTON event
     */
    fo.eventHandler.subscribe(fo.eventHandler.events.COMPARE_ME_ADD_SKILLS_TO_PROFILE_BUTTON, function(){
        analyticsTracking(trackingTrigger.actionCompareMe.TRACK_COMPARE_ME_ADD_SKILLS_TO_PROFILE_BUTTON);
    });


    var
        /**
         * analytics tracking defaults
         */
        defaults = {
            "controls-container-selector": ".navigable-carousel-controls",
            "prev-selector": ".prev",
            "next-selector": ".next",
            "sliding-dropdown": ".sliding-dropdown",
            "navigation-button-disabled-class": "disabled",
            "add-to-profile-button": ".add",
            "completness-tip": ".completenessTip",
            "sliding-dropdown-selected-selector": "span",
            "sliding-dropdown-menu-selector": "ul",
            "sliding-dropdown-options-selector": "li",
            "comparison-container": ".comparison-container",
            "active-item": ".item.active"
        };

    /**
     * AddToProfile analytics tracking function
     * @param options
     * @constructor
     */
    function AddToProfile (container, options) {
        /**
         * Options reference
         */
        this.options = options;

        /**
         * jQuery reference to Add to profile button
         */
        this.addButton = container.find(options["add-to-profile-button"]);

        /**
         * jQuery reference to completeness tip value
         */
        this.tip = container.find(options["completness-tip"]).val();

    }

    /**
     * AddToProfile tracking prototype
     * @type {{init: init}}
     */
    AddToProfile.prototype = {
        init: function() {
            var tip = this.tip;
            this.addButton.on("click", function(){
                fo.eventHandler.publish(fo.eventHandler.events.COMPARE_ME_ADD_TO_PROFILE_SECTION,{
                    label: tip
                });
            });
        }
    }

    /**
     * addToProfileTracking analytics tracking
     * @param container
     * @param options
     * @constructor
     */
    $.fn.addToProfileTracking = function(ops){

        return this.each(function () {

            var
                /**
                 * jQuery reference to select element being wrapped by plugin
                 *
                 * @type {*|HTMLElement}
                 */
                self = $(this),

                /**
                 * Plugin options.
                 */
                options = $.extend({}, defaults, ops),

                /**
                 *
                 * @type {AddToProfile}
                 */
                addToProfile = new AddToProfile(self, options);

            addToProfile.init();

        });

    }

    /**
     * DropDownTracking analytics tracking
     * @param container
     * @param options
     * @constructor
     */
    function DropDownTracking(){}

    /**
     * analytics tracking main dropdown prototype
     * @type {{analytics: analytics}}
     */
    DropDownTracking.prototype = {

        arrowTracking: function (mainDropdownText) {
            fo.eventHandler.publish(fo.eventHandler.events.COMPARE_ME_MAIN_DROP_DOWN,{
                label: mainDropdownText + ' - Arrow'
            });
        },

        selectionTracking: function(mainDropdownText){
            fo.eventHandler.publish(fo.eventHandler.events.COMPARE_ME_MAIN_DROP_DOWN,{
                label: mainDropdownText + ' - Dropdown'
            });
        },

        selectionTrackingSubDropdown: function(mainDropdownText, postfix){
            fo.eventHandler.publish(fo.eventHandler.events.COMPARE_ME_SUB_DROP_DOWN,{
                label: mainDropdownText + ' - ' + postfix
            });
        }

    }

    $.fn.subDropdownSelectionTracking = function(ops){

        return this.each(function(){

            var
                /**
                 * jQuery reference to select element being wrapped by plugin
                 *
                 * @type {*|HTMLElement}
                 */
                self = $(this),

                /**
                 * Plugin options.
                 */
                options = $.extend({}, defaults, ops),

                /**
                 * jQuery reference to container element
                 */
                container = self.siblings(options["sliding-dropdown"]),

                /**
                 * jQuery reference to dropdown menu
                 */
                menu = container.find(options["sliding-dropdown-menu-selector"]),

                /**
                 * jQuery regerence to dropdown menu item
                 */
                items = menu.find(options["sliding-dropdown-options-selector"]),

                /**
                 * jQuery reference to selected item
                 */
                selected = container.find(options["sliding-dropdown-selected-selector"]),

                /**
                 * selected item text
                 */
                selectedtext = selected.text(),

                /**
                 * DropDownTracking object constructor
                 * @type {DropDownTracking}
                 */
                dropDownTracking = new DropDownTracking();

            /* binding click event to each menu item */
            items.on('click', function(){
                var itemText = $(this).text(),
                    carousel = $(options["controls-container-selector"]),
                    carouselActiveItem = carousel.find(options["active-item"]),
                    activeMainDropdown = carouselActiveItem.find(options["sliding-dropdown"]),
                    activeMainSelected = activeMainDropdown.find(options["sliding-dropdown-selected-selector"]),

                    activeMainItemText = activeMainSelected.text();
                if(selectedtext !== itemText){
                    dropDownTracking.selectionTrackingSubDropdown(itemText, activeMainItemText);
                }
                selectedtext = selected.text();
            });

        });

    }

    $.fn.mainDropdownSelectionTracking = function(ops){

        return this.each(function(){

            var
                /**
                 * jQuery reference to select element being wrapped by plugin
                 *
                 * @type {*|HTMLElement}
                 */
                self = $(this),

                /**
                 * Plugin options.
                 */
                options = $.extend({}, defaults, ops),

                /**
                 * jQuery reference to container element
                 */
                container = self.siblings(options["sliding-dropdown"]),

                /**
                 * jQuery reference to dropdown menu
                 */
                menu = container.find(options["sliding-dropdown-menu-selector"]),

                /**
                 * jQuery regerence to dropdown menu item
                 */
                items = menu.find(options["sliding-dropdown-options-selector"]),

                /**
                 * jQuery reference to selected item
                 */
                selected = container.find(options["sliding-dropdown-selected-selector"]),

                /**
                 * selected item text
                 */
                selectedtext = selected.text(),

                /**
                 * DropDownTracking object constructor
                 * @type {DropDownTracking}
                 */
                dropDownTracking = new DropDownTracking();

            /* binding click event to each menu item */
            items.on('click', function(){
                var itemText = $(this).text();
                if(selectedtext !== itemText){
                    dropDownTracking.selectionTracking(itemText);
                }
                selectedtext = selected.text();
            });

        });

    }

    /**
     * addToProfileTracking analytics,
     */
    $.fn.mainDropdownTrackingArrow = function(ops){

        return this.each(function(){

            var
                /**
                 * Plugin options.
                 */
                options = $.extend({}, defaults, ops),

                /**
                 * jQuery reference to controls container
                 * @type {*|HTMLElement}
                 */
                controlsContainer = $(options["controls-container-selector"]),

                /**
                 * jQuery reference to previous slide button
                 */
                prev = controlsContainer.find(options["prev-selector"]),

                /**
                 * jQuery reference to next slide button
                 */
                next = controlsContainer.find(options["next-selector"]),

                /**
                 * DropDownTracking object constructor
                 * @type {DropDownTracking}
                 */
                dropDownTracking = new DropDownTracking(),

                mainDropdownText;

            /* binding click event to prev control */
            prev.click(function(){
                mainDropdownText = $('.item:not(".active") .sliding-dropdown span').text()
                if (!$(this).hasClass(options["navigation-button-disabled-class"])) {
                    dropDownTracking.arrowTracking(mainDropdownText);
                }
            });

            /* binding click event to next control */
            next.click(function(){
                mainDropdownText = $('.item:not(".active") .sliding-dropdown span').text()
                if (!$(this).hasClass(options["navigation-button-disabled-class"])) {
                    dropDownTracking.arrowTracking(mainDropdownText);
                }
            });

        });

    }

}());