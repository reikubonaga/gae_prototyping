(function() {
  var $m,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  if (typeof Code === "undefined" || Code === null) Code = {};

  if (Code.models == null) Code.models = {};

  if (Code.utils == null) Code.utils = {};

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

  Code.Ace = (function() {

    function Ace() {}

    Ace.prototype.render = function(id) {
      var EditSession, JavaScriptMode, Range, editor, lang;
      editor = ace.edit(id);
      editor.renderer.setShowGutter(false);
      JavaScriptMode = require("ace/mode/javascript").Mode;
      EditSession = require("ace/edit_session").EditSession;
      lang = require("ace/lib/lang");
      Range = require("ace/range").Range;
      editor.getSession().setMode(new JavaScriptMode());
      return editor;
    };

    return Ace;

  })();

  Code.ace = new Code.Ace;

  Code.Util = (function() {

    function Util() {}

    Util.prototype.user_ans = null;

    Util.prototype.check = function(variable, code, answer) {
      eval("Code.exe = function(){" + variable + " " + code + " return main();};");
      this.user_ans = Code.exe();
      console.log(this.user_ans);
      if (Number(answer) === Number(this.user_ans)) {
        return true;
      } else {
        return false;
      }
    };

    return Util;

  })();

  Code.util = new Code.Util;

  if (Code.Math == null) Code.Math = {};

  Code.Math.Fragment = (function() {

    function Fragment() {}

    Fragment.prototype.x = 1;

    Fragment.prototype.y = 1;

    Fragment.prototype.set_arr = function(a, b) {
      this.x = a;
      return this.y = b;
    };

    Fragment.prototype.set = function(str) {
      var arr;
      arr = str.split("/");
      this.x = arr[0];
      return this.y = arr[1];
    };

    Fragment.prototype.real = function() {
      return this.x / this.y;
    };

    Fragment.prototype.format = function() {
      if (this.x < 0 && this.y < 0) {
        return (-1 * this.x) + "/" + (-1 * this.y);
      } else if (this.x > 0 && this.y < 0) {
        return (-1 * this.x) + "/" + (-1 * this.y);
      } else if (this.x = 0) {
        return 0;
      } else if (this.y = 0) {
        Code.Math.core.error("fragment error y=0");
      } else {
        return this.x + "/" + this.y;
      }
    };

    return Fragment;

  })();

  Code.Math.Formula1 = (function() {

    function Formula1() {}

    Formula1.prototype.v = 0;

    Formula1.prototype.x = 0;

    Formula1.prototype.set_arr = function(a, b) {
      this.x = a;
      return this.v = b;
    };

    Formula1.prototype.set = function(str) {
      var arr, varr, xarr, _i, _len, _results;
      str = Code.Math.core.str_to_plus(str);
      arr = str.split("+");
      _results = [];
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        xarr = arr[_i];
        varr = xarr.split("x");
        if (varr[1] === "") varr[1] = 1;
        if (!varr[1]) {
          if (this.v === 0) {
            this.v = Code.Math.core.str_to_number(varr[0]);
          } else {
            this.v += Code.Math.core.str_to_number(varr[0]);
          }
        }
        if (varr[1] === 1) {
          if (this.x === 0) {
            _results.push(this.x = Code.Math.core.str_to_number(varr[0]));
          } else {
            _results.push(this.x += Code.Math.core.str_to_number(varr[0]));
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Formula1.prototype.exe = function() {
      var f, g, v, x;
      x = this.x;
      v = this.v;
      g = Code.Math.core.gcd(x, v);
      f = new Code.Math.Fragment;
      f.set_arr(-v / g, x / g);
      return f.format();
    };

    return Formula1;

  })();

  Code.Math.Core = (function() {

    function Core() {}

    Core.prototype.error = function(text) {
      return console.log("error" + text);
    };

    Core.prototype.gcd = function(a, b) {
      var f, r;
      if (a === 0 || b === 0) return;
      f = true;
      r = a % b;
      while (r !== 0) {
        a = b;
        b = r;
        r = a % b;
      }
      return b;
    };

    Core.prototype.str_to_plus = function(str) {
      var e_arr;
      e_arr = str.split("=");
      if (e_arr.length > 2) {
        this.error("equal > 2");
        return;
      }
      if (e_arr.length = 2) {
        str = e_arr[0] + "-" + e_arr[1];
      } else {
        str = e_arr[0];
      }
      if (str.substring(0, 1) === "-") {
        str = "-" + str.substring(1).replace("-", "+-");
      } else {
        str = str.replace("-", "+-");
      }
      return str;
    };

    Core.prototype.str_to_number = function(str) {
      if (str.substring(0, 1) === "-") {
        return -1 * Number(str.substring(1));
      } else {
        return Number(str);
      }
    };

    Core.prototype.x = function(str) {
      var f;
      f = new Code.Math.Formula1;
      f.set(str);
      return f.exe();
    };

    return Core;

  })();

  Code.Math.core = new Code.Math.Core;

  $m = Code.Math.core;

  $(function() {
    var route;
    Code.PostView = (function(_super) {

      __extends(PostView, _super);

      function PostView() {
        PostView.__super__.constructor.apply(this, arguments);
      }

      PostView.prototype.initialize = function() {
        var el;
        el = this.make("div");
        this.setElement(el);
        $("#content").html("");
        $("#content").append(el);
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
        var answer, code, variable;
        variable = this.variable.getSession().getValue();
        code = this.code.getSession().getValue();
        answer = $("#answer_num").val();
        if (Code.util.check(variable, code, answer)) {
          return alert("success" + Code.util.user_ans);
        } else {
          return alert("unsuccess" + Code.util.user_ans);
        }
      };

      PostView.prototype.post = function() {
        var answer, code, question, question_model, title, variable;
        variable = this.variable.getSession().getValue();
        code = this.code.getSession().getValue();
        title = $("#title").val();
        question = $("#question").val();
        answer = $("#answer").val();
        question_model = new Code.models.Question({
          title: title,
          code: code,
          answer: answer,
          question: question,
          variable: variable
        });
        return question_model.save();
      };

      PostView.prototype.render = function() {
        this.$el.append(this.template());
        $("#variable").css("width", $("#variable").width() + "px");
        $("#variable").css("height", $("#variable").height() + "px");
        this.variable = Code.ace.render("variable");
        this.variable.getSession().setValue($("#post-variable-template").html());
        $("#code").css("width", $("#code").width() + "px");
        this.code = Code.ace.render("code");
        return this.code.getSession().setValue($("#post-code-template").html());
      };

      return PostView;

    })(Backbone.View);
    Code.TopView = (function(_super) {

      __extends(TopView, _super);

      function TopView() {
        TopView.__super__.constructor.apply(this, arguments);
      }

      TopView.prototype.initialize = function() {
        var el;
        el = this.make("div");
        this.setElement(el);
        $("#content").html("");
        $("#content").append(el);
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
              _results.push(self.$el.append(self.template(model)));
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

      TryView.prototype.initialize = function() {
        var el;
        el = this.make("div");
        this.setElement(el);
        $("#content").html("");
        $("#content").append(el);
        return $("#header_menu li").removeClass("active");
      };

      TryView.prototype.template = function(model) {
        return _.template($("#try-content-template").html(), model);
      };

      TryView.prototype.events = {
        "click .check": "check",
        "click .post": "post"
      };

      TryView.prototype.check = function() {
        var answer, code, variable;
        variable = this.variable.getSession().getValue();
        code = this.code.getSession().getValue();
        answer = this.model.get("answer");
        if (Code.util.check(variable, code, answer)) {
          return alert("success" + Code.util.user_ans);
        } else {
          return alert("unsuccess" + Code.util.user_ans);
        }
      };

      TryView.prototype.post = function() {
        var code, question, title, variable;
        variable = this.variable.getSession().getValue();
        code = this.code.getSession().getValue();
        title = $("#title").val();
        question = $("#question").val();
        this.model.set({
          code: code,
          variable: variable
        });
        return this.model.save();
      };

      TryView.prototype.render = function(question_id) {
        var Question, self;
        self = this;
        Question = new Code.models.Question;
        return Question.fetch({
          data: {
            id: question_id
          },
          success: function(model) {
            var EditSession, JavaScriptMode, Range, editor, lang;
            self.model = model;
            model = model.toJSON();
            self.$el.html(self.template(model));
            $("#variable").css("width", $("#variable").width() + "px");
            $("#variable").css("height", $("#variable").height() + "px");
            editor = ace.edit("variable");
            editor.renderer.setShowGutter(false);
            JavaScriptMode = require("ace/mode/javascript").Mode;
            EditSession = require("ace/edit_session").EditSession;
            lang = require("ace/lib/lang");
            Range = require("ace/range").Range;
            editor.getSession().setMode(new JavaScriptMode());
            self.variable = editor;
            editor.getSession().setValue(model.variable);
            $("#answer").css("width", $("#answer").width() + "px");
            editor = ace.edit("answer");
            JavaScriptMode = require("ace/mode/javascript").Mode;
            EditSession = require("ace/edit_session").EditSession;
            lang = require("ace/lib/lang");
            Range = require("ace/range").Range;
            editor.getSession().setMode(new JavaScriptMode());
            self.editor = editor;
            editor.getSession().setValue(model.code);
            return self.delegateEvents();
          }
        });
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
        Code.tryView = new Code.TryView;
        return Code.tryView.render(id);
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
