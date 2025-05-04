// WOW.js - Animation on scroll
(function() {
    // Initialize animations on scroll
    function init() {
        new WOW().init();
    }

    // WOW.js implementation
    function WOW() {
        this.scrollCallback = this.scrollCallback.bind(this);
        this.scrollHandler = this.scrollHandler.bind(this);
        this.resetAnimation = this.resetAnimation.bind(this);
        this.start = this.start.bind(this);
        this.scrolled = true;
        this.config = {
            boxClass: 'wow',
            animateClass: 'animated',
            offset: 0,
            mobile: true,
            live: true,
            callback: null,
            scrollContainer: null
        };
        this.animationNameCache = new WeakMap();
        this.wowEvent = null;
    }

    WOW.prototype.init = function() {
        this.wowEvent = new Event('wow');
        this.boxes = Array.from(document.getElementsByClassName(this.config.boxClass));
        
        if (this.boxes.length) {
            this.disabled = false;
            this.start();
        } else {
            this.disabled = true;
        }
        
        if (this.config.live) {
            this.live();
        }
    };

    WOW.prototype.start = function() {
        this.resetAnimation();
        this.scrolled = true;
        this.scrollHandler();
        
        const scrollContainer = this.config.scrollContainer || window;
        scrollContainer.addEventListener('scroll', this.scrollCallback, false);
        scrollContainer.addEventListener('touchmove', this.scrollCallback, false);
        scrollContainer.addEventListener('resize', this.scrollCallback, false);
    };

    WOW.prototype.stop = function() {
        const scrollContainer = this.config.scrollContainer || window;
        scrollContainer.removeEventListener('scroll', this.scrollCallback, false);
        scrollContainer.removeEventListener('touchmove', this.scrollCallback, false);
        scrollContainer.removeEventListener('resize', this.scrollCallback, false);
    };

    WOW.prototype.scrollCallback = function() {
        this.scrolled = true;
    };

    WOW.prototype.scrollHandler = function() {
        if (this.scrolled) {
            this.scrolled = false;
            this.boxes.forEach(box => {
                if (box) {
                    if (this.isVisible(box)) {
                        this.show(box);
                    }
                }
            });
        }
    };

    WOW.prototype.resetAnimation = function() {
        this.boxes.forEach(box => {
            if (box) {
                box.style.visibility = 'hidden';
            }
        });
    };

    WOW.prototype.show = function(box) {
        this.applyStyle(box);
        box.style.visibility = 'visible';
        
        const duration = this.getAnimationDuration(box);
        const delay = this.getAnimationDelay(box);
        
        if (duration) {
            this.customSetTimeout(() => {
                this.resetStyle(box);
            }, duration);
        }
        
        if (this.config.callback) {
            this.config.callback(box);
        }
        
        box.dispatchEvent(this.wowEvent);
        
        return box;
    };

    WOW.prototype.applyStyle = function(box) {
        const animationName = this.getAnimationName(box);
        const animationDuration = box.getAttribute('data-wow-duration');
        const animationDelay = box.getAttribute('data-wow-delay');
        
        box.classList.add(this.config.animateClass);
        
        if (animationName) {
            box.classList.add(animationName);
        }
        
        if (animationDuration) {
            this.styleSetProperty(box, 'animation-duration', animationDuration);
        }
        
        if (animationDelay) {
            this.styleSetProperty(box, 'animation-delay', animationDelay);
        }
    };

    WOW.prototype.resetStyle = function(box) {
        box.style.removeProperty('visibility');
        const animationName = this.getAnimationName(box);
        
        if (animationName) {
            box.classList.remove(animationName);
        }
        
        box.classList.remove(this.config.animateClass);
        this.styleRemoveProperty(box, 'animation-duration');
        this.styleRemoveProperty(box, 'animation-delay');
    };

    WOW.prototype.getAnimationName = function(box) {
        let animationName = box.getAttribute('data-wow-animation');
        
        if (!animationName) {
            animationName = this.config.animateClass;
        }
        
        return animationName;
    };

    WOW.prototype.getAnimationDuration = function(box) {
        let duration = box.getAttribute('data-wow-duration');
        
        if (duration) {
            const num = parseFloat(duration);
            const unit = duration.match(/m?s/);
            
            if (unit) {
                switch (unit[0]) {
                    case 'ms':
                        return num;
                    case 's':
                        return num * 1000;
                }
            }
        }
        
        return null;
    };

    WOW.prototype.getAnimationDelay = function(box) {
        let delay = box.getAttribute('data-wow-delay');
        
        if (delay) {
            const num = parseFloat(delay);
            const unit = delay.match(/m?s/);
            
            if (unit) {
                switch (unit[0]) {
                    case 'ms':
                        return num;
                    case 's':
                        return num * 1000;
                }
            }
        }
        
        return null;
    };

    WOW.prototype.isVisible = function(box) {
        const rect = box.getBoundingClientRect();
        const scrollContainer = this.config.scrollContainer || window;
        const viewTop = scrollContainer.scrollY || scrollContainer.pageYOffset;
        const viewBottom = viewTop + Math.min(document.documentElement.clientHeight, window.innerHeight);
        const top = rect.top + viewTop;
        const bottom = top + rect.height;
        const offset = parseInt(box.getAttribute('data-wow-offset') || this.config.offset, 10);
        
        return top <= viewBottom + offset && bottom >= viewTop - offset;
    };

    WOW.prototype.styleSetProperty = function(element, property, value) {
        element.style.setProperty(property, value);
    };

    WOW.prototype.styleRemoveProperty = function(element, property) {
        element.style.removeProperty(property);
    };

    WOW.prototype.customSetTimeout = function(fn, delay) {
        setTimeout(fn, delay);
    };

    WOW.prototype.live = function() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                Array.from(mutation.addedNodes || []).forEach(node => {
                    if (node.nodeType === 1) {
                        if (node.classList.contains(this.config.boxClass)) {
                            this.boxes.push(node);
                            if (!this.disabled) {
                                this.show(node);
                            }
                        }
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    };

    // Initialize when DOM is ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1);
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }

    window.WOW = WOW;
})();