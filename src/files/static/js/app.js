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
