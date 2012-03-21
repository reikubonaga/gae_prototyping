(function() {
  var ImpactMosaic, Model_Project, Model_Projects, Mosaic, View_Project, View_Projects, model_Projects,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Mosaic = (function() {

    Mosaic.prototype.datas = [];

    Mosaic.prototype.ins_datas = [];

    Mosaic.prototype.wait_datas = [];

    Mosaic.prototype.render_top = [];

    Mosaic.prototype.render_left = [];

    Mosaic.prototype.data_width = 226;

    Mosaic.prototype.width = 980;

    Mosaic.prototype.space_width = 60;

    Mosaic.prototype.space_height = 112;

    function Mosaic() {
      var num;
      this.calculate_left();
      this.render_top = (function() {
        var _ref, _results;
        _results = [];
        for (num = 0, _ref = this.width_num - 1; 0 <= _ref ? num <= _ref : num >= _ref; 0 <= _ref ? num++ : num--) {
          _results.push(0);
        }
        return _results;
      }).call(this);
    }

    Mosaic.prototype.get_low_left_index = function() {
      var i, min, min_index, _ref;
      min = this.render_top[0];
      min_index = 0;
      for (i = 0, _ref = this.render_top.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
        if (min > this.render_top[i]) {
          min = this.render_top[i];
          min_index = i;
        }
      }
      return min_index;
    };

    Mosaic.prototype.get_size = function(width, height, img_width) {
      if (img_width == null) img_width = this.data_width;
      return [img_width, (height / width * img_width) | 0];
    };

    Mosaic.prototype.get_next_position = function(width, height) {
      var h, index, top, w, _ref;
      index = this.get_low_left_index();
      _ref = this.get_size(width, height), w = _ref[0], h = _ref[1];
      top = this.render_top[index];
      this.render_top[index] = top + h + this.space_height;
      return [top, this.render_left[index]];
    };

    Mosaic.prototype.set_position = function(data, top, left, width) {
      var _ref;
      data.top = top;
      data.left = left;
      _ref = this.get_size(data.width, data.height, width), data.img_width = _ref[0], data.img_height = _ref[1];
      this.wait_datas = _.reject(this.wait_datas, function(obj) {
        return obj.id === data.id;
      });
      return this.ins_datas.push(data);
    };

    Mosaic.prototype.add = function(datas) {
      var data, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = datas.length; _i < _len; _i++) {
        data = datas[_i];
        if (!data.id || !data.height || !data.width) {
          console.log("not id or hegiht or width");
          continue;
        }
        _results.push(this.wait_datas.push(data));
      }
      return _results;
    };

    Mosaic.prototype.calculate = function() {
      var data, i, left, top, wait_datas, width, _ref, _ref2, _results;
      wait_datas = this.wait_datas;
      _results = [];
      for (i = 0, _ref = wait_datas.length - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
        data = wait_datas[i];
        _ref2 = this.get_next_position(data.width, data.height), top = _ref2[0], left = _ref2[1], width = _ref2[2];
        _results.push(this.set_position(data, top, left, width));
      }
      return _results;
    };

    Mosaic.prototype.next = function() {
      var data;
      if (this.ins_datas.legnth === 0) return false;
      data = this.ins_datas[0];
      this.datas.push(data);
      this.ins_datas.shift();
      return data;
    };

    Mosaic.prototype.calculate_left = function() {
      var i, _ref, _results;
      this.width_num = ((this.width + this.space_width) / (this.data_width + this.space_width)) | 0;
      this.surplus_width = this.width - (this.width_num - 1) * this.space_width - this.width_num * this.data_width;
      this.render_left.push(this.surplus_width / 2);
      _results = [];
      for (i = 1, _ref = this.width_num - 1; 1 <= _ref ? i <= _ref : i >= _ref; 1 <= _ref ? i++ : i--) {
        _results.push(this.render_left.push(this.render_left[i - 1] + this.space_width + this.data_width));
      }
      return _results;
    };

    Mosaic.prototype.need_data_space = 3000;

    Mosaic.prototype.need_data = function(scrollTop) {
      var top;
      top = _.min(this.render_top);
      if (scrollTop + this.need_data_space > top) return true;
      return false;
    };

    return Mosaic;

  })();

  ImpactMosaic = (function(_super) {

    __extends(ImpactMosaic, _super);

    function ImpactMosaic(collection) {
      this.collection = collection;
      this.width = $(window).width();
      ImpactMosaic.__super__.constructor.call(this);
    }

    ImpactMosaic.prototype.equal_index = false;

    ImpactMosaic.prototype.equal_space = 20;

    ImpactMosaic.prototype.before_top = -1;

    ImpactMosaic.prototype.before_left_index = -1;

    ImpactMosaic.prototype.equal_top = function() {
      var i, now_index, _ref;
      now_index = this.datas.length + this.ins_datas.length;
      if (this.equal_index === false || (now_index > this.equal_index + this.width_num - 2)) {
        for (i = 0, _ref = this.render_top.length - 2; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
          if ((Number(this.render_top[i + 1]) >= Number(this.render_top[i]) - this.equal_space) && (Number(this.render_top[i + 1]) <= Number(this.render_top[i]) + this.equal_space)) {
            if (this.before_top === this.render_top[i]) continue;
            this.equal_index = now_index;
            if (this.render_top[i + 1] > this.render_top[i]) return [i, i + 1];
            return [i, i];
          }
        }
      }
      return false;
    };

    ImpactMosaic.prototype.get_next_position = function(width, height) {
      var bi, h, img_width, index, top, w, _ref, _ref2, _ref3;
      if (_ref = this.equal_top(), index = _ref[0], bi = _ref[1], _ref) {
        img_width = this.data_width * 2 + this.space_width;
        _ref2 = this.get_size(width, height, img_width), w = _ref2[0], h = _ref2[1];
        top = this.render_top[bi];
        this.render_top[index] = top + h + this.space_height;
        this.render_top[index + 1] = this.render_top[index];
        this.before_top = this.render_top[index];
        if (top === 1688) console.log("test");
        return [top, this.render_left[index], img_width];
      }
      _ref3 = this.get_size(width, height), w = _ref3[0], h = _ref3[1];
      index = this.get_low_left_index();
      top = this.render_top[index];
      this.render_top[index] = top + h + this.space_height;
      return [top, this.render_left[index]];
    };

    return ImpactMosaic;

  })(Mosaic);

  Model_Project = (function(_super) {

    __extends(Model_Project, _super);

    function Model_Project() {
      Model_Project.__super__.constructor.apply(this, arguments);
    }

    Model_Project.prototype.test = function() {
      return console.log("test");
    };

    return Model_Project;

  })(Backbone.Model);

  Model_Projects = (function(_super) {

    __extends(Model_Projects, _super);

    function Model_Projects() {
      Model_Projects.__super__.constructor.apply(this, arguments);
    }

    Model_Projects.prototype.url = "/arraies/js/projects.json";

    Model_Projects.prototype.model = Model_Project;

    return Model_Projects;

  })(Backbone.Collection);

  model_Projects = new Model_Projects;

  View_Project = (function(_super) {

    __extends(View_Project, _super);

    function View_Project() {
      View_Project.__super__.constructor.apply(this, arguments);
    }

    View_Project.prototype.template = function(model_json) {
      return _.template($("#project_template").html(), model_json);
    };

    View_Project.prototype.render = function(model_json) {
      var div, img;
      div = this.make("div");
      img = this.make("img");
      $(img).hide().attr("src", model_json.image_host + model_json.user_id + "/" + model_json.id + "/bigger_" + model_json.image_url).css({
        height: model_json.img_hegiht + "px",
        width: model_json.img_width + "px"
      }).load(function() {
        $(".thumbnail", div).append(img);
        return $(img).fadeIn("slow");
      }).error(function() {
        return console.log("error");
      });
      return $(div).html(this.template(model_json));
    };

    return View_Project;

  })(Backbone.View);

  View_Projects = (function(_super) {

    __extends(View_Projects, _super);

    function View_Projects() {
      View_Projects.__super__.constructor.apply(this, arguments);
    }

    View_Projects.prototype.el = "#content";

    View_Projects.prototype.render = function() {
      var self;
      self = this;
      return model_Projects.fetch({
        success: function(collection) {
          var arr;
          arr = collection.toJSON();
          arr = _.shuffle(arr);
          mosaic.add(arr);
          mosaic.calculate();
          return self.render_projects(100);
        }
      });
    };

    View_Projects.prototype.render_projects = function(limit) {
      var data, i, view_project, _results;
      if (limit == null) limit = 50;
      i = 0;
      _results = [];
      while (data = mosaic.next()) {
        if (i === limit) break;
        view_project = new View_Project;
        this.$el.append(view_project.render(data));
        _results.push(++i);
      }
      return _results;
    };

    return View_Projects;

  })(Backbone.View);

  $(function() {
    var lock, next_scrollY, scroll_up, view, y_arr;
    window.mosaic = new ImpactMosaic(model_Projects);
    view = new View_Projects;
    view.render();
    next_scrollY = 300;
    scroll_up = true;
    lock = false;
    $(window).scroll(function() {
      if (window.mosaic.need_data(this.scrollY)) view.render();
      if (lock) return;
      if (this.scrollY > next_scrollY && scroll_up) {
        lock = true;
        $("#header-group").slideUp("slow", function() {
          scroll_up = false;
          return lock = false;
        });
      }
      if (!scroll_up && this.scrollY < 200) {
        lock = true;
        return $("#header-group").slideDown("normal", function() {
          next_scrollY = $(window)[0].scrollY + 100;
          scroll_up = true;
          return lock = false;
        });
      }
    });
    y_arr = [];
    lock = false;
    return $(window).mousemove(function(event) {
      if (lock) return;
      if (event.clientY < 200 && !scroll_up) {
        lock = true;
        return $("#header-group").slideDown("normal", function() {
          lock = false;
          next_scrollY = $(window)[0].scrollY + 100;
          return scroll_up = true;
        });
      }
    });
  });

}).call(this);
