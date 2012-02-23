Code ?= {}
Code.models ?= {}
Code.utils ?= {}

class Code.models.Question extends Backbone.Model
  url:"/programing/question"

class Code.models.Questions extends Backbone.Collection
  url:"/programing/questions"

class Code.Ace
  render:(id)->
    editor = ace.edit id
    editor.renderer.setShowGutter false
    JavaScriptMode = require("ace/mode/javascript").Mode
    EditSession = require("ace/edit_session").EditSession
    lang = require "ace/lib/lang"
    Range = require("ace/range").Range
    editor.getSession().setMode(new JavaScriptMode())
    return editor

Code.ace = new Code.Ace

class Code.Util
  user_ans:null
  check:(variable,code,answer)->
    eval "Code.exe = function(){"+variable+" "+code+" return main();};"
    @user_ans = Code.exe()
    console.log @user_ans
    if Number(answer) is Number(@user_ans)
      return true
    else
      return false

Code.util = new Code.Util

#error時はundefinedとerrorログを返す

Code.Math ?= {}

class Code.Math.Fragment
  x:1
  y:1
  set_arr:(a,b)->
    @x = a
    @y = b
  set:(str)->
    arr = str.split "/"
    @x = arr[0]
    @y = arr[1]
  real:->
    @x/@y
  format:()->
    if @x < 0 and @y < 0
      return (-1*@x)+"/"+(-1*@y)
    else if @x > 0 and @y < 0
      return (-1*@x)+"/"+(-1*@y)
    else if @x = 0
      return 0
    else if @y = 0
      Code.Math.core.error "fragment error y=0"
      return
    else
      return @x+"/"+@y

class Code.Math.Formula1
  v:0
  x:0
  set_arr:(a,b)->
    @x = a
    @v = b
  #割り算はどうするか
  set:(str)->
    str = Code.Math.core.str_to_plus str
    arr = str.split "+"
    for xarr in arr
      varr = xarr.split "x"
      if varr[1] is ""
        varr[1] = 1
      if not varr[1]
        if @v is 0
          @v = Code.Math.core.str_to_number varr[0]
        else
          @v += Code.Math.core.str_to_number varr[0]
      if varr[1] is 1
        if @x is 0
          @x = Code.Math.core.str_to_number varr[0]
        else
          @x += Code.Math.core.str_to_number varr[0]
  exe:->
    x = @x
    v = @v
    g = Code.Math.core.gcd(x,v)
    f = new Code.Math.Fragment
    f.set_arr(-v/g,x/g)
    f.format()

class Code.Math.Core
  error:(text)->
    console.log "error"+text
  #最小公約数
  gcd:(a,b)->
    if a is 0 or b is 0
      return undefined
    f = true
    r = a % b
    while r isnt 0
      a = b
      b = r
      r = a % b
    return b

  str_to_plus:(str)->
    e_arr = str.split "="
    if e_arr.length > 2
      @error "equal > 2"
      return
    if e_arr.length = 2
      str = e_arr[0]+"-"+e_arr[1]
    else
      str = e_arr[0]
    if str.substring(0,1) is "-"
      str= "-"+str.substring(1).replace("-","+-")
    else
      str=str.replace("-","+-")
    return str
  str_to_number:(str)->
    if str.substring(0,1) is "-"
      return -1*Number(str.substring 1)
    else
      return Number(str)

  x:(str)->
    f = new Code.Math.Formula1
    f.set str
    return f.exe()

Code.Math.core = new Code.Math.Core

$m = Code.Math.core

