YAHOO.widget.Effects = function(){
    return {
        version: "0.8"
    }
}();
YAHOO.widget.Effects.Hide = function(A){
    this.element = YAHOO.util.Dom.get(A);
    YAHOO.util.Dom.setStyle(this.element, "display", "none");
    YAHOO.util.Dom.setStyle(this.element, "visibility", "hidden")
};
YAHOO.widget.Effects.Hide.prototype.toString = function(){
    return "Effect Hide [" + this.element.id + "]"
};
YAHOO.widget.Effects.Show = function(A){
    this.element = YAHOO.util.Dom.get(A);
    YAHOO.util.Dom.setStyle(this.element, "display", "block");
    YAHOO.util.Dom.setStyle(this.element, "visibility", "visible")
};
YAHOO.widget.Effects.Show.prototype.toString = function(){
    return "Effect Show [" + this.element.id + "]"
};
YAHOO.widget.Effects.Fade = function(F, D){
    this.element = YAHOO.util.Dom.get(F);
    var A = {
        opacity: {
            from: 1,
            to: 0
        }
    };
    this.onEffectComplete = new YAHOO.util.CustomEvent("oneffectcomplete", this);
    var E = ((D && D.ease) ? D.ease : YAHOO.util.Easing.easeOut);
    var C = ((D && D.seconds) ? D.seconds : 1);
    var B = ((D && D.delay) ? D.delay : false);
    this.effect = new YAHOO.util.Anim(this.element, A, C, E);
    this.effect.onComplete.subscribe(function(){
        YAHOO.widget.Effects.Hide(this.element);
        this.onEffectComplete.fire()
    }, this, true);
    if (!B) {
        this.effect.animate()
    }
};
YAHOO.widget.Effects.Fade.prototype.animate = function(){
    this.effect.animate()
};
YAHOO.widget.Effects.Fade.prototype.toString = function(){
    return "Effect Fade [" + this.element.id + "]"
};
YAHOO.widget.Effects.Appear = function(F, D){
    this.element = YAHOO.util.Dom.get(F);
    YAHOO.util.Dom.setStyle(this.element, "opacity", "0");
    YAHOO.widget.Effects.Show(this.element);
    var A = {
        opacity: {
            from: 0,
            to: 1
        }
    };
    this.onEffectComplete = new YAHOO.util.CustomEvent("oneffectcomplete", this);
    var E = ((D && D.ease) ? D.ease : YAHOO.util.Easing.easeOut);
    var C = ((D && D.seconds) ? D.seconds : 3);
    var B = ((D && D.delay) ? D.delay : false);
    this.effect = new YAHOO.util.Anim(this.element, A, C, E);
    this.effect.onComplete.subscribe(function(){
        this.onEffectComplete.fire()
    }, this, true);
    if (!B) {
        this.effect.animate()
    }
};
YAHOO.widget.Effects.Appear.prototype.animate = function(){
    this.effect.animate()
};
YAHOO.widget.Effects.Appear.prototype.toString = function(){
    return "Effect Appear [" + this.element.id + "]"
};
YAHOO.widget.Effects.BlindUp = function(G, D){
    var F = ((D && D.ease) ? D.ease : YAHOO.util.Easing.easeOut);
    var C = ((D && D.seconds) ? D.seconds : 1);
    var B = ((D && D.delay) ? D.delay : false);
    var E = ((D && D.ghost) ? D.ghost : false);
    this.element = YAHOO.util.Dom.get(G);
    this._height = $T.getHeight(this.element);
    this._top = parseInt($D.getStyle(this.element, "top"));
    this._opts = D;
    YAHOO.util.Dom.setStyle(this.element, "overflow", "hidden");
    var A = {
        height: {
            to: 0
        }
    };
    if (E) {
        A.opacity = {
            to: 0,
            from: 1
        }
    }
    this.onEffectComplete = new YAHOO.util.CustomEvent("oneffectcomplete", this);
    if (D && D.bind && (D.bind == "bottom")) {
        var A = {
            height: {
                from: 0,
                to: parseInt(this._height)
            },
            top: {
                from: (this._top + parseInt(this._height)),
                to: this._top
            }
        };
        if (E) {
            A.opacity = {
                to: 1,
                from: 0
            }
        }
    }
    this.effect = new YAHOO.util.Anim(this.element, A, C, F);
    this.effect.onComplete.subscribe(function(){
        if (this._opts && this._opts.bind && (this._opts.bind == "bottom")) {
            YAHOO.util.Dom.setStyle(this.element, "top", this._top + "px")
        }
        else {
            YAHOO.widget.Effects.Hide(this.element);
            YAHOO.util.Dom.setStyle(this.element, "height", this._height)
        }
        YAHOO.util.Dom.setStyle(this.element, "opacity", 1);
        this.onEffectComplete.fire()
    }, this, true);
    if (!B) {
        this.animate()
    }
};
YAHOO.widget.Effects.BlindUp.prototype.prepStyle = function(){
    if (this._opts && this._opts.bind && (this._opts.bind == "bottom")) {
        YAHOO.util.Dom.setStyle(this.element, "height", "0px");
        YAHOO.util.Dom.setStyle(this.element, "top", this._height)
    }
    YAHOO.widget.Effects.Show(this.element)
};
YAHOO.widget.Effects.BlindUp.prototype.animate = function(){
    this.prepStyle();
    this.effect.animate()
};
YAHOO.widget.Effects.BlindUp.prototype.toString = function(){
    return "Effect BlindUp [" + this.element.id + "]"
};
YAHOO.widget.Effects.BlindDown = function(G, D){
    var F = ((D && D.ease) ? D.ease : YAHOO.util.Easing.easeOut);
    var C = ((D && D.seconds) ? D.seconds : 1);
    var B = ((D && D.delay) ? D.delay : false);
    var E = ((D && D.ghost) ? D.ghost : false);
    this.element = YAHOO.util.Dom.get(G);
    this._opts = D;
    this._height = parseInt($T.getHeight(this.element));
    this._top = parseInt($D.getStyle(this.element, "top"));
    YAHOO.util.Dom.setStyle(this.element, "overflow", "hidden");
    var A = {
        height: {
            from: 0,
            to: this._height
        }
    };
    if (E) {
        A.opacity = {
            to: 1,
            from: 0
        }
    }
    this.onEffectComplete = new YAHOO.util.CustomEvent("oneffectcomplete", this);
    if (D && D.bind && (D.bind == "bottom")) {
        var A = {
            height: {
                to: 0,
                from: parseInt(this._height)
            },
            top: {
                to: (this._top + parseInt(this._height)),
                from: this._top
            }
        };
        if (E) {
            A.opacity = {
                to: 0,
                from: 1
            }
        }
    }
    this.effect = new YAHOO.util.Anim(this.element, A, C, F);
    if (D && D.bind && (D.bind == "bottom")) {
        this.effect.onComplete.subscribe(function(){
            YAHOO.widget.Effects.Hide(this.element);
            YAHOO.util.Dom.setStyle(this.element, "top", this._top + "px");
            YAHOO.util.Dom.setStyle(this.element, "height", this._height + "px");
            YAHOO.util.Dom.setStyle(this.element, "opacity", 1);
            this.onEffectComplete.fire()
        }, this, true)
    }
    else {
        this.effect.onComplete.subscribe(function(){
            YAHOO.util.Dom.setStyle(this.element, "opacity", 1);
            this.onEffectComplete.fire()
        }, this, true)
    }
    if (!B) {
        this.animate()
    }
};
YAHOO.widget.Effects.BlindDown.prototype.prepStyle = function(){
    if (this._opts && this._opts.bind && (this._opts.bind == "bottom")) {
    }
    else {
        YAHOO.util.Dom.setStyle(this.element, "height", "0px")
    }
    YAHOO.widget.Effects.Show(this.element)
};
YAHOO.widget.Effects.BlindDown.prototype.animate = function(){
    this.prepStyle();
    this.effect.animate()
};
YAHOO.widget.Effects.BlindDown.prototype.toString = function(){
    return "Effect BlindDown [" + this.element.id + "]"
};
YAHOO.widget.Effects.BlindRight = function(G, D){
    var F = ((D && D.ease) ? D.ease : YAHOO.util.Easing.easeOut);
    var C = ((D && D.seconds) ? D.seconds : 1);
    var B = ((D && D.delay) ? D.delay : false);
    var E = ((D && D.ghost) ? D.ghost : false);
    this.element = YAHOO.util.Dom.get(G);
    this._width = parseInt(YAHOO.util.Dom.getStyle(this.element, "width"));
    this._left = parseInt(YAHOO.util.Dom.getStyle(this.element, "left"));
    this._opts = D;
    YAHOO.util.Dom.setStyle(this.element, "overflow", "hidden");
    this.onEffectComplete = new YAHOO.util.CustomEvent("oneffectcomplete", this);
    var A = {
        width: {
            from: 0,
            to: this._width
        }
    };
    if (E) {
        A.opacity = {
            to: 1,
            from: 0
        }
    }
    if (D && D.bind && (D.bind == "right")) {
        var A = {
            width: {
                to: 0
            },
            left: {
                to: this._left + parseInt(this._width),
                from: this._left
            }
        };
        if (E) {
            A.opacity = {
                to: 0,
                from: 1
            }
        }
    }
    this.effect = new YAHOO.util.Anim(this.element, A, C, F);
    if (D && D.bind && (D.bind == "right")) {
        this.effect.onComplete.subscribe(function(){
            YAHOO.widget.Effects.Hide(this.element);
            YAHOO.util.Dom.setStyle(this.element, "width", this._width + "px");
            YAHOO.util.Dom.setStyle(this.element, "left", this._left + "px");
            this._width = null;
            YAHOO.util.Dom.setStyle(this.element, "opacity", 1);
            this.onEffectComplete.fire()
        }, this, true)
    }
    else {
        this.effect.onComplete.subscribe(function(){
            YAHOO.util.Dom.setStyle(this.element, "opacity", 1);
            this.onEffectComplete.fire()
        }, this, true)
    }
    if (!B) {
        this.animate()
    }
};
YAHOO.widget.Effects.BlindRight.prototype.prepStyle = function(){
    if (this._opts && this._opts.bind && (this._opts.bind == "right")) {
    }
    else {
        YAHOO.util.Dom.setStyle(this.element, "width", "0")
    }
};
YAHOO.widget.Effects.BlindRight.prototype.animate = function(){
    this.prepStyle();
    this.effect.animate()
};
YAHOO.widget.Effects.BlindRight.prototype.toString = function(){
    return "Effect BlindRight [" + this.element.id + "]"
};
YAHOO.widget.Effects.BlindLeft = function(G, D){
    var F = ((D && D.ease) ? D.ease : YAHOO.util.Easing.easeOut);
    var C = ((D && D.seconds) ? D.seconds : 1);
    var B = ((D && D.delay) ? D.delay : false);
    var E = ((D && D.ghost) ? D.ghost : false);
    this.ghost = E;
    this.element = YAHOO.util.Dom.get(G);
    this._width = "100px";
	// YAHOO.util.Dom.getStyle(this.element, "width");
    this._left = parseInt(YAHOO.util.Dom.getStyle(this.element, "left"));
    this._opts = D;
    YAHOO.util.Dom.setStyle(this.element, "overflow", "hidden");
    var A = {
        width: {
            to: 0
        }
    };
    if (E) {
        A.opacity = {
            to: 0,
            from: 1
        }
    }
    this.onEffectComplete = new YAHOO.util.CustomEvent("oneffectcomplete", this);
    if (D && D.bind && (D.bind == "right")) {
        var A = {
            width: {
                from: 0,
                to: parseInt(this._width)
            },
            left: {
                from: this._left + parseInt(this._width),
                to: this._left
            }
        };
        if (E) {
            A.opacity = {
                to: 1,
                from: 0
            }
        }
    }
    this.effect = new YAHOO.util.Anim(this.element, A, C, F);
    if (D && D.bind && (D.bind == "right")) {
        this.effect.onComplete.subscribe(function(){
            this.onEffectComplete.fire()
        }, this, true)
    }
    else {
        this.effect.onComplete.subscribe(function(){
            YAHOO.widget.Effects.Hide(this.element);
            YAHOO.util.Dom.setStyle(this.element, "width", this._width);
            YAHOO.util.Dom.setStyle(this.element, "left", this._left + "px");
            YAHOO.util.Dom.setStyle(this.element, "opacity", 1);
            this._width = null;
            this.onEffectComplete.fire()
        }, this, true)
    }
    if (!B) {
        this.animate()
    }
};
YAHOO.widget.Effects.BlindLeft.prototype.prepStyle = function(){
    if (this._opts && this._opts.bind && (this._opts.bind == "right")) {
        YAHOO.widget.Effects.Hide(this.element);
        YAHOO.util.Dom.setStyle(this.element, "width", "0px");
        YAHOO.util.Dom.setStyle(this.element, "left", parseInt(this._width));
        if (this.ghost) {
            YAHOO.util.Dom.setStyle(this.element, "opacity", 0)
        }
        YAHOO.widget.Effects.Show(this.element)
    }
};
YAHOO.widget.Effects.BlindLeft.prototype.animate = function(){
    this.prepStyle();
    this.effect.animate()
};
YAHOO.widget.Effects.BlindLeft.prototype.toString = function(){
    return "Effect BlindLeft [" + this.element.id + "]"
};
YAHOO.widget.Effects.Fold = function(F, D){
    var E = ((D && D.ease) ? D.ease : YAHOO.util.Easing.easeOut);
    var C = ((D && D.seconds) ? D.seconds : 1);
    var B = ((D && D.delay) ? D.delay : false);
    this.ghost = ((D && D.ghost) ? D.ghost : false);
    this.element = YAHOO.util.Dom.get(F);
    this._to = 5;
    if (!B) {
        YAHOO.widget.Effects.Show(this.element)
    }
    YAHOO.util.Dom.setStyle(this.element, "overflow", "hidden");
    this.done = false;
    this._height = parseInt($T.getHeight(this.element));
    this._width = YAHOO.util.Dom.getStyle(this.element, "width");
    this.onEffectComplete = new YAHOO.util.CustomEvent("oneffectcomplete", this);
    if (D && D.to) {
        this._to = D.to
    }
    var A = {
        height: {
            to: this._to
        }
    };
    this.effect = new YAHOO.util.Anim(this.element, A, C, E);
    this.effect.onComplete.subscribe(function(){
        if (this.done) {
            YAHOO.widget.Effects.Hide(this.element);
            YAHOO.util.Dom.setStyle(this.element, "height", this._height + "px");
            YAHOO.util.Dom.setStyle(this.element, "width", this._width);
            this.onEffectComplete.fire()
        }
        else {
            this.done = true;
            this.effect.attributes = {
                width: {
                    to: 0
                },
                height: {
                    from: this._to,
                    to: this._to
                }
            };
            if (this.ghost) {
                this.effect.attributes.opacity = {
                    to: 0,
                    from: 1
                }
            }
            this.animate()
        }
    }, this, true);
    if (!B) {
        this.animate()
    }
};
YAHOO.widget.Effects.Fold.prototype.animate = function(){
    this.effect.animate()
};
YAHOO.widget.Effects.Fold.prototype.toString = function(){
    return "Effect Fold [" + this.element.id + "]"
};
YAHOO.widget.Effects.UnFold = function(E, C){
    var D = ((C && C.ease) ? C.ease : YAHOO.util.Easing.easeOut);
    var B = ((C && C.seconds) ? C.seconds : 1);
    var A = ((C && C.delay) ? C.delay : false);
    this.ghost = ((C && C.ghost) ? C.ghost : false);
    this.element = YAHOO.util.Dom.get(E);
    this._height = $T.getHeight(this.element);
    this._width = YAHOO.util.Dom.getStyle(this.element, "width");
    this._to = 5;
    YAHOO.util.Dom.setStyle(this.element, "overflow", "hidden");
    this.done = false;
    this.onEffectComplete = new YAHOO.util.CustomEvent("oneffectcomplete", this);
    if (C && C.to) {
        this._to = C.to
    }
    attributes = {
        height: {
            from: 0,
            to: this._to
        },
        width: {
            from: 0,
            to: parseInt(this._width)
        }
    };
    if (this.ghost) {
        attributes.opacity = {
            to: 0.15,
            from: 0
        }
    }
    this.effect = new YAHOO.util.Anim(this.element, attributes, B, D);
    this.effect.onComplete.subscribe(function(){
        if (this.done) {
            this.onEffectComplete.fire();
            this.done = false
        }
        else {
            this.done = true;
            this.effect.attributes = {
                width: {
                    from: parseInt(this._width),
                    to: parseInt(this._width)
                },
                height: {
                    from: this._to,
                    to: parseInt(this._height)
                }
            };
            if (this.ghost) {
                this.effect.attributes.opacity = {
                    to: 1,
                    from: 0.15
                }
            }
            this.effect.animate()
        }
    }, this, true);
    if (!A) {
        this.animate()
    }
};
YAHOO.widget.Effects.UnFold.prototype.prepStyle = function(){
    YAHOO.widget.Effects.Hide(this.element);
    YAHOO.util.Dom.setStyle(this.element, "height", "0px");
    YAHOO.util.Dom.setStyle(this.element, "width", "0px");
    this.effect.attributes = attributes
};
YAHOO.widget.Effects.UnFold.prototype.animate = function(){
    this.prepStyle();
    YAHOO.widget.Effects.Show(this.element);
    this.effect.animate()
};
YAHOO.widget.Effects.UnFold.prototype.toString = function(){
    return "Effect UnFold [" + this.element.id + "]"
};
YAHOO.widget.Effects.ShakeLR = function(F, D){
    this.element = YAHOO.util.Dom.get(F);
    this._offSet = 10;
    this._maxCount = 5;
    this._counter = 0;
    this._elmPos = YAHOO.util.Dom.getXY(this.element);
    var A = {
        left: {
            to: (-this._offSet)
        }
    };
    this.onEffectComplete = new YAHOO.util.CustomEvent("oneffectcomplete", this);
    if (D && D.offset) {
        this._offSet = D.offset
    }
    if (D && D.maxcount) {
        this._maxCount = D.maxcount
    }
    var E = ((D && D.ease) ? D.ease : YAHOO.util.Easing.easeOut);
    var C = ((D && D.seconds) ? D.seconds : 0.25);
    var B = ((D && D.delay) ? D.delay : false);
    this.effect = new YAHOO.util.Anim(this.element, A, C, E);
    this.effect.onComplete.subscribe(function(){
        if (this.done) {
            this.onEffectComplete.fire()
        }
        else {
            if (this._counter < this._maxCount) {
                this._counter++;
                if (this._left) {
                    this._left = null;
                    this.effect.attributes = {
                        left: {
                            to: (-this._offSet)
                        }
                    }
                }
                else {
                    this._left = true;
                    this.effect.attributes = {
                        left: {
                            to: this._offSet
                        }
                    }
                }
                this.effect.animate()
            }
            else {
                this.done = true;
                this._left = null;
                this._counter = null;
                this.effect.attributes = {
                    left: {
                        to: 0
                    }
                };
                this.effect.animate()
            }
        }
    }, this, true);
    if (!B) {
        this.effect.animate()
    }
};
YAHOO.widget.Effects.ShakeLR.prototype.animate = function(){
    this.effect.animate()
};
YAHOO.widget.Effects.ShakeLR.prototype.toString = function(){
    return "Effect ShakeLR [" + this.element.id + "]"
};
YAHOO.widget.Effects.ShakeTB = function(F, D){
    this.element = YAHOO.util.Dom.get(F);
    this._offSet = 10;
    this._maxCount = 5;
    this._counter = 0;
    this._elmPos = YAHOO.util.Dom.getXY(this.element);
    var A = {
        top: {
            to: (-this._offSet)
        }
    };
    if (D && D.offset) {
        this._offSet = D.offset
    }
    if (D && D.maxcount) {
        this._maxCount = D.maxcount
    }
    this.onEffectComplete = new YAHOO.util.CustomEvent("oneffectcomplete", this);
    var E = ((D && D.ease) ? D.ease : YAHOO.util.Easing.easeOut);
    var C = ((D && D.seconds) ? D.seconds : 0.25);
    var B = ((D && D.delay) ? D.delay : false);
    this.effect = new YAHOO.util.Anim(this.element, A, C, E);
    this.effect.onComplete.subscribe(function(){
        if (this.done) {
            this.onEffectComplete.fire()
        }
        else {
            if (this._counter < this._maxCount) {
                this._counter++;
                if (this._left) {
                    this._left = null;
                    this.effect.attributes = {
                        top: {
                            to: (-this._offSet)
                        }
                    }
                }
                else {
                    this._left = true;
                    this.effect.attributes = {
                        top: {
                            to: this._offSet
                        }
                    }
                }
                this.effect.animate()
            }
            else {
                this.done = true;
                this._left = null;
                this._counter = null;
                this.effect.attributes = {
                    top: {
                        to: 0
                    }
                };
                this.effect.animate()
            }
        }
    }, this, true);
    if (!B) {
        this.effect.animate()
    }
};
YAHOO.widget.Effects.ShakeTB.prototype.animate = function(){
    this.effect.animate()
};
YAHOO.widget.Effects.ShakeTB.prototype.toString = function(){
    return "Effect ShakeTB [" + this.element.id + "]"
};
YAHOO.widget.Effects.Drop = function(F, D){
    this.element = YAHOO.util.Dom.get(F);
    this._height = parseInt($T.getHeight(this.element));
    this._top = parseInt($D.getStyle(this.element, "top"));
    var A = {
        top: {
            from: this._top,
            to: (this._top + this._height)
        },
        opacity: {
            from: 1,
            to: 0
        }
    };
    this.onEffectComplete = new YAHOO.util.CustomEvent("oneffectcomplete", this);
    var E = ((D && D.ease) ? D.ease : YAHOO.util.Easing.easeIn);
    var C = ((D && D.seconds) ? D.seconds : 1);
    var B = ((D && D.delay) ? D.delay : false);
    this.effect = new YAHOO.util.Anim(this.element, A, C, E);
    this.effect.onComplete.subscribe(function(){
        YAHOO.widget.Effects.Hide(this.element);
        YAHOO.util.Dom.setStyle(this.element, "top", this._top + "px");
        YAHOO.util.Dom.setStyle(this.element, "opacity", 1);
        this.onEffectComplete.fire()
    }, this, true);
    if (!B) {
        this.animate()
    }
};
YAHOO.widget.Effects.Drop.prototype.animate = function(){
    this.effect.animate()
};
YAHOO.widget.Effects.Drop.prototype.toString = function(){
    return "Effect Drop [" + this.element.id + "]"
};
YAHOO.widget.Effects.Pulse = function(F, D){
    this.element = YAHOO.util.Dom.get(F);
    this._counter = 0;
    this._maxCount = 9;
    var A = {
        opacity: {
            from: 1,
            to: 0
        }
    };
    if (D && D.maxcount) {
        this._maxCount = D.maxcount
    }
    this.onEffectComplete = new YAHOO.util.CustomEvent("oneffectcomplete", this);
    var E = ((D && D.ease) ? D.ease : YAHOO.util.Easing.easeIn);
    var C = ((D && D.seconds) ? D.seconds : 0.25);
    var B = ((D && D.delay) ? D.delay : false);
    this.effect = new YAHOO.util.Anim(this.element, A, C, E);
    this.effect.onComplete.subscribe(function(){
        if (this.done) {
            this.onEffectComplete.fire()
        }
        else {
            if (this._counter < this._maxCount) {
                this._counter++;
                if (this._on) {
                    this._on = null;
                    this.effect.attributes = {
                        opacity: {
                            to: 0
                        }
                    }
                }
                else {
                    this._on = true;
                    this.effect.attributes = {
                        opacity: {
                            to: 1
                        }
                    }
                }
                this.effect.animate()
            }
            else {
                this.done = true;
                this._on = null;
                this._counter = null;
                this.effect.attributes = {
                    opacity: {
                        to: 1
                    }
                };
                this.effect.animate()
            }
        }
    }, this, true);
    if (!B) {
        this.effect.animate()
    }
};
YAHOO.widget.Effects.Pulse.prototype.animate = function(){
    this.effect.animate()
};
YAHOO.widget.Effects.Pulse.prototype.toString = function(){
    return "Effect Pulse [" + this.element.id + "]"
};
YAHOO.widget.Effects.Shrink = function(F, D){
    this.start_elm = YAHOO.util.Dom.get(F);
    this.element = this.start_elm.cloneNode(true);
    this.start_elm.parentNode.replaceChild(this.element, this.start_elm);
    YAHOO.widget.Effects.Hide(this.start_elm);
    YAHOO.util.Dom.setStyle(this.element, "overflow", "hidden");
    this.onEffectComplete = new YAHOO.util.CustomEvent("oneffectcomplete", this);
    var E = ((D && D.ease) ? D.ease : YAHOO.util.Easing.easeOut);
    var C = ((D && D.seconds) ? D.seconds : 1);
    var B = ((D && D.delay) ? D.delay : false);
    var A = {
        width: {
            to: 0
        },
        height: {
            to: 0
        },
        fontSize: {
            from: 100,
            to: 0,
            unit: "%"
        },
        opacity: {
            from: 1,
            to: 0
        }
    };
    this.effect = new YAHOO.util.Anim(this.element, A, C, E);
    this.effect.onComplete.subscribe(function(){
        this.element.parentNode.replaceChild(this.start_elm, this.element);
        this.onEffectComplete.fire()
    }, this, true);
    if (!B) {
        this.effect.animate()
    }
};
YAHOO.widget.Effects.Shrink.prototype.animate = function(){
    this.effect.animate()
};
YAHOO.widget.Effects.Shrink.prototype.toString = function(){
    return "Effect Shrink [" + this.element.id + "]"
};
YAHOO.widget.Effects.Grow = function(H, F){
    this.element = YAHOO.util.Dom.get(H);
    var E = parseInt($T.getHeight(this.element));
    var A = parseInt(YAHOO.util.Dom.getStyle(this.element, "width"));
    YAHOO.util.Dom.setStyle(this.element, "overflow", "hidden");
    this.onEffectComplete = new YAHOO.util.CustomEvent("oneffectcomplete", this);
    var G = ((F && F.ease) ? F.ease : YAHOO.util.Easing.easeOut);
    var D = ((F && F.seconds) ? F.seconds : 1);
    var C = ((F && F.delay) ? F.delay : false);
    var B = {
        width: {
            to: A,
            from: 0
        },
        height: {
            to: E,
            from: 0
        },
        fontSize: {
            from: 0,
            to: 100,
            unit: "%"
        },
        opacity: {
            from: 0,
            to: 1
        }
    };
    this.effect = new YAHOO.util.Anim(this.element, B, D, G);
    this.effect.onComplete.subscribe(function(){
        this.onEffectComplete.fire()
    }, this, true);
    if (!C) {
        this.animate()
    }
};
YAHOO.widget.Effects.Grow.prototype.animate = function(){
    this.effect.animate()
};
YAHOO.widget.Effects.Grow.prototype.toString = function(){
    return "Effect Grow [" + this.element.id + "]"
};
YAHOO.widget.Effects.TV = function(F, D){
    var E = ((D && D.ease) ? D.ease : YAHOO.util.Easing.easeIn);
    var C = ((D && D.seconds) ? D.seconds : 1);
    var B = ((D && D.delay) ? D.delay : false);
    this.element = YAHOO.util.Dom.get(F);
    this.done = false;
    this._height = parseInt($T.getHeight(this.element));
    this._width = parseInt(YAHOO.util.Dom.getStyle(this.element, "width"));
    YAHOO.util.Dom.setStyle(this.element, "overflow", "hidden");
    var A = {
        top: {
            from: 0,
            to: (this._height / 2)
        },
        height: {
            to: 5
        }
    };
    this.onEffectComplete = new YAHOO.util.CustomEvent("oneffectcomplete", this);
    this.effect = new YAHOO.util.Anim(this.element, A, C, E);
    this.effect.onComplete.subscribe(function(){
        if (this.done) {
            this.onEffectComplete.fire();
            YAHOO.widget.Effects.Hide(this.element);
            YAHOO.util.Dom.setStyle(this.element, "height", this._height + "px");
            YAHOO.util.Dom.setStyle(this.element, "width", this._width + "px");
            YAHOO.util.Dom.setStyle(this.element, "top", "");
            YAHOO.util.Dom.setStyle(this.element, "left", "");
            YAHOO.util.Dom.setStyle(this.element, "opacity", "1")
        }
        else {
            this.done = true;
            this.effect.attributes = {
                top: {
                    from: (this._height / 2),
                    to: (this._height / 2)
                },
                left: {
                    from: 0,
                    to: (this._width / 2)
                },
                height: {
                    from: 5,
                    to: 5
                },
                width: {
                    to: 5
                },
                opacity: {
                    from: 1,
                    to: 0
                }
            };
            this.effect.animate()
        }
    }, this, true);
    if (!B) {
        this.animate()
    }
};
YAHOO.widget.Effects.TV.prototype.animate = function(){
    this.effect.animate()
};
YAHOO.widget.Effects.TV.prototype.toString = function(){
    return "Effect TV [" + this.element.id + "]"
};
YAHOO.widget.Effects.Shadow = function(K, A){
    var D = ((A && A.delay) ? A.delay : false);
    var F = ((A && A.top) ? A.top : 8);
    var B = ((A && A.left) ? A.left : 8);
    var H = ((A && A.color) ? A.color : "#ccc");
    var G = ((A && A.opacity) ? A.opacity : 0.75);
    this.element = YAHOO.util.Dom.get(K);
    if (YAHOO.util.Dom.get(this.element.id + "_shadow")) {
        this.shadow = YAHOO.util.Dom.get(this.element.id + "_shadow")
    }
    else {
        this.shadow = document.createElement("div");
        this.shadow.id = this.element.id + "_shadow";
        this.element.parentNode.appendChild(this.shadow)
    }
    var E = parseInt($T.getHeight(this.element));
    var J = parseInt(YAHOO.util.Dom.getStyle(this.element, "width"));
    var I = this.element.style.zIndex;
    if (!I) {
        I = 1;
        this.element.style.zIndex = I
    }
    YAHOO.util.Dom.setStyle(this.element, "overflow", "hidden");
    YAHOO.util.Dom.setStyle(this.shadow, "height", E + "px");
    YAHOO.util.Dom.setStyle(this.shadow, "width", J + "px");
    YAHOO.util.Dom.setStyle(this.shadow, "background-color", H);
    YAHOO.util.Dom.setStyle(this.shadow, "opacity", 0);
    YAHOO.util.Dom.setStyle(this.shadow, "position", "absolute");
    this.shadow.style.zIndex = (I - 1);
    var L = YAHOO.util.Dom.getXY(this.element);
    this.onEffectComplete = new YAHOO.util.CustomEvent("oneffectcomplete", this);
    var C = {
        opacity: {
            from: 0,
            to: G
        },
        top: {
            from: L[1],
            to: (L[1] + F)
        },
        left: {
            from: L[0],
            to: (L[0] + B)
        }
    };
    this.effect = new YAHOO.util.Anim(this.shadow, C);
    this.effect.onComplete.subscribe(function(){
        this.onEffectComplete.fire()
    }, this, true);
    if (!D) {
        this.animate()
    }
};
YAHOO.widget.Effects.Shadow.prototype.animate = function(){
    this.effect.animate()
};
YAHOO.widget.Effects.Shadow.prototype.toString = function(){
    return "Effect Shadow [" + this.element.id + "]"
};
YAHOO.widget.Effects.Puff = function(O, B){
    var G = YAHOO.util.Dom.get(O);
    this.element = start_this.element.cloneNode(true);
    start_this.element.parentNode.replaceChild(this.element, G);
    YAHOO.widget.Effects.Hide(G);
    var P = YAHOO.util.Dom.getXY(this.element);
    var H = parseInt($T.getHeight(this.element));
    var N = parseInt(YAHOO.util.Dom.getStyle(this.element, "width"));
    var C = ((H / 2) + H);
    var K = ((N / 2) + N);
    var M = ((C - H) / 2);
    var J = ((K - N) / 2);
    var L = P[1] - M;
    var A = P[0] - J;
    YAHOO.util.Dom.setStyle(this.element, "position", "absolute");
    var F = {
        top: {
            to: L
        },
        left: {
            to: A
        },
        width: {
            to: K
        },
        height: {
            to: C
        },
        opacity: {
            from: 1,
            to: 0
        }
    };
    var E = ((B && B.ease) ? B.ease : YAHOO.util.Easing.easeOut);
    var I = ((B && B.seconds) ? B.seconds : 1);
    var D = new YAHOO.util.Anim(this.element, F, I, E);
    D.onComplete.subscribe(function(){
        this.element = this.getEl();
        this.element.parentNode.replaceChild(G, elm)
    });
    D.animate();
    return D
};
if (!YAHOO.Tools) {
    $T = {
        getHeight: function(A){
            return YAHOO.util.Dom.getStyle(A, "height")
        }
    }
};