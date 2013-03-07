#
App ?= {}

class App.User extends Backbone.Model

class App.Users extends Backbone.Collection
  model:App.User
  localStorage: new Store("janken-user")
  find: (name):
    users = @where "name",name
    if not users or users.length is 0
      user = @create
        name: name
    else
      user = users[0]
    return user

App.users = new App.Users

class App.Janken extends Backbone.Model
  @targets : [@gu, @choki, @pa]
  @gu : 1
  @choki : -1
  @pa : 0
  @rand :()->
    rand = Math.random()*3|0 - 1
  @win : 1
  @lose : -1
  @draw : 0
  @fight :(me, you)->
    if me is you
      return App.Janken.draw
    if me is @gu and you is @pa
      return App.Janken.lose
    if me is @gu and you is @choki
      return App.Janken.win
    if me is @choki and you is @pa
      return App.Janken.win
    if me is @choki and you is @gu
      return App.Janken.lose
    if me is @pa and you is @gu
      return App.Janken.win
    if me is @pa and you is @choki
      return App.Janken.lose

class App.Jankens extends Backbone.Collection
  model:App.Janken
  localStorage: new Store("janken-user")

  janken:(janken_name)->
    console.log janken_name

  computer:(janken_key)->
    rand = App.Janken.rand()
    App.Janken.fight janken_key, rand

  log : (name, hand)->
    user = App.users.find name
    janken = @create
      name: name
      hand: hand

  logs : (name)->
    logs = @filter (obj)->
      return obj.get("name") is name
    return logs

App.jankens = new App.Jankens

class JankenView extends Backbone.View
  el:"#janken"
  events:
    "click .janken":"janken"

  janken:(e)->
    $target = $(e.target)
    console.log $("#logs")
    #App.jankens.computer App.Janken[$target.text()]
    #@render()

  render:()->
    $("#logs").empty()
    hands = _.pluck App.jankens.logs(),"hand"
    console.log hands

$ ->
  view = new JankenView
  view.delegateEvents()