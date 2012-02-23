Code ?= {}
Code.models ?= {}

class Code.models.Question extends Backbone.Model
  url:"/programing/question"

class Code.models.Questions extends Backbone.Collection
  url:"/programing/questions"

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
      answer = @editor.getSession().getValue()
      Code.answer = $("#answer_num").val()
      eval "Code.exe = function(){"+variable+answer+"}"
      user_ans = Code.exe()
      if Number(Code.answer) is Number(user_ans)
        alert("success "+user_ans)
      else
        alert("unsuccess "+user_ans)
    post:->
      variable = @variable.getSession().getValue()
      answer = @editor.getSession().getValue()
      title = $("#title").val()
      question = $("#question").val()
      answer_num = $("#answer_num").val()
      question_model = new Code.models.Question(
        title:title
        code:answer
        answer:answer_num
        question:question
        variable:variable
      )
      question_model.save()

    render:->
      @$el.append @template()

      $("#variable").css("width",$("#variable").width()+"px")
      $("#variable").css("height",$("#variable").height()+"px")
      editor = ace.edit "variable"
      editor.renderer.setShowGutter false
      JavaScriptMode = require("ace/mode/javascript").Mode
      EditSession = require("ace/edit_session").EditSession
      lang = require "ace/lib/lang"
      Range = require("ace/range").Range
      editor.getSession().setMode(new JavaScriptMode())
      @variable = editor

      $("#answer").css("width",$("#answer").width()+"px")
      #$("#answer").css("height",$("#answer").height()+"px")
      editor = ace.edit "answer"
      JavaScriptMode = require("ace/mode/javascript").Mode
      EditSession = require("ace/edit_session").EditSession
      lang = require "ace/lib/lang"
      Range = require("ace/range").Range
      editor.getSession().setMode(new JavaScriptMode())
      @editor = editor

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
      answer = @editor.getSession().getValue()
      Code.answer = $("#answer_num").val()
      eval "Code.exe = function(){"+variable+answer+"}"
      user_ans = Code.exe()
      if Number(Code.answer) is Number(user_ans)
        alert("success "+user_ans)
      else
        alert("unsuccess "+user_ans)
    post:->
      variable = @variable.getSession().getValue()
      answer = @editor.getSession().getValue()
      title = $("#title").val()
      question = $("#question").val()
      @model.set(
        code:answer
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
