(function() {

  jQuery.support.cors = true;

  $(function() {
    return $.ajax({
      "url": "http://ja.wikipedia.org/wiki/HTML5",
      "success": function(res) {
        return console.log(res);
      }
    });
  });

}).call(this);
