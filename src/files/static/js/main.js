;(function(context) {

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

    isIOS: function() {
      return navigator.userAgent.match(/iPhone/i) ||
          navigator.userAgent.match(/iPad/i) ||
          navigator.userAgent.match(/iPod/i);
    },

    roundToNth: function(num, n) {
      var factor = Math.pow(10, n);
      return Math.round(num * factor) / factor;
    },

  };

  var bind = Util.bind;

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

  ///// MainView /////

  var MainView = Base.extend({

    initialize: function() {
      this.$nav = $('nav');
      this.$bagEls = $('.item');

      this.createBagShows();
    },

    createBagShows: function() {
      var that = this;
      this.bagHovers = [];

      this.$bagEls.each(function(i, el) {
        that.bagHovers.push(new BagShow(el));
      });
    }

  });

  ///// DesktopView /////

  var DesktopView = MainView.extend({

    initialize: function(el) {
      MainView.prototype.initialize.apply(this, arguments);
      this.$nav.delegate('a', 'click', bind(this.onClickNav, this));
    },

    onClickNav: function(e) {
      e.preventDefault();
      var target = $(e.currentTarget).data('id');
      var $target = $('#' + target);
      $.scrollTo($target, config.scrollSpeed);
    }

  });

  ///// MobileView /////

  var MobileView = MainView.extend({

    initialize: function(el) {
      MainView.prototype.initialize.apply(this, arguments);
    }

  });

  ///// BagShow /////

  var BagShow = Base.extend({

    initialize: function(el) {
      this.el = el;
      this.$el = $(el);
      this.$images = this.$el.find('img');
      this.$list = this.$el.find('ul.low-res');

      this.preloadImages();
      this.addHoverClass();
      if (this.$images.length > 1) {
        this.$list.delegate('img', 'click', bind(this.next, this));
      }
    },

    addHoverClass: function() {
      if (this.$images.length > 1) {
        this.$list.addClass('slideshow');
      }
    },

    next: function() {
      var current = this.$list.find('li:first-child');
      current.remove();
      this.$list.append(current);
    },

    preloadImages: function() {
      var that = this;
      this.imageCache = {};

      this.$images.each(function(i, el) {
        var src = $(el).attr('src');
        var image = new Image();
        image.src = src;
        that.imageCache[src] = image;
        image.onload = function() {
          delete that.imageCache[src];
        };
      });
    }

  });

  ///// App /////

  function App() {
    this.route();
  }

  App.prototype.route = function() {
    if (Util.isIOS()) {
      this.view = new MobileView();
    } else {
      this.view = new DesktopView();
    }
  };

  context['app'] = new App();

})(window);
;(function() {
  $(function() {
    var $header = $('body > header');
    var $nav = $header.find('nav');
    var navHeight = $nav.height();
    var fixedOffset = 34;
    var isFixed = true;
    function onScrollResize() {
      var bbox = $header[0].getBoundingClientRect();
      var offset = bbox.bottom - navHeight;
      console.log(bbox, offset);
      if (offset <= fixedOffset) {
        isFixed = false;
        var delta = fixedOffset - offset;
        $nav.css({'bottom': -delta})
      } else if (!isFixed) {
        isFixed = true;
        $nav.css({'bottom': 0});
      }
    };
    $(window).on('scroll resize', onScrollResize);
  });

})();
