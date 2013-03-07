#coffee

doc ?= document

#title memo
class Data extends Backbone.Model
  default:
    title:""
    access:0

  initialize:()->
    self = @
    @on "change",(model)->
      date = new Date()
      time = date.getTime()
      if self.isNew()
        self.set "created",time
      self.set "updated",time

    if not @get "access"
      @set "access",0

  clear:()->
    @destroy()

  #右の一覧に表示するときのelementsを取得
  get_word_els:(start=0,length=0)->
    textarea = @get "text"
    line = textarea.split("\n")
    ans_word_num = 1
    if line.length < ans_word_num+1
      return false
    if length is 0
      length = line.length
    els = []
    left = 0
    first = true

    #tagを取得
    tags = {}
    for i in [ans_word_num..line.length-1]
      text = line[i]
      if text.search(/\s@/) isnt -1
        text_arr = text.split " @"
        data = text_arr[0]
        for j in [1..text_arr.length-1]
          tag = text_arr[j]
          if not tags[tag]
            tags[tag] = [data]
          else
            tags[tag].push data

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
      else if text.search(/^(!-)|(-!)/) isnt -1
        left += 1
        span.className = "word sub"
        span.innerHTML = line[i].substr(2)
      else if text.search(/^-/) isnt -1
        left += 1
        span.className = "word"
        span.innerHTML = line[i].substr(1)
      else if text.search(/^!/) isnt -1
        span.className = "word sub"
        span.innerHTML = line[i].substr(1)
      else if text.search(/<->/) isnt -1
        span.className = "word flow"
        text_arr = text.split "<->"
        for j in [0..text_arr.length-1]
          text = text_arr[j]
          if text is ""
            continue
          d = document.createElement "div"
          d.innerHTML = text
          span.appendChild d
          if text_arr.length-1 isnt j
            d = document.createElement "div"
            d.innerHTML = "◀▶"
            span.appendChild d
      else if text.search(/->/) isnt -1
        span.className = "word flow"
        text_arr = text.split "->"
        for j in [0..text_arr.length-1]
          text = text_arr[j]
          if text is ""
            continue
          d = document.createElement "div"
          d.innerHTML = text
          span.appendChild d
          if text_arr.length-1 isnt j
            d = document.createElement "div"
            d.innerHTML = "▶"
            span.appendChild d

      else if text.search(/^\*@@.+@@.+@@.+@@.+/) isnt -1
        span.className = "axis"
        text_arr = text.split "@@"
        name_tags = []
        for j in [1..4]
          t = text_arr[j]
          if t.search(/^.+\[.+\]$/) isnt -1
            _t = t.split "["
            text_arr[j] = _t[0]
            name_tags.push _t[1].substr(0,_t[1].length-1)
          else
            name_tags.push t
        div_arr = []
        display_tags_obj = {}
        for j in [0..3]
          if j%2 is 0
            div_box = doc.createElement "div"
          first = if j > 1 then 1 else 0
          second = j%2 + 2
          display_tags = _.intersection tags[text_arr[first+1]],tags[text_arr[second+1]]
          display_tags_obj[j] = display_tags
          div = doc.createElement "div"
          div.className = "box box"+j
          if j is 1
            tag = name_tags[first]
            d = doc.createElement "div"
            d.className = "tag tag1"
            d.innerHTML = tag
            div.appendChild d
          if j is 2
            tag = name_tags[second]
            d = doc.createElement "div"
            d.className = "tag tag2"
            d.innerHTML = tag
            div.appendChild d
          if j is 3
            tag = name_tags[second]
            d = doc.createElement "div"
            d.className = "tag tag3"
            d.innerHTML = tag
            div.appendChild d
          if display_tags.length isnt 0
            for data in display_tags
              d = doc.createElement "div"
              d.className = "word"
              d.innerHTML = data
              div.appendChild d
          div_box.appendChild div
          div_arr.push div
          if j%2 is 1
            d = doc.createElement "div"
            d.className = "clearfix"
            div_box.appendChild d
            span.appendChild div_box
        #左
        tag = name_tags[first]
        d = doc.createElement "div"
        d2 = doc.createElement "div"
        d2.className = "tag4_box"
        d3 = doc.createElement "div"
        d3.className = "tag tag4"
        d3.innerHTML = tag
        d2.appendChild d3
        d.appendChild d2
        span.appendChild d

        #box1とbox2の高さを調整
        if display_tags_obj[0].length < display_tags_obj[1].length
          $(".box0",span).height display_tags_obj[1].length * 21
        if display_tags_obj[2].length < display_tags_obj[3].length
          $(".box2",span).height display_tags_obj[3].length * 21


      else if text.search(/^@@.+@@.+@@.+@@.+/) isnt -1
        span.className = "matrix"
        text_arr = text.split "@@"
        table = doc.createElement "table"
        name_tags = []
        for j in [1..4]
          t = text_arr[j]
          if t.search(/^.+\[.+\]$/) isnt -1
            _t = t.split "["
            text_arr[j] = _t[0]
            name_tags.push _t[1].substr(0,_t[1].length-1)
          else
            name_tags.push t
        for j in [1..text_arr.length-1]
          if j%2 is 1
            tr = doc.createElement "tr"
          tag = text_arr[j]
          td = doc.createElement "td"
          d = doc.createElement "div"
          d.className = "tag"
          d.innerHTML = name_tags[j-1]
          td.appendChild d
          if tags[tag]
            for data in tags[tag]
              d = doc.createElement "div"
              d.className = "word"
              d.innerHTML = data
              td.appendChild d
          tr.appendChild td
          if j%2 is 0
            table.appendChild tr
        span.appendChild table

      else if text.search(/\s@/) isnt -1
        span.className = "word tags"
        text_arr = text.split " @"
        d = document.createElement "div"
        d.innerHTML = text_arr[0]
        span.appendChild d
        for j in [1..text_arr.length-1]
          text = text_arr[j]
          if text is ""
            continue
          d = document.createElement "div"
          d.className = "tag"
          d.innerHTML = text
          span.appendChild d
          if text_arr.length-1 isnt j
            d = document.createElement "div"
            d.innerHTML = ""
            span.appendChild d
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

  count:()->
    n = @get "access"
    @set "access",n+1

