(function() {
  var Data, DataList, DataView, Datas, IndexView, ShortcutKeys,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Data = (function(_super) {

    __extends(Data, _super);

    function Data() {
      Data.__super__.constructor.apply(this, arguments);
    }

    Data.prototype["default"] = {
      title: "",
      ans1: "",
      ans2: "",
      ans3: ""
    };

    Data.prototype.initialize = function() {
      return this.on("change", function(model) {
        var date, time;
        date = new Date();
        time = date.getTime();
        if (this.isNew()) model.set("created", time);
        return model.set("updated", time);
      });
    };

    Data.prototype.clear = function() {
      return this.destroy();
    };

    Data.prototype.get_word = function() {
      var a, el, i, line, span, text, textarea, _ref;
      textarea = this.get("text");
      line = textarea.split("\n");
      if (line.length < 5) return false;
      el = document.createElement("div");
      for (i = 4, _ref = line.length - 1; 4 <= _ref ? i <= _ref : i >= _ref; 4 <= _ref ? i++ : i--) {
        if (line[i] === "") continue;
        text = line[i];
        if (text[0] === " " || text[0] === "　") continue;
        span = document.createElement("span");
        if (text.search("/^http/") !== -1) {
          a = document.createElement("a");
          a.innerHTML = line[i];
          a.setAttribute("href", line[i]);
          span.appendChild(a);
        } else {
          span.className = "word";
          span.innerHTML = line[i];
        }
        el.appendChild(span);
      }
      return el;
    };

    return Data;

  })(Backbone.Model);

  DataList = (function(_super) {

    __extends(DataList, _super);

    function DataList() {
      DataList.__super__.constructor.apply(this, arguments);
    }

    DataList.prototype.model = Data;

    DataList.prototype.localStorage = new Store("idea-data");

    return DataList;

  })(Backbone.Collection);

  Datas = new DataList;

  DataView = (function(_super) {

    __extends(DataView, _super);

    function DataView() {
      DataView.__super__.constructor.apply(this, arguments);
    }

    DataView.prototype.events = function() {
      return {
        "click .show": "show",
        "click .edit": "edit",
        "click .paste": "paste",
        "click .word": "addWord"
      };
    };

    DataView.prototype.template = function() {
      return _.template($("#data_template").html(), this.model.toJSON());
    };

    DataView.prototype.tag = "div";

    DataView.prototype.className = "data";

    DataView.prototype.render = function() {
      if (!this.model.get("ans1")) {
        this.model.set("ans1", "");
        this.model.save();
      }
      if (!this.model.get("ans2")) {
        this.model.set("ans2", "");
        this.model.save();
      }
      if (!this.model.get("ans3")) {
        this.model.set("ans3", "");
        this.model.save();
      }
      if (!this.model.get("title") && !this.model.get("ans1") && !this.model.get("ans2") && !this.model.get("ans3")) {
        this.model.destroy();
        return false;
      }
      if (!this.model.get("text")) {
        this.model.set("text", this.model.get("title") + "\n" + this.model.get("ans1") + "\n" + this.model.get("ans2") + "\n" + this.model.get("ans3"));
        this.model.save();
      }
      this.$el.html(this.template());
      this.show();
      return this;
    };

    DataView.prototype.setParent = function(view) {
      return this.parent = view;
    };

    DataView.prototype.isShow = false;

    DataView.prototype.show = function(e) {
      if (!this.isShow) {
        $(this.$(".show-list")[0]).append(this.model.get_word());
        return this.isShow = true;
      } else {
        $(this.$(".show-list")[0]).html("");
        return this.isShow = false;
      }
    };

    DataView.prototype.edit = function() {
      return this.parent.render_textarea(this.model);
    };

    DataView.prototype.addWord = function(e) {
      return this.parent.addWord($(e.target).text());
    };

    DataView.prototype.paste = function() {
      return this.parent.addWord($(this.$(".title .edit")[0]).html());
    };

    return DataView;

  })(Backbone.View);

  IndexView = (function(_super) {

    __extends(IndexView, _super);

    function IndexView() {
      this.addOne = __bind(this.addOne, this);
      IndexView.__super__.constructor.apply(this, arguments);
    }

    IndexView.prototype.el = "body";

    IndexView.prototype.events = {
      "keydown #content-left-wrap textarea": "editing",
      "change #content-left-wrap textarea": "editing",
      "keydown #search_bar input": "search",
      "change #search_bar input": "search",
      "click #search_bar .button": "search",
      "click .delete": "delete",
      "click .menu .new": "render_new",
      "click #search_bar .new": "click_new",
      "click .save": "editing"
    };

    IndexView.prototype.editing = function(e) {
      var line, textarea;
      textarea = $(this.$("#content-left-wrap textarea")[0]).val();
      line = textarea.split("\n");
      this.$("#content-left-wrap .title").html(line[0]);
      this.$("#content-left-wrap .ans1").html(line[1]);
      this.$("#content-left-wrap .ans2").html(line[2]);
      this.$("#content-left-wrap .ans3").html(line[3]);
      if (this.model) {
        this.model.set({
          title: line[0],
          ans1: line[1],
          ans2: line[2],
          ans3: line[3],
          text: textarea
        });
        return this.model.save();
      } else {
        return this.model = Datas.create({
          title: line[0],
          ans1: line[1],
          ans2: line[2],
          ans3: line[3],
          text: textarea
        });
      }
    };

    IndexView.prototype.addWord = function(word) {
      var textarea;
      if (word == null) word = "";
      if (word === "") return;
      textarea = $(this.$("#content-left-wrap textarea")[0]).val();
      if (textarea === "") {
        textarea += word;
      } else {
        textarea += "\n" + word;
      }
      $(this.$("#content-left-wrap textarea")[0]).val(textarea);
      return this.editing();
    };

    IndexView.prototype.click_new = function() {
      var text;
      text = $(this.$("#search_bar input")[0]).val();
      this.render_new();
      $(this.$("#content-left-wrap textarea")[0]).val(text);
      return this.editing();
    };

    IndexView.prototype.search = function(e) {
      var data, datas, text, _i, _len, _results;
      text = $(this.$("#search_bar input")[0]).val();
      datas = Datas.filter(function(obj) {
        return obj.get("title").search(text) !== -1;
      });
      this.clear();
      _results = [];
      for (_i = 0, _len = datas.length; _i < _len; _i++) {
        data = datas[_i];
        _results.push(this.addOne(data));
      }
      return _results;
    };

    IndexView.prototype.initialize = function() {
      Datas.bind("reset", this.addAll, this);
      Datas.bind("all", this.render, this);
      return Datas.fetch();
    };

    IndexView.prototype.render_textarea = function(model) {
      var line, textarea;
      this.model = model;
      textarea = this.model.get("text");
      line = textarea.split("\n");
      this.$("#content-left-wrap .title").html(line[0]);
      this.$("#content-left-wrap .ans1").html(line[1]);
      this.$("#content-left-wrap .ans2").html(line[2]);
      this.$("#content-left-wrap .ans3").html(line[3]);
      return this.$("#content-left-wrap textarea").val(textarea);
    };

    IndexView.prototype.render_new = function() {
      this.model = null;
      this.$("#content-left-wrap .title").html("");
      this.$("#content-left-wrap .ans1").html("");
      this.$("#content-left-wrap .ans2").html("");
      this.$("#content-left-wrap .ans3").html("");
      return this.$("#content-left-wrap textarea").val("");
    };

    IndexView.prototype.render = function(event, model) {};

    IndexView.prototype.clear = function() {
      return this.$("#search_list").html("");
    };

    IndexView.prototype["delete"] = function(e) {
      if (confirm("delete?")) {
        this.model.destroy();
        this.render_new();
        this.clear();
        this.addAll();
      }
      return this.model = null;
    };

    IndexView.prototype.addAll = function() {
      return _.each(Datas.sortBy(function(item) {
        return item.cid;
      }), this.addOne);
    };

    IndexView.prototype.addOne = function(data) {
      var view;
      view = new DataView({
        model: data
      });
      view.setParent(this);
      return this.$("#search_list").append(view.render().el);
    };

    return IndexView;

  })(Backbone.View);

  ShortcutKeys = (function(_super) {

    __extends(ShortcutKeys, _super);

    function ShortcutKeys() {
      ShortcutKeys.__super__.constructor.apply(this, arguments);
    }

    ShortcutKeys.prototype.shortcuts = {
      "ctrl+r": "reloadPage"
    };

    ShortcutKeys.prototype.reloadPage = function() {
      return alert("Reload!!!");
    };

    return ShortcutKeys;

  })(Backbone.Shortcuts);

  $(function() {
    var shortcuts, view;
    view = new IndexView;
    return shortcuts = new ShortcutKeys;
  });

}).call(this);
