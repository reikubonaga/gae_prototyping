(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  if (typeof Lifelog === "undefined" || Lifelog === null) Lifelog = {};

  Lifelog.Item = (function(_super) {

    __extends(Item, _super);

    function Item() {
      Item.__super__.constructor.apply(this, arguments);
    }

    Item.prototype.defaults = function() {
      var left, top;
      top = Math.floor(Math.random() * 600);
      left = Math.floor(Math.random() * 1000);
      return {
        top: top,
        left: left
      };
    };

    return Item;

  })(Backbone.Model);

  Lifelog.Items = (function(_super) {

    __extends(Items, _super);

    function Items() {
      Items.__super__.constructor.apply(this, arguments);
    }

    Items.prototype.model = Lifelog.Item;

    Items.prototype.localStorage = new Store("item");

    return Items;

  })(Backbone.Collection);

  Lifelog.ItemView = (function(_super) {

    __extends(ItemView, _super);

    function ItemView() {
      ItemView.__super__.constructor.apply(this, arguments);
    }

    ItemView.prototype.template = function(model) {
      return _.template($("#item-template").html(), model);
    };

    ItemView.prototype.template_screen = function(model) {
      return _.template($("#item-screen-template").html(), model);
    };

    ItemView.prototype.events = {
      "click .images img": "screen"
    };

    ItemView.prototype.screen = function(event) {
      var el, target_el;
      el = this.make("div", {
        "class": "screen"
      });
      target_el = event.currentTarget;
      this.screen = el;
      $(el).html(this.template_screen(this.model));
      $("#theater").show().click(function() {
        $("#theater").hide();
        return $("#screen").html("").hide();
      });
      $("#screen").append(el).show();
      return Lifelog.indexView.render_back(this.model["image" + $(target_el).attr("num")]);
    };

    ItemView.prototype.render = function(model) {
      var el;
      this.model = model;
      el = this.make("div", {
        "class": "item"
      });
      this.setElement(el);
      this.$el.html(this.template(model));
      this.$el.css(model.css);
      this.delegateEvents();
      return this.el;
    };

    return ItemView;

  })(Backbone.View);

  Lifelog.IndexView = (function(_super) {

    __extends(IndexView, _super);

    function IndexView() {
      IndexView.__super__.constructor.apply(this, arguments);
    }

    IndexView.prototype.el = "#content";

    IndexView.prototype.datas = [
      {
        name: "光が丘",
        css: {
          top: "30px",
          left: "50px"
        },
        image1: "http://nerimaku.jp/walk/img/IMG_0712.jpg",
        image1_c: "高層団地。30階以上のマンションの団地",
        image2: "http://occhan.cocolog-nifty.com/diary/images/2005.04.23%20051.jpg",
        image2_c: "光が丘公園。広い。",
        image3: "http://www.secom-shl.co.jp/new/town/03/images/p_town2_m6.jpg",
        image3_c: "光が丘図書館。光が丘公園の近くにある"
      }, {
        name: "三原",
        css: {
          top: "300px",
          left: "500px"
        },
        image1: "http://blogimg.goo.ne.jp/user_image/32/e3/dccd2e0c725ef28f6dfa210b319d42c9.jpg",
        image1_c: "有竜島。無人島。船で遊びに行ける",
        image2: "http://www.zicco.biz/blog/recent/images/rairai01.jpg",
        image2_c: "来来軒。ラーメン屋。三原駅の近く。",
        image3: "http://pds.exblog.jp/pds/1/201012/09/51/f0137351_163187.jpg",
        image3_c: "筆影山。瀬戸内海が一望できる"
      }
    ];

    IndexView.prototype.render = function() {
      var data, itemView, _i, _len, _ref;
      _ref = this.datas;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        data = _ref[_i];
        itemView = new Lifelog.ItemView;
        this.$el.append(itemView.render(data));
      }
      return this.render_back(this.datas[0].image2);
    };

    IndexView.prototype.render_back = function(image) {
      var width;
      width = $(window).width();
      return $("#background img").attr("src", image).css("width", width + "px");
    };

    return IndexView;

  })(Backbone.View);

  Lifelog.indexView = new Lifelog.IndexView;

  Lifelog.indexView.render();

}).call(this);
