(function() {
  var Data, DataList, DataView, Datas, IndexView,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  if (typeof doc === "undefined" || doc === null) doc = document;

  Data = (function(_super) {

    __extends(Data, _super);

    function Data() {
      Data.__super__.constructor.apply(this, arguments);
    }

    Data.prototype["default"] = {
      title: "",
      access: 0
    };

    Data.prototype.initialize = function() {
      var self;
      self = this;
      this.on("change", function(model) {
        var date, time;
        date = new Date();
        time = date.getTime();
        if (self.isNew()) self.set("created", time);
        return self.set("updated", time);
      });
      if (!this.get("access")) return this.set("access", 0);
    };

    Data.prototype.clear = function() {
      return this.destroy();
    };

    Data.prototype.get_word_els = function(start, length) {
      var a, ans_word_num, d, d2, d3, data, display_tags, div, div_arr, div_box, els, first, i, j, left, line, name_tags, now_left, now_length, second, span, t, table, tag, tags, td, text, text_arr, textarea, tr, _i, _j, _len, _len2, _ref, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _t;
      if (start == null) start = 0;
      if (length == null) length = 0;
      textarea = this.get("text");
      line = textarea.split("\n");
      ans_word_num = 1;
      if (line.length < ans_word_num + 1) return false;
      if (length === 0) length = line.length;
      els = [];
      left = 0;
      first = true;
      tags = {};
      for (i = ans_word_num, _ref = line.length - 1; ans_word_num <= _ref ? i <= _ref : i >= _ref; ans_word_num <= _ref ? i++ : i--) {
        text = line[i];
        if (text.search(/^@@/) !== -1) continue;
        if (text.search(/^\*@@/) !== -1) continue;
        if (text.search(/@@/) !== -1) {
          text_arr = text.split("@@");
          data = text_arr[0];
          for (j = 1, _ref2 = text_arr.length - 1; 1 <= _ref2 ? j <= _ref2 : j >= _ref2; 1 <= _ref2 ? j++ : j--) {
            tag = text_arr[j];
            if (!tags[tag]) {
              tags[tag] = [data];
            } else {
              tags[tag].push(data);
            }
          }
        }
      }
      now_length = 0;
      for (i = ans_word_num, _ref3 = line.length - 1; ans_word_num <= _ref3 ? i <= _ref3 : i >= _ref3; ans_word_num <= _ref3 ? i++ : i--) {
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
        } else if (text.search(/<->/) !== -1) {
          span.className = "word flow";
          text_arr = text.split("<->");
          for (j = 0, _ref4 = text_arr.length - 1; 0 <= _ref4 ? j <= _ref4 : j >= _ref4; 0 <= _ref4 ? j++ : j--) {
            text = text_arr[j];
            if (text === "") continue;
            d = document.createElement("div");
            d.innerHTML = text;
            span.appendChild(d);
            if (text_arr.length - 1 !== j) {
              d = document.createElement("div");
              d.innerHTML = "◀▶";
              span.appendChild(d);
            }
          }
        } else if (text.search(/->/) !== -1) {
          span.className = "word flow";
          text_arr = text.split("->");
          for (j = 0, _ref5 = text_arr.length - 1; 0 <= _ref5 ? j <= _ref5 : j >= _ref5; 0 <= _ref5 ? j++ : j--) {
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
        } else if (text.search(/^\*@@.+@@.+@@.+@@.+/) !== -1) {
          span.className = "axis";
          text_arr = text.split("@@");
          name_tags = [];
          for (j = 1; j <= 4; j++) {
            t = text_arr[j];
            if (t.search(/^.+\[.+\]$/) !== -1) {
              _t = t.split("[");
              text_arr[j] = _t[0];
              name_tags.push(_t[1].substr(0, _t[1].length - 1));
            } else {
              name_tags.push(t);
            }
          }
          div_arr = [];
          for (j = 0; j <= 3; j++) {
            if (j % 2 === 0) div_box = doc.createElement("div");
            first = j > 1 ? 1 : 0;
            second = j % 2 + 2;
            display_tags = _.intersection(tags[text_arr[first + 1]], tags[text_arr[second + 1]]);
            div = doc.createElement("div");
            div.className = "box box" + j;
            if (j === 1) {
              tag = name_tags[first];
              d = doc.createElement("div");
              d.className = "tag tag1";
              d.innerHTML = tag;
              div.appendChild(d);
            }
            if (j === 2) {
              tag = name_tags[second];
              d = doc.createElement("div");
              d.className = "tag tag2";
              d.innerHTML = tag;
              div.appendChild(d);
            }
            if (j === 3) {
              tag = name_tags[second];
              d = doc.createElement("div");
              d.className = "tag tag3";
              d.innerHTML = tag;
              div.appendChild(d);
            }
            if (display_tags.length !== 0) {
              for (_i = 0, _len = display_tags.length; _i < _len; _i++) {
                data = display_tags[_i];
                d = doc.createElement("div");
                d.className = "word";
                d.innerHTML = data;
                div.appendChild(d);
              }
            }
            div_box.appendChild(div);
            div_arr.push(div);
            if (j % 2 === 1) {
              d = doc.createElement("div");
              d.className = "clearfix";
              div_box.appendChild(d);
              span.appendChild(div_box);
            }
          }
          tag = name_tags[first];
          d = doc.createElement("div");
          d2 = doc.createElement("div");
          d2.className = "tag4_box";
          d3 = doc.createElement("div");
          d3.className = "tag tag4";
          d3.innerHTML = tag;
          d2.appendChild(d3);
          d.appendChild(d2);
          span.appendChild(d);
        } else if (text.search(/^@@.+@@.+@@.+@@.+/) !== -1) {
          span.className = "matrix";
          text_arr = text.split("@@");
          table = doc.createElement("table");
          name_tags = [];
          for (j = 1; j <= 4; j++) {
            t = text_arr[j];
            if (t.search(/^.+\[.+\]$/) !== -1) {
              _t = t.split("[");
              text_arr[j] = _t[0];
              name_tags.push(_t[1].substr(0, _t[1].length - 1));
            } else {
              name_tags.push(t);
            }
          }
          for (j = 1, _ref6 = text_arr.length - 1; 1 <= _ref6 ? j <= _ref6 : j >= _ref6; 1 <= _ref6 ? j++ : j--) {
            if (j % 2 === 1) tr = doc.createElement("tr");
            tag = text_arr[j];
            td = doc.createElement("td");
            d = doc.createElement("div");
            d.className = "tag";
            d.innerHTML = name_tags[j - 1];
            td.appendChild(d);
            if (tags[tag]) {
              _ref7 = tags[tag];
              for (_j = 0, _len2 = _ref7.length; _j < _len2; _j++) {
                data = _ref7[_j];
                d = doc.createElement("div");
                d.className = "word";
                d.innerHTML = data;
                td.appendChild(d);
              }
            }
            tr.appendChild(td);
            if (j % 2 === 0) table.appendChild(tr);
          }
          span.appendChild(table);
        } else if (text.search(/@@/) !== -1) {
          span.className = "word tags";
          text_arr = text.split("@@");
          d = document.createElement("div");
          d.innerHTML = text_arr[0];
          span.appendChild(d);
          for (j = 1, _ref8 = text_arr.length - 1; 1 <= _ref8 ? j <= _ref8 : j >= _ref8; 1 <= _ref8 ? j++ : j--) {
            text = text_arr[j];
            if (text === "") continue;
            d = document.createElement("div");
            d.className = "tag";
            d.innerHTML = text;
            span.appendChild(d);
            if (text_arr.length - 1 !== j) {
              d = document.createElement("div");
              d.innerHTML = "";
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
        els.push(document.createElement("br"));
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

    Data.prototype.show = function() {
      var n;
      n = this.get("access");
      return this.set("access", n + 1);
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
        "click .edit": "edit"
      };
    };

    DataView.prototype.template = function() {
      return _.template($("#data_template").html(), this.model.toJSON());
    };

    DataView.prototype.tag = "div";

    DataView.prototype.className = "data";

    DataView.prototype.render = function() {
      var div;
      if (!this.model.get("title")) {
        this.model.destroy();
        return false;
      }
      if (!this.model.get("text")) {
        this.model.set("text", this.model.get("title"));
        this.model.save();
      }
      div = doc.createElement("div");
      div.innerHTML = this.template();
      this.$el.prepend(div);
      this.show();
      return this;
    };

    DataView.prototype.update = function() {
      this.render();
      return $(this.$el.children()[1]).remove();
    };

    DataView.prototype.setParent = function(view) {
      return this.parent = view;
    };

    DataView.prototype.show = function() {
      return $(this.$(".show-list")[0]).append(this.model.get_word());
    };

    DataView.prototype.edit = function() {
      return this.parent.render_textarea(this.model);
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
      var height, sum, textareaEle;
      if (e.keyCode === 9) {
        textareaEle = this.getTextareaEle();
        textareaEle.focus();
        if (this.views[this.nowIndex]) this.views[this.nowIndex].unselect();
        return false;
      }
      height = $(window).height() - 170;
      sum = Math.ceil($(this.views[this.nowIndex].el).height() / height);
      if (e.keyCode === 40 || e.keyCode === 74) {
        if (this.nowScrollIndex < sum) {
          $(window).scrollTop($(window).scrollTop() + height);
          this.nowScrollIndex += 1;
        } else {
          this.focus_data(this.nowIndex + 1);
        }
      }
      if (e.keyCode === 38 || e.keyCode === 75) {
        if (this.nowScrollIndex > 1) {
          $(window).scrollTop($(window).scrollTop() - height);
          this.nowScrollIndex -= 1;
        } else {
          this.focus_data(this.nowIndex - 1);
        }
      }
      if (e.keyCode === 13) {
        this.views[this.nowIndex].edit();
        textareaEle = this.getTextareaEle();
        textareaEle.focus();
        if (this.views[this.nowIndex]) this.views[this.nowIndex].unselect();
        this.clickedDataView = this.views[this.nowIndex];
        return false;
      }
    };

    IndexView.prototype.clickedDataView = false;

    IndexView.prototype.nowIndex = false;

    IndexView.prototype.nowScrollIndex = 1;

    IndexView.prototype.focus_data = function(i) {
      if (this.views[i] && this.views[this.nowIndex]) {
        this.views[this.nowIndex].unselect();
      }
      if (this.views[i]) {
        this.nowIndex = i;
        this.views[i].select();
        this.views[i].scroll();
        return this.nowScrollIndex = 1;
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
          text: textarea
        });
        this.model.save();
      } else {
        this.model = Datas.create({
          title: line[0],
          text: textarea
        });
      }
      return this.clickedDataView.update();
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
      var title;
      if (!this.textareaTitleEle) {
        this.textareaTitleEle = this.$("#content-left-wrap .title");
      }
      if (!line || !line[0]) {
        title = "";
      } else {
        title = line[0];
      }
      return this.textareaTitleEle.html(title);
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
        datas = _.sortBy(datas, function(item) {
          return -item.get("access");
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
      Datas.fetch({
        success: function(collection) {
          if (collection.length === 0) {
            Datas.create({
              title: "How to use search",
              text: "How to use search and edit\n1. Type tab. then focus searchbar\n2. Type \"use\". then the results show and focus search result\n3. Type j or k (Down or Up) and enter. then move to search bar results and focus textarea\n"
            });
            Datas.create({
              title: "How to use textarea",
              text: "How to use textarea\n@@1@@2@@3@@4\nType tab. then focus serchbar@@1\nType \"first text\" and enter. then the new text is created and focus textarea@@2\nThe text is always saved when you type@@3\ntest@@4"
            });
            Datas.create({
              title: "Follow me",
              text: "Follow me\nI am Rei Kubonaga\nI studied mathematics in Kyoto University and working in Kwl-E\nif you have something to think, please send me the message\nhttps://twitter.com/kubonagarei\nenable link"
            });
            Datas.each(self.addOne);
            return self.views[0].edit();
          }
        }
      });
      return $("#editing").height($(window).height() - 170);
    };

    IndexView.prototype.render_textarea = function(model) {
      var line, textarea, textareaEle;
      this.model = model;
      if (this.model) this.model.show();
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
        return -item.get("access");
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
