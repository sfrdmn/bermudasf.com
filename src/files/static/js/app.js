;(function() {

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

///// MainView /////

var MainView = Base.extend({

  initialize: function() {
    this.$nav = $('nav');
    this.$bagEls = $('.item');

    this.initializeImprint();
    this.initializeNavHighlights();
    this.initializeNavEffect();
    this.createBagViews();
  },

  initializeImprint: function() {
    var $imprint = this.$imprint = $('.imprint');
    $('#imprint-link').click(onClickOpen);
    $('.imprint .close').click(onClickClose);
    function onClickOpen(e) {
      e.preventDefault();
      $imprint.addClass('active');
    }
    function onClickClose(e) {
      e.preventDefault();
      $imprint.removeClass('active');
    }
  },

  initializeNavHighlights: function() {
    var $window = $(window);
    var $nav = $('.nav-container nav');
    var aboutOffset = $('#info').offset().top;
    var shopOffset = $('#shop').offset().top;
    var activeLink = $('.nav-link.info');;

    function onScroll(e) {
      if ($window.scrollTop() > aboutOffset) {
        $nav.find('.nav-link.info').addClass
      } else if ($window.scrollTop() > shopOffset) {

      }
    }
  },

  initializeNavEffect: function() {
    var $header = $('body > header');
    var $nav = $header.find('nav');
    var navHeight = $nav.height();
    var fixedOffset = 34; // pixels from top of fixed nav
    var isFixed = true;
    function onScrollResize() {
      var bbox = $header[0].getBoundingClientRect();
      var offset = bbox.bottom - navHeight;
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
  },

  createBagViews: function() {
    var that = this;
    this.bagHovers = [];

    this.$bagEls.each(function(i, el) {
      that.bagHovers.push(new BagView(el));
    });
  }

});

///// DesktopView /////

var DesktopView = MainView.extend({

  initialize: function(el) {
    MainView.prototype.initialize.apply(this, arguments);
    this.$nav.delegate('a', 'click', bind(this.onClickNav, this));
    $('#scroll-to-top').bind('click', bind(this.onClickNav, this));
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

///// BagView /////

var BagView = Base.extend({

  isMobile: function() {
    return Modernizr.touch;
  },

  initialize: function(el) {
    this.el = el;
    this.$el = $(el);
    this.$images = this.$el.find('img');
    this.$list = this.$el.find('ul.low-res');

    this.preloadImages();
    this.addHoverClass();
    if (this.$images.length > 1) {
      if (this.isMobile()) {
        this.$list.delegate('img', 'swipeLeft', bind(this.next, this));
        this.$list.delegate('img', 'swipeRight', bind(this.previous, this));
      } else {
        this.$list.delegate('img', 'click', bind(this.onClick, this));
        this.$list.bind('mouseenter', bind(this.onMouseEnter, this));
        this.$list.bind('mouseleave', bind(this.onMouseLeave, this));
      }
    }
  },

  addHoverClass: function() {
    if (this.$images.length > 1) {
      this.$list.addClass('slideshow');
    }
  },

  isLeftRegion: function(e) {
    var $el = $(e.currentTarget);
    var offsetX = e.pageX - $el.offset().left;
    console.log(offsetX, $el.offset(), e);
    if (offsetX < $el.width() / 2 - 40) { // 40 us half width of cursor
      return true;
    } else {
      return false;
    }
  },

  onClick: function(e) {
    if (this.isLeftRegion(e)) {
      this.previous();
    } else {
      this.next();
    }
  },

  onMouseEnter: function(e) {
    console.log('Mouse enter!');
    $(e.currentTarget).bind('mousemove', throttle(bind(this.onMouseMove, this), 100));
  },

  onMouseLeave: function(e) {
    console.log('Mouse leave!');
    $(e.currentTarget).unbind('mousemove');
  },

  currentMouseOver: null,

  onMouseMove: function(e) {
    console.log('Mouse over!');
    var $el = $(e.currentTarget);
    if (this.isLeftRegion(e)) {
      if (this.currentMouseOver !== -1) {
        this.currentMouseOver = -1;
        $(e.currentTarget).removeClass('hover-right');
        $(e.currentTarget).addClass('hover-left');
      }
    } else {
        if (this.currentMouseOver !== 1) {
          this.currentMouseOver = 1;
          $(e.currentTarget).removeClass('hover-left');
          $(e.currentTarget).addClass('hover-right');
        }
    }
  },

  previous: function() {
    var $first = this.$list.find('li:first-child');
    $first.remove();
    this.$list.append($first);
  },

  next: function() {
    var $last = this.$list.find('li:last-child');
    $last.remove();
    this.$list.prepend($last);
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

///// ROUTER /////

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

window['app'] = new App();

})();
