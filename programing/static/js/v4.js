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
    var route;
    Code.PostView = (function(_super) {

      __extends(PostView, _super);

      function PostView() {
        PostView.__super__.constructor.apply(this, arguments);
      }

      PostView.prototype.el = "#content";

      PostView.prototype.initialize = function() {
        $("#header_menu li").removeClass("active");
        $("#header_menu .post").addClass("active");
        this.render();
        return this.delegateEvents();
      };

      PostView.prototype.template = _.template($("#post-content-template").html());

      PostView.prototype.events = {
        "click .check": "check",
        "click .post": "post"
      };

      PostView.prototype.check = function() {
        var answer, user_ans, variable;
        variable = this.variable.getSession().getValue();
        answer = this.editor.getSession().getValue();
        Code.answer = $("#answer_num").val();
        eval("Code.exe = function(){" + variable + answer + "}");
        user_ans = Code.exe();
        if (Number(Code.answer) === Number(user_ans)) {
          return alert("success " + user_ans);
        } else {
          return alert("unsuccess " + user_ans);
        }
      };

      PostView.prototype.post = function() {
        var answer, answer_num, question, question_model, title, variable;
        variable = this.variable.getSession().getValue();
        answer = this.editor.getSession().getValue();
        title = $("#title").val();
        question = $("#question").val();
        answer_num = $("#answer_num").val();
        question_model = new Code.models.Question({
          title: title,
          code: answer,
          answer: answer_num,
          question: question,
          variable: variable
        });
        return question_model.save();
      };

      PostView.prototype.render = function() {
        var EditSession, JavaScriptMode, Range, editor, lang;
        this.$el.html(this.template());
        $("#variable").css("width", $("#variable").width() + "px");
        $("#variable").css("height", $("#variable").height() + "px");
        editor = ace.edit("variable");
        editor.renderer.setShowGutter(false);
        JavaScriptMode = require("ace/mode/javascript").Mode;
        EditSession = require("ace/edit_session").EditSession;
        lang = require("ace/lib/lang");
        Range = require("ace/range").Range;
        editor.getSession().setMode(new JavaScriptMode());
        this.variable = editor;
        $("#answer").css("width", $("#answer").width() + "px");
        editor = ace.edit("answer");
        JavaScriptMode = require("ace/mode/javascript").Mode;
        EditSession = require("ace/edit_session").EditSession;
        lang = require("ace/lib/lang");
        Range = require("ace/range").Range;
        editor.getSession().setMode(new JavaScriptMode());
        return this.editor = editor;
      };

      return PostView;

    })(Backbone.View);
    Code.TopView = (function(_super) {

      __extends(TopView, _super);

      function TopView() {
        TopView.__super__.constructor.apply(this, arguments);
      }

      TopView.prototype.el = "#content";

      TopView.prototype.initialize = function() {
        $("#header_menu li").removeClass("active");
        $("#header_menu .try").addClass("active");
        this.render();
        return Code.topQuestionView = new Code.TopQuestionView;
      };

      TopView.prototype.template = _.template($("#top-content-template").html());

      TopView.prototype.render = function() {
        return this.$el.html(this.template());
      };

      return TopView;

    })(Backbone.View);
    Code.TopQuestionView = (function(_super) {

      __extends(TopQuestionView, _super);

      function TopQuestionView() {
        TopQuestionView.__super__.constructor.apply(this, arguments);
      }

      TopQuestionView.prototype.initialize = function() {
        this.setElement("#top-question-content");
        return this.render();
      };

      TopQuestionView.prototype.template = function(model) {
        return _.template($("#top-question-template").html(), model);
      };

      TopQuestionView.prototype.render = function() {
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

      return TopQuestionView;

    })(Backbone.View);
    Code.TryView = (function(_super) {

      __extends(TryView, _super);

      function TryView() {
        TryView.__super__.constructor.apply(this, arguments);
      }

      TryView.prototype.el = "#content";

      TryView.prototype.initialize = function() {
        $("#header_menu li").removeClass("active");
        $("#header_menu .try").addClass("active");
        return this.render();
      };

      TryView.prototype.template = _.template($("#try-content-template").html());

      TryView.prototype.render = function() {
        return this.$el.html(this.template());
      };

      return TryView;

    })(Backbone.View);
    Code.workspace = (function(_super) {

      __extends(workspace, _super);

      function workspace() {
        workspace.__super__.constructor.apply(this, arguments);
      }

      workspace.prototype.routes = {
        "": "top",
        "post": "post",
        "try/:question_id": "try"
      };

      workspace.prototype["try"] = function(id) {
        return console.log(id);
      };

      workspace.prototype.top = function() {
        return Code.topView = new Code.TopView;
      };

      workspace.prototype.post = function() {
        return Code.postView = new Code.PostView;
      };

      return workspace;

    })(Backbone.Router);
    route = new Code.workspace;
    return Backbone.history.start();
  });

}).call(this);
