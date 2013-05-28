///// Misc /////

var config = {
  scrollSpeed: 800
};


var Util = {

  bind: function(fn, obj) {
    return function() {
      fn.apply(obj, arguments);
    };
  },

  throttle: function(fn, delay) {
    var isReady = true;
    return function() {
      if (isReady) {
        isReady = false;
        setTimeout(function() {
          isReady = true; 
        }, delay);
        fn.apply(this, arguments);
      }
    };
  },

  isIOS: function() {
    return navigator.userAgent.match(/(iPhone|iPad|iPod)/i);
  },

  roundToNth: function(num, n) {
    var factor = Math.pow(10, n);
    return Math.round(num * factor) / factor;
  },

};

var bind = Util.bind;
var throttle = Util.throttle;

///// Base /////

var Base = {

  extend: function(props) {
    var ctor = function() {
      if (this.initialize) {
        result = this.initialize.apply(this, arguments);
      }
      return result ? result : this;
    };
    var temp = function() {
      this.constructor = ctor;
    };

    temp.prototype = this.prototype;
    ctor.prototype = new temp();
    $.extend(ctor.prototype, props || {});
    $.extend(ctor, Base);
    return ctor;
  }

};
