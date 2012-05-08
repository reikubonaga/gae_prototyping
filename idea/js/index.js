(function() {
  var Data, DataList, DataView, Datas, IndexView,
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
      ans1: ""
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

    Data.prototype.get_word_els = function(start, length) {
      var a, ans_word_num, d, els, first, i, j, left, line, now_left, now_length, span, text, text_arr, textarea, _ref, _ref2;
      if (start == null) start = 0;
      if (length == null) length = 0;
      textarea = this.get("text");
      line = textarea.split("\n");
      ans_word_num = 2;
      if (line.length < ans_word_num + 1) return false;
      if (length === 0) length = line.length;
      els = [];
      left = 0;
      first = true;
      now_length = 0;
      for (i = ans_word_num, _ref = line.length - 1; ans_word_num <= _ref ? i <= _ref : i >= _ref; ans_word_num <= _ref ? i++ : i--) {
        now_left = left;
        if (!line[i] || line[i] === "") {
          if (left > 0) left -= 1;
          now_length += 1;
          length += 1;
          continue;
        }
        text = line[i];
        if (text[0] === " " || text[0] === "　") {
          now_length += 1;
          length += 1;
          continue;
        }
        span = document.createElement("span");
        if (text.search(/^http/) !== -1) {
          a = document.createElement("a");
          a.innerHTML = line[i];
          a.setAttribute("href", line[i]);
          a.setAttribute("target", "blank");
          span.appendChild(a);
        } else if (text.search(/^(!-)|(-!)/) !== -1) {
          left += 1;
          span.className = "word sub";
          span.innerHTML = line[i].substr(2);
        } else if (text.search(/^-/) !== -1) {
          left += 1;
          span.className = "word";
          span.innerHTML = line[i].substr(1);
        } else if (text.search(/^!/) !== -1) {
          span.className = "word sub";
          span.innerHTML = line[i].substr(1);
        } else if (text.search(/->/) !== -1) {
          span.className = "word flow";
          text_arr = text.split("->");
          for (j = 0, _ref2 = text_arr.length - 1; 0 <= _ref2 ? j <= _ref2 : j >= _ref2; 0 <= _ref2 ? j++ : j--) {
            text = text_arr[j];
            if (text === "") continue;
            d = document.createElement("div");
            d.innerHTML = text;
            span.appendChild(d);
            if (text_arr.length - 1 !== j) {
              d = document.createElement("div");
              d.innerHTML = "▶";
              span.appendChild(d);
            }
          }
        } else {
          span.className = "word";
          span.innerHTML = line[i];
        }
        if (now_left > 0) span.className = span.className + " l" + now_left;
        if (now_length < start || now_length >= start + length) {
          first = false;
          now_length += 1;
          continue;
        }
        if (now_left !== left && !first) els.push(document.createElement("br"));
        els.push(span);
        if (first) first = false;
        if (left > 0) els.push(document.createElement("br"));
        now_length += 1;
      }
      return els;
    };

    Data.prototype.get_word = function() {
      var el, els, output, _i, _len;
      els = this.get_word_els();
      output = document.createElement("div");
      if (els) {
        for (_i = 0, _len = els.length; _i < _len; _i++) {
          el = els[_i];
          output.appendChild(el);
        }
      }
      return output;
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
      if (!this.model.get("title")) {
        this.model.destroy();
        return false;
      }
      if (!this.model.get("text")) {
        this.model.set("text", this.model.get("title") + "\n" + this.model.get("ans1"));
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

    DataView.prototype.select = function() {
      return $(this.$(".selectertext")[0]).html("▶");
    };

    DataView.prototype.unselect = function() {
      return $(this.$(".selectertext")[0]).html("");
    };

    DataView.prototype.scroll = function() {
      return $(window).scrollTop(this.$el.position().top - 110);
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
      "keyup #content-left-wrap textarea": "editing",
      "change #content-left-wrap textarea": "editing",
      "keydown #search_bar input": "search",
      "change #search_bar input": "search",
      "click #search_bar .button": "search",
      "focus #search_list_input": "list_focus",
      "keydown #search_list_input": "list_keydown",
      "click .delete": "delete",
      "click .menu .new": "render_new",
      "click .save": "editing"
    };

    IndexView.prototype.list_focus = function(e) {
      if (this.nowIndex === false) this.focus_data(0);
      return this.views[this.nowIndex].select();
    };

    IndexView.prototype.list_keydown = function(e) {
      var textareaEle;
      if (e.keyCode === 9) {
        textareaEle = this.getTextareaEle();
        textareaEle.focus();
        if (this.views[this.nowIndex]) this.views[this.nowIndex].unselect();
        return false;
      }
      if (e.keyCode === 40 || e.keyCode === 74) this.focus_data(this.nowIndex + 1);
      if (e.keyCode === 38 || e.keyCode === 75) this.focus_data(this.nowIndex - 1);
      if (e.keyCode === 13) {
        this.views[this.nowIndex].edit();
        textareaEle = this.getTextareaEle();
        textareaEle.focus();
        if (this.views[this.nowIndex]) this.views[this.nowIndex].unselect();
        return false;
      }
    };

    IndexView.prototype.nowIndex = false;

    IndexView.prototype.focus_data = function(i) {
      if (this.views[i] && this.views[this.nowIndex]) {
        this.views[this.nowIndex].unselect();
      }
      if (this.views[i]) {
        this.nowIndex = i;
        this.views[i].select();
        return this.views[i].scroll();
      }
    };

    IndexView.prototype.editing = function(e) {
      var arr, line, now_line, range, text, textarea, textareaEle;
      textareaEle = this.getTextareaEle();
      textarea = textareaEle.val();
      if (textarea === "") return;
      line = textarea.split("\n");
      range = $(e.target).getSelection();
      text = textarea.substr(0, range.start);
      arr = text.match(/\n/g);
      if (arr) {
        now_line = arr.length + 1;
      } else {
        now_line = 1;
      }
      this.setTextareaTitle(line, now_line);
      if (this.model) {
        this.model.set({
          title: line[0],
          ans1: line[1],
          text: textarea
        });
        return this.model.save();
      } else {
        return this.model = Datas.create({
          title: line[0],
          ans1: line[1],
          text: textarea
        });
      }
    };

    IndexView.prototype.getTextareaEle = function() {
      if (!this.textareaEl) {
        this.textareaEl = $(this.$("#content-left-wrap textarea")[0]);
      }
      return this.textareaEl;
    };

    IndexView.prototype.getSearchbarEle = function() {
      if (!this.searchbarEle) {
        this.searchbarEle = $(this.$("#search_bar input")[0]);
      }
      return this.searchbarEle;
    };

    IndexView.prototype.getSearchbarButtonEle = function() {
      if (!this.searchbarButtonEle) {
        this.searchbarButtonEle = $(this.$("#search_bar .button")[0])[0];
      }
      return this.searchbarButtonEle;
    };

    IndexView.prototype.getResultListEle = function() {
      if (!this.resultListEle) this.resultListEle = this.$("#search_list");
      return this.resultListEle;
    };

    IndexView.prototype.getResultListInputEle = function() {
      if (!this.resultListInputEle) {
        this.resultListInputEle = this.$("#search_list_input");
      }
      return this.resultListInputEle;
    };

    IndexView.prototype.setTextareaTitle = function(line, now_line_num) {
      var ans1, divEle, el, els, start_line, title, _i, _len;
      if (!this.textareaTitleEle) {
        this.textareaTitleEle = this.$("#content-left-wrap .title");
      }
      if (!this.textareaAns1Ele) {
        this.textareaAns1Ele = this.$("#content-left-wrap .ans1");
      }
      if (!this.textareaWordsEle) {
        this.textareaWordsEle = $(this.$("#content-left-wrap .words")[0]);
      }
      if (!line || !line[0]) {
        title = "";
      } else {
        title = line[0];
      }
      if (!line || !line[1]) {
        ans1 = "";
      } else {
        ans1 = line[1];
      }
      this.textareaTitleEle.html(title);
      this.textareaAns1Ele.html(ans1);
      this.textareaWordsEle.html("");
      if (!this.model) return;
      if (now_line_num < 7) {
        start_line = 0;
      } else {
        start_line = now_line_num - 3;
      }
      els = this.model.get_word_els(start_line, 7);
      divEle = document.createElement("div");
      for (_i = 0, _len = els.length; _i < _len; _i++) {
        el = els[_i];
        divEle.appendChild(el);
      }
      return this.textareaWordsEle.append(divEle);
    };

    IndexView.prototype.addWord = function(word) {
      var textarea, textareaEle;
      if (word == null) word = "";
      if (word === "") return;
      textareaEle = this.getTextareaEle();
      textarea = textareaEle.val();
      if (textarea === "") {
        textarea += word;
      } else {
        textarea += "\n" + word;
      }
      textareaEle.val(textarea);
      return this.editing();
    };

    IndexView.prototype.isSearch = true;

    IndexView.prototype.old_search_text = "";

    IndexView.prototype.search = function(e) {
      var data, datas, el, searchbarButtonEle, searchbarEle, text, textareaEle, _i, _len;
      searchbarEle = this.getSearchbarEle();
      text = searchbarEle.val();
      if (text !== this.old_search_text) {
        this.old_search_text = text;
        datas = Datas.filter(function(obj) {
          return obj.get("title").search(text) !== -1;
        });
        this.clear();
        if (datas.length === 0 && this.isSearch) {
          this.isSearch = false;
          searchbarButtonEle = this.getSearchbarButtonEle();
          searchbarButtonEle.innerHTML = "create";
        }
        if (datas.length > 0 && !this.isSearch) {
          this.isSearch = true;
          searchbarButtonEle = this.getSearchbarButtonEle();
          searchbarButtonEle.innerHTML = "search";
        }
        for (_i = 0, _len = datas.length; _i < _len; _i++) {
          data = datas[_i];
          this.addOne(data);
        }
      }
      if (e && e.keyCode === 13) {
        if (!this.isSearch) {
          textareaEle = this.getTextareaEle();
          this.render_new();
          text = text.replace("\n", "");
          textareaEle.val(text);
          textareaEle.focus();
          return false;
        } else {
          el = this.getResultListInputEle();
          el.focus();
          if (this.views[this.nowIndex]) return this.views[this.nowIndex].select();
        }
      }
    };

    IndexView.prototype.initialize = function() {
      var self;
      Datas.bind("reset", this.addAll, this);
      Datas.bind("all", this.render, this);
      self = this;
      return Datas.fetch({
        success: function(collection) {
          if (collection.length === 0) {
            Datas.create({
              title: "How to use search",
              ans1: "1. Type tab. then focus searchbar",
              ans2: "2. Type \"use\" and enter. then the results show and focus search result",
              ans3: "3. Type j or k (Down or Up) and enter. then move to search bar results and focus textarea",
              text: "How to use search and edit\n1. Type tab. then focus searchbar\n2. Type \"use\". then the results show and focus search result\n3. Type j or k (Down or Up) and enter. then move to search bar results and focus textarea\n"
            });
            Datas.create({
              title: "How to use textarea",
              ans1: "1. Type tab. then focus serchbar",
              ans2: "2. Type \"first text\" and enter. then the new text is created and focus textarea",
              ans3: "The text is always saved when you type",
              text: "How to use textarea\n1. Type tab. then focus serchbar\n2. Type \"first text\" and enter. then the new text is created and focus textarea\nThe text is always saved when you type\n"
            });
            Datas.create({
              title: "Follow me",
              ans1: "I am Rei Kubonaga",
              ans2: "I am working at Kwl-E",
              ans3: "if you have something to think, please send me the message",
              text: "Follow me\nI am Rei Kubonaga\nI studied mathematics in Kyoto University and working in Kwl-E\nif you have something to think, please send me the message\nhttps://twitter.com/kubonagarei\nenable link"
            });
            Datas.each(self.addOne);
            return self.views[0].edit();
          }
        }
      });
    };

    IndexView.prototype.render_textarea = function(model) {
      var line, textarea, textareaEle;
      this.model = model;
      textarea = this.model.get("text");
      line = textarea.split("\n");
      this.setTextareaTitle(line, 0);
      textareaEle = this.getTextareaEle();
      return textareaEle.val(textarea);
    };

    IndexView.prototype.render_new = function() {
      var textareaEle;
      this.model = null;
      this.setTextareaTitle();
      textareaEle = this.getTextareaEle();
      return textareaEle.val("");
    };

    IndexView.prototype.render = function(event, model) {};

    IndexView.prototype.views = [];

    IndexView.prototype.clear = function() {
      this.getResultListEle().html("");
      this.views = [];
      return this.nowIndex = false;
    };

    IndexView.prototype["delete"] = function(e) {
      if (confirm("delete?")) {
        if (this.model) this.model.destroy();
        this.render_new();
        this.clear();
        this.old_search_text = false;
        this.search();
        if (this.views[0]) this.views[0].scroll();
      }
      return this.model = null;
    };

    IndexView.prototype.addAll = function() {
      var datas, textareaEle;
      datas = Datas.sortBy(function(item) {
        return item.cid;
      });
      if (!datas || datas.length === 0) {} else {
        _.each(datas, this.addOne);
        this.views[0].scroll();
      }
      textareaEle = this.getTextareaEle();
      return textareaEle.focus();
    };

    IndexView.prototype.addOne = function(data) {
      var view;
      view = new DataView({
        model: data
      });
      view.setParent(this);
      this.getResultListEle().append(view.render().el);
      return this.views.push(view);
    };

    return IndexView;

  })(Backbone.View);

  $(function() {
    var view;
    return view = new IndexView;
  });

}).call(this);
