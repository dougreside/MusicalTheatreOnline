/**
 * Copyright (c) 2008, Matt Snider, LLC. All rights reserved.
 * Version: 1
 */

/**
 * This object controls the blind up/down animation.
 * @namespace Core.Widget
 * @class BlindAnimator
 * @dependencies yahoo-dom-event.js, animation.js, core.js, object.js
 */
BlindAnimator = function(id, cfg) {
    // local namespace
    var Anim = YAHOO.util.Anim,
        config = Object.is(cfg) ? cfg : {},
        Dom = YAHOO.util.Dom,
        F = function() {},
        isDown = false,
        that = null;

    // DOM namespace
    var dom = {
        node : Dom.get(id)
    };

    if (! dom.node) {return;} // node is required

    // update config
    if (! config.animSpeedDown) {config.animSpeedDown = 0.5;}
    if (! config.animSpeedUp) {config.animSpeedUp = 0.5;}
    if (! config.bottomPadding) {config.bottomPadding = 0;}
    if (! config.minHeight) {config.minHeight = 0;}
    if (! config.maxHeight) {
        var r = Dom.getRegion(dom.node);
        config.maxHeight = r.bottom - r.top;
        isDown = true;
    }
    
    // initialize animations
    var anim = {
        blindDown: new Anim(dom.node, {height: {from: config.minHeight, to: config.maxHeight}}, config.animSpeedDown, config.easing),
        blindUp: new Anim(dom.node, {height: {from: config.maxHeight, to: config.minHeight}}, config.animSpeedUp, config.easing)
    };

    // setup animations
    anim.blindDown.onStart.subscribe(function() {Dom.setStyle(dom.node, 'overflow', 'hidden');});
    anim.blindUp.onComplete.subscribe(function() {Dom.setStyle(dom.node, 'overflow', 'visible');});
    anim.blindDown._onComplete.subscribe(function() {isDown = true;});
    anim.blindUp._onComplete.subscribe(function() {isDown = false;});

    // scrolls the page as the bind opens
    if (config.scrollToViewport) {
        anim.blindDown._onTween.subscribe(function() { // handles scrolling the window to fit during animation
            var dim = Dom.getRegion(dom.node),
                offset = Core.Client.getScrollOffset(),
                view = Core.Client.getViewportSize(),
                pos = dim.bottom + config.bottomPadding,
                bottom = offset.y + view.y;

            if (pos > bottom) {
                window.scroll(0, offset.y + pos - bottom);
            }
        });
    }

    // public namespace
    F.prototype = {

        /**
         * Begins the blind down animation.
         * @method blindDown
         * @public
         */
        blindDown: function() {
            that.stop();
            anim.blindDown.animate();
        },

        /**
         * Begins the blind up animation.
         * @method blindUp
         * @public
         */
        blindUp: function() {
            that.stop();
            anim.blindUp.animate();
        },

        /**
         * Immediately stops both animations, and jumps to final blind-up position.
         * @method stop
         * @public
         */
        stop: function() {
            anim.blindDown.stop();
            anim.blindUp.stop();
        },

        /**
         * Rotate between blind down and up.
         * @method toggle
         * @public
         */
        toggle: function() {
            that[isDown ? 'blindUp' : 'blindDown']();
        },

        /**
         * Subscribe to the animations.
         * @method subscribe
         * @param name {String} Required. The name of the event: onStart, _onStart, onComplete, _onComplete, onTween, _onTween.
         * @param fn {Function} Required. Callback function for custom event.
         * @param isUp {Boolean} Optional. True, when subscribing to blindUp, false for blindDown.
         * @param o {Object} Optional. An optional pass-through variable.
         * @public
         */
        subscribe: function(name, fn, isUp, o) {
            var a = isUp ? anim.blindUp : anim.blindDown;

            if (a[name] && a[name].subscribe) {
                a[name].subscribe(fn, o);
            }
        }
    };

    that = new F();
    return that;
};