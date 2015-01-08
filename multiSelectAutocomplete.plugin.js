/*jslint unparam: true, browser: true, nomen: true, regexp: true, maxerr: 50, indent: 4, devel: true */
/*global jQuery:true */

/**
 * Autocomplete created in the scope of https://jira.intetics.com/browse/ODT0221FO-867.
 * Original design is http://ixei0k.axshare.com/#p=home.
 *
 * This plugin depends on the bootstrap typeahead plugin and uses it to show autosuggest.
 * Basic plugin markup is the following:
 *
 * <code>
 *     &lt;div class="input-group multi-select" data-efctype="multiSelectAutocomplete" data-efcargs='{"dataset":"keyword", "requestType":"dynamic"}'&gt;
 *          &lt;span class="input-group-addon multi-select-left-control-container"&gt;
 *              &lt;span class="input-group-icon jobs-faded-icon multi-select-move-left-initial"&gt;&lt;/span&gt;
 *              &lt;span class="multi-select-move-left-custom"> &#60; &lt;/span&gt;
 *          &lt;/span&gt;
 *          &lt;span class="multi-select-wrapper"&gt;
 *              &lt;span class="multi-select-inner-wrapper"&gt;
 *                  &lt;input class="form-control multi-select-input" maxlength="500" autocomplete="off" type="text" /&gt;
 *                  &lt;input id="keyword" name="keywords" type="hidden" class="form-control multi-select-hidden-input" value=""/&gt;
 *              &lt;/span&gt;
 *          &lt;/span&gt;
 *          &lt;span class="input-group-addon multi-select-right-control-container"&gt;
 *              &lt;span class="multi-select-move-right-initial"> &#215; &lt;/span&gt;
 *              &lt;span class="multi-select-move-right-custom"> &#62; &lt;/span&gt;
 *          &lt;/span&gt;
 *     &lt;/div&gt;
 * </code>
 *
 * Settings can either be specified directly or via data-efcargs attribute.
 * The following properties can be specified: <br />
 * - path                      - Source path - url to fetch the autosuggestions from.
 *                               Default value is '/suggest/keyword'; <br />
 *
 * - additional-suggestions-path - Source path - url to fetch the additional suggestions from.
 *                               Default value is '/suggest/skills'; <br />
 *
 * - wrapper-selector          - selector for element, wrapping input field. Has fixed width. <br />
 *                               Default value is '.multi-select-wrapper' ;<br/>
 *
 * - inner-wrapper-selector    - selector for element, wrapping input field. Resides inside wrapper
 *                               and has a fluid width;<br />
 *                               Default value is '.multi-select-inner-wrapper' ;<br/>
 *
 * - min-length                - The default minimum number of characters a user must type before a search is performed.
 *                               Zero is useful for local data with just a few items, but a higher value should be
 *                               used when a single character search could match a few thousand items.<br />
 *                               Default value is 3.<br />
 *
 * - cn-min-length             - The mandarin minimum number of characters a user must type before a search is performed.
 *
 * - delay                     - The delay in milliseconds between when a keystroke occurs and when a search is
 *                               performed. A zero-delay makes sense for local data (more responsive), but can
 *                               produce a lot of load for remote data, while being less responsive.<br />
 *                               Default value is 300.<br />
 *
 * - selected-tag-animation-period - Period of time the selected tag is moved from suggestions popup to input field.
 *
 * - tooltip-delay             - Delay showing and hiding the tooltip to additional suggestions, which are longer then
 *                               the available space(ms) - does not apply to manual trigger type<br />
 *                               Default value is 200.<br />
 *
 * - tooltip-placement         - How to position the tooltip - top | bottom | left | right | auto. <br />
 *                               Default value is 'right'.<br />
 *
 * - items                     - The max number of items to display in the dropdown.
 *                               Default value is 10.<br />
 *
 * - scroll-increment          - Number of pixels to shift the inner wrapper by on each click.
 *                               Default value is 50.<br />
 *
 * - scroll-duration           - Duration of time the inner wrapper shift in.
 *                               Default value is 300 ms.<br />
 *
 * - additional-suggestions-fade-duration. A string or number determining how long the animation of fade will run.
 *                               Default value is 300 ms.<br />
 *
 * - input-selector            - selector for the input field to type in <br />
 *                               Default value is '.multi-select-input'.<br />
 *
 * - hidden-input-selector     - selector for hidden input field where the selected value
 *                               will be stored as string;
 *                               For example, if 'java' and 'c++' are selected, then this field will contain value
 *                               'java,c++'; <br />
 *                               Default value is '.multi-select-hidden-input'.<br />
 *
 * - additional-suggestions-popup-selector - selector for additional suggestions popup.
 *                               Default value is '.additional-suggestions-popup'.<br />
 *
 * - additional-suggestions-container-selector - selector for additional suggestions popup.
 *                               Default value is '.additional-suggestions-container'.<br />
 *
 * - additional-suggestions-item-class - class name for additional suggestions item.
 *                               Default value is 'additional-suggestions-item'.<br />
 *
 * - additional-suggestions-close-selector - selector for additional suggestions 'close' button.
 *                               Default value is '.additional-suggestions-close'.<br />
 *
 * - plugin-class              - class to be added to container.<br />
 *                               Default value is 'multi-select'.<br />
 *
 * - multi-select-move-right-class  - class to be added to show right arrow.<br />
 *                               Default value is 'multi-select-move-right'.<br />
 *
 * - multi-select-move-left-class  - class to be added to show left arrow.<br />
 *                               Default value is 'multi-select-move-left'.<br />
 *
 * - selected-keyword-class    - class name for div element, which will represent selected keyword;<br />
 *                               Default value is 'remove-selected-keyword'.<br />
 *
 * - selected-keyword-template - html template for element, which will represent selected keyword<br />
 *
 * - additional-suggestion-template - html template for element, which will represent a separate additional suggestion<br />
 *
 * - additional-suggestions-popup-template - html template for additional suggestions popup<br/>
 *
 * - multi-select-selected-keyword-animation-class - Class for wrapper to animate selection of a tag.<br />
 *
 * - invoke-additional-suggestions - flag that indicates is should be displayed additional suggestions.<br />
 *
 * - multiple-valued-hidden-input-template - template for creation hidden inputs for multi-valued data.<br />
 *
 * - multiple-valued-hidden-input-id - main part of attribute 'name' of 'input' tag, that contains Id-value.<br />
 * 										Needs for correct initialization of Restore Manager.<br />
 *
 * - multiple-valued-hidden-input-value - main part of attribute 'name' of 'input' tag, that contains Name-value.<br />
 * 											Needs for correct initialization of Restore Manager.<br />
 *
 * - autocomplete-path-type - type of autocomplete. Needs to detect suggestions path. Possible values see in fo.config.autocompletePaths.<br />
 *
 * - request-on-focus - indicates that need to send request to server on input focus.<br />
 */
