#coffee

#title ans1 ans2 ans3 memo
class Data extends Backbone.Model
  default:
    title:""
    ans1:""
  initialize:()->
    @on "change",(model)->
      date = new Date()
      time = date.getTime()
      if @isNew()
        model.set "created",time
      model.set "updated",time
  clear:()->
    @destroy()

  get_word_els:(start=0,length=0)->
    textarea = @get "text"
    line = textarea.split("\n")
    ans_word_num = 2
    if line.length < ans_word_num+1
      return false
    if length is 0
      length = line.length
    els = []
    left = 0
    first = true
    now_length = 0
    for i in [ans_word_num..line.length-1]
      now_left = left
      if not line[i] or line[i] is ""
        if left > 0
          left -= 1
        now_length += 1
        length += 1
        continue
      text = line[i]
      if text[0] is " " or text[0] is "　"
        now_length += 1
        length += 1
        continue
      span = document.createElement "span"
      if text.search(/^http/) isnt -1
        a = document.createElement "a"
        a.innerHTML = line[i]
        a.setAttribute "href",line[i]
        a.setAttribute "target","blank"
        span.appendChild a
      else if text.search(/^-/) isnt -1
        left += 1
        span.className = "word"
        span.innerHTML = line[i].substr(1)
      else if text.search(/^!|(!-)|(-!)/) isnt -1
        span.className = "word sub"
        span.innerHTML = line[i].substr(1)
      else
        span.className = "word"
        span.innerHTML = line[i]
      if now_left > 0
        span.className = span.className + " l" + now_left
      if now_length < start or now_length >= start+length
        first = false
        now_length += 1
        continue
      if now_left isnt left and not first
        els.push document.createElement "br"
      els.push span
      if first
        first = false
      if left > 0
        els.push document.createElement "br"
      now_length += 1
    return els

  get_word:()->
    els = @get_word_els()
    output = document.createElement "div"
    if els
      for el in els
        output.appendChild el
    return output


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
    if not @model.get("title")
      @model.destroy()
      return false
    if not @model.get "text"
      @model.set "text",@model.get("title")+"\n"+@model.get("ans1")
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
    "keyup #content-left-wrap textarea":"editing"
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
      @focus_data 0
    @views[@nowIndex].select()

  list_keydown:(e)->
    #tab
    if e.keyCode is 9
      textareaEle = @getTextareaEle()
      textareaEle.focus()
      if @views[@nowIndex]
        @views[@nowIndex].unselect()
      return false
    #up
    if e.keyCode is 40 or e.keyCode is 74
      @focus_data @nowIndex+1
    #down
    if e.keyCode is 38 or e.keyCode is 75
      @focus_data @nowIndex-1
    #enter
    if e.keyCode is 13
      @views[@nowIndex].edit()
      textareaEle = @getTextareaEle()
      textareaEle.focus()
      if @views[@nowIndex]
        @views[@nowIndex].unselect()
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
    range = $(e.target).getSelection()
    text = textarea.substr(0,range.start)
    arr = text.match(/\n/g)
    if arr
      now_line = arr.length+1
    else
      now_line = 1
    @setTextareaTitle line,now_line
    if @model
      @model.set
        title:line[0]
        ans1:line[1]
        text:textarea
      @model.save()
    else
      @model = Datas.create
        title:line[0]
        ans1:line[1]
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

  setTextareaTitle:(line,now_line_num)->
    if not @textareaTitleEle
      @textareaTitleEle = @$("#content-left-wrap .title")
    if not @textareaAns1Ele
      @textareaAns1Ele = @$("#content-left-wrap .ans1")
    if not @textareaWordsEle
      @textareaWordsEle = $(@$("#content-left-wrap .words")[0])

    if not line[0]
      title = ""
    else
      title = line[0]
    if not line[1]
      ans1 = ""
    else
      ans1 = line[1]
    @textareaTitleEle.html title
    @textareaAns1Ele.html ans1
    @textareaWordsEle.html ""
    if not @model
      return
    if now_line_num < 7
      start_line = 0
    else
      start_line = now_line_num-3
    els = @model.get_word_els start_line,7
    divEle = document.createElement "div"
    for el in els
      divEle.appendChild el
    @textareaWordsEle.append divEle



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
    if e and e.keyCode is 13
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
        if @views[@nowIndex]
          @views[@nowIndex].select()

  initialize:()->
    #Datas.bind "add",@addOne,@
    Datas.bind "reset",@addAll,@
    Datas.bind "all",@render,@
    self = @
    Datas.fetch(
      success:(collection)->
        if collection.length is 0
          Datas.create
            title:"How to use search"
            ans1:"1. Type tab. then focus searchbar"
            ans2:"2. Type \"use\" and enter. then the results show and focus search result"
            ans3:"3. Type j or k (Down or Up) and enter. then move to search bar results and focus textarea"
            text:"How to use search and edit\n1. Type tab. then focus searchbar\n2. Type \"use\". then the results show and focus search result\n3. Type j or k (Down or Up) and enter. then move to search bar results and focus textarea\n"
          Datas.create
            title:"How to use textarea"
            ans1:"1. Type tab. then focus serchbar"
            ans2:"2. Type \"first text\" and enter. then the new text is created and focus textarea"
            ans3:"The text is always saved when you type"
            text:"How to use textarea\n1. Type tab. then focus serchbar\n2. Type \"first text\" and enter. then the new text is created and focus textarea\nThe text is always saved when you type\n"
          Datas.create
            title:"Follow me"
            ans1:"I am Rei Kubonaga"
            ans2:"I am working at Kwl-E"
            ans3:"if you have something to think, please send me the message"
            text:"Follow me\nI am Rei Kubonaga\nI studied mathematics in Kyoto University and working in Kwl-E\nif you have something to think, please send me the message\nhttps://twitter.com/kubonagarei\nenable link"
          Datas.each self.addOne
          self.views[0].edit()
    )

  render_textarea:(model)->
    @model = model
    textarea = @model.get "text"
    line = textarea.split("\n")
    @setTextareaTitle line,0
    textareaEle = @getTextareaEle()
    textareaEle.val textarea
  render_new:()->
    @model = null
    @setTextareaTitle()
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
      @old_search_text = false
      @search()
      if @views[0]
        @views[0].scroll()
    @model = null

  addAll:()->
    datas = Datas.sortBy((item)->
      item.cid
    )
    if not datas or datas.length is 0
    else
      _.each datas,@addOne
      @views[0].scroll()
    textareaEle = @getTextareaEle()
    textareaEle.focus()

  addOne:(data)=>
    view = new DataView
      model:data
    view.setParent @
    @getResultListEle().append view.render().el
    @views.push view

$ ->
  view = new IndexView