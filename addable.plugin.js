/*jslint unparam: true, browser: true, nomen: true, regexp: true, maxerr: 50, indent: 4, devel: true */
/*global jQuery:true */
/**
 * Plugin to enable element adding to bucket.
 * Adds element, marked with "addable-class" and once element is added to bucket, makes it "added".
 * Once element is added, marks all the elements with the same data-id as added too.
 *
 * Once element is removed from bucket, removes "added" and adds "addable" class once again.
 *
 * When element is added to a bucket, a corresponding hidden input with the skill id is added to a form.
 * Field name template is retrieved from data-field-name attribute, where index is replaced with "%id%" placeholder.
 */
(function ($) {
    "use strict";

    /**
     * Default options
     *
     * @type {{}}
     */
    var defaults = {
        "addable-class": "addable",
        "added-class": "added",
        "bucket-selector": ".bucket",
        "placeholder-selector": ".placeholder",
        "add-button-selector": ".add",
        "add-button-inactive-class": "inactive",
        "add-button-loading-class": "loading",
        "field-name-pre-index-part": "skill[",
        "field-name-post-index-part": "].id",
        "selected-element-animation-period": 500,
        "active-sub-dropdown": ".comparison .others.active"
    };

    /* selected tag move animation component */
    /**
     * Component which is responsible for creation of animation of selected element movement
     * from suggestions popup to input area.
     * It accepts two elements - the element to start animation from and the element to animate to,
     * then creates an absolutely positioned fake tag, with offset - position of an element relative to the document,
     * equal to the offset of the start element, animates its movement from start to end
     * position - offset, equal to the offset of the 'to' element, and after it notifies listeners about
     * animation end event - selected element component subscribes to it and shows up a real selected element,
     * and finally removes the fake element.
     *
     * @param from {jQuery}     jQuery reference to element to start animation from
     * @param to {jQuery}       jQuery reference to element to move to.
     * @param options {Object}  Plugin options
     * @constructor
     * @class SelectedTagMoveAnimationComponent
     */
    function SelectedElementMoveAnimation(from, to, options) {

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
     * SelectedElementMoveAnimation component API.
     *
     * @type {{animate: animate, onAnimationEnd: onAnimationEnd}}
     */
    SelectedElementMoveAnimation.prototype = {

        /**
         * Function which performs element movement animation.
         */
        animate: function () {
            var _this = this,
                fake = this.from.clone(),
                initialOffset = this.from.offset(),
                targetOffset = this.to.offset();

            /* calculating style and current position  - position:absolute is a hack for IE */
            fake.css("position", "absolute").offset(initialOffset);

            /* adding element to body */
            this.body.append(fake);

            /* now, animating movement */
            fake.animate({
                top: targetOffset.top,
                left: targetOffset.left
            }, {
                duration: this.options['selected-element-animation-period'],
                complete: function () {
                    $.fn.addable.utils.notifyListeners(_this.animationEndListeners);
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

    /**
     * ElementAdder class.
     * Provides functionality to subscribe to click event on selected elements.
     *
     * @param container Plugin container
     * @param options   Plugin options
     * @constructor
     * @class ElementAdder
     */
    function ElementAdder(container, options) {
        /**
         * Options reference
         */
        this.options = options;

        /**
         * jQuery reference to container
         */
        this.container = container;

        /**
         * jQuery reference to elements being added
         *
         * @type {jQuery}
         */
        this.elements = container.find("." + options["addable-class"]);

        /**
         * jQuery reference to bucket where the elements will be added to.
         */
        this.bucket = container.find(options["bucket-selector"]);

        /**
         * Placeholder inside the bucket which has to be hidden after the first item is dropped to the bucket.
         */
        this.placeholder = this.bucket.find(options["placeholder-selector"]);

        /**
         * jQuery reference to 'add' button.
         */
        this.addButton = container.find(options["add-button-selector"]);

    }

    /**
     * ElementAdder API.
     *
     * @type {{}}
     */
    ElementAdder.prototype = {
        /**
         * Initializes plugin - binds events, does all the stuff
         */
        init: function () {
            var that = this;

            this.elements.on('click', function () {
                var element = $(this),
                    clone = element.clone(false),
                    animator = new SelectedElementMoveAnimation(element, clone, that.options);

                if (!element.hasClass(that.options["addable-class"])) {
                    clone.remove();
                    return;
                }

                that.placeholder.hide();
                that.add(clone);
                that.markElementsAsAdded(clone);
                animator.onAnimationEnd(function () {
                    clone.css("visibility", "visible");
                    clone.on('click', function () {
                        var backAnimator = new SelectedElementMoveAnimation(clone, element, that.options),
                            cb = function () {
                                that.markElementsAsNotAdded(element);
                            };

                        if (element.is(":visible")) {
                            backAnimator.onAnimationEnd(function () {
                                cb();
                            });
                            backAnimator.animate();
                        } else {
                            cb();
                        }

                        that.remove(clone);
                    });
                });
                animator.animate();
            });

            this.handleAjaxSkillsAdd();
        },

        /**
         * Adds the specified element to the bucket, setting to it visibility: hidden for
         * animation reasons, creates the corresponding hidden input field inside the bucket.
         *
         * @param element {jQuery}  Element to add
         */
        add: function (element) {
            var value = element.data("id"),
                hiddens = this.bucket.find("input[type=hidden][name^='" + this.options["field-name-pre-index-part"] + "']"),
                name = this.options["field-name-pre-index-part"] + hiddens.length + this.options["field-name-post-index-part"],
                currentSubDropDown = this.container.find(this.options["active-sub-dropdown"]),
                optionVal = currentSubDropDown.data('option-type');

            element.css("visibility", "hidden");
            this.bucket.append(element);
            this.bucket.append("<input type='hidden' name='" + name + "' value='" + value + "' />");
            this.addButton.removeAttr("disabled").removeClass(this.options["add-button-inactive-class"]);

            /**
             * analytics PROFILE.COMPARE_ME_ADD_INDIVIDUAL_SKILLS event tracking
             */
            fo.eventHandler.publish(fo.eventHandler.events.COMPARE_ME_ADD_INDIVIDUAL_SKILLS, {
                label: value + ' - ' + optionVal
            });
        },

        /**
         * Removes the specified element from the bucket and recalculates hidden input indexes
         *
         * @param element
         */
        remove: function (element) {
            var that = this,
                value = element.data("id"),
                hidden = this.bucket.find("input[type=hidden][name^='" + this.options["field-name-pre-index-part"] + "'][value='" + value + "']"),
                hiddens;

            hidden.remove();
            hiddens = this.bucket.find("input[type=hidden][name^='" + this.options["field-name-pre-index-part"] + "']");
            hiddens.each(function (i, h) {
                $(h).attr("name", that.options["field-name-pre-index-part"] + i + that.options["field-name-post-index-part"]);
            });
            element.remove();

            if (hiddens.length === 0) {
                that.placeholder.show();
                that.addButton.attr("disabled", "disabled").addClass(that.options["add-button-inactive-class"]);
            }
        },

        /**
         * Function to mark all elements with the same data-id as in the specified one
         * as added.
         *
         * @param element {jQuery}  Element to be marked as added.
         */
        markElementsAsAdded: function (element) {
            this.elements.filter(function (i, item) {
                return $(item).data("id") === element.data("id");
            }).removeClass(this.options["addable-class"]).addClass(this.options["added-class"]);
        },

        /**
         * Function to mark all elements with the same data-id as in the specified one
         * as not-added.
         *
         * @param element {jQuery}  Element to be marked as added.
         */
        markElementsAsNotAdded: function (element) {
            this.elements.filter(function (i, item) {
                return $(item).data("id") === element.data("id");
            }).removeClass(this.options["added-class"]).addClass(this.options["addable-class"]);
        },

        /**
         * Binds click event on 'add skills' button and to send proper request.
         */
        handleAjaxSkillsAdd: function () {
            var that = this,
                form,
                url,
                data;

            this.addButton.on('click', function () {
                if (!that.addButton.hasClass(that.options["add-button-inactive-class"]) &&
                        !that.addButton.hasClass(that.options["add-button-loading-class"])) {
                    form = that.addButton.closest('form');
                    url = form.attr('action');
                    data = $.fn.addable.utils.serializeObject(form);

                    $.ajax({
                        type: "POST",
                        cache: false, //IE caches requests and as a result - 302
                        url: url,
                        data: data,
                        dataType: "xml",
                        beforeSend: $.proxy(that.toggleAddButtonLoadingState, that),
                        success: function (xml) {
                            var
                                /**
                                 * jQuery object that can be traversed and manipulated
                                 * @type jQuery
                                 */
                                $xml = $(xml),

                                /**
                                 * list of elements, where key is id of the target element to be updated
                                 * and value is its escaped value.
                                 * @type XML
                                 */
                                elements = $xml.find('element');

                            that.toggleAddButtonLoadingState();
                            $.each(elements, function (i, el) {
                                var $el = $(el),
                                    k = $el.find('key').text(),
                                    v = $el.find('value').text();

                                $(window).trigger(k + "_refreshed", v);
                            });

                            $(window).trigger("completeness_update_required").trigger("tile.refreshed");

                            /**
                             * analytics PROFILE.COMPARE_ME_ADD_SKILLS_TO_PROFILE_BUTTON  event tracking
                             */
                            fo.eventHandler.publish(fo.eventHandler.events.COMPARE_ME_ADD_SKILLS_TO_PROFILE_BUTTON);
                        },
                        error: function () {
                            that.toggleAddButtonLoadingState();
                        }
                    });
                }
            });
        },

        /**
         * Toggles add button state - to or form loading.
         */
        toggleAddButtonLoadingState: function () {
            this.addButton.toggleClass(this.options["add-button-loading-class"]);
        }
    };

    $.fn.addable = function (o) {
        var
            /**
             * jQuery reference to select element being wrapped by plugin
             *
             * @type {*|HTMLElement}
             */
            that = $(this),

            /**
             * Utilities object
             *
             * @type {{}|jQuery.fn.addablePlugin.utils|*}
             */
            utils = $.fn.addable.utils,

            /**
             * Plugin options.
             */
            options = $.extend({}, defaults, utils.retrieveDataOptions(that), o),

            /**
             * Element added instance
             *
             * @type {ElementAdder}
             */
            elementAdder = new ElementAdder(that, options);

        elementAdder.init();
    };

    /**
     * Set of functions for slidingDropdown plugin.
     *
     * @static
     * @type {{}}
     */
    $.fn.addable.utils = {

        /**
         * Function to retrieve data-options, corresponding to defaults,
         * from element data- attributes.
         *
         * @param element {jQuery} jQuery reference to element to retrieve options from.
         * @returns {{}} Map of property keys and values, extracted from data-attributes.
         */
        retrieveDataOptions: function (element) {
            var result = {},
                option,
                value;

            for (option in defaults) {
                if (defaults.hasOwnProperty(option) && (value = element.data(option))) {
                    result[option] = value;
                }
            }

            return result;
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
         * Form serializer
         *
         * @param form  Form serializer
         * @returns {{}}
         */
        serializeObject: function (form) {
            var o = {},
                a = form.serializeArray();
            $.each(a, function () {
                if (o[this.name] !== undefined) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push(this.value || '');
                } else {
                    o[this.name] = this.value || '';
                }
            });
            return o;
        }
    };
}(jQuery));