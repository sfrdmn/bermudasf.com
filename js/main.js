;(function(context) {

  var Util = {
    bind: function(fn, obj) {
      return function() {
        fn.apply(obj, arguments);
      };
    }
  };

  function MainView() {
    this.$bagEls = $('.bag');
    this.bagHovers = [];

    this.createBagHovers();
  }

  MainView.prototype.createBagHovers = function() {
    var that = this;

    this.$bagEls.each(function(i, el) {
      that.bagHovers.push(new BagHover(el));
    });
  };

  function BagHover(el) {
    this.el = el;
    this.$el = $(el);
    this.$images = this.$el.children('img');
    this.$list = this.$el.children('ul');

    this.preloadImages();
    this.delegateEvents();
  }

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
    var current = this.$list.children('li:first-child');
    current.remove();
    this.$list.append(current);
  };

  BagHover.prototype.delegateEvents = function() {
    this.$el.on('mouseenter', Util.bind(this.onMouseOver, this));
    this.$el.on('mouseleave', Util.bind(this.onMouseOut, this));
  };

  BagHover.prototype.onMouseOver = function(e) {
    e.stopPropagation();
    this.startSlideShow();
  };

  BagHover.prototype.onMouseOut = function() {
    this.stopSlideShow();
  };

  BagHover.prototype.preloadImages = function() {
    this.imageCache = {};

    this.$images.each(function(i, el) {
      var src = $(el).attr('src');
      var image = new Image();
      image.src = src;
      imageCache[src] = image;
      image.onload = function() {
        delete imageCache[src];
      };
    });
  };

  BagHover.INTERVAL = 1500;

  function App() {
    this.view = new MainView();
  }

  context['app'] = new App();

})(window);
