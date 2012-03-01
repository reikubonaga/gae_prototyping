Code ?= {}
Code.rest ?= {}
Code.utils ?= {}
Code.views ?= {}

class Code.rest.MyProfile extends Backbone.Model
  url:"/programing/me"
  loaded:false
  isLogin:(redirect_url)->
    if loaded
      if @get "login"
        exe()
      else

    else
      @load exe
  load:(exe)->
    @fetch
      success:exe
Code.rest.myProfile = new Code.rest.MyProfile

class Code.rest.Question extends Backbone.Model
  url:"/programing/question"

class Code.rest.Questions extends Backbone.Collection
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
    else if @x is 0
      return 0
    else if @y is 0
      Code.Math.core.error "fragment error y=0"
      return
    else if @y is 1
      return @x
    else
      return @x+"/"+@y

class Code.Math.Formula
  constructor: (@str) ->
    @input_str = @str
    @str = Code.Math.core.str_to_plus @str
    @set @str
  dimension:0
  str:""
  set:(str)->
    str = Code.Math.core.str_to_plus str
    @str = str
    match_arr = str.match(/x(\d+)\+/i)
    if match_arr is null
      if str.match(/x\+/)
        @dimension = 1
        return @
    max = 0
    for match in match_arr
      arr = match.match(/\d/)
      if arr[0] > max
        max = arr[0]
    @dimension = Number(max)
    @
  set_num:(ins,num)->
    if not num
      return ins
    if ins is 0
      ins = Code.Math.core.str_to_number num
    else
      ins += Code.Math.core.str_to_number num
    ins
  create:(str)->
    @set str
    switch @dimension
      when 1
        f = new Code.Math.Formula1
        f.set @str
        return f
      when 2
        f = new Code.Math.Formula2
        f.set @str
        return f
      else
        Code.Math.core.error "formula create no dimension"
        return @

class Code.Math.Formula2 extends Code.Math.Formula
  v:0
  x1:0
  x2:0
  set:(str)->
    arr = str.split "+"
    for xarr in arr
      varr = xarr.split "x"
      if varr[0] is ""
        varr[0] = 1
      if varr[1] is ""
        varr[1] = 1
      if not varr[1]
        @v = @set_num(@v,varr[0])
        continue
      if varr[1] is 1
        console.log varr
        @x1 = @set_num(@x1,varr[0])
        continue
      if varr[1] is "2"
        @x2 = @set_num(@x2,varr[0])
        continue
  min:()->
    if @x2 is 1
      str = "x2"
    else if @x2 is -1
      str = "-x2"
    else
      str = @x2+"x2"
    if @x1>0
      if @x1 is 1
        str += "+x"
      else
        str += "+"+@x1+"x"
    else
      if @x1 is -1
        str += "-x"
      else
        str += @x1+"x"
    if @v>0
      str += "+"+@v
    else
      str += @v
    str
  exe:->
    x2 = @x2
    x = @x
    v = @v
    g = Code.Math.core.gcd(x,v)
    if not g? or g is 0
      Code.Math.core.error "formula1 exe error"
      return
    f = new Code.Math.Fragment
    f.set_arr(-1*v/g,x/g)
    f.format()

class Code.Math.Formula1 extends Code.Math.Formula
  v:0
  x:0
  set_arr:(a,b)->
    @x = Code.Math.core.str_to_number a
    @v = Code.Math.core.str_to_number b
  #割り算はどうするか
  set:(str)->
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
    if not g? or g is 0
      Code.Math.core.error "formula1 exe error"
      return
    f = new Code.Math.Fragment
    f.set_arr(-1*v/g,x/g)
    f.format()

class Code.Math.Core
  error:(text)->
    console.log "error"+text
  #最小公約数
  gcd:(a,b)->
    if not a? or not b? or a is 0 or b is 0
      @error "undefind gcd"
      return
    f = true
    r = a % b
    while r isnt 0
      a = b
      b = r
      r = a % b
    return b

  str_to_plus:(str)->
    if not str?
      @error "undefind str_to_plus"
      return
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
      str=str.replace(/-/g,"+-")
    str=str.replace(/\+--/g,"+")
    str=str.replace(/--/g,"+")
    return str

  str_to_number:(str)->
    if typeof str is "number"
      return str
    if str.substring(0,1) is "-"
      return -1*Number(str.substring 1)
    else
      return Number(str)

  x:(str)->
    f = new Code.Math.Formula
    f = f.create str
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
      question_model = new Code.rest.Question(
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
      Questions = new Code.rest.Questions
      self = @
      Questions.fetch(
        success:(collection)->
          for model in collection.toJSON()
            self.$el.append self.template model
      )

  class Code.EditView extends Backbone.View
    initialize:->
      el = @make "div"
      @setElement el
      $("#content").html ""
      $("#content").append el
      $("#header_menu li").removeClass("active")
    template:(model)->
      _.template( $("#edit-content-template").html(),model)
    events:
      "click .save":"save"
      "click .delete":"delete"
    save:->
      variable = @variable.getSession().getValue()
      code = @code.getSession().getValue()
      @model.set(
        code:code
        variable:variable
      )
      @model.save()
    delete:->
      @model.destroy()
    render:(question_id)->
      self = @
      Question = new Code.rest.Question
      Question.fetch(
        data:
          id:question_id
        success:(model)->
          self.model = model
          model = model.toJSON()
          self.$el.html self.template model

          $("#variable").css("width",$("#variable").width()+"px")
          $("#variable").css("height",$("#variable").height()+"px")
          self.variable = Code.ace.render "variable"
          self.variable.getSession().setValue model.variable

          $("#code").css("width",$("#code").width()+"px")
          self.code = Code.ace.render "code"
          self.code.getSession().setValue model.code

          self.delegateEvents()
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
      @model.set(
        code:code
        variable:variable
      )
      @model.save()
    render:(question_id)->
      self = @
      Question = new Code.rest.Question
      Question.fetch(
        data:
          id:question_id
        success:(model)->
          self.model = model
          model = model.toJSON()
          self.$el.html self.template model

          $("#variable").css("width",$("#variable").width()+"px")
          $("#variable").css("height",$("#variable").height()+"px")
          self.variable = Code.ace.render "variable"
          self.variable.getSession().setValue model.variable

          $("#code").css("width",$("#code").width()+"px")
          self.code = Code.ace.render "code"
          self.code.getSession().setValue model.code

          self.delegateEvents()
      )

  class Code.HeaderView extends Backbone.View
    el:"#header-right"
    template:$("#header-content-template").html()
    login_template:$("#header-login-content-template").html()
    render:->
      self = @
      Code.rest.myProfile.load(
        Code.FB.login((response)->
          if response.authResponse
            Code.FB.api('/me/friends',(response)->
              self.friends = response["data"]
            )
          else
            console.log "login error"
        ,
          scope: 'email,user_photos,friends_photos'
        )
      )





  class Code.workspace extends Backbone.Router
    routes:
      "":"top"
      "post":"post"
      "edit/:question_id":"edit"
      "try/:question_id":"try"
    try:(id)->
      Code.tryView = new Code.TryView
      Code.tryView.render id
    edit:(id)->
      Code.editView = new Code.EditView
      Code.editView.render id
    top:->
      Code.topView = new Code.TopView
    post:->
      Code.postView = new Code.PostView
  Code.headerView = new Code.HeaderView
  Code.headerView.render()
  route = new Code.workspace
  Backbone.history.start()
