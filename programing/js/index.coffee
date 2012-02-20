Code ?= {}

$ ->
  class Code.QuestionView extends Backbone.View
    el:"#question-content"
    initialize: ->
      @render()
    template:_.template $("#question-content-template").html()
    render: ->
      $(@el).html @template()

  class Code.AnswerView extends Backbone.View
    el:"#answer-content"
    events:
      "click .check":"check"
    check:->
      variable = Code.questionView.$(".variable").val()
      answer = @editor.getSession().getValue()
      eval "Code.exe = function(){"+variable+answer+"}";
      Code.answer = Code.questionView.$(".answer").val()
      user_ans = Code.exe()
      if Number(Code.answer) is Number(user_ans)
        alert("success "+user_ans)
      else
        alert("unsuccess "+user_ans)
    initialize: ->
      @render()
    template:_.template $("#answer-content-template").html()

    render: ->
      $(@el).html @template()
      editor = ace.edit "editor"
      JavaScriptMode = require("ace/mode/javascript").Mode
      EditSession = require("ace/edit_session").EditSession
      lang = require "ace/lib/lang"
      Range = require("ace/range").Range;
      editor.getSession().setMode(new JavaScriptMode())
      @editor = editor
      #editor.getSession().setValue(document.getElementById("main").innerHTML())

  Code.questionView = new Code.QuestionView
  Code.answerView = new Code.AnswerView
