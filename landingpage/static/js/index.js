(function() {

  window.Landing = (function() {

    function Landing(el, text, option) {
      if (option == null) option = {};
      this.el = el;
      this.text = text;
      this.option = {};
    }

    Landing.prototype.nowtext = "";

    Landing.prototype.stack = [];

    Landing.prototype.setShowText = function(text, jel, option) {
      if (option == null) {
        option = {
          interval: 80
        };
      }
      return this.stack.push({
        text: text,
        option: option,
        jel: jel,
        type: "showText"
      });
    };

    Landing.prototype.setMoveElement = function(jel, option) {
      if (option == null) {
        option = {
          speed: 400
        };
      }
      return this.stack.push({
        jel: jel,
        option: option,
        type: "moveElement"
      });
    };

    Landing.prototype.setSleep = function(second) {
      return this.stack.push({
        second: second,
        type: "sleep"
      });
    };

    Landing.prototype.start = function() {
      var fuc, num, self;
      if (this.stack.length === 0) return;
      if (this.stack.length === 1) {
        this.exe(this.stack[0]);
        return;
      }
      num = 0;
      self = this;
      fuc = function(exe) {
        if (num === self.stack.length) return;
        $.when(self.exe(self.stack[num])).done(fuc);
        return ++num;
      };
      return fuc();
    };

    Landing.prototype.exe = function(stack) {
      stack.dfd = $.Deferred();
      switch (stack.type) {
        case "showText":
          this.showText(stack);
          break;
        case "moveElement":
          this.moveElement(stack);
          break;
        case "sleep":
          this.sleep(stack);
      }
      return stack.dfd.promise();
    };

    Landing.prototype.showText = function(d) {
      var interval, jel, nexttext, nowtext, textfun, timerID;
      jel = d.jel;
      nowtext = jel.html();
      nexttext = d.text;
      interval = d.option.interval;
      timerID = 0;
      textfun = function() {
        var addtext;
        if (nexttext.length === 0) {
          clearInterval(timerID);
          d.dfd.resolve();
          return;
        }
        addtext = nexttext.substring(0, 1);
        nexttext = nexttext.substring(1);
        nowtext += addtext;
        return jel.html(nowtext);
      };
      return timerID = setInterval(textfun, interval);
    };

    Landing.prototype.moveElement = function(d) {
      var position, speed;
      speed = d.option.speed;
      position = d.jel.offset().top;
      return $('body').animate({
        scrollTop: position
      }, speed, 'swing', function() {
        return d.dfd.resolve();
      });
    };

    Landing.prototype.sleep = function(d) {
      var fun;
      fun = function() {
        return d.dfd.resolve();
      };
      return setTimeout(fun, d.second);
    };

    return Landing;

  })();

}).call(this);
