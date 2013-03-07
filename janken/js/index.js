(function() {
  var JankenView,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  if (typeof App === "undefined" || App === null) App = {};

  App.User = (function(_super) {

    __extends(User, _super);

    function User() {
      User.__super__.constructor.apply(this, arguments);
    }

    return User;

  })(Backbone.Model);

  App.Users = (function(_super) {

    __extends(Users, _super);

    function Users() {
      Users.__super__.constructor.apply(this, arguments);
    }

    Users.prototype.model = App.User;

    Users.prototype.localStorage = new Store("janken-user");

    return Users;

  })(Backbone.Collection);

  App.Janken = (function(_super) {

    __extends(Janken, _super);

    function Janken() {
      Janken.__super__.constructor.apply(this, arguments);
    }

    Janken.gu = 1;

    Janken.choki = -1;

    Janken.pa = 0;

    Janken.rand = function() {
      var rand;
      return rand = Math.random() * 3 | 0 - 1;
    };

    Janken.win = function(me, you) {
      if (me === you) alert("draw");
      if (me === this.gu && you === this.pa) alert("lose");
      if (me === this.gu && you === this.choki) return alert("win");
    };

    return Janken;

  })(Backbone.Model);

  App.Jankens = (function(_super) {

    __extends(Jankens, _super);

    function Jankens() {
      Jankens.__super__.constructor.apply(this, arguments);
    }

    Jankens.prototype.model = App.Janken;

    Jankens.prototype.localStorage = new Store("janken-user");

    Jankens.prototype.janken = function(janken_name) {
      return console.log(janken_name);
    };

    Jankens.prototype.computer = function(janken_key) {
      var rand;
      rand = App.Janken.rand();
      return App.Janken.win(janken_key, rand);
    };

    return Jankens;

  })(Backbone.Collection);

  App.jankens = new App.Jankens;

  JankenView = (function(_super) {

    __extends(JankenView, _super);

    function JankenView() {
      JankenView.__super__.constructor.apply(this, arguments);
    }

    JankenView.prototype.el = "#janken";

    JankenView.prototype.events = {
      "click .janken": "janken"
    };

    JankenView.prototype.janken = function(e) {
      var $target;
      $target = $(e.target);
      return App.jankens.computer(App.Janken[$target.text()]);
    };

    return JankenView;

  })(Backbone.View);

  $(function() {
    var view;
    view = new JankenView;
    return view.delegateEvents();
  });

}).call(this);
