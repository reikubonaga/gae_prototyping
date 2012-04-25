jQuery.support.cors = true
$ ->
  $.ajax(
    "url":"http://ja.wikipedia.org/wiki/HTML5"
    "xhr" : window.XDomainRequest ? window.hookXhr : undefined,
    crossDomain: true
    dataType: 'jsonp',
    "success":(res)->
      console.log res
  )