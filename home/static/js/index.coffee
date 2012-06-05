class MainView extends Backbone.View
  initialize:()->
    $("#searchbar").focus()
  el:"body"
  events:
    "keydown #searchbar":"search"
  search:(e)->
    #enter
    if e.keyCode is 13
      location.href = "http://google.com/?#q="+$("#searchbar").val()+"&output=search"
    #tab
    if e.keyCode is 9
      $("#searchbar").focus()
      return false

$ ->
  view = new MainView
  console.log "se"