(function ($) {
    'use strict';

    /**
     * Plugin definition;
     * Settings can either be specified directly or via data-efcargs attribute.
     *
     * @param settings Set of options.
     * @returns {*}
     */
    $.fn.multiSelectAutocomplete = function (settings) {

        var
            /**
             * Utils object
             *
             * @type {{}}
             */
            utils = $.fn.multiSelectAutocomplete.utils,

            /**
             * Set of classes
             *
             * @type {classes|{}}
             */
            classes = $.fn.multiSelectAutocomplete.classes,

            /**
             * Factory methods for objects creation
             *
             * @type {{buildAdditionalSuggestionProcessor: buildAdditionalSuggestionProcessor, buildSuggestionRetrieverComponent: buildSuggestionRetrieverComponent, buildRestoreManager: buildRestoreManager}|*}
             */
            factory = $.fn.multiSelectAutocomplete.factory,

            /**
             * Reference to fo.
             *
             * @type {Window.fo|*|{}|*|window.fo|{}}
             */
            fo = window.fo || {
                config: {
                    autocompletePaths: {}
                }
            },

            /**
             * Logger reference.
             *
             * @type {Window.logger|*}
             */
            logger = fo.logger || {
                log: $.noop,
                error: $.noop
            };

        return this.each(function () {

            /* private fields and functions declaration */
            var
                /**
                 * Plugin container
                 * @type {*|HTMLElement}
                 */
                container = $(this),

                /**
                 * Plugin options - default values, extended by the user definitions.
                 */
                options = $.extend({}, $.fn.multiSelectAutocomplete.defaults, {
                    "path": fo.config.autocompletePaths[container.data('efcargs')['autocomplete-path-type']],
                    "additional-suggestions-path": fo.config.autocompletePaths.additionalSkills
                }, settings || container.data('efcargs')),

                /**
                 * Input field to bind bootstrap typeahead to.
                 */
                input = container.find(options['input-selector']),

                /**
                 * Hidden field to store the selected values to.
                 */
                hiddenInput = container.find(options['hidden-input-selector']),

                /**
                 * Wrapper for input fields and tags
                 */
                wrapper = container.find(options['wrapper-selector']),

                /**
                 * Wrapper for input fields and tags
                 */
                innerWrapper = container.find(options['inner-wrapper-selector']),

                /**
                 * Loading indicator container to show during ajax call.
                 */
                loadingIndicatorContainer = container.find(options['loading-indicator-container-selector']),

                /**
                 * Clear button to clear current selection.
                 */
                clear = container.find(options['multi-select-clear-selector']),

                /**
                 * Values cache.
                 * Once the keyword is entered and suggestions returned for it, it will be cached
                 * so that on all subsequent calls for the same keyword no request is performed.
                 *
                 * @type {{}}
                 */
                autocompleteSuggestionsCache = {},

                /**
                 * Additional suggestions cache.
                 * Once the keyword is entered and suggestions returned for it, it will be cached
                 * so that on all subsequent calls for the same keyword no request is performed.
                 *
                 * @type {{}}
                 */
                additionalSuggestionsCache = {},

                /**
                 * Timeout between when a keystroke occurs and when a search is performed
                 */
                timeout,

                /**
                 * Autocomplete suggestions processor.
                 *
                 * @type {jQuery.fn.multiSelectAutocomplete.classes.AutocompleteSuggestionsProcessor}
                 */
                autocompleteSuggestionsProcessor = factory.buildAdditionalSuggestionProcessor(options),

                /**
                 * Additional suggestions processor.
                 *
                 * @type {jQuery.fn.multiSelectAutocomplete.classes.AdditionalSuggestionsProcessor}
                 */
                additionalSuggestionsProcessor = new classes.AdditionalSuggestionsProcessor(),

                /**
                 * Scroll manager which operates on scroll
                 *
                 * @type {jQuery.fn.multiSelectAutocomplete.classes.ScrollComponent}
                 */
                scrollComponent = new classes.ScrollComponent(wrapper, innerWrapper, input, options),

                /**
                 * Restore manager to restore values from hidden input field.
                 *
                 * @type {jQuery.fn.multiSelectAutocomplete.classes.RestoreManager}
                 */
                restoreManager = factory.buildRestoreManager(hiddenInput, input, innerWrapper, options),

                /**
                 * Selected tag manager to operate on selected tags.
                 *
                 * @type {jQuery.fn.multiSelectAutocomplete.classes.SelectedTagComponent}
                 */
                selectedTagComponent = new classes.SelectedTagComponent(input, innerWrapper, options),

                /**
                 * Additional suggestions component.
                 *
                 * @type {jQuery.fn.multiSelectAutocomplete.classes.AdditionalSuggestionsComponent}
                 */
                additionalSuggestionsComponent = new classes.AdditionalSuggestionsComponent(container, wrapper, options),

                /**
                 * Input component which is responsible for handing event on input field and processing them.
                 *
                 * @type {jQuery.fn.multiSelectAutocomplete.classes.InputComponent}
                 */
                inputComponent = new classes.InputComponent(input, options),

                /**
                 * ClearComponent
                 *
                 * @type {jQuery.fn.multiSelectAutocomplete.classes.ClearComponent}
                 */
                clearComponent = new classes.ClearComponent(clear, options),

                /**
                 *
                 *
                 * @type {jQuery.fn.multiSelectAutocomplete.classes.BaseSuggestionRetrieverComponent}
                 */
                suggestionRetrieverComponent = factory.buildSuggestionRetrieverComponent(options),

                /**
                 * RelatedSkillTracking
                 *
                 * @type {classes.RelatedSkillTracking}
                 */
                relatedSkillTracking = new classes.RelatedSkillTracking(),

                /**
                 * Chosen tag navigation component for handing event on tags navigation.
                 *
                 * @type {classes.ChosenTagsNavigationComponent}
                 */
                chosenTagsNavigationComponent = new classes.ChosenTagsNavigationComponent(container, input),

                /**
                 * Initializes container
                 */
                initContainer = function () {
                    container.addClass(options['plugin-class']);

                    /* trick to freeze wrapper width */
                    if (wrapper.is(":visible")) {
                        wrapper.width(wrapper.width());
                        input.width(input.width());
                    }
                },

                /**
                 * Last keyword selected from autocomplete.
                 * This is required to track skill name selected from autocomplete, not related skill name
                 * selected from additional suggestions list.
                 */
                lastSelectedKeyword;

            /* plugin logic goes here */

            utils.checkDependencies();
            utils.checkDomElementPresence(input, options['input-selector']);
            utils.checkDomElementPresence(hiddenInput, options['hidden-input-selector']);
            utils.checkDomElementPresence(wrapper, options['wrapper-selector']);
            utils.checkDomElementPresence(innerWrapper, options['inner-wrapper-selector']);

            initContainer();

            /* when value is restored from input field, corresponding tag should be added */
            restoreManager.onRestore(function (value, id) {
                selectedTagComponent.addSelectedAndReturn(value, id);
            });

            /* when tag is added, scroll should became visible */
            selectedTagComponent.onTagAdd(function () {
                scrollComponent.adjustTagsVisibility(false, false);
                scrollComponent.refresh();
                inputComponent.focus();
            });

            /* when tag is removed, scroll should be refreshed and value in hidden input field should be synchronized */
            selectedTagComponent.onTagRemove(function (value) {
                scrollComponent.adjustTagsVisibility(false, true);
                scrollComponent.refresh();
                restoreManager.onValueChanged();
                additionalSuggestionsComponent.onSuggestionShouldAppear(value);
                inputComponent.focus();
            });

            /* when item is selected from additional suggestions component, should add a tag and notify restore manager about value change */
            additionalSuggestionsComponent.onItemSelect(function (item, suggestion) {
                var selected = selectedTagComponent.addInvisibleSelectedAndReturn(item), // will trigger onTagAdd event
                    animator = new classes.SelectedTagMoveAnimationComponent(suggestion, selected, item, options);

                restoreManager.onValueChanged();
                animator.onAnimationEnd(function () {
                    selectedTagComponent.showInvisibleSelected(selected);
                });
                animator.animate();
                relatedSkillTracking.trackSkillSelection(lastSelectedKeyword);
            });

            /* when clear button is clicked, then everything should be cleared */
            clearComponent.onClear(function () {
                inputComponent.clear();
                selectedTagComponent.removeAll();
                restoreManager.onValueChanged();
                scrollComponent.adjustTagsVisibility(false, true);
                scrollComponent.refresh();
                inputComponent.focus();
            });

            /*
                processing item selection from autocomplete list:
                - should send a request to retrieve additional suggestions
                - should clear input field
                - should add the corresponding selected tag or merge if current input starts with 'and '
                - notify restore manager about value change
                - fix focus issue in IE
             */
            inputComponent.onItemSelectFromAutocomplete(function (value, inputValue, id) {
                suggestionRetrieverComponent.retrieveRelatedSuggestions(options['additional-suggestions-path'], value, additionalSuggestionsCache, options, false, additionalSuggestionsProcessor, function (suggestions) {
                    additionalSuggestionsComponent.show(suggestions);
                }, loadingIndicatorContainer);

                inputComponent.clear();
                if (!utils.getAndPattern().test(inputValue)) {
                    selectedTagComponent.addSelectedAndReturn(value, id);
                } else {
                    selectedTagComponent.mergeWithLastSelectedAndReturn(" and " + value);
                }

                restoreManager.onValueChanged();
                lastSelectedKeyword = value;
            });

            /*
               Source for autocomplete list retrieve
             */
            inputComponent.onAutocompleteSourceRetrieve(function (query, process) {
                suggestionRetrieverComponent.retrieveSuggestions(options.path, query.replace(utils.getAndPattern(), ""), autocompleteSuggestionsCache, options, true, autocompleteSuggestionsProcessor, process, loadingIndicatorContainer);
            });

            /* fix for case when initially keyword search is hidden - then it's width is wrong. */
            inputComponent.onFocus(function () {
                wrapper.width(wrapper.width());
            });

            if (options['request-on-focus'] === true) {
                inputComponent.onFocus(function () {
                    suggestionRetrieverComponent.retrieveSuggestions(options.path, "", autocompleteSuggestionsCache, options, true, autocompleteSuggestionsProcessor, function() {}, loadingIndicatorContainer);
                });
            }

            /*
             1.1 If the user types any keywords in the Search field, does not select from the typeahead and
             clicks away from the field, the keywords should become a tag.
             */
            inputComponent.onBlur(function (keyword) {
                if (!utils.getAndPattern().test(keyword)) {
                    selectedTagComponent.addSelectedAndReturn(keyword);
                } else {
                    selectedTagComponent.mergeWithLastSelectedAndReturn(keyword.replace(utils.getAndPattern(), " and "));
                }

                inputComponent.clear();
                restoreManager.onValueChanged();
            });

            inputComponent.onStartTyping(function () {
                /* dynamically update hidden input value */
                restoreManager.onValueChanged();

                /*
                 hide suggestions popup on any button click(tab button is included). Will satisfy 2 requirements at once:
                 1.2 The related terms fly-out should disappear if the user performs the following actions:
                 user tabs to the next field
                 keeps on typing another skill after selecting from the typeahead
                 */
                additionalSuggestionsComponent.hide();

                scrollComponent.scrollToStartFromInput();
                scrollComponent.refresh();
            });

            inputComponent.onBackspace(function () {
                /*
                 3. A NICE TO HAVE PLEASE GUESTIMATE SEPARATELY
                 The user should be able to use keyboard actions in the search field to perform actions:
                 BACKSPACE will delete the tag before cursor
                 */
                selectedTagComponent.removeLast();
            });

            chosenTagsNavigationComponent.onSelectPrevTag(function () {
                selectedTagComponent.selectPrevTag();
                scrollComponent.scrollToNavigatedTag();
            });

            chosenTagsNavigationComponent.onSelectNextTag(function () {
                selectedTagComponent.selectNextTag();
                scrollComponent.scrollToNavigatedTag();
            });

            chosenTagsNavigationComponent.onInputFocus(function () {
                selectedTagComponent.focusInputField();
            });

            chosenTagsNavigationComponent.onBackspaceToNavgateTag(function () {
                selectedTagComponent.removeNavigatedTag();
            });

            chosenTagsNavigationComponent.onTabFromNavigatedTag(function () {
                selectedTagComponent.navigateFromInput();
            });

            /* and now initializing managers */
            scrollComponent.init();
            selectedTagComponent.init();
            restoreManager.init();
            additionalSuggestionsComponent.init();
            clearComponent.init();
            inputComponent.init();
            chosenTagsNavigationComponent.init();

            /*
             1.2 The related terms fly-out should disappear if the user performs the following actions:
             clicks the search or location field or anywhere outside the plugin
             */
            $(document).click(function (e) {
                var target = $(e.target),
                    isSelectedTag = (
                        target.hasClass(options['selected-keyword-class']) ||
                        target.hasClass(options['remove-selected-keyword-class'])
                    );

                if (!isSelectedTag && target.parents("." + options['plugin-class']).length === 0) {
                    // clicked outside plugin
                    additionalSuggestionsComponent.hide();
                }
            });
        });
    };

    /**
     * Set of utils.
     *
     * @static
     * @type {{}}
     */
    $.fn.multiSelectAutocomplete.utils = {

        /**
         * Index used to generate next number
         */
        index: 0,

        /**
         * Checks dependencies presence:
         * - bootstrap-typeahead
         * - bootstrap-tooltip
         */
        checkDependencies: function () {
            if (!$.fn.typeahead) {
                throw new Error("Bootstrap-typeahead dependency is not available");
            }

            if (!$.fn.tooltip) {
                throw new Error("Bootstrap-tooltip dependency is not available");
            }
        },

        /**
         * Checks that jQuery object references to a non-empty set of dom elements.
         *
         * @param element  {jQuery} jQuery reference to element.
         * @param selector {String} Selector to get the specified element
         * @throws Error if elements set is empty
         */
        checkDomElementPresence: function (element, selector) {
            if (!element || !element.length) {
                throw new Error("No element were found by selector " + selector);
            }
        },

        /**
         * Checks object for non-null.
         *
         * @param object Object to check.
         */
        assertNotNull: function (object) {
            if (!object) {
                throw new Error("Object is not defined !");
            }
        },

        /**
         * Notifies listeners.
         * Arguments are passed after the array of listeners.
         *
         * @param listeners             An array of listeners.
         * @param {...object} var_args  Arguments to be passed to listeners.
         */
        notifyListeners: function (listeners, /*...[object]*/ var_args) {
            var args = Array.prototype.slice.call(arguments, 1);

            $.each(listeners, function (j, listener) {
                if (typeof listener === "function") {
                    listener.apply(null, args);
                }
            });
        },

        /**
         * Generates next number
         */
        generateNext: function () {
            return $.fn.multiSelectAutocomplete.utils.index++;
        },

        /**
         * Static reference to 'and' pattern.
         *
         * @static
         */
        getAndPattern: function () {
            return (/\s*and\s+/gm);
        },

        /**
         * Checks whether the browser is ie or not.
         *
         * @returns {boolean} True if it is IE browser and false otherwise.
         */
        isIE: function () {
            var _ref = $('.ie-checker'),
                _ua = navigator.userAgent,
                _checker = _ref.length > 0 ? _ref : this.getIeCheckerElement(),
                _isIE9OrLess = _checker.children('.ie').length > 0,
                _isIE10 = new RegExp('msie\\s10', 'i').test(_ua),
                _isIE11 = !!_ua.match(/Trident.*rv\:11\./);

            return _isIE9OrLess || _isIE10 || _isIE11;
        },

        /**
         * Gets jQuery referense to IE checker element.
         *
         * @returns {*}
         */
        getIeCheckerElement: function () {
            var _html = "<span class='ie-checker'>"
                + "<!--[if lt IE 7 ]> <span class='ie ie6'></span> <![endif]-->"
                + "<!--[if IE 7 ]>    <span class='ie ie7'></span> <![endif]-->"
                + "<!--[if IE 8 ]>    <span class='ie ie8'></span> <![endif]-->"
                + "<!--[if IE 9 ]>    <span class='ie ie9'></span> <![endif]-->"
                + "</span>";

            return $(_html).appendTo($('body'));
        }
    };

    /**
     * Set of classes declarations.
     *
     * @type {{}}
     */
    $.fn.multiSelectAutocomplete.classes = (function () {

        /**
         * Suggestions processor interface.
         *
         * @constructor
         * @class SuggestionsProcessor
         */
        function SuggestionsProcessor() {

        }

        /**
         * Abstract suggestions processor.
         *
         * @param response Response from server
         */
        SuggestionsProcessor.prototype.process = function (response) {};

        /* Autocomplete suggestions processor */

        /**
         * SuggestionsProcessor implementation for autocomplete.
         *
         * @constructor
         * @class AutocompleteSuggestionsProcessor
         * @extends {SuggestionsProcessor}
         */
        function AutocompleteSuggestionsProcessor() {

        }
        AutocompleteSuggestionsProcessor.prototype = new SuggestionsProcessor();

        /**
         *
         * Suggestions processor.
         * processes the response from server and transforms it to an array of suggestion values.
         *
         * Currently, suggestions format from server is :
         * [
         *  {"id":"0","frequency":"7","displayName":"corporate","source":"termsSectorNames"},
         *  {"id":"1","frequency":"4","displayName":"corporate banking","source":"termsSectorNames"}
         * ].
         * An array of "displayName"-s will be created.
         *
         * @override
         * @param response {JSON} Response from server
         * @return {Array} An array of suggestion values, i.e. ["corporate", "corporate banking"].
         */
        AutocompleteSuggestionsProcessor.prototype.process = function (response) {
            return $.map(response || [], function (item) {
                return item.displayName || "";
            });
        };

        /* Additional suggestions processor */

        /**
         * SuggestionsProcessor implementation for additional suggestions popup.
         *
         * @constructor
         * @class AdditionalSuggestionsProcessor
         * @extends {SuggestionsProcessor}
         */
        function AdditionalSuggestionsProcessor() {

        }
        AdditionalSuggestionsProcessor.prototype = new SuggestionsProcessor();

        /**
         * Additional suggestions processor.
         * Processes the response from server and transforms it to an array of suggestion values.
         *
         * Currently, suggestions format from server is :
         *
         * [
         *  {"strength":99,"name":"JNDI","description":"JNDI description"},
         *  {"strength":94,"name":"Web-Sphere 6.0", "description":"Web-Sphere 6.0 description"},
         *  {"strength":84,"name":"Java Servlets", "description":"Java Servlets description"}}
         * ].
         * An array of names will be created.
         *
         * @override
         * @param response {JSON} Response from server
         * @return {Array} An array of suggestion values and trengths, i.e. ["JNDI", "Web-Sphere 6.0", "Java Servlets"].
         */
        AdditionalSuggestionsProcessor.prototype.process = function (response) {
            return $.map(response || [], function (item) {
                return {
                    'name': item.name || "",
                    'strength': item.strength || 0,
                    'description' : item.description || ""
                };
            });
        };

        /**
         * SuggestionsProcessor implementation for location suggestions popup.
         *
         * @constructor
         * @class LocationSuggestionsProcessor
         * @extends {SuggestionsProcessor}
         */
        function LocationSuggestionsProcessor() {

        }
        LocationSuggestionsProcessor.prototype = new SuggestionsProcessor();

        /**
         * Location suggestions processor.
         * Processes the response from server and transforms it to an array of suggestion values.
         *
         * Currently, suggestions format from server is :
         *
         * [
         *  {"id":256565,"displayName":"London, Uk","name":"London"},
         *  {"id":145548,"displayName":"Minsk, Belarus, Uk","name":"Minsk"},
         *  {"id":346465,"displayName":"Moscow, Russia","name":"Moscow"},
         * ].
         * An array of names will be created.
         *
         * @override
         * @param response {JSON} Response from server
         * @return {Array} An array of suggestion values and trengths.
         */
        LocationSuggestionsProcessor.prototype.process = function (response) {
            return $.map(response || [], function (item) {
                return {
                    'id': item.id || 0,
                    'displayName': item.displayName || ""
                };
            });
        };

        /* Scroll manager*/
        /**
         * Scroll manager which is responsible for scrolling to the right and to the left.
         * Interface provides the following methods:
         * - init - initializes manager and binds event listeners.
         * = refresh - updates the state
         *
         * @param outerWrapper  Outer plugin wrapper whose width is fixed.
         * @param innerWrapper  Inner wrapper whose width equals to the content width.
         * @param input         Input field binded to bootstrap typeahead plugin.
         * @param options       Plugin options.
         * @constructor
         * @class ScrollComponent
         */
        function ScrollComponent(outerWrapper, innerWrapper, input, options) {
            $.fn.multiSelectAutocomplete.utils.checkDomElementPresence(outerWrapper, options['wrapper-selector']);
            $.fn.multiSelectAutocomplete.utils.checkDomElementPresence(innerWrapper, options['inner-wrapper-selector']);
            $.fn.multiSelectAutocomplete.utils.checkDomElementPresence(input, options['input-selector']);

            /**
             * Outer plugin wrapper whose width is fixed.
             *
             * @property
             * @type {jQuery}
             */
            this.outerWrapper = outerWrapper;

            /**
             * Inner wrapper whose width equals to the content width.
             *
             * @property
             * @type {jQuery}
             */
            this.innerWrapper = innerWrapper;

            /**
             * Input field binded to bootstrap typeahead plugin.
             *
             * @property
             * @type {jQuery}
             */
            this.input = input;

            /**
             * Fixed width of the outer wrapper
             */
            this.wrapperWidth = outerWrapper.width();

            /**
             * Options object.
             */
            this.options = options;

            /**
             * Scroll to the right control.
             *
             * @property
             * @type {jQuery}
             */
            this.moveRightControl = null;

            /**
             * Scroll to the left control.
             *
             * @property
             * @type {jQuery}
             */
            this.moveLeftControl = null;
        }

        /**
         * Scroll manager functionality
         *
         * @type {{init: init, refresh: refresh, _scrollByStaticIncrement: _scrollByStaticIncrement}}
         */
        ScrollComponent.prototype = {

            /**
             * Initializes plugin, right and left controls, and binds click listener to them.
             * Also, updates their ui state if they should be visible.
             *
             * @method
             * @public
             * @throws Error if left or right control is not found.
             */
            init: function () {
                var _this = this;

                this.moveRightControl = this.outerWrapper.next();
                $.fn.multiSelectAutocomplete.utils.checkDomElementPresence(this.moveRightControl, "this.outerWrapper.next()");

                this.moveLeftControl = this.outerWrapper.prev();
                $.fn.multiSelectAutocomplete.utils.checkDomElementPresence(this.moveRightControl, "this.outerWrapper.prev()");

                this.moveLeftControl.click(function () {
                    if (!$(this).hasClass(_this.options['multi-select-move-disabled-class'])) {
                        _this._scrollByStaticIncrement(ScrollComponent.constants.direction.LEFT);
                    }
                });
                this.moveRightControl.click(function () {
                    if (!$(this).hasClass(_this.options['multi-select-move-disabled-class'])) {
                        _this._scrollByStaticIncrement(ScrollComponent.constants.direction.RIGHT);
                    }
                });

            },

            /**
             * Function which detects whether the move controls are necessary and shows or hides them.
             *
             *  - Shows 'scroll to the right' arrow only if any tag is selected;
             *  - Shows 'scroll to the left' arrow if margin-left property is not 0, i.e. inner wrapper
             *    is shifted to the right;
             *
             * @method
             * @public
             */
            refresh: function () {
                var shift = parseInt(this.innerWrapper.css("margin-left"), 10);

                this.moveRightControl.removeClass(this.options['multi-select-move-disabled-class']);

                if (this.innerWrapper.find("." + this.options['selected-keyword-class']).length) {
                    this.moveRightControl.addClass(this.options['multi-select-move-right-class']);
                } else {
                    this.moveRightControl.removeClass(this.options['multi-select-move-right-class']);
                }

                if (shift < 0) {
                    this.moveLeftControl.addClass(this.options['multi-select-move-left-class']);
                } else {
                    this.moveLeftControl.removeClass(this.options['multi-select-move-left-class']);
                }

                /* if scrolled to the end, then should disable right arrow */
                if (this.input.offset().left + shift <= this.input.parent().offset().left) {
                    this.moveRightControl.addClass(this.options['multi-select-move-disabled-class']);
                }
            },

            /**
             * Makes at least one tag visible.
             * Calculates total selected tags width(with margins) and width of the last tag.
             * Wrapper margin left corresponds to current shift and is negative. For instance,
             * if we scrolled right to 50px, then margin-left is -50px.
             *
             * In this case, checks, that if absolute margin-left value is greater than total selected tags width,
             * then it means that no one tag is visible.
             *
             * The algorithm aims to have the input field position unchanged all the time after auto-scroll operations.
             *
             * @method
             * @param skipLeft {Boolean}   Indicates that the left bound check should be skipped
             * @param skipRight {Boolean}  Indicates that the right bound check should be skipped
             */
            adjustTagsVisibility: function (skipLeft, skipRight) {
                var totalSelectedTagsWidth = 0,
                    currentShift = parseInt(this.innerWrapper.css("margin-left"), 10),
                    selectedTags = this.innerWrapper.find("." + this.options['selected-keyword-class']),
                    percent = this.options['space-available-for-tags-in-percent'],
                    lastWidth = 0;

                selectedTags.each(function () {
                    lastWidth = $(this).outerWidth(true);
                    totalSelectedTagsWidth += lastWidth;
                });

                if (!skipLeft && totalSelectedTagsWidth - lastWidth + currentShift < 0) { // all tags are hidden or last tag is not visible totally
                    this.innerWrapper.css({
                        "margin-left": selectedTags.length > 0 ? Math.min(currentShift + lastWidth, 0) : 0
                    });
                } else if (!skipRight && totalSelectedTagsWidth + currentShift >= percent * this.wrapperWidth) { // tags exceed field width
                    this.innerWrapper.css({
                        "margin-left":  Math.max(currentShift - lastWidth, lastWidth - totalSelectedTagsWidth)
                    });
                }

            },

            /**
             * Performs a scroll so that all tags are hidden and only input field is visible.
             * Will be performed on tyoing start so that input field is never hidden when user types.
             */
            scrollToStartFromInput: function () {
                var totalSelectedTagsWidth = 0,
                    selectedTags = this.innerWrapper.find("." + this.options['selected-keyword-class']),
                    percent = 0.3,
                    lastWidth = 0;

                selectedTags.each(function () {
                    lastWidth = $(this).outerWidth(true);
                    totalSelectedTagsWidth += lastWidth;
                });

                this.innerWrapper.css({
                    "margin-left":  Math.min(-1 * totalSelectedTagsWidth + percent * this.wrapperWidth, 0)
                });
            },

            /**
             * Function to scroll the inner wrapper to the right by the pre-specified amount of pixels;
             *
             * Gets the total width of the selected tags and if current shift does not exceed it,
             * increments shift to the specified value;
             *
             * If ...... to add....
             *
             * @method
             * @private
             * @param direction Specifies where to move: positive number corresponds to the right,
             *                  negative - to the left;
             */
            _scrollByStaticIncrement: function (direction) {
                var totalSelectedTagsWidth = 0,
                    increment = direction * this.options['scroll-increment'], // 50 px increment per click
                    toMargin,
                    currentShift,
                    selectedTags;

                selectedTags = this.innerWrapper.find("." + this.options['selected-keyword-class']);
                selectedTags.each(function () {
                    totalSelectedTagsWidth += $(this).outerWidth(true);
                });
                currentShift = parseInt(this.innerWrapper.css("margin-left"), 10);

                if (direction === ScrollComponent.constants.direction.RIGHT && -1 * currentShift < totalSelectedTagsWidth) {
                    toMargin = -1 * Math.min(-1 * currentShift + increment, totalSelectedTagsWidth);
                } else if (direction === ScrollComponent.constants.direction.LEFT && currentShift < 0) {
                    toMargin = -1 * Math.max(-1 * currentShift + increment, 0);
                } else {
                    return;
                }

                this._doAnimatedScroll(toMargin);
            },

            /**
             * Function which allows to perform an animated scroll.
             *
             * @param margin   Margin left to be specified for the element.
             * @private
             */
            _doAnimatedScroll: function (margin) {
                this.innerWrapper.stop(true, true).animate({
                    "margin-left": margin
                },  {
                    duration: this.options['scroll-duration'],
                    complete: $.proxy(this.refresh, this)
                });
            },

            scrollToNavigatedTag: function () {
                var totalSelectedTagsWidth = 0,
                    selectedTags = this.innerWrapper.find("." + this.options['selected-keyword-class']),
                    selectedTag = this.innerWrapper.find("." + this.options['selected-tag-class']),
                    prevTags = selectedTag.prevAll(),
                    percent = 0.3,
                    lastWidth = 0;

                prevTags.each(function () {
                    lastWidth = $(this).outerWidth(true);
                    totalSelectedTagsWidth += lastWidth;
                });

                this.innerWrapper.css({
                    "margin-left":  Math.min(-1 * totalSelectedTagsWidth + percent * this.wrapperWidth, 0),
                    "transition": "all 0.5s ease-in-out"
                });
            }
        };

        /**
         * Scroll component constants.
         *
         * @static
         */
        ScrollComponent.constants = {

            /**
             * Specified scroll direction
             */
            direction: {
                /**
                 * Scroll to the right
                 */
                RIGHT: 1,

                /**
                 * Scroll to the left
                 */
                LEFT: -1
            }
        };

        /* Selected tag manager */
        /**
         * SelectedTag manager which aim is to operate on selected tags.
         *
         * @param input         Input field binded to bootstrap typeahed plugin
         * @param innerWrapper  Inner wrapper whose width equals to the content width.
         * @param options       Plugin options.
         * @constructor
         * @class SelectedTagComponent
         */
        function SelectedTagComponent(input, innerWrapper, options) {
            $.fn.multiSelectAutocomplete.utils.checkDomElementPresence(input, options['input-selector']);
            $.fn.multiSelectAutocomplete.utils.checkDomElementPresence(innerWrapper, options['inner-wrapper-selector']);

            /**
             * Input field binded to bootstrap typeahead plugin.
             *
             * @property
             * @type {jQuery}
             */
            this.input = input;

            /**
             * Inner wrapper whose width equals to the content width.
             *
             * @property
             * @type {jQuery}
             */
            this.innerWrapper = innerWrapper;

            /**
             * Options object.
             */
            this.options = options;

            /**
             * A map, where the key is the keyword and value is a generated unique number;
             *
             * @type {{}}
             */
            this.selectedKeywordsMap = {};

            /**
             * An array of functions, listening to 'add tag' event;
             *
             * @type {Array}
             */
            this.addTagListeners = [];

            /**
             * An array of functions, listening to 'remove tag' event;
             *
             * @type {Array}
             */
            this.removeTagListeners = [];
        }

        /**
         * Selected tag component API.
         *
         * @type {{init: init, removeSelected: removeSelected, removeAll: removeAll, removeLast: removeLast, addSelectedAndReturn: addSelectedAndReturn, addInvisibleSelectedAndReturn: addInvisibleSelectedAndReturn, showInvisibleSelected: showInvisibleSelected, onTagAdd: onTagAdd, onTagRemove: onTagRemove}}
         */
        SelectedTagComponent.prototype = {

            /**
             * Initializes manager
             */
            init: function () {
                var _this = this;

                if (window.fo && window.fo.eventHandler) {
                    window.fo.eventHandler.subscribe(window.fo.eventHandler.events.FILTERS_RESET, function () {
                        if (_this.options['remove-tags-on-filters-reset']) {
                            _this.removeAll();
                        }
                    });
                }
            },

            /**
             * Removes selected value from selected tags.
             *
             * @param value         Value to remove
             * @param index         Element index. Index is associated with the corresponding value.
             * @param skipAnimation Whether to skip animation or not
             */
            removeSelected: function (value, index, skipAnimation) {
                var i = (typeof index !== 'undefined') ? index : this.selectedKeywordsMap[value];

                if (skipAnimation) {
                    this.innerWrapper.find('.' + this.options['selected-keyword-class'] + '-' + i).remove();
                    $.fn.multiSelectAutocomplete.utils.notifyListeners(this.removeTagListeners, value);
                } else {
                    this._animateRemoval(this.innerWrapper.find('.' + this.options['selected-keyword-class'] + '-' + i),
                        function () {
                            $.fn.multiSelectAutocomplete.utils.notifyListeners(this.removeTagListeners, value);
                        });
                }

                delete this.selectedKeywordsMap[value];
            },

            /**
             * Function to remove all selected tags
             */
            removeAll: function () {
                $.each(this.innerWrapper.find('.' + this.options['remove-selected-keyword-class']), function () {
                    $(this).data("skipAnimate", true).click();
                });
            },

            /**
             * Function to remove the last tag in the list.
             */
            removeLast: function () {
                var tag = this.innerWrapper.find('.' + this.options['selected-keyword-class']).last(),
                    value;

                if (tag.length) {
                    value = tag.html();

                    delete this.selectedKeywordsMap[value];
                    this._animateRemoval(tag, function () {
                        $.fn.multiSelectAutocomplete.utils.notifyListeners(this.removeTagListeners, value);
                    });
                }
            },

            /**
             * Adds tag for selected value and updates value in the input field and returns the added element.
             *
             * @param value Selected value
             * @param id    Identifier of selected value
             * @returns jQuery reference to created element
             */
            addSelectedAndReturn: function (value, id) {
                var _this = this,
                    html = this.options['selected-keyword-template'].replace(/\{value\}/gim, value).replace(/\{id\}/gim, id || "0"),
                    index = $.fn.multiSelectAutocomplete.utils.generateNext(),
                    selected;

                this.selectedKeywordsMap[value] = index;
                selected = $(html)
                    .insertBefore(this.input)
                    .addClass(this.options['selected-keyword-class'] + '-' + index);

                selected
                    .find('.' + this.options['remove-selected-keyword-class'])
                    .click(function () {
                        _this.removeSelected(value, index, $(this).data("skipAnimate") || false);
                    });

                if (window.fo && window.fo.eventHandler) {
                    window.fo.eventHandler.subscribe(window.fo.eventHandler.events.SELECTED_FILTER_REMOVED, function (event, filter) {
                        if (id === filter) {
                            _this.removeSelected(value, index, true);
                        }
                    });
                }

                $.fn.multiSelectAutocomplete.utils.notifyListeners(this.addTagListeners, value);

                return selected;
            },

            /**
             * Merges the specified value with the last entered tag and returns the
             *
             * @param value
             */
            mergeWithLastSelectedAndReturn: function (value) {
                var lastTag = this.innerWrapper.find("." + this.options['selected-keyword-class']).last(),
                    lastTagValue = lastTag.text(),
                    detachedElements,
                    mergedTagValue = "";

                if (lastTag.length === 1) { // updating last tag
                    mergedTagValue = lastTagValue + value;
                    this.selectedKeywordsMap[mergedTagValue] = this.selectedKeywordsMap[lastTagValue];
                    delete this.selectedKeywordsMap[lastTagValue];

                    detachedElements = lastTag.children().detach();
                    lastTag.text(mergedTagValue).append(detachedElements);

                    $.fn.multiSelectAutocomplete.utils.notifyListeners(this.addTagListeners, mergedTagValue);
                    return lastTag;
                }

                // there are no previously added tags
                return this.addSelectedAndReturn(value);
            },

            /**
             * Adds selected tag, adds 'invisible' class to it and returns it.
             *
             * @param value Selected value
             * @returns {*} jQuery reference to created element
             */
            addInvisibleSelectedAndReturn: function (value) {
                return this.addSelectedAndReturn(value).addClass(this.options['invisible-class']);
            },

            /**
             * Shows invisible element by removing 'invisible' class from it.
             *
             * @param element jQuery reference to invisible selected element.
             */
            showInvisibleSelected: function (element) {
                element.removeClass(this.options['invisible-class']);
            },

            /**
             * Adds listener to 'add tag' event which gets triggered on
             * tag add.
             *
             * @method
             * @public
             * @param cb Function to be executed on 'select tag' event trigger.
             */
            onTagAdd: function (cb) {
                if (typeof cb === "function") {
                    this.addTagListeners.push(cb);
                }
            },

            /**
             * Adds listener to 'remove tag' event which gets triggered on
             * tag remove.
             *
             * @method
             * @public
             * @param cb Function to be executed on 'select tag' event trigger.
             */
            onTagRemove: function (cb) {
                if (typeof cb === "function") {
                    this.removeTagListeners.push(cb);
                }
            },

            /**
             * Animates the removing of the specified tag: first - fade out so that tag disappears smoothly,
             * and then width and paddings reduce to 0 to emulate a smooth move of the other elements,
             * following the removed tag.
             *
             * After the animation is complete, removing the tag completely.
             *
             * @param tag   Tag to be removed.
             * @param cb    Callback function to be executed after the animation complete.
             * @private
             */
            _animateRemoval: function (tag, cb) {
                var _this = this;

                tag.animate(
                    {
                        opacity: 0
                    },
                    {
                        duration: _this.options['selected-tag-fadeout-duration'],
                        complete: function () {
                            tag.animate(
                                {
                                    width: 0,
                                    padding: 0,
                                    margin: 0
                                },
                                {
                                    duration: _this.options['selected-tag-disappear-duration'],
                                    complete: function () {
                                        tag.remove();

                                        if (typeof cb === "function") {
                                            cb.call(_this);
                                        }
                                    }
                                }
                            );
                        }
                    }
                );
            },

            selectPrevTag: function () {
                var wrapper = this.innerWrapper,
                    inputEl = this.input,
                    tagClass = this.options['selected-keyword-class'],
                    selectedTagClass = this.options['selected-tag-class'],
                    selectedTag = wrapper.find('.' + selectedTagClass);

                if ( $('.' + tagClass).hasClass(selectedTagClass) && $('.' + selectedTagClass).prev('.' + tagClass).length ) {
                    var prevTag = selectedTag.prev();

                    selectedTag.removeClass(selectedTagClass);
                    prevTag.addClass(selectedTagClass);
                }
                if ( inputEl.is(":focus") ) {
                    inputEl.prev("." + this.options['selected-keyword-class']).addClass(selectedTagClass);
                    inputEl.blur();
                }
            },

            selectNextTag: function () {
                var wrapper = this.innerWrapper,
                    tagClass = this.options['selected-keyword-class'],
                    selectedTagClass = this.options['selected-tag-class'],
                    selectedTag = wrapper.find('.' + selectedTagClass);

                if ( $('.' + tagClass).hasClass(selectedTagClass) && $('.' + selectedTagClass).next('input').length ) {
                    selectedTag.next('input').focus();
                    selectedTag.removeClass(selectedTagClass);
                } else if ( $('.' + tagClass).hasClass(selectedTagClass) && $('.' + selectedTagClass).next('.' + tagClass).length ) {
                    var nextTag = selectedTag.next();

                    selectedTag.removeClass(selectedTagClass);
                    nextTag.addClass(selectedTagClass);
                }
            },

            focusInputField: function (item) {
                var wrapper = this.innerWrapper,
                    selectedTagClass = this.options['selected-tag-class'];

                wrapper.find('.' + selectedTagClass).removeClass(selectedTagClass);
            },

            removeNavigatedTag: function () {
                var tag = this.innerWrapper.find('.' + this.options['selected-tag-class']),
                    value;

                if (tag.length) {
                    value = tag.html();

                    delete this.selectedKeywordsMap[value];
                    this._animateRemoval(tag, function () {
                        $.fn.multiSelectAutocomplete.utils.notifyListeners(this.removeTagListeners, value);
                    });
                }
            },

            navigateFromInput: function () {
                var wrapper = this.innerWrapper,
                    selectedTagClass = this.options['selected-tag-class'],
                    selectedTag = wrapper.find('.' + selectedTagClass);

                selectedTag.siblings(this.options["input-selector"]).focus();
                selectedTag.removeClass(selectedTagClass);
            }

        }

        /* Additional suggestions component */
        function AdditionalSuggestionsComponent(container, wrapper, options) {
            $.fn.multiSelectAutocomplete.utils.checkDomElementPresence(container, options['plugin-class']);
            $.fn.multiSelectAutocomplete.utils.checkDomElementPresence(wrapper, options['wrapper-selector']);

            /**
             * Plugin container reference
             *
             * @type jQuery
             */
            this.container = container;

            /**
             * Outer wrapper to append additional suggestions popup to.
             *
             * @property
             * @type {jQuery}
             */
            this.wrapper = wrapper;

            /**
             * Options object.
             */
            this.options = options;

            /**
             * Additional suggestions popup to show the additional suggestions.
             */
            this.additionalSuggestionsPopup = null;

            /**
             * Additional suggestions container
             */
            this.additionalSuggestionsContainer = null;

            /**
             * Flag to indicate whether the popup is visible or not.
             *
             * @type {boolean}
             */
            this.isVisible = false;

            /**
             * An array of item selection listeners.
             *
             * @type {Array}
             */
            this.itemSelectionListeners = [];

            /**
             * List of suggestions being displayed by additions suggestions popup.
             * Contains objects in format {value: "", description: "", strength: 1}.
             *
             * @type {Array}
             */
            this.suggestions = [];
        }

        /**
         * Additional suggestions component API
         *
         * @type {{init: init, show: show, onItemSelect: onItemSelect, onSuggestionShouldAppear: onSuggestionShouldAppear}}
         */
        AdditionalSuggestionsComponent.prototype = {

            /**
             * Function to init additional suggestions popup
             */
            init: function () {
                var _this = this;

                this.wrapper.append(
                    this.options['additional-suggestions-popup-template']
                        .replace(/\{headerText\}/gim, this.options['additional-suggestions-popup-header-text'])
                        .replace(/\{relationshipText\}/gim, this.options['additional-suggestions-popup-relationship-text'])
                        .replace(/\{lessText\}/gim, this.options['additional-suggestions-popup-less-text'])
                        .replace(/\{moreText\}/gim, this.options['additional-suggestions-popup-more-text'])
                );
                this.additionalSuggestionsPopup = this.container.find(this.options['additional-suggestions-popup-selector']);
                this.additionalSuggestionsContainer = this.additionalSuggestionsPopup.find(this.options['additional-suggestions-container-selector']);
                this.additionalSuggestionsPopup.find(this.options['additional-suggestions-close-selector']).click(function () {
                    _this.hide();
                });
                this.additionalSuggestionsPopup.hide();
            },
            /**
             * Function to show the additional suggestions
             *
             * @param suggestions   List of suggestions to show
             */
            show: function (suggestions) {
                var _this = this,
                    values = suggestions || [],
                    i,
                    value,
                    description,
                    strength,
                    html,
                    suggestion,
                    hideMoreDescriptionButton;

                /* building markup for each suggestion - clearing previous suggestions and building new ones */
                if (values.length > 0) {
                    /* first of all, clearing up previous suggestions */
                    this.additionalSuggestionsContainer.empty();
                    this.suggestions = values;

                    /* then, adding current suggestions */
                    for (i = 0; i < values.length; i++) {
                        value = values[i].name;
                        description = this._truncateDescriptionIfNecessary(values[i].description);
                        hideMoreDescriptionButton = (description === values[i].description);
                        strength = values[i].strength;
                        html = this.options['additional-suggestion-template']
                            .replace(/\{value\}/gim, value)
                            .replace(/\{description\}/gim, description)
                            .replace(/\{display\}/gim, value);

                        suggestion = $(html).appendTo(this.additionalSuggestionsContainer);
                        suggestion.find('.' + this.options['additional-suggestions-item-body-class'])
                            .css({
                                width: strength + '%'
                            });
                        this._activateMoreDescriptionButton(suggestion, hideMoreDescriptionButton);
                    }

                    /* binding click listeners */
                    this.additionalSuggestionsContainer.find('.' + this.options['additional-suggestions-item-class']).each(function () {
                        var suggestion = $(this),
                            val = suggestion.data('value');

                        suggestion.find('.' + _this.options['additional-suggestions-item-body-class']).click(function () {
                            $.fn.multiSelectAutocomplete.utils.notifyListeners(_this.itemSelectionListeners, val, suggestion);
                            suggestion.slideUp(_this.options['additional-suggestions-fade-duration']);
                        });
                    });

                    /* showing popup */
                    this.isVisible = true;

                    /* activate tooltips */
                    _this._activateTooltipsIfNecessary();

                    this.additionalSuggestionsPopup.slideDown(this.options['additional-suggestions-fade-duration']);
                }
            },

            /**
             * Hides the additional suggestions popup.
             */
            hide: function () {
                /* this check is required to prevent multiple hidings even in cases when popup is already hidden */
                if (this.isVisible) {
                    this.isVisible = false;
                    this.additionalSuggestionsPopup.fadeOut(this.options['additional-suggestions-fade-duration']);
                }
            },

            /**
             * Adds item selection event listener.
             * This event gets triggered when user clicks on suggestion.
             *
             * @param cb Function to be executed on item selection.
             */
            onItemSelect: function (cb) {
                if (typeof cb === "function") {
                    this.itemSelectionListeners.push(cb);
                }
            },

            /**
             * Gets triggered when suggestion should appear again
             *
             * @param value Suggestion value
             */
            onSuggestionShouldAppear: function (value) {
                var _this = this,
                    suggestions = this.additionalSuggestionsContainer.find('.' + this.options['additional-suggestions-item-class']);

                $.each(suggestions, function (i, item) {
                    var suggestion = $(item);

                    if (suggestion.data('value') === value) {
                        suggestion.slideDown(_this.options['additional-suggestions-fade-duration']);
                    }
                });
            },

            /**
             * To satisfy the following requirement:
             *
             * "If description from WorkDigital API is more than 250 characters, the tooltip will show in collapsed view."
             *
             * @param description {String}  Description to truncate if necessary
             * @private
             * @return {String} processed description
             */
            _truncateDescriptionIfNecessary: function (description) {
                var limit = this.options['suggestion-description-characters-limit'];

                return description && description.length > limit ? description.substring(0, limit) + "..." : description;
            },

            /**
             * Activates 'more description' label and binds event listeners to it
             *
             * @param element   {jQuery}    jQuery reference to suggestion element
             * @param hide      {Boolean}   Indicates whether the 'more description' button should be hidden or not,
             * @private
             */
            _activateMoreDescriptionButton: function (element, hide) {
                var moreDecriptionButton = element.find("." + this.options['additional-suggestions-item-more-description-class']),
                    descriptionContentElement = element.find("." + this.options['additional-suggestions-item-description-content-class']),
                    descriptionValueElement = element.find("." + this.options['additional-suggestions-item-description-value-class']),
                    _this = this;

                if (hide) {
                    moreDecriptionButton.addClass(this.options['inactive-class']);
                } else {
                    moreDecriptionButton.click(function () {
                        var value = descriptionValueElement.text(),
                            fullDescription = descriptionContentElement.text(),
                            suggestion;

                        moreDecriptionButton.addClass(_this.options['inactive-class']);
                        for (suggestion in _this.suggestions) {
                            if (_this.suggestions.hasOwnProperty(suggestion) && value.trim() === _this.suggestions[suggestion].name.trim()) {
                                fullDescription = _this.suggestions[suggestion].description;
                            }
                        }
                        descriptionContentElement.text(fullDescription);
                    });
                }
            },

            /**
             * Activate tooltip if description is not empty
             *
             * @method
             * @private
             */
            _activateTooltipsIfNecessary: function () {
                var _this = this;

                this.additionalSuggestionsContainer.menuAim({
                    rowSelector: '.' + _this.options['additional-suggestions-item-body-class'],
                    // Function to call when a row is purposefully activated. Use this
                    // to show a submenu's content for the activated row.
                    activate: function (row) {
                        var suggestion = $(row),
                            container = suggestion.parent(),
                            description = container.find('.' + _this.options['additional-suggestions-item-description-class']),
                            descriptionValueHolder = container.find('.' + _this.options['additional-suggestions-item-description-content-class']);

                        if (descriptionValueHolder.text()) {
                            description
                                .addClass(_this.options['additional-suggestions-item-description-active-class'])
                                .css({
                                    "left": suggestion.outerWidth(true),
                                    "top": suggestion.position().top
                                });
                        }
                    },
                    // Function to call when a row is deactivated.
                    deactivate: function (row) {
                        $(row).parent().find('.' + _this.options['additional-suggestions-item-description-class'])
                            .removeClass(_this.options['additional-suggestions-item-description-active-class']);
                    },
                    // Function to call when mouse exits the entire menu. If this returns
                    // true, the current row's deactivation event and callback function
                    // will be fired. Otherwise, if this isn't supplied or it returns
                    // false, the currently activated row will stay activated when the
                    // mouse leaves the menu entirely.
                    exitMenu: function () { return true; }
                });
            },

            /**
             * Calculates the width of the specified text, residing inside the specified item.
             * Item is necessary to retrieve it's font so that the width is calculated correctly.
             *
             * @param text {String} Text to calculate width.
             * @param item {jQuery} Item the text resides in.
             * @returns {*} Text width
             * @private
             */
            _calculateTextWidth: function (text, item) {
                if (!this.fakeElement) {
                    this.fakeElement = $('<span>').hide().appendTo(document.body);
                }
                this.fakeElement.text(text).css({
                    'font': item.css('font')
                });
                return this.fakeElement.innerWidth();
            }
        };

        /* Clear component */
        /**
         * Clear button component to clear current selection
         *
         * @param clear     Clear button reference
         * @param options   Plugin options
         * @constructor
         * @class ClearComponent
         */
        function ClearComponent(clear, options) {
            $.fn.multiSelectAutocomplete.utils.checkDomElementPresence(clear, options['multi-select-clear-selector']);

            /**
             * Clear button reference
             *
             * @type jQuery
             */
            this.clear = clear;

            /**
             * Options object.
             */
            this.options = options;

            /**
             * An array of clear button click listeners
             * @type {Array}
             */
            this.clearListeners = [];
        }

        /**
         * ClearComponent public API.
         *
         * @type {{init: init, onClear: onClear}}
         */
        ClearComponent.prototype = {

            /**
             * Initializes component, bind click event listener to clear button,
             * on which it notifies all listeners about click event.
             */
            init: function () {
                var _this = this;
                this.clear.click(function () {
                    $.fn.multiSelectAutocomplete.utils.notifyListeners(_this.clearListeners);
                });
            },

            /**
             * Add clear button click listener
             *
             * @param cb Function to be executed on clear button click
             */
            onClear: function (cb) {
                if (typeof cb === "function") {
                    this.clearListeners.push(cb);
                }
            }
        };

        /* selected tag move animation component */
        /**
         * Component which is responsible for creation of animation of selected tag movement
         * from suggestions popup to input area.
         * It accepts two elements - the element to start animation from and the element to animate to,
         * then creates an absolutely positioned fake tag, with offset - position of an element relative to the document,
         * equal to the offset of the start element, animates its movement from start to end
         * position - offset, equal to the offset of the 'to' element, and after it notifies listeners about
         * animation end event - selected tag component subscribes to it and shows up a real selected tag,
         * and finally removes the fake element.
         *
         * @param from {jQuery}     jQuery reference to element to start animation from
         * @param to {jQuery}       jQuery reference to element to move to.
         * @param value {String}    Element value (additional suggestion(skill) name)
         * @param options {Object}  Plugin options
         * @constructor
         * @class SelectedTagMoveAnimationComponent
         */
        function SelectedTagMoveAnimationComponent(from, to, value, options) {
            $.fn.multiSelectAutocomplete.utils.checkDomElementPresence(from, "From element");
            $.fn.multiSelectAutocomplete.utils.checkDomElementPresence(to, "To element");

            /**
             * From element to start animation from.
             * This is jQuery reference to it and is used just to calculate the initial
             * position of the helper element.
             *
             * @type {jQuery}
             */
            this.from = from;

            /**
             * Element to move to.
             * This is jQuery reference to it and is used just to calculate the end
             * position of the helper element.
             *
             * @type {jQuery}
             */
            this.to = to;

            /**
             * Element value (additional suggestion(skill) name)
             *
             * @type {String}
             */
            this.value = value;

            /**
             * Plugin options
             *
             * @type {Object}
             */
            this.options = options;

            /**
             * jQuery reference to document body.
             *
             * @type {*|HTMLElement}
             */
            this.body = $('body');

            /**
             * An array of animation end event listeners.
             *
             * @type {Array}
             */
            this.animationEndListeners = [];
        }

        /**
         * SelectedTagMoveAnimationComponent component API.
         *
         * @type {{animate: animate, onAnimationEnd: onAnimationEnd}}
         */
        SelectedTagMoveAnimationComponent.prototype = {

            /**
             * Function which performs element movement animation.
             */
            animate: function () {
                var _this = this,
                    tag = this.options['selected-keyword-template'].replace(/\{value\}/gim, this.value),
                    fake = $("<div class='" + this.options['multi-select-selected-keyword-animation-class'] + "'></div>"),
                    initialOffset = this.from.offset(),
                    targetOffset = this.to.offset();

                /* calculating style and current position  - position:absolute is a hack for IE */
                fake.html(tag).css("position", "absolute").offset(initialOffset);

                /* adding element to body */
                this.body.append(fake);

                /* now, animating movement */
                fake.animate({
                    top: targetOffset.top,
                    left: targetOffset.left
                }, {
                    duration: this.options['selected-tag-animation-period'],
                    complete: function () {
                        $.fn.multiSelectAutocomplete.utils.notifyListeners(_this.animationEndListeners);
                        fake.remove();
                    }
                });
            },

            /**
             * Add animation end event listener
             *
             * @param cb Function to be executed on animation end event
             */
            onAnimationEnd: function (cb) {
                if (typeof cb === "function") {
                    this.animationEndListeners.push(cb);
                }
            }
        };

        /* Input field component */
        /**
         * Input component which handles all logic, related to input field.
         *
         * @param input     Input field.
         * @param options   Plugin options.
         * @constructor
         * @class InputComponent
         */
        function InputComponent(input, options) {
            $.fn.multiSelectAutocomplete.utils.checkDomElementPresence(input, options['input-selector']);

            /**
             * Input field binded to bootstrap typeahead plugin.
             *
             * @property
             * @type {jQuery}
             */
            this.input = input;

            /**
             * Next focusable input field.
             * Reference is required to focus on 'tab' button click.
             */
            this.nextInput = null;

            /**
             * Typeahead instance binded to input field.
             */
            this.typeahead = null;

            /**
             * Plugin options.
             */
            this.options = options;

            /**
             * List of callbacks listening to focus event.
             *
             * @type {Array}
             */
            this.focusListeners = [];

            /**
             * List of callbacks listening to blur event.
             *
             * @type {Array}
             */
            this.blurListeners = [];

            /**
             * List of callbacks listening to typing start event.
             *
             * @type {Array}
             */
            this.typingStartListeners = [];

            /**
             * List of callbacks listening to backspace event.
             * This event will be triggered if input field is empty and 'backspace' button was typed.
             *
             * @type {Array}
             */
            this.backspaceListeners = [];

            /**
             * List of callbacks listening to item selection from autocomplete list event.
             *
             * @type {Array}
             */
            this.itemSelectionFromAutocompleteListeners = [];

            /**
             * List of callbacks listening to autocomplete source retrieve event.
             *
             * @type {Array}
             */
            this.autocompleteSourceRetrieveListeners = [];

            /**
             * Map of values for typeahead and their Id
             *
             * @type {Object}
             */
            this.autocompleteValueToIdMap = {};

        }

        /**
         * Input component API.
         *
         * @type {{init: init, focus: focus, clear: clear, onFocus: onFocus, onBlur: onBlur, onStartTyping: onStartTyping, onBackspace: onBackspace, _focus: _focus, _blur: _blur, _keydown: _keydown}}
         */
        InputComponent.prototype = {

            /**
             * Initializes component and binds events, after that initializes bootstrap typeahead plugin..
             *
             * @method
             * @public
             */
            init: function () {
                var _this = this,
                    inputs;

                inputs = $(this).closest('form').find('input[type=text]');
                this.nextInput = inputs.eq(inputs.index(this) + 1);
                this.input.focus($.proxy(this._focus, this));
                this.input.blur($.proxy(this._blur, this));
                this.input.keydown($.proxy(this._keydown, this));
                this.input.keyup($.proxy(this._keyup, this));

                /* bootstrap typeahead binding */
                this.input.typeahead({
                    minLength: 1, // Let source() determine min length as CN has alternate min length
                    items: this.options.items,

                    /**
                     * The method used to return selected item.
                     * Gets called when the item is selected, so, custom implementation is used to
                     * perform an additional action - selected tag appending and additional suggestions popup showing.
                     *
                     * @param value     Selected value.
                     * @returns {*} Selected value
                     */
                    updater: function (value) {
                        var id = _this.autocompleteValueToIdMap[value];

                        $.fn.multiSelectAutocomplete.utils.notifyListeners(_this.itemSelectionFromAutocompleteListeners, value, _this.getValue(), id);

                        return ""; // clearing input
                    },

                    /**
                     * The data source to query against.
                     * The function is passed two arguments, the query value in the input field and the process callback.
                     *
                     * @param query     Current query value to make suggestions for.
                     * @param process   Asynchronous function to be called after the suggestions retrieved.
                     */
                    source: function (query, process) {
                        /**
                         * We are to switch the minimum length requirements based on the input language of the user.
                         * This cannot be determined at initialisation of plugin, and would need to be calculated at
                         * runtime.  There is no before() or way to override Typeahead.lookup() without altering the
                         * plugin sourcecode so work-around here, by performing length check here.
                         * If a length has been explicitly set on a typeahead, then use that instead.
                         */
                        var minLength = _this.options['min-length'];
                        if (fo.helpers.hasMandarinCharSet(query)) {
                            minLength = _this.options['cn-min-length'];
                        }
                        if (query.length < minLength) {
                            return process([]);
                        }

                        $.fn.multiSelectAutocomplete.utils.notifyListeners(_this.autocompleteSourceRetrieveListeners, query, function (values) {
                            _this.sourceCallbackFunction(values, process);
                        });
                    },

                    /**
                     * Overriding matcher in order to correctly process suggestions for
                     * query, starting with 'and ' - in this case, default typeahead behaviour will operate
                     * on contents of input field, which is 'and ....' and will not match suggestions for the
                     * phrase, following 'and '.
                     *
                     * So, just replacing 'and ' in the beginning of the query and delegating invokation to default
                     * matcher.
                     *
                     * @param item Item to match.
                     */
                    matcher: function (item) {
                        _this.typeahead.query = _this.getValue().replace($.fn.multiSelectAutocomplete.utils.getAndPattern(), "");
                        return InputComponent.DEFAULT_TYPEAHEAD_MATCHER.call(_this.typeahead, item);
                    }
                });
                this.typeahead = this.input.data('typeahead');

                $.fn.multiSelectAutocomplete.utils.assertNotNull(this.typeahead);
            },

            /**
             * Proxy function for processing data for typeahead.
             * Transforms Object-values to String getting value-meaning properties.
             * Also fill autocompleteValueToIdMap.
             *
             * @param values	Data for typeahead.
             * @param process	Callback function from bootstrap-typeahead.
             */
            sourceCallbackFunction: function (values, process) {
                var _this = this,
                    resultValues = values;

                if (values.length > 0 && typeof values[0] == 'object') {
                    resultValues = [];
                    $.each(values, function (i, item) {
                        _this.autocompleteValueToIdMap[item.displayName] = item.id;
                        resultValues.push(item.displayName);
                    });
                }

                process(resultValues);
            },

            /**
             * hack to fix element width in IE. after select via click, $.focus() gets called, which hides an added tag
             * focuses element - i.e. places cursor inside it - so that nothing shift and everything works in all browsers.
             *
             * Setting visibility to hidden so that visually nothing changes since markup is preserved,
             * then getting browser some time to repaint it and after that showing again.
             */
            focus: function () {
                var _this = this,
                    isIE = $.fn.multiSelectAutocomplete.utils.isIE(),
                    cb = function () {
                        _this.input.css("visibility", "visible");
                        _this.input.val("");
                        _this.input.select();
                    };

                this.input.css("visibility", "hidden");
                isIE ? setTimeout(cb, 10) : cb();
            },

            /**
             * Clear up the input field.
             */
            clear: function () {
                this.input.val("");
            },

            /**
             * Gets current value in the input field.
             *
             * @returns {*}
             */
            getValue: function () {
                return this.input.val();
            },

            /**
             * Add focus event listener
             *
             * @method
             * @public
             * @param cb Function to be executed on input focus
             */
            onFocus: function (cb) {
                if (typeof cb === "function") {
                    this.focusListeners.push(cb);
                }
            },

            /**
             * Add blur event listener
             *
             * @param cb Function to be executed on input blur
             */
            onBlur: function (cb) {
                if (typeof cb === "function") {
                    this.blurListeners.push(cb);
                }
            },

            /**
             * Add start typing event listener
             *
             * @method
             * @public
             * @param cb Function to be executed when suer starts typing something in input field.
             */
            onStartTyping: function (cb) {
                if (typeof cb === "function") {
                    this.typingStartListeners.push(cb);
                }
            },

            /**
             * Add 'backspace' event listener.
             * This event will be triggered if input field is empty and 'backspace' button was typed.
             *
             * @method
             * @public
             * @param cb Function to be executed when suer starts typing something in input field.
             */
            onBackspace: function (cb) {
                if (typeof cb === "function") {
                    this.backspaceListeners.push(cb);
                }
            },

            /**
             * Add 'item select from autocomplete' event listener.
             *
             * @method
             * @public
             * @param cb Function to be executed when user selects an item from autocomplete list.
             */
            onItemSelectFromAutocomplete: function (cb) {
                if (typeof cb === "function") {
                    this.itemSelectionFromAutocompleteListeners.push(cb);
                }
            },

            /**
             * Add 'autocomplete source retrieve' event listener.
             * Since this event passes 'process' function, should be only one event listener.
             *
             * @method
             * @public
             * @param cb Function to be executed
             */
            onAutocompleteSourceRetrieve: function (cb) {
                if (typeof cb === "function") {
                    this.autocompleteSourceRetrieveListeners.length = 0;
                    this.autocompleteSourceRetrieveListeners.push(cb);
                }
            },

            /**
             * Focus event handler
             *
             * @private
             */
            _focus: function () {
                $.fn.multiSelectAutocomplete.utils.notifyListeners(this.focusListeners);
            },

            /**
             * Blur event handler.
             * Notifies listeners about blur event only if keyword is not empty and
             * typeahead is not mouseovered at the moment, since it means that user is using autocomplete
             * and blur should not be triggered.
             *
             * @private
             */
            _blur: function () {
                var keyword = this.input.val();

                /* also check if typeahead is mouseovered at the moment, then do nothing, because it means that currently we a re selecting suggestions... */
                if (keyword !== "" && this.typeahead && !this.typeahead.mousedover) {
                    $.fn.multiSelectAutocomplete.utils.notifyListeners(this.blurListeners, keyword);
                }
            },

            /**
             * Keydown event handler.
             *
             * @private
             * @param e {jQuery.Event} Key event object.
             */
            _keydown: function (e) {
                var code = e.keyCode || e.which,
                    keyword = this.input.val();
                if (code === 8 && keyword === "") { // backspace clicked
                    $.fn.multiSelectAutocomplete.utils.notifyListeners(this.backspaceListeners);
                } else if (code === 9) { // tab
                    e.stopPropagation();
                }

            },

            /**
             * Keyup event handler.
             * Checks if 'TAB' button was clicked, then focuses next input and stops propagation.
             * This is done to prevent default 'bootstrap-typeahead' handling, which does not focus next field
             * since stops propagation.
             *
             * @private
             * @param e {jQuery.Event} Key event object.
             */
            _keyup: function (e) {
                var code = e.keyCode || e.which;

                $.fn.multiSelectAutocomplete.utils.notifyListeners(this.typingStartListeners);

                if (code === 9) {
                    this.nextInput.focus().select();

                    e.stopPropagation();
                    e.preventDefault();
                }
            }

        };

        /**
         * Static reference to default typeahead matcher.
         *
         * @static
         * @type {matcher|Typeahead.matcher|c.matcher}
         */
        InputComponent.DEFAULT_TYPEAHEAD_MATCHER = $.fn.typeahead.Constructor.prototype.matcher;

        /**
         * Suggestions retriever component interface
         *
         * @constructor
         * @class BaseSuggestionRetrieverComponent
         */
        function BaseSuggestionRetrieverComponent() {

        }

        /**
         * Abstract functions for suggestion retriever component
         *
         * @type {{retrieveSuggestions: retrieveSuggestions, retrieveRelatedSuggestions: retrieveRelatedSuggestions}}
         */
        BaseSuggestionRetrieverComponent.prototype = {
            /**
             * Function to retrieve suggestions from server - checks, whether the values are already present in cache
             * and if no, performs ajax call, then puts the value to cache and invokes callback function,
             * passing the list of suggestions.
             *
             * @param path          Url to retrieve values from.
             * @param query         Keyword query.
             * @param cache         Current values cache.
             * @param options       Plugin options.
             * @param useTimeout    Indicates whether the ajax call has to be performed after the delay
             * @param suggestionsProcessor {(jQuery.fn.multiSelectAutocomplete.classes.AutocompleteSuggestionsProcessor | jQuery.fn.multiSelectAutocomplete.classes.AdditionalSuggestionsProcessor)}
             *                      Function to process response from server and map it to a pure array of suggestions;
             * @param cb            Callback function to execute with the list of suggestions.
             * @param loadingIndicatorContainer     Container for loading animation.
             */
            retrieveSuggestions: function (path, query, cache, options, useTimeout, suggestionsProcessor, cb, loadingIndicatorContainer) {},
            /**
             * Function to retrieve suggestions from server - checks, whether the values are already present in cache
             * and if no, performs ajax call, then puts the value to cache and invokes callback function,
             * passing the list of suggestions.
             *
             * @param path          Url to retrieve values from.
             * @param query         Keyword query.
             * @param cache         Current values cache.
             * @param options       Plugin options.
             * @param useTimeout    Indicates whether the ajax call has to be performed after the delay
             * @param suggestionsProcessor {(jQuery.fn.multiSelectAutocomplete.classes.AutocompleteSuggestionsProcessor | jQuery.fn.multiSelectAutocomplete.classes.AdditionalSuggestionsProcessor)}
             *                      Function to process response from server and map it to a pure array of suggestions;
             * @param cb            Callback function to execute with the list of suggestions.
             * @param loadingIndicatorContainer     Container for loading animation.
             */
            retrieveRelatedSuggestions: function (path, query, cache, options, useTimeout, suggestionsProcessor, cb, loadingIndicatorContainer) {}
        };

        /**
         * Related suggestion retriever component
         *
         * @constructor
         * @class RelatedSuggestionRetrieverComponent
         */
        function RelatedSuggestionRetrieverComponent() {
            this.timeout = null;
        }

        RelatedSuggestionRetrieverComponent.prototype = new BaseSuggestionRetrieverComponent();

        RelatedSuggestionRetrieverComponent.prototype.retrieveSuggestions = function (path, query, cache, options, useTimeout, suggestionsProcessor, cb, loadingIndicatorContainer) {
            var
                /**
                 * Keyword to load suggestions by
                 *
                 * @type {string}
                 */
                keyword = query.toLowerCase(),

                ldc = $(loadingIndicatorContainer),

                /**
                 * Function to retrieve autosuggestions from server via ajax request
                 */
                performAjaxCall = function () {
                    ldc.addClass(options['loading-indicator-class']);
                    $.ajax({
                        url: path,
                        type: 'GET',
                        contentType: 'application/json',
                        dataType: 'json',
                        data: {
                            'query': query
                        },
                        cache: false,
                        success: function (suggestions) {
                            ldc.removeClass(options['loading-indicator-class']);
                            cache[keyword] = suggestionsProcessor.process(suggestions);
                            cb(cache[keyword]);
                        },
                        error: function (e) {
                            ldc.removeClass(options['loading-indicator-class']);
                        }
                    });
                };

            if (!cache[keyword] && useTimeout) {
                clearTimeout(this.timeout);
                this.timeout = setTimeout(performAjaxCall, options.delay);
            } else {
                if (cache[keyword]) {
                    cb(cache[keyword]);
                } else {
                    performAjaxCall();
                }
            }
        };

        RelatedSuggestionRetrieverComponent.prototype.retrieveRelatedSuggestions = function (path, query, cache, options, useTimeout, suggestionsProcessor, cb, loadingIndicatorContainer) {
            this.retrieveSuggestions(path, query, cache, options, useTimeout, suggestionsProcessor, cb, loadingIndicatorContainer);
        };

        /**
         * Suggestion retriever that don't retrieve related suggestions
         *
         * @constructor
         * @class OneLevelSuggestionRetrieverComponent
         */
        function OneLevelSuggestionRetrieverComponent() {
            this.timeout = null;
        }

        OneLevelSuggestionRetrieverComponent.prototype = new BaseSuggestionRetrieverComponent();

        OneLevelSuggestionRetrieverComponent.prototype.retrieveSuggestions = function (path, cacheKey, cache, options, useTimeout, suggestionsProcessor, cb, loadingIndicatorContainer) {
            var
                loadingIndicator = $(loadingIndicatorContainer),

                /**
                 * Function to retrieve autosuggestions from server via ajax request
                 */
                performAjaxCall = function () {
                    loadingIndicator.addClass(options['loading-indicator-class']);
                    $.ajax({
                        url: path,
                        type: 'GET',
                        contentType: 'application/json',
                        dataType: 'json',
                        cache: false,
                        success: function (suggestions) {
                            loadingIndicator.removeClass(options['loading-indicator-class']);
                            cache['all'] = suggestionsProcessor.process(suggestions);
                            cb(cache['all']);
                        },
                        error: function (e) {
                            loadingIndicator.removeClass(options['loading-indicator-class']);
                        }
                    });
                };

            if (!cache['all'] && useTimeout) {
                clearTimeout(this.timeout);
                this.timeout = setTimeout(performAjaxCall, options.delay);
            } else {
                if (cache['all']) {
                    cb(cache['all']);
                } else {
                    performAjaxCall();
                }
            }
        };

        /* Value restore manager */
        /**
         * Restore manager which aim is to restore selected tags from hidden input
         * and vice versa, restore hidden input value from selected tags.
         *
         * @constructor
         * @class RestoreManager
         */
        function BaseRestoreManager () {

        }

        BaseRestoreManager.prototype = {
            /**
             * Initializes scroll manager
             *
             * @method
             * @public
             */
            init: function () {},
            /**
             * Adds listener to restore value event
             *
             * @method
             * @public
             * @param cb Function to be called on value restore
             */
            onRestore: function (cb) {
                if (typeof cb === "function") {
                    this.restoreValueListeners.push(cb);
                }
            },
            /**
             * Function which should be called when the hidden input value should be changed.
             * It iterates over all selected tags and input input field and sets the hidden value with respect to it.
             */
            onValueChanged: function () {}
        };


        /**
         * Restore manager that operate unique input-field
         *
         * @param hidden        Hidden input field the value is placed to
         * @param input         Input field binded to bootstrap typeahed plugin
         * @param innerWrapper  Inner wrapper whose width equals to the content width.
         * @param options       Plugin options.
         * @constructor
         * @class SingleFieldRestoreManager
         */
        function SingleFieldRestoreManager(hidden, input, innerWrapper, options) {
            $.fn.multiSelectAutocomplete.utils.checkDomElementPresence(hidden, options['hidden-input-selector']);
            $.fn.multiSelectAutocomplete.utils.checkDomElementPresence(input, options['input-selector']);
            $.fn.multiSelectAutocomplete.utils.checkDomElementPresence(innerWrapper, options['inner-wrapper-selector']);

            /**
             * Hidden input field.
             *
             * @property
             * @type {jQuery}
             */
            this.hidden = hidden;

            /**
             * Input field binded to bootstrap typeahead plugin.
             *
             * @property
             * @type {jQuery}
             */
            this.input = input;

            /**
             * Inner wrapper whose width equals to the content width.
             *
             * @property
             * @type {jQuery}
             */
            this.innerWrapper = innerWrapper;

            /**
             * Options object.
             */
            this.options = options;

            /**
             * An array of functions, listening to restore value event;
             *
             * @type {Array}
             */
            this.restoreValueListeners = [];
        }

        /**
         * Restore manager functionality
         *
         * @type {{init: init, onRestore: onRestore, onValueChanged: onValueChanged}}
         */
        SingleFieldRestoreManager.prototype = new BaseRestoreManager();

        SingleFieldRestoreManager.prototype.init = function () {
            var _this = this,
                value = this.hidden.val() || "",
                tags = value.split(',');

            $.each(tags, function (i, item) {
                if (item !== "") {
                    $.fn.multiSelectAutocomplete.utils.notifyListeners(_this.restoreValueListeners, item);
                }
            });
        };

        SingleFieldRestoreManager.prototype.onValueChanged = function () {
            var selectedTags = this.innerWrapper.find('.' + this.options['selected-keyword-class']),
                inputValue = this.input.val() || "",
                value = "";

            $.each(selectedTags, function (i, tag) {
                value += (value.length ? "," : "") + $(tag).text();
            });

            value += (value.length && inputValue.length ? "," : "") + inputValue;
            this.hidden.val(value);
        };

        /**
         * Restore manager that operate several input-fields
         *
         * @param hidden        Hidden input field the value is placed to
         * @param input         Input field binded to bootstrap typeahed plugin
         * @param innerWrapper  Inner wrapper whose width equals to the content width.
         * @param options       Plugin options.
         * @constructor
         */
        function MultipleFieldsRestoreManager (hiddenWrapper, input, innerWrapper, options) {
            /**
             * Hidden input field.
             *
             * @property
             * @type {jQuery}
             */
            this.hiddenWrapper = hiddenWrapper;

            /**
             * Input field binded to bootstrap typeahead plugin.
             *
             * @property
             * @type {jQuery}
             */
            this.input = input;

            /**
             * Inner wrapper whose width equals to the content width.
             *
             * @property
             * @type {jQuery}
             */
            this.innerWrapper = innerWrapper;

            /**
             * Options object.
             */
            this.options = options;

            /**
             * An array of functions, listening to restore value event;
             *
             * @type {Array}
             */
            this.restoreValueListeners = [];
        }

        MultipleFieldsRestoreManager.prototype = new BaseRestoreManager();

        MultipleFieldsRestoreManager.prototype.init = function () {
            var _this = this,
                count = this.hiddenWrapper.attr('data-count'),
                i,
                id,
                value;

            for (i = 0; i < count; i++) {
                id = this.hiddenWrapper.find('input[name="' + this.options['multiple-valued-hidden-input-id'] + '[' + i + ']"]').val();
                value = this.hiddenWrapper.find('input[name="' + this.options['multiple-valued-hidden-input-value'] + '[' + i + ']"]').val();

                $.fn.multiSelectAutocomplete.utils.notifyListeners(_this.restoreValueListeners, value, id);
            }

            this.handleValuesUpdateRequired();
        };

        MultipleFieldsRestoreManager.prototype.onValueChanged = function () {
            var selectedTags = this.innerWrapper.find('.' + this.options['selected-keyword-class']),
                hiddenInputsTemplate = this.options['multiple-valued-hidden-input-template'],
                inputValue = this.input.val(),
                dataCount = selectedTags.size(),
                value = "",
                names = [],
                locName = '';

            $.each(selectedTags, function (i, tag) {
                value += hiddenInputsTemplate.replace(/\{value\}/gim, $(tag).text()).replace(/\{id\}/gim, $(tag).attr('data-id')).replace(/\{index\}/gim, i);
            });

            if (selectedTags.size() == this.hiddenWrapper.attr('data-count') && inputValue.length > 0) {
                value += hiddenInputsTemplate.replace(/\{value\}/gim, inputValue).replace(/\{id\}/gim, "0").replace(/\{index\}/gim, dataCount);
                dataCount = dataCount + 1;
            }

            this.hiddenWrapper.attr('data-count', dataCount);
            this.hiddenWrapper.html(value);

            for (var i = 0; i < dataCount; i++) {
                locName = this.hiddenWrapper.find('input[name="' + this.options['multiple-valued-hidden-input-value'] + '[' + i + ']"]').val();

                (function(itemName){
                    names.push(itemName);
                })(locName);

            }

            fo.eventHandler.publish(fo.eventHandler.events.TYPE_AHEAD_SELECT_CHECK , names);

        };

        MultipleFieldsRestoreManager.prototype.handleValuesUpdateRequired = function () {
            var _this = this;
            if (window.fo && window.fo.eventHandler) {
                window.fo.eventHandler.subscribe(window.fo.eventHandler.events.VALUES_UPDATE_REQUIRED, function (key, cb) {
                    if (typeof cb === "function") {
                        var count = _this.hiddenWrapper.attr('data-count'),
                            ids = "",
                            names = "",
                            i;

                        for (i = 0; i < count; i++) {
                            ids += (ids.length ? "," : "")
                                + _this.hiddenWrapper.find('input[name="' + _this.options['multiple-valued-hidden-input-id'] + '[' + i + ']"]').val();
                            names += (names.length ? "," : "")
                                + _this.hiddenWrapper.find('input[name="' + _this.options['multiple-valued-hidden-input-value'] + '[' + i + ']"]').val();
                        }

                        cb.call(_this, ids, names);
                    }
                });
            }
        };

        /**
         * First selected related skill tracking component.
         * Add GA tracking tag to related terms selection.
         *
         * @constructor
         * @class FirstRelatedSkillTracking
         */
        function RelatedSkillTracking() {

            /**
             * setting temporary object to allow to track first selected related skill, after skill been tracked this
             * boolean will be set to true to stop ga tracking
             * @type boolean
             */
            this.trackedSkills = [];

        }

        /**
         * first selected related skill tracking functionality
         *
         * @type {{init: init, trackSkill: trackSkill }}
         */
        RelatedSkillTracking.prototype = {

            /**
             * ga tracking when selecting only first related skill
             *
             * @method
             * @public
             * @param skill {String} Skill name
             */
            trackSkillSelection: function (skill) {
                if (skill && $.inArray(skill, this.trackedSkills) === -1) {
                    window.analytics.triggerAction({label: skill}, 'JOBS.SUB_SKILL_SELECTION');
                    this.trackedSkills.push(skill);
                }
            }

        };

        function ChosenTagsNavigationComponent (container, input) {

            /**
             * Inner wrapper whose width equals to the content width.
             *
             * @property
             * @type {jQuery}
             */
            this.container = container;

            /**
             * Input field reference
             * @property
             * @type {jQuery}
             */
            this.input = input;

            /**
             * List of callbacks listening to autocomplete select prev tag event.
             * @type {Array}
             */
            this.selectPrevtTagListeners = [];

            /**
             * List of callbacks listening to autocomplete select next tag event.
             * @type {Array}
             */
            this.selectNextTagListeners = [];

            /**
             * List of callbacks listening to input field focus event.
             * @type {Array}
             */
            this.focusOnInputListener = [];

            this.backspaceToNavigatedTagListeners = [];

            this.tabFromNavigatedTagListeners = [];

        }

        ChosenTagsNavigationComponent.prototype = {

            init: function () {
                var inptEl = this.input,
                    page = $(document);

                page.keypress($.proxy(this.triggerTagNavigation, this));
                inptEl.focus($.proxy(this._onInputFocus, this));

            },

            onSelectPrevTag: function (cb) {
                if (typeof cb === "function") {
                    this.selectPrevtTagListeners.push(cb);
                }
            },

            onSelectNextTag: function (cb) {
                if (typeof cb === "function") {
                    this.selectNextTagListeners.push(cb);
                }
            },

            onInputFocus: function (cb) {
                if (typeof cb === "function") {
                    this.focusOnInputListener.push(cb);
                }
            },

            onBackspaceToNavgateTag: function (cb) {
                if (typeof cb === "function") {
                    this.backspaceToNavigatedTagListeners.push(cb);
                }
            },

            onTabFromNavigatedTag: function (cb) {
                if (typeof cb === "function") {
                    this.tabFromNavigatedTagListeners.push(cb);
                }
            },

            triggerTagNavigation: function (e) {
                var code = e.keyCode || e.which;

                switch (code) {
                    case 37: // left arrow
                        $.fn.multiSelectAutocomplete.utils.notifyListeners(this.selectPrevtTagListeners);
                        break;
                    case 39: // right arrow
                        $.fn.multiSelectAutocomplete.utils.notifyListeners(this.selectNextTagListeners);
                        break;
                    case 9: // tab
                        e.preventDefault();
                        $.fn.multiSelectAutocomplete.utils.notifyListeners(this.tabFromNavigatedTagListeners);
                        break;
                    case 8: // backspace clicked
                        $.fn.multiSelectAutocomplete.utils.notifyListeners(this.backspaceToNavigatedTagListeners);
                        break;
                    case 46: // delete button clicked
                        $.fn.multiSelectAutocomplete.utils.notifyListeners(this.backspaceToNavigatedTagListeners);
                        break;
                }
            },

            _onInputFocus: function () {
                $.fn.multiSelectAutocomplete.utils.notifyListeners(this.focusOnInputListener);
            }

        }

        /**
         * Public API
         */
        return {
            SuggestionsProcessor: SuggestionsProcessor,
            AutocompleteSuggestionsProcessor: AutocompleteSuggestionsProcessor,
            LocationSuggestionsProcessor: LocationSuggestionsProcessor,
            AdditionalSuggestionsProcessor: AdditionalSuggestionsProcessor,
            ScrollComponent: ScrollComponent,
            SingleFieldRestoreManager: SingleFieldRestoreManager,
            MultipleFieldsRestoreManager: MultipleFieldsRestoreManager,
            SelectedTagComponent: SelectedTagComponent,
            AdditionalSuggestionsComponent: AdditionalSuggestionsComponent,
            InputComponent: InputComponent,
            SelectedTagMoveAnimationComponent: SelectedTagMoveAnimationComponent,
            ClearComponent: ClearComponent,
            RelatedSkillTracking: RelatedSkillTracking,
            RelatedSuggestionRetrieverComponent: RelatedSuggestionRetrieverComponent,
            OneLevelSuggestionRetrieverComponent: OneLevelSuggestionRetrieverComponent,
            ChosenTagsNavigationComponent: ChosenTagsNavigationComponent
        };
    }());

    /**
     * Factory-methods for objects creation
     *
     * @type {{buildAdditionalSuggestionProcessor: buildAdditionalSuggestionProcessor, buildSuggestionRetrieverComponent: buildSuggestionRetrieverComponent, buildRestoreManager: buildRestoreManager}}
     */
    $.fn.multiSelectAutocomplete.factory = {
        /**
         * Create suggestions processor
         *
         * @param options	Plugin options.
         *
         * @returns {$.fn.multiSelectAutocomplete.classes.SuggestionsProcessor} 	New instance of suggestions processor.
         */
        buildAdditionalSuggestionProcessor: function (options) {
            if (options['invoke-additional-suggestions'] === true) {
                return new $.fn.multiSelectAutocomplete.classes.AutocompleteSuggestionsProcessor();
            } else {
                return new $.fn.multiSelectAutocomplete.classes.LocationSuggestionsProcessor();
            }
        },

        /**
         * Create suggestion retriever component
         *
         * @param options	Plugin options.
         *
         * @returns {$.fn.multiSelectAutocomplete.classes.BaseSuggestionRetrieverComponent}		New instance of suggestion retriever component
         */
        buildSuggestionRetrieverComponent: function (options) {
            if (options['invoke-additional-suggestions'] === true) {
                return new $.fn.multiSelectAutocomplete.classes.RelatedSuggestionRetrieverComponent();
            } else {
                return new $.fn.multiSelectAutocomplete.classes.OneLevelSuggestionRetrieverComponent();
            }
        },

        /**
         * Create restore manager
         *
         * @param hidden        Hidden input field the value is placed to
         * @param input         Input field binded to bootstrap typeahed plugin
         * @param innerWrapper  Inner wrapper whose width equals to the content width.
         * @param options       Plugin options.
         *
         * @returns {$.fn.multiSelectAutocomplete.classes.BaseRestoreManager}	New instance of restore manager
         */
        buildRestoreManager: function (hidden, input, innerWrapper, options) {
            if (options['invoke-additional-suggestions'] === true) {
                return new $.fn.multiSelectAutocomplete.classes.SingleFieldRestoreManager(hidden, input, innerWrapper, options);
            } else {
                return new $.fn.multiSelectAutocomplete.classes.MultipleFieldsRestoreManager(hidden, input, innerWrapper, options);
            }
        }
    };

    /**
     * Default plugin options.
     *
     * @static
     * @type {{}}
     */
    $.fn.multiSelectAutocomplete.defaults = {
        'path': '/suggest/keyword',
        'additional-suggestions-path': '/suggest/skills',
        'min-length': 3,
        'cn-min-length': 1,
        'delay': 300,
        'tooltip-delay': 200,
        'selected-tag-animation-period': 800,
        'tooltip-placement': 'right',
        'items': 10,
        'scroll-increment': 50,
        'scroll-duration': 600,
        'selected-tag-fadeout-duration': 300,
        'selected-tag-disappear-duration': 500,
        'additional-suggestions-fade-duration': 300,
        'space-available-for-tags-in-percent': 0.8,
        // limit should be 250, but according to the ODT0221FO-1394 we are waiting for full description from WD API
        'suggestion-description-characters-limit': 1000,
        'wrapper-selector': '.multi-select-wrapper',
        'inner-wrapper-selector': '.multi-select-inner-wrapper',
        'input-selector': '.multi-select-input',
        'hidden-input-selector': '.multi-select-hidden-input',
        'additional-suggestions-popup-selector': '.additional-suggestions-popup',
        'additional-suggestions-container-selector': '.additional-suggestions-container',
        'additional-suggestions-close-selector': '.additional-suggestions-close',
        'plugin-class': 'multi-select',
        'multi-select-move-right-class': 'multi-select-move-right',
        'multi-select-move-left-class': 'multi-select-move-left',
        'multi-select-move-disabled-class': 'disabled',
        'selected-keyword-class': 'selected-keyword',
        'remove-selected-keyword-class': 'remove-selected-keyword',
        'additional-suggestions-item-class': 'additional-suggestions-item',
        'additional-suggestions-item-body-class': 'additional-suggestions-item-body',
        'additional-suggestions-item-description-class': 'additional-suggestions-item-description',
        "additional-suggestions-item-description-content-class": 'description',
        "additional-suggestions-item-description-value-class": 'value',
        'additional-suggestions-item-more-description-class': 'more-description',
        'additional-suggestions-item-description-active-class': 'active',
        'multi-select-clear-selector': '.multi-select-clear',
        'loading-indicator-container-selector': '.multi-select-loading-indicator-container',
        'loading-indicator-class': 'multi-select-loading-indicator',
        'additional-suggestions-popup-header-text': 'Add these related terms to expand your search',
        'additional-suggestions-popup-relationship-text': 'Relationship strength',
        'additional-suggestions-popup-less-text': 'Less',
        'additional-suggestions-popup-more-text': 'More',
        'multi-select-selected-keyword-animation-class': 'multi-select-selected-keyword-animation',
        'invisible-class': 'invisible',
        'inactive-class': 'inactive',
        'invoke-additional-suggestions': true,
        'selected-keyword-template': '<div class="selected-keyword">'
            + '{value}'
            + '<div class="remove-selected-keyword">'
            + '</div>'
            + '</div>',
        'additional-suggestion-template': '<div class="additional-suggestions-item" data-value="{value}">'
            + '<div class="additional-suggestions-item-body">'
            + '{display}'
            + '</div>'
            + '<div class="additional-suggestions-item-description">'
            +   '<div class="tooltip-triangle"></div>'
            +   '<p>'
            +       '<span class="value">{value}&nbsp;</span>'
            +       '<span class="description">{description}</span>'
            +   '</p>'
            +   '<span class="more-description"></span>'
            + '</div>'
            + '</div>',
        'additional-suggestions-popup-template': '<div class="additional-suggestions-popup">'
            + '<div class="additional-suggestions-popup-header">'
            +   '<button type="button" class="additional-suggestions-close" tabindex="-1">&times;</button>'
            +   '{headerText}'
            + '</div>'
            + '<div class="additional-suggestions-container"></div>'
            + '<div class="additional-suggestions-popup-footer">'
            +   '<div class="additional-suggestions-popup-footer-relationship-scale"></div>'
            +   '<div class="additional-suggestions-popup-footer-relationship">'
            +       '<span class="relationship-left-bound">{lessText}</span>'
            +       '<span class="relationship-text">{relationshipText}</span>'
            +       '<span class="relationship-right-bound">{moreText}</span>'
            +   '</div>'
            + '</div>'
            + '</div>',
        'multiple-valued-hidden-input-template': '',
        'multiple-valued-hidden-input-id' : '',
        'multiple-valued-hidden-input-value' : '',
        'autocomplete-path-type' : '',
        'request-on-focus' : false,
        'remove-tags-on-filters-reset': false,
        'selected-tag-class':'selected-tag'
    };

}(jQuery));