class DataList extends Backbone.Collection
  model:Data
  localStorage: new Store("idea-data")
  #csv形式でexportする
  export: ()->
    console.log "export"

Datas = new DataList

class History extends Backbone.Model
  
#title memo
class Histories extends Backbone.Collection
  model:History
  last_pull_time:0
  last_push_time:0
  push:()->
    console.log "push"
  pull:()->
    console.log "pull"
  commit:()->
    console.log "pull"
  #いくつかのデータをまとめて受け取ったとき
  import:()->
    console.log ""


class DataView extends Backbone.View
  events:()->
    "click .edit":"edit"
    "click .delete":"delete"
  template:()->
    _.template $("#data_template").html(),@model.toJSON()
  tag:"div"
  className:"data"
  render:()->
    if not @model.get("title")
      @model.destroy()
      return false
    if not @model.get "text"
      @model.set "text",@model.get("title")
      @model.save()
    div = doc.createElement "div"
    div.innerHTML = @template()
    @$el.prepend div
    @show()
    @

  update:()->
    @render()
    $(@$el.children()[1]).remove()

  setParent:(view)->
    @parent = view

  show:()->
    $(@$(".show-list")[0]).append @model.get_word()

  edit:()->
    @parent.render_textarea @model

  select:()->
    $(@$(".selectertext")[0]).html "▶"
  unselect:()->
    $(@$(".selectertext")[0]).html ""
  scroll:()->
    $(window).scrollTop @$el.position().top - 110

  delete:(e)->
    if confirm("delete?")
      if @model
        @model.destroy()
      @parent.render_new()
      @parent.clear()
      @parent.old_search_text = false
      @parent.search()
      if @parent.views[0]
        @parent.views[0].scroll()
    @model = null

