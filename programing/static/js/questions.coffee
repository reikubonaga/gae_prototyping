Code ?= {}
Code.models ?= {}

class Code.models.Question extends Backbone.Model
  url:"/programing/question"

class Code.models.Questions extends Backbone.Collection
  url:"/programing/questions"

$ ->
  class Code.TitleView extends Backbone.View
    el:"#title-content"
    initialize: ->
      @render()
    template:(model)->
      _.template($("#title-content-template").html(),model)
    render: ->
      Questions = new Code.models.Questions
      self = @
      Questions.fetch(
        success:(collection)->
          for model in collection.toJSON()
            $(self.el).append self.template model
      )

  Code.titleView = new Code.TitleView