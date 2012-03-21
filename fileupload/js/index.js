(function() {

  $(function() {
    return $("#upload_files").change(function() {
      var files;
      files = $("#upload_files").file;
      return console.log(files);
    });
  });

}).call(this);
