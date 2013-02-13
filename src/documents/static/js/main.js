;(function() {
  $(function() {
    var $header = $('body > header');
    var $nav = $header.children('nav');
    var navHeight = $nav.height();
    var fixedOffset = 33;
    var isFixed = true;
    function onScrollResize() {
      var bbox = $header[0].getBoundingClientRect();
      var offset = bbox.bottom - navHeight;
      if (offset <= fixedOffset) {
        isFixed = false;
        var delta = fixedOffset - offset;
        $nav.css({'bottom': -Util.roundToNth(delta, 4)})
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
