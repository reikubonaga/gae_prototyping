Code ?= {}
Code.models ?= {}

class Code.models.Question extends Backbone.Model
  url:"/programing/question"

$ ->
  class Code.TitleView extends Backbone.View
    el:"#title-content"
    initialize: ->
      @render()
    template:_.template $("#title-content-template").html()
    render: ->
      $(@el).html @template()

  class Code.QuestionView extends Backbone.View
    el:"#question-content"
    initialize: ->
      @render()
    template:_.template $("#question-content-template").html()
    render: ->
      $(@el).html @template()
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

  class Code.AnswerView extends Backbone.View
    el:"#answer-content"
    events:
      "click .check":"check"
      "click .post":"post"
    check:->
      variable = Code.questionView.variable.getSession().getValue()
      answer = @editor.getSession().getValue()
      Code.answer = $("#answer_num").val()
      eval "Code.exe = function(){"+variable+answer+"}"
      user_ans = Code.exe()
      if Number(Code.answer) is Number(user_ans)
        alert("success "+user_ans)
      else
        alert("unsuccess "+user_ans)
    post:->
      console.log "post"
      variable = Code.questionView.variable.getSession().getValue()
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

    initialize: ->
      @render()
    template:_.template $("#answer-content-template").html()

    render: ->
      $(@el).html @template()
      $("#answer").css("width",$("#answer").width()+"px")
      #$("#answer").css("height",$("#answer").height()+"px")
      editor = ace.edit "answer"
      JavaScriptMode = require("ace/mode/javascript").Mode
      EditSession = require("ace/edit_session").EditSession
      lang = require "ace/lib/lang"
      Range = require("ace/range").Range
      editor.getSession().setMode(new JavaScriptMode())
      @editor = editor
      #editor.getSession().setValue(document.getElementById("main").innerHTML())

  Code.questionView = new Code.QuestionView
  Code.answerView = new Code.AnswerView
  Code.titleView = new Code.TitleView
