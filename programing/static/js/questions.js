(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  if (typeof Code === "undefined" || Code === null) Code = {};

  if (Code.models == null) Code.models = {};

  Code.models.Question = (function(_super) {

    __extends(Question, _super);

    function Question() {
      Question.__super__.constructor.apply(this, arguments);
    }

    Question.prototype.url = "/programing/question";

    return Question;

  })(Backbone.Model);

  Code.models.Questions = (function(_super) {

    __extends(Questions, _super);

    function Questions() {
      Questions.__super__.constructor.apply(this, arguments);
    }

    Questions.prototype.url = "/programing/questions";

    return Questions;

  })(Backbone.Collection);

  $(function() {
    Code.TitleView = (function(_super) {

      __extends(TitleView, _super);

      function TitleView() {
        TitleView.__super__.constructor.apply(this, arguments);
      }

      TitleView.prototype.el = "#title-content";

      TitleView.prototype.initialize = function() {
        return this.render();
      };

      TitleView.prototype.template = function(model) {
        return _.template($("#title-content-template").html(), model);
      };

      TitleView.prototype.render = function() {
        var Questions, self;
        Questions = new Code.models.Questions;
        self = this;
        return Questions.fetch({
          success: function(collection) {
            var model, _i, _len, _ref, _results;
            _ref = collection.toJSON();
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              model = _ref[_i];
              _results.push($(self.el).append(self.template(model)));
            }
            return _results;
          }
        });
      };

      return TitleView;

    })(Backbone.View);
    return Code.titleView = new Code.TitleView;
  });

}).call(this);
