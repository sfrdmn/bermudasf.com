;(function(context) {

  var Util = {
    bind: function(fn, obj) {
      return function() {
        fn.apply(obj, arguments);
      };
    }
  };

  var config = {

    scrollSpeed: 800

  };

  function MainView() {
    this.$nav = $('nav');
    this.$bagEls = $('.item');

    this.createBagHovers();
    this.$nav.delegate('a', 'click', Util.bind(this.onClickNav, this));
  }

  MainView.prototype.onClickNav = function(e) {
    e.preventDefault();
    var target = $(e.currentTarget).data('id');
    var $target = $('#' + target);
    $.scrollTo($target, config.scrollSpeed);
    console.log('woo!');
  };

  MainView.prototype.createBagHovers = function() {
    var that = this;
    this.bagHovers = [];

    this.$bagEls.each(function(i, el) {
      that.bagHovers.push(new BagHover(el));
    });
  };

  function BagHover(el) {
    this.el = el;
    this.$el = $(el);
    this.$images = this.$el.find('img');
    this.$list = this.$el.find('ul.low-res');

    this.addHoverClass();
    this.preloadImages();
    this.$list.delegate('img', 'click', Util.bind(this.next, this));
    this.$list.delegate('img', 'hover', Util.bind(this.onHover, this));
    //this.delegateEvents();
  }

  BagHover.prototype.addHoverClass = function() {
    if (this.$images.length > 1) {
      this.$list.addClass('slideshow');
    }
  };

  BagHover.prototype.startSlideShow = function() {
    var that = this;
    var onTimeout = function() {
      that.next();
      that.timeout = setTimeout(onTimeout, BagHover.INTERVAL);
    };
    onTimeout();
  };

  BagHover.prototype.stopSlideShow = function() {
    clearTimeout(this.timeout);
  };

  BagHover.prototype.next = function() {
    var current = this.$list.find('li:first-child');
    current.remove();
    this.$list.append(current);
  };

  BagHover.prototype.onHover = function(e) {
    var width = $(e.currentTarget).width();

  };

//  BagHover.prototype.next = function() {
//    var that = this;
//    var current = this.$list.find('li:first-child');
//    current.animate({
//      'margin-left': - BagHover.IMAGE_SIZE
//    }, BagHover.DURATION, BagHover.EASING, function() {
//        current.remove();
//        current.css('margin-left', 0);
//        that.$list.append(current);
//    });
//  };

  BagHover.prototype.delegateEvents = function() {
    this.$list.filter('.slideshow')
        .on('click', Util.bind(this.next, this));
  };

  BagHover.prototype.preloadImages = function() {
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
  };

  BagHover.INTERVAL = 1500;
  BagHover.IMAGE_SIZE = 350;
  BagHover.DURATION = 750;
  BagHover.EASING = null;

  function App() {
    this.route();
  }

  App.prototype.route = function() {
    this.view = new MainView();
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

  var Util = {

    roundToNth: function(num, n) {
      var factor = Math.pow(10, n);
      return Math.round(num * factor) / factor;
    },

    bind: function(fn, obj) {
      return function() {
        fn.apply(obj, arguments);
      };
    }

  };
})();
