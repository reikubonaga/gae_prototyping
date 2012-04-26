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
    if not @model.get("title")
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
  select:()->
    $(@$(".selectertext")[0]).html "▶"
  unselect:()->
    $(@$(".selectertext")[0]).html ""
  scroll:()->
    $(window).scrollTop @$el.position().top - 110

class IndexView extends Backbone.View
  el:"body"
  events:
    "keydown #content-left-wrap textarea":"editing"
    "change #content-left-wrap textarea":"editing"
    "keydown #search_bar input":"search"
    "change #search_bar input":"search"
    "click #search_bar .button":"search"
    "focus #search_list_input":"list_focus"
    "keydown #search_list_input":"list_keydown"
    "click .delete":"delete"
    "click .menu .new":"render_new"
    "click .save":"editing"
  list_focus:(e)->
    if @nowIndex is false
      @nowIndex = 0
      @views[@nowIndex].select()
      @views[@nowIndex].scroll()

  list_keydown:(e)->
    #tab
    if e.keyCode is 9
      textareaEle = @getTextareaEle()
      textareaEle.focus()
      return false
    #up
    if e.keyCode is 40
      @focus_data @nowIndex+1
    #down
    if e.keyCode is 38
      @focus_data @nowIndex-1
    #enter
    if e.keyCode is 13
      @views[@nowIndex].edit()
      textareaEle = @getTextareaEle()
      textareaEle.focus()
      return false

  nowIndex:false
  focus_data:(i)->
    if @views[i] and @views[@nowIndex]
      @views[@nowIndex].unselect()

    if @views[i]
      @nowIndex = i
      @views[i].select()
      @views[i].scroll()

  editing:(e)->
    textareaEle = @getTextareaEle()
    textarea = textareaEle.val()
    if textarea is ""
      return
    line = textarea.split("\n")
    @setTextareaTile line[0],line[1],line[2],line[3]
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

  getTextareaEle:()->
    if not @textareaEl
      @textareaEl = $(@$("#content-left-wrap textarea")[0])
    @textareaEl

  getSearchbarEle:()->
    if not @searchbarEle
      @searchbarEle = $(@$("#search_bar input")[0])
    @searchbarEle

  getSearchbarButtonEle:()->
    if not @searchbarButtonEle
      @searchbarButtonEle = $(@$("#search_bar .button")[0])[0]
    @searchbarButtonEle

  getResultListEle:()->
    if not @resultListEle
      @resultListEle = @$("#search_list")
    @resultListEle

  getResultListInputEle:()->
    if not @resultListInputEle
      @resultListInputEle = @$("#search_list_input")
    @resultListInputEle

  setTextareaTile:(title,ans1="",ans2="",ans3="")->
    if not @textareaTitleEle
      @textareaTitleEle = @$("#content-left-wrap .title")
    if not @textareaAns1Ele
      @textareaAns1Ele = @$("#content-left-wrap .ans1")
    if not @textareaAns2Ele
      @textareaAns2Ele = @$("#content-left-wrap .ans2")
    if not @textareaAns3Ele
      @textareaAns3Ele = @$("#content-left-wrap .ans3")
    if not title
      title = ""
    if not ans1
      ans1 = ""
    if not ans2
      ans2 = ""
    if not ans3
      ans3 = ""
    @textareaTitleEle.html title
    @textareaAns1Ele.html ans1
    @textareaAns2Ele.html ans2
    @textareaAns3Ele.html ans3

  addWord:(word = "")->
    if word is ""
      return
    textareaEle = @getTextareaEle()
    textarea = textareaEle.val()
    if textarea is ""
      textarea += word
    else
      textarea += "\n"+word
    textareaEle.val textarea
    @editing()

  isSearch:true
  old_search_text:""
  search:(e)->
    searchbarEle = @getSearchbarEle()
    text = searchbarEle.val()
    if text isnt @old_search_text
      @old_search_text = text
      datas = Datas.filter (obj)->
        return obj.get("title").search(text) isnt -1
      @clear()
      if datas.length is 0 and @isSearch
        @isSearch = false
        searchbarButtonEle = @getSearchbarButtonEle()
        searchbarButtonEle.innerHTML = "create"
      if datas.length > 0 and not @isSearch
        @isSearch = true
        searchbarButtonEle = @getSearchbarButtonEle()
        searchbarButtonEle.innerHTML = "search"
      for data in datas
        @addOne data
    #enter
    if e.keyCode is 13
      if not @isSearch
        textareaEle = @getTextareaEle()
        @render_new()
        text = text.replace "\n", ""
        textareaEle.val text
        textareaEle.focus()
        return false
      else
        el = @getResultListInputEle()
        el.focus()

  initialize:()->
    #Datas.bind "add",@addOne,@
    Datas.bind "reset",@addAll,@
    Datas.bind "all",@render,@
    Datas.fetch()

  render_textarea:(model)->
    @model = model
    textarea = @model.get "text"
    line = textarea.split("\n")
    @setTextareaTile line[0],line[1],line[2],line[3]
    textareaEle = @getTextareaEle()
    textareaEle.val textarea
  render_new:()->
    @model = null
    @setTextareaTile()
    textareaEle = @getTextareaEle()
    textareaEle.val ""

  render:(event,model)->
    #console.log model

  views:[]
  clear:()->
    @getResultListEle().html ""
    @views = []
    @nowIndex = false

  delete:(e)->
    if confirm("delete?")
      if @model
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
    @getResultListEle().append view.render().el
    @views.push view

class ShortcutKeys extends Backbone.Shortcuts
  shortcuts:
    "ctrl+r" : "reloadPage"
  reloadPage: -> alert "Reload!!!"

$ ->
  view = new IndexView
  shortcuts = new ShortcutKeys