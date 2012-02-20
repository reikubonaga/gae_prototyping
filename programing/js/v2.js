(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  if (typeof Code === "undefined" || Code === null) Code = {};

  $(function() {
    Code.QuestionView = (function(_super) {

      __extends(QuestionView, _super);

      function QuestionView() {
        QuestionView.__super__.constructor.apply(this, arguments);
      }

      QuestionView.prototype.el = "#question-content";

      QuestionView.prototype.initialize = function() {
        return this.render();
      };

      QuestionView.prototype.template = _.template($("#question-content-template").html());

      QuestionView.prototype.render = function() {
        return $(this.el).html(this.template());
      };

      return QuestionView;

    })(Backbone.View);
    Code.AnswerView = (function(_super) {

      __extends(AnswerView, _super);

      function AnswerView() {
        AnswerView.__super__.constructor.apply(this, arguments);
      }

      AnswerView.prototype.el = "#answer-content";

      AnswerView.prototype.events = {
        "click .check": "check"
      };

      AnswerView.prototype.check = function() {
        var answer, user_ans, variable;
        variable = Code.questionView.$(".variable").val();
        answer = this.editor.getSession().getValue();
        eval("Code.exe = function(){" + variable + answer + "}");
        Code.answer = Code.questionView.$(".answer").val();
        user_ans = Code.exe();
        if (Number(Code.answer) === Number(user_ans)) {
          return alert("success " + user_ans);
        } else {
          return alert("unsuccess " + user_ans);
        }
      };

      AnswerView.prototype.initialize = function() {
        return this.render();
      };

      AnswerView.prototype.template = _.template($("#answer-content-template").html());

      AnswerView.prototype.render = function() {
        var EditSession, JavaScriptMode, Range, editor, lang;
        $(this.el).html(this.template());
        editor = ace.edit("editor");
        JavaScriptMode = require("ace/mode/javascript").Mode;
        EditSession = require("ace/edit_session").EditSession;
        lang = require("ace/lib/lang");
        Range = require("ace/range").Range;
        editor.getSession().setMode(new JavaScriptMode());
        return this.editor = editor;
      };

      return AnswerView;

    })(Backbone.View);
    Code.questionView = new Code.QuestionView;
    return Code.answerView = new Code.AnswerView;
  });

}).call(this);
