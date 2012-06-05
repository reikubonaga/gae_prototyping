(function() {
  var MainView,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  MainView = (function(_super) {

    __extends(MainView, _super);

    function MainView() {
      MainView.__super__.constructor.apply(this, arguments);
    }

    MainView.prototype.initialize = function() {
      return $("#searchbar").focus();
    };

    MainView.prototype.el = "body";

    MainView.prototype.events = {
      "keydown #searchbar": "search"
    };

    MainView.prototype.search = function(e) {
      if (e.keyCode === 13) {
        location.href = "http://google.com/?#q=" + $("#searchbar").val() + "&output=search";
      }
      if (e.keyCode === 9) {
        $("#searchbar").focus();
        return false;
      }
    };

    return MainView;

  })(Backbone.View);

  $(function() {
    var view;
    view = new MainView;
    return console.log("se");
  });

}).call(this);
