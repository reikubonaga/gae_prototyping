Lifelog ?= {}

class Lifelog.Item extends Backbone.Model
  defaults:()->
    top = Math.floor( Math.random() * 600 )
    left = Math.floor( Math.random() * 1000 )
    {
      top:top
      left:left
    }

class Lifelog.Items extends Backbone.Collection
  model:Lifelog.Item
  localStorage: new Store("item")

class Lifelog.ItemView extends Backbone.View
  template:(model)->
    _.template($("#item-template").html(),model)
  template_screen:(model)->
    _.template($("#item-screen-template").html(),model)
  events:
    "click .images img":"screen"
  screen:(event)->
    el = @make("div",{"class":"screen"})
    target_el = event.currentTarget
    @screen = el
    $(el).html @template_screen @model
    $("#theater").show().click(->
      $("#theater").hide()
      $("#screen").html("").hide()
    )
    $("#screen").append(el).show()
    Lifelog.indexView.render_back @model["image"+$(target_el).attr("num")]
  render:(model)->
    @model = model
    el = @make("div",{"class":"item"})
    @setElement el
    @$el.html @template model
    @$el.css(model.css)
    @delegateEvents()
    return @el

class Lifelog.IndexView extends Backbone.View
  el:"#content"
  datas:[
    name:"光が丘"
    css:
      top:"30px"
      left:"50px"
    image1:"http://nerimaku.jp/walk/img/IMG_0712.jpg"
    image1_c:"高層団地。30階以上のマンションの団地"
    image2:"http://occhan.cocolog-nifty.com/diary/images/2005.04.23%20051.jpg"
    image2_c:"光が丘公園。広い。"
    image3:"http://www.secom-shl.co.jp/new/town/03/images/p_town2_m6.jpg"
    image3_c:"光が丘図書館。光が丘公園の近くにある"
  ,
    name:"三原"
    css:
      top:"300px"
      left:"500px"
    image1:"http://blogimg.goo.ne.jp/user_image/32/e3/dccd2e0c725ef28f6dfa210b319d42c9.jpg"
    image1_c:"有竜島。無人島。船で遊びに行ける"
    image2:"http://www.zicco.biz/blog/recent/images/rairai01.jpg"
    image2_c:"来来軒。ラーメン屋。三原駅の近く。"
    image3:"http://pds.exblog.jp/pds/1/201012/09/51/f0137351_163187.jpg"
    image3_c:"筆影山。瀬戸内海が一望できる"
  ]
  render:()->
    for data in @datas
      itemView = new Lifelog.ItemView
      @$el.append itemView.render data
    @render_back @datas[0].image2
  render_back:(image)->
    width = $(window).width()
    $("#background img").attr("src",image).css("width",width+"px")

Lifelog.indexView = new Lifelog.IndexView
Lifelog.indexView.render()