$ ->
  class Code.PostView extends Backbone.View
    initialize:->
      el = @make "div"
      @setElement el
      $("#content").html ""
      $("#content").append el
      $("#header_menu li").removeClass("active")
      $("#header_menu .post").addClass("active")
      @render()
      @delegateEvents()
    template:_.template $("#post-content-template").html()
    events:
      "click .check":"check"
      "click .post":"post"
    check:->
      variable = @variable.getSession().getValue()
      code = @code.getSession().getValue()
      answer = $("#answer_num").val()
      if Code.util.check(variable,code,answer)
        alert "success"+Code.util.user_ans
      else
        alert "unsuccess"+Code.util.user_ans
    post:->
      variable = @variable.getSession().getValue()
      code = @code.getSession().getValue()
      title = $("#title").val()
      question = $("#question").val()
      answer = $("#answer").val()
      question_model = new Code.models.Question(
        title:title
        code:code
        answer:answer
        question:question
        variable:variable
      )
      question_model.save()

    render:->
      @$el.append @template()

      $("#variable").css("width",$("#variable").width()+"px")
      $("#variable").css("height",$("#variable").height()+"px")
      @variable = Code.ace.render "variable"
      @variable.getSession().setValue $("#post-variable-template").html()

      $("#code").css("width",$("#code").width()+"px")
      @code = Code.ace.render "code"
      @code.getSession().setValue $("#post-code-template").html()

  class Code.TopView extends Backbone.View
    initialize:->
      el = @make "div"
      @setElement el
      $("#content").html ""
      $("#content").append el
      $("#header_menu li").removeClass("active")
      $("#header_menu .try").addClass("active")
      @render()
      Code.topQuestionView = new Code.TopQuestionView
    template:_.template $("#top-content-template").html()
    render:->
      @$el.html @template()

  class Code.TopQuestionView extends Backbone.View
    initialize: ->
      @setElement("#top-question-content")
      @render()
    template:(model)->
      _.template($("#top-question-template").html(),model)
    render: ->
      Questions = new Code.models.Questions
      self = @
      Questions.fetch(
        success:(collection)->
          for model in collection.toJSON()
            self.$el.append self.template model
      )

  class Code.TryView extends Backbone.View
    initialize:->
      el = @make "div"
      @setElement el
      $("#content").html ""
      $("#content").append el
      $("#header_menu li").removeClass("active")
    template:(model)->
      _.template( $("#try-content-template").html(),model)
    events:
      "click .check":"check"
      "click .post":"post"
    check:->
      variable = @variable.getSession().getValue()
      code = @code.getSession().getValue()
      answer = @model.get "answer"
      if Code.util.check(variable,code,answer)
        alert "success"+Code.util.user_ans
      else
        alert "unsuccess"+Code.util.user_ans
    post:->
      variable = @variable.getSession().getValue()
      code = @code.getSession().getValue()
      title = $("#title").val()
      question = $("#question").val()
      @model.set(
        code:code
        variable:variable
      )
      @model.save()
    render:(question_id)->
      self = @
      Question = new Code.models.Question
      Question.fetch(
        data:
          id:question_id
        success:(model)->
          self.model = model
          model = model.toJSON()
          self.$el.html self.template model
          $("#variable").css("width",$("#variable").width()+"px")
          $("#variable").css("height",$("#variable").height()+"px")
          editor = ace.edit "variable"
          editor.renderer.setShowGutter false
          JavaScriptMode = require("ace/mode/javascript").Mode
          EditSession = require("ace/edit_session").EditSession
          lang = require "ace/lib/lang"
          Range = require("ace/range").Range
          editor.getSession().setMode(new JavaScriptMode())
          self.variable = editor
          editor.getSession().setValue model.variable

          $("#answer").css("width",$("#answer").width()+"px")
          #$("#answer").css("height",$("#answer").height()+"px")
          editor = ace.edit "answer"
          JavaScriptMode = require("ace/mode/javascript").Mode
          EditSession = require("ace/edit_session").EditSession
          lang = require "ace/lib/lang"
          Range = require("ace/range").Range
          editor.getSession().setMode(new JavaScriptMode())
          self.editor = editor
          editor.getSession().setValue model.code

          self.delegateEvents()
      )

  class Code.workspace extends Backbone.Router
    routes:
      "":"top"
      "post":"post"
      "try/:question_id":"try"
    try:(id)->
      Code.tryView = new Code.TryView
      Code.tryView.render id
    top:->
      Code.topView = new Code.TopView
    post:->
      Code.postView = new Code.PostView

  route = new Code.workspace
  Backbone.history.start()
