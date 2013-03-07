(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  if (typeof Corridor === "undefined" || Corridor === null) Corridor = {};

  Corridor.TopView = (function(_super) {

    __extends(TopView, _super);

    function TopView() {
      this._read_friend = __bind(this._read_friend, this);
      this.get_next_friend = __bind(this.get_next_friend, this);
      this.read_friend = __bind(this.read_friend, this);
      this.make_cube = __bind(this.make_cube, this);
      this.make_cube_left = __bind(this.make_cube_left, this);
      this.make_cube_right = __bind(this.make_cube_right, this);
      this.onDocumentMouseDown = __bind(this.onDocumentMouseDown, this);
      this.onDocumentMouseWheel = __bind(this.onDocumentMouseWheel, this);
      this.animate = __bind(this.animate, this);
      TopView.__super__.constructor.apply(this, arguments);
    }

    TopView.prototype.el = "#content";

    TopView.prototype.wallPosition = {
      left: 8,
      right: 8
    };

    TopView.prototype.cubes = [];

    TopView.prototype.initialize = function() {
      var camera, i, self;
      this.projector = new THREE.Projector;
      this.container = document.createElement("div");
      $(this.el).append(this.container);
      this.scene = new THREE.Scene;
      this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
      camera = this.camera;
      camera.position.x = 200;
      camera.position.y = 200;
      camera.position.z = 800;
      this.scene.add(camera);
      for (i = 0; i <= 8; i++) {
        this.make_cube_right();
        this.make_cube_left();
      }
      this.renderer = new THREE.CanvasRenderer();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.container.appendChild(this.renderer.domElement);
      $(document).mousewheel(this.onDocumentMouseWheel);
      $(document).mousedown(this.onDocumentMouseDown);
      $("#start_fb").popover().click(function() {
        return $("#my-modal").modal("toggle");
      });
      $("#my-modal .closefun").click(function() {
        return $("#my-modal").modal("hide");
      });
      self = this;
      $("#my-modal .start-fb").click(function() {
        return Corridor.FB.login(function(response) {
          if (response.authResponse) {
            return Corridor.FB.api('/me/friends', function(response) {
              return self.friends = response["data"];
            });
          } else {
            return console.log("login error");
          }
        }, {
          scope: 'email,user_photos,friends_photos'
        });
      });
      return this.animate();
    };

    TopView.prototype.animate = function() {
      requestAnimationFrame(this.animate);
      return this.render();
    };

    TopView.prototype.render = function() {
      return this.renderer.render(this.scene, this.camera);
    };

    TopView.prototype.scroll_z = 0;

    TopView.prototype.scroll_z_old = 0;

    TopView.prototype.onDocumentMouseWheel = function(event, delta) {
      var i, z;
      this.moveCamera(Math.PI);
      z = this.camera.position.z;
      if (this.friends != null) {
        if (z / 80 < this.scroll_z + 8) {
          for (i = 0; i <= 8; i++) {
            this.scroll_z = this.scroll_z - 1;
            this.read_friend();
          }
        }
      }
      this.scroll_z_old = delta;
      return this.camera.position.z = (z + 20 * delta + 50 * this.scroll_z_old) | 0;
    };

    TopView.prototype.p = Math.PI;

    TopView.prototype.onDocumentMouseDown = function(e) {
      var action, intersects, mouse_x, mouse_y, ray, vector;
      mouse_x = ((e.pageX - e.target.offsetParent.offsetLeft) / this.renderer.domElement.width) * 2 - 1;
      mouse_y = -((e.pageY - e.target.offsetParent.offsetTop) / this.renderer.domElement.height) * 2 + 1;
      vector = new THREE.Vector3(mouse_x, mouse_y, 0.5);
      this.projector.unprojectVector(vector, this.camera);
      ray = new THREE.Ray(this.camera.position, vector.subSelf(this.camera.position).normalize());
      intersects = ray.intersectObjects(this.cubes);
      if (intersects.length > 0) {
        action = intersects[0].object.action;
        this.moveRoad(action.z);
        return this.moveCamera(action.p);
      }
    };

    TopView.prototype.move_lock = false;

    TopView.prototype.moveCamera = function(n_p) {
      var end, flame, i, move, self, speed, start_p, _move, _ref;
      if (this.move_lock) return;
      if (n_p === this.p) return;
      this.move_lock = true;
      self = this;
      start_p = this.p;
      flame = 20;
      speed = 45;
      _move = function() {
        return self.camera.lookAt(new THREE.Vector3(self.camera.position.x + Math.sin(self.p), self.camera.position.y, self.camera.position.z + Math.cos(self.p)));
      };
      move = function() {
        self.p += (n_p - start_p) / flame;
        return _move();
      };
      end = function() {
        self.p = n_p;
        _move();
        return self.move_lock = false;
      };
      for (i = 0, _ref = flame - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
        setTimeout(move, speed * i);
      }
      return setTimeout(end, speed * flame);
    };

    TopView.prototype.moveRoad = function(n_p) {
      var flame, i, move, now_p, self, speed, start_p, _results;
      if (n_p === this.camera.position.z) return;
      start_p = this.camera.position.z;
      self = this;
      now_p = start_p;
      flame = 20;
      speed = 45;
      move = function() {
        now_p += (n_p - start_p) / flame;
        return self.camera.position.z = now_p;
      };
      _results = [];
      for (i = 0; 0 <= flame ? i <= flame : i >= flame; 0 <= flame ? i++ : i--) {
        _results.push(setTimeout(move, speed * i));
      }
      return _results;
    };

    TopView.prototype.make_cube_right = function(url) {
      return this.make_cube(400, url, false);
    };

    TopView.prototype.make_cube_left = function(url) {
      return this.make_cube(0, url, true);
    };

    TopView.prototype.make_cube = function(x, url, isLeft) {
      var cube, i, material, materials, materials2, texture, z_i;
      if (url == null) url = "img/arraies.png";
      texture = new THREE.ImageUtils.loadTexture(url);
      material = new THREE.MeshLambertMaterial({
        map: texture
      });
      materials = [];
      for (i = 0; i <= 6; i++) {
        materials.push(new THREE.MeshBasicMaterial({
          color: 0x2a2a2a
        }));
      }
      materials2 = [];
      for (i = 0; i <= 6; i++) {
        if (isLeft && i === 0) {
          materials2.push(material);
        } else if (!isLeft && i === 1) {
          materials2.push(material);
        } else {
          materials2.push(new THREE.MeshBasicMaterial({
            color: 0xffffff
          }));
        }
      }
      if (isLeft) {
        z_i = this.wallPosition.left;
        this.wallPosition.left -= 1;
      } else {
        z_i = this.wallPosition.right;
        this.wallPosition.right -= 1;
      }
      cube = new THREE.Mesh(new THREE.CubeGeometry(25, 250, 100, 1, 1, 1, materials), new THREE.MeshFaceMaterial());
      cube.position.x = x;
      cube.position.y = 150;
      cube.position.z = 80 * z_i;
      cube.overdraw = true;
      this.scene.add(cube);
      cube = new THREE.Mesh(new THREE.CubeGeometry(3, 70, 70, 1, 1, 1, materials2), new THREE.MeshFaceMaterial());
      if (isLeft) {
        cube.position.x = x + 13;
      } else {
        cube.position.x = x - 13;
      }
      cube.position.y = 150;
      cube.position.z = 80 * z_i + 3;
      cube.action = {
        url: url,
        z: cube.position.z + 40
      };
      if (isLeft) {
        cube.action.p = Math.PI / 2 * 3;
      } else {
        cube.action.p = Math.PI / 2;
      }
      cube.overdraw = true;
      this.scene.add(cube);
      return this.cubes.push(cube);
    };

    TopView.prototype.read_friend = function() {
      this._read_friend(this.get_next_friend(), this.make_cube_right);
      return this._read_friend(this.get_next_friend(), this.make_cube_left);
    };

    TopView.prototype.get_next_friend = function() {
      var friend, randnum;
      randnum = Math.floor(Math.random() * this.friends.length);
      friend = this.friends[randnum];
      this.friends.splice(randnum, 1);
      return friend;
    };

    TopView.prototype._read_friend = function(friend, make_cube) {
      var self;
      self = this;
      return Corridor.FB.api('/' + friend.id + '/photos', function(response) {
        var i, photos, set_photos, sum, _ref, _results;
        photos = response["data"];
        sum = photos.length;
        if (sum === 0) {
          self._read_friend(self.get_next_friend(), make_cube);
          return;
        }
        set_photos = [];
        for (i = 0, _ref = sum - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
          if (sum === 0) break;
          if (set_photos.length === 5) break;
          if (photos[i]["picture"]) set_photos.push(photos[i]["picture"]);
        }
        _results = [];
        for (i = 0; i <= 5; i++) {
          _results.push(make_cube(set_photos[i]));
        }
        return _results;
      });
    };

    return TopView;

  })(Backbone.View);

  Corridor.topView = new Corridor.TopView;

}).call(this);
