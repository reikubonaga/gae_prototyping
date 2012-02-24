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
      } else if (this.x === 0) {
        return 0;
      } else if (this.y === 0) {
        Code.Math.core.error("fragment error y=0");
      } else if (this.y === 1) {
        return this.x;
      } else {
        return this.x + "/" + this.y;
      }
    };

    return Fragment;

  })();

  Code.Math.Formula = (function() {

    function Formula(str) {
      this.str = str;
      this.input_str = this.str;
      this.str = Code.Math.core.str_to_plus(this.str);
      this.set(this.str);
    }

    Formula.prototype.dimension = 0;

    Formula.prototype.str = "";

    Formula.prototype.set = function(str) {
      var arr, match, match_arr, max, _i, _len;
      str = Code.Math.core.str_to_plus(str);
      this.str = str;
      match_arr = str.match(/x(\d+)\+/i);
      if (match_arr === null) {
        if (str.match(/x\+/)) {
          this.dimension = 1;
          return this;
        }
      }
      max = 0;
      for (_i = 0, _len = match_arr.length; _i < _len; _i++) {
        match = match_arr[_i];
        arr = match.match(/\d/);
        if (arr[0] > max) max = arr[0];
      }
      this.dimension = Number(max);
      return this;
    };

    Formula.prototype.set_num = function(ins, num) {
      if (!num) return ins;
      if (ins === 0) {
        ins = Code.Math.core.str_to_number(num);
      } else {
        ins += Code.Math.core.str_to_number(num);
      }
      return ins;
    };

    Formula.prototype.create = function(str) {
      var f;
      this.set(str);
      switch (this.dimension) {
        case 1:
          f = new Code.Math.Formula1;
          f.set(this.str);
          return f;
        case 2:
          f = new Code.Math.Formula2;
          f.set(this.str);
          return f;
        default:
          Code.Math.core.error("formula create no dimension");
          return this;
      }
    };

    return Formula;

  })();

  Code.Math.Formula2 = (function(_super) {

    __extends(Formula2, _super);

    function Formula2() {
      Formula2.__super__.constructor.apply(this, arguments);
    }

    Formula2.prototype.v = 0;

    Formula2.prototype.x1 = 0;

    Formula2.prototype.x2 = 0;

    Formula2.prototype.set = function(str) {
      var arr, varr, xarr, _i, _len, _results;
      arr = str.split("+");
      _results = [];
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        xarr = arr[_i];
        varr = xarr.split("x");
        if (varr[0] === "") varr[0] = 1;
        if (varr[1] === "") varr[1] = 1;
        if (!varr[1]) {
          this.v = this.set_num(this.v, varr[0]);
          continue;
        }
        if (varr[1] === 1) {
          console.log(varr);
          this.x1 = this.set_num(this.x1, varr[0]);
          continue;
        }
        if (varr[1] === "2") {
          this.x2 = this.set_num(this.x2, varr[0]);
          continue;
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Formula2.prototype.min = function() {
      var str;
      if (this.x2 === 1) {
        str = "x2";
      } else if (this.x2 === -1) {
        str = "-x2";
      } else {
        str = this.x2 + "x2";
      }
      if (this.x1 > 0) {
        if (this.x1 === 1) {
          str += "+x";
        } else {
          str += "+" + this.x1 + "x";
        }
      } else {
        if (this.x1 === -1) {
          str += "-x";
        } else {
          str += this.x1 + "x";
        }
      }
      if (this.v > 0) {
        str += "+" + this.v;
      } else {
        str += this.v;
      }
      return str;
    };

    Formula2.prototype.exe = function() {
      var f, g, v, x, x2;
      x2 = this.x2;
      x = this.x;
      v = this.v;
      g = Code.Math.core.gcd(x, v);
      if (!(g != null) || g === 0) {
        Code.Math.core.error("formula1 exe error");
        return;
      }
      f = new Code.Math.Fragment;
      f.set_arr(-1 * v / g, x / g);
      return f.format();
    };

    return Formula2;

  })(Code.Math.Formula);

  Code.Math.Formula1 = (function(_super) {

    __extends(Formula1, _super);

    function Formula1() {
      Formula1.__super__.constructor.apply(this, arguments);
    }

    Formula1.prototype.v = 0;

    Formula1.prototype.x = 0;

    Formula1.prototype.set_arr = function(a, b) {
      this.x = Code.Math.core.str_to_number(a);
      return this.v = Code.Math.core.str_to_number(b);
    };

    Formula1.prototype.set = function(str) {
      var arr, varr, xarr, _i, _len, _results;
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
      if (!(g != null) || g === 0) {
        Code.Math.core.error("formula1 exe error");
        return;
      }
      f = new Code.Math.Fragment;
      f.set_arr(-1 * v / g, x / g);
      return f.format();
    };

    return Formula1;

  })(Code.Math.Formula);

  Code.Math.Core = (function() {

    function Core() {}

    Core.prototype.error = function(text) {
      return console.log("error" + text);
    };

    Core.prototype.gcd = function(a, b) {
      var f, r;
      if (!(a != null) || !(b != null) || a === 0 || b === 0) {
        this.error("undefind gcd");
        return;
      }
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
      if (!(str != null)) {
        this.error("undefind str_to_plus");
        return;
      }
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
      str = str.replace("+--", "+");
      str = str.replace("--", "+");
      return str;
    };

    Core.prototype.str_to_number = function(str) {
      if (typeof str === "number") return str;
      if (str.substring(0, 1) === "-") {
        return -1 * Number(str.substring(1));
      } else {
        return Number(str);
      }
    };

    Core.prototype.x = function(str) {
      var f;
      f = new Code.Math.Formula;
      f = f.create(str);
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
        var code, variable;
        variable = this.variable.getSession().getValue();
        code = this.code.getSession().getValue();
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
            self.model = model;
            model = model.toJSON();
            self.$el.html(self.template(model));
            $("#variable").css("width", $("#variable").width() + "px");
            $("#variable").css("height", $("#variable").height() + "px");
            self.variable = Code.ace.render("variable");
            self.variable.getSession().setValue(model.variable);
            $("#code").css("width", $("#code").width() + "px");
            self.code = Code.ace.render("code");
            self.code.getSession().setValue(model.code);
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