#全体view
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

    height = $(window).height() - 170
    sum = Math.ceil($(@views[@nowIndex].el).height()/height)
    #down
    if e.keyCode is 40 or e.keyCode is 74
      if @nowScrollIndex<sum
        $(window).scrollTop $(window).scrollTop()+height
        @nowScrollIndex += 1;
      else
        @focus_data @nowIndex+1
    #up
    if e.keyCode is 38 or e.keyCode is 75
      if @nowScrollIndex>1
        $(window).scrollTop $(window).scrollTop()-height
        @nowScrollIndex -= 1;
      else
        @focus_data @nowIndex-1

    #enter
    if e.keyCode is 13
      @views[@nowIndex].edit()
      textareaEle = @getTextareaEle()
      textareaEle.focus()
      if @views[@nowIndex]
        @views[@nowIndex].unselect()
      @clickedDataView = @views[@nowIndex]
      return false

  clickedDataView:false
  nowIndex:false
  nowScrollIndex:1
  focus_data:(i)->
    if @views[i] and @views[@nowIndex]
      @views[@nowIndex].unselect()
    if @views[i]
      @nowIndex = i
      @views[i].select()
      @views[i].scroll()
      @nowScrollIndex = 1

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
    @setTextareaTitle line
    if @model
      @model.set
        title:line[0]
        text:textarea
      @model.save()
    else
      @create line[0],textarea
    if @clickedDataView
      @clickedDataView.update()

  create:(title,text)->
    @model = Datas.create
      title:title
      text:text

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

  setTextareaTitle:(line)->
    if not @textareaTitleEle
      @textareaTitleEle = @$("#content-left-wrap .title")

    if not line or not line[0]
      title = ""
    else
      title = line[0]
    @textareaTitleEle.html title

  isSearch:true
  old_search_text:""

  search:(e = false)->
    searchbarEle = @getSearchbarEle()
    text = searchbarEle.val()
    if text isnt @old_search_text
      @old_search_text = text
      datas = Datas.filter (obj)->
        return obj.get("title").search(text) isnt -1
      datas = _.sortBy datas,(item)->
        -item.get "access"
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
        @create text,text
        @old_search_text = false
        @search()
        @clickedDataView = @views[0]
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
            text:"How to use search and edit\n1. Type tab. then focus searchbar\n2. Type \"use\". then the results show and focus search result\n3. Type j or k (Down or Up) and enter. then move to search bar results and focus textarea\n"
          Datas.create
            title:"How to use textarea"
            text:"How to use textarea\n@@1@@2@@3@@4\nType tab. then focus serchbar@@1\nType \"first text\" and enter. then the new text is created and focus textarea@@2\nThe text is always saved when you type@@3\ntest@@4"
          Datas.create
            title:"Follow me"
            text:"Follow me\nI am Rei Kubonaga\nI studied mathematics in Kyoto University and working in Kwl-E\nif you have something to think, please send me the message\nhttps://twitter.com/kubonagarei\nenable link"
          Datas.each self.addOne
          self.views[0].edit()
    )
    $("#editing").height $(window).height()-170

  render_textarea:(model)->
    @model = model
    if @model
      @model.count()
    textarea = @model.get "text"
    line = textarea.split("\n")
    @setTextareaTitle line
    textareaEle = @getTextareaEle()
    textareaEle.val textarea

  render_new:()->
    @model = null
    @setTextareaTitle()
    textareaEle = @getTextareaEle()
    textareaEle.val ""

  views:[]
  clear:()->
    @getResultListEle().html ""
    @views = []
    @nowIndex = false

  addAll:()->
    datas = Datas.sortBy (item)->
      -item.get "access"
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