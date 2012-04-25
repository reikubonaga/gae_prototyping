#coffee

#title ans1 ans2 ans3 memo
class Data extends Backbone.Model
  default:
    title:""
    ans1:""
    ans2:""
    ans3:""
  initialize:()->
    @on "change",(model)->
      date = new Date()
      time = date.getTime()
      if @isNew()
        model.set "created",time
      model.set "updated",time
  clear:()->
    @destroy()
  get_word:()->
    textarea = @get "text"
    line = textarea.split("\n")
    if line.length < 5
      return false
    el = document.createElement "div"
    for i in [4..line.length-1]
      if line[i] is ""
        continue
      text = line[i]
      if text[0] is " " or text[0] is "　"
        continue
      span = document.createElement "span"
      if text.search("/^http/") isnt -1
        a = document.createElement "a"
        a.innerHTML = line[i]
        a.setAttribute "href",line[i]
        span.appendChild a
      else
        span.className = "word"
        span.innerHTML = line[i]
      el.appendChild span
    return el


class DataList extends Backbone.Collection
  model:Data
  localStorage: new Store("idea-data")

Datas = new DataList

class DataView extends Backbone.View
  events:()->
    "click .show":"show"
    "click .edit":"edit"
    "click .paste":"paste"
    "click .word":"addWord"
  template:()->
    _.template $("#data_template").html(),@model.toJSON()
  tag:"div"
  className:"data"
  render:()->
    if not @model.get "ans1"
      @model.set "ans1",""
      @model.save()
    if not @model.get "ans2"
      @model.set "ans2",""
      @model.save()
    if not @model.get "ans3"
      @model.set "ans3",""
      @model.save()
    if not @model.get("title") and not @model.get("ans1") and not @model.get("ans2") and not @model.get("ans3")
      @model.destroy()
      return false
    if not @model.get "text"
      @model.set "text",@model.get("title")+"\n"+@model.get("ans1")+"\n"+@model.get("ans2")+"\n"+@model.get("ans3")
      @model.save()
    @$el.html @template()
    @show()
    @
  setParent:(view)->
    @parent = view
  isShow:false
  show:(e)->
    if not @isShow
      $(@$(".show-list")[0]).append @model.get_word()
      @isShow = true
    else
      $(@$(".show-list")[0]).html ""
      @isShow = false
  edit:()->
    @parent.render_textarea @model
  addWord:(e)->
    @parent.addWord $(e.target).text()
  paste:()->
    @parent.addWord $(@$(".title .edit")[0]).html()


class IndexView extends Backbone.View
  el:"body"
  events:
    "keydown #content-left-wrap textarea":"editing"
    "change #content-left-wrap textarea":"editing"
    "keydown #search_bar input":"search"
    "change #search_bar input":"search"
    "click #search_bar .button":"search"
    "click .delete":"delete"
    "click .menu .new":"render_new"
    "click #search_bar .new":"click_new"
    "click .save":"editing"
  editing:(e)->
    textarea = $(@$("#content-left-wrap textarea")[0]).val()
    line = textarea.split("\n")
    @$("#content-left-wrap .title").html line[0]
    @$("#content-left-wrap .ans1").html line[1]
    @$("#content-left-wrap .ans2").html line[2]
    @$("#content-left-wrap .ans3").html line[3]
    if @model
      @model.set
        title:line[0]
        ans1:line[1]
        ans2:line[2]
        ans3:line[3]
        text:textarea
      @model.save()
    else
      @model = Datas.create
        title:line[0]
        ans1:line[1]
        ans2:line[2]
        ans3:line[3]
        text:textarea

  addWord:(word = "")->
    if word is ""
      return
    textarea = $(@$("#content-left-wrap textarea")[0]).val()
    if textarea is ""
      textarea += word
    else
      textarea += "\n"+word
    $(@$("#content-left-wrap textarea")[0]).val textarea
    @editing()
  click_new:()->
    text = $(@$("#search_bar input")[0]).val()
    @render_new()
    $(@$("#content-left-wrap textarea")[0]).val text
    @editing()
  search:(e)->
    text = $(@$("#search_bar input")[0]).val()
    datas = Datas.filter (obj)->
      return obj.get("title").search(text) isnt -1
    @clear()
    for data in datas
      @addOne data
  initialize:()->
    #Datas.bind "add",@addOne,@
    Datas.bind "reset",@addAll,@
    Datas.bind "all",@render,@
    Datas.fetch()
  render_textarea:(model)->
    @model = model
    textarea = @model.get "text"
    line = textarea.split("\n")
    @$("#content-left-wrap .title").html line[0]
    @$("#content-left-wrap .ans1").html line[1]
    @$("#content-left-wrap .ans2").html line[2]
    @$("#content-left-wrap .ans3").html line[3]
    @$("#content-left-wrap textarea").val textarea
  render_new:()->
    @model = null
    @$("#content-left-wrap .title").html ""
    @$("#content-left-wrap .ans1").html ""
    @$("#content-left-wrap .ans2").html ""
    @$("#content-left-wrap .ans3").html ""
    @$("#content-left-wrap textarea").val ""

  render:(event,model)->
    #console.log model
  clear:()->
    @$("#search_list").html ""
  delete:(e)->
    if confirm("delete?")
      @model.destroy()
      @render_new()
      @clear()
      @addAll()
    @model = null
  addAll:()->
    _.each(Datas.sortBy((item)->
      item.cid
    ),@addOne)
  addOne:(data)=>
    view = new DataView
      model:data
    view.setParent @
    @$("#search_list").append view.render().el

class ShortcutKeys extends Backbone.Shortcuts
  shortcuts:
    "ctrl+r" : "reloadPage"
  reloadPage: -> alert "Reload!!!"

$ ->
  view = new IndexView
  shortcuts = new ShortcutKeys