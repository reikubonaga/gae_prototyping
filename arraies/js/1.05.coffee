class Mosaic
  #すでにレンダリングしているデータ
  datas:[]
  #まだレンダリングしてないデータ
  ins_datas:[]
  #まだ計算してないデータ
  wait_datas:[]
  #mosaicで表示している画像のそれぞれの高さ
  render_top:[]
  #mosaicのそれぞれの列の横の長さ
  render_left:[]
  data_width:226
  width:980
  space_width:60
  space_height:112
  #width_num
  #collection

  constructor:()->
    @calculate_left()
    @render_top = (0 for num in [0..@width_num-1])
  get_low_left_index:()->
    min = @render_top[0]
    min_index = 0
    for i in [0..@render_top.length-1]
      if min > @render_top[i]
        min = @render_top[i]
        min_index = i
    min_index
  get_size:(width,height,img_width)->
    img_width ?= @data_width
    [img_width,(height/width*img_width)|0]
  #ここを変えることで拡張性を高める
  get_next_position:(width,height)->
    #一番高さの低い場所に入れる
    index = @get_low_left_index()
    [w,h] = @get_size(width,height)
    top = @render_top[index]
    @render_top[index] = top+h+@space_height
    return [top,@render_left[index]]
  set_position:(data,top,left,width)->
    data.top = top
    data.left = left
    [data.img_width,data.img_height] = @get_size(data.width,data.height,width)
    @wait_datas = _.reject(@wait_datas,(obj)->
      return obj.id is data.id
    )
    @ins_datas.push data
  add:(datas)->
    for data in datas
      if not data.id or not data.height or not data.width
        console.log "not id or hegiht or width"
        continue
      @wait_datas.push data
  calculate:()->
    wait_datas = @wait_datas
    for i in [0..wait_datas.length-1]
      data = wait_datas[i]
      [top,left,width] = @get_next_position(data.width,data.height)
      @set_position(data,top,left,width)
  #次のデータを取得
  next:()->
    if @ins_datas.legnth is 0
      return false
    data = @ins_datas[0]
    @datas.push data
    @ins_datas.shift()
    return data
  calculate_left:()->
    #200x+10x-10+y=980 max x
    @width_num = ((@width+@space_width)/(@data_width+@space_width))|0
    @surplus_width = @width-(@width_num-1)*@space_width-@width_num*@data_width
    @render_left.push @surplus_width/2
    for i in [1..@width_num-1]
      @render_left.push (@render_left[i-1]+@space_width+@data_width)
  #次に読み込む判定
  need_data_space:3000
  need_data:(scrollTop)->
    top = _.min @render_top
    if scrollTop + @need_data_space > top
      return true
    return false


class ImpactMosaic extends Mosaic
  constructor: (@collection) ->
    @width = $(window).width()
    super()
  equal_index:false
  equal_space:20
  before_top:-1
  before_left_index:-1
  equal_top:()->
    now_index=@datas.length+@ins_datas.length
    if @equal_index is false or (now_index > @equal_index+@width_num-2)
      for i in [0..@render_top.length-2]
        if (Number(@render_top[i+1])>=Number(@render_top[i])-@equal_space)and(Number(@render_top[i+1])<=Number(@render_top[i])+@equal_space)
          if @before_top is @render_top[i]
            continue
          #if @before_left_index is i
          #  continue
          @equal_index = now_index
          if @render_top[i+1]>@render_top[i]
            return [i,i+1]
          return [i,i]
    false

  get_next_position:(width,height)->
    #一番高さの低い場所に入れる
    if [index,bi] = @equal_top()
      img_width = @data_width*2+@space_width
      [w,h] = @get_size(width,height,img_width)
      top = @render_top[bi]
      #@before_left_index = index
      @render_top[index] = top+h+@space_height
      @render_top[index+1] = @render_top[index]
      @before_top = @render_top[index]
      if top is 1688
        console.log "test"
      return [top,@render_left[index],img_width]
    [w,h] = @get_size(width,height)
    index = @get_low_left_index()
    top = @render_top[index]
    @render_top[index] = top+h+@space_height
    return [top,@render_left[index]]

class Model_Project extends Backbone.Model
  test:()->
    console.log "test"

class Model_Projects extends Backbone.Collection
  url:"/arraies/js/projects.json"
  model:Model_Project

model_Projects = new Model_Projects

class View_Project extends Backbone.View
  template:(model_json)->
    _.template($("#project_template").html(),model_json)
  render:(model_json)->
    div = @make "div"
    img = @make "img"
    $(img)
      .hide()
      .attr("src",model_json.image_host+model_json.user_id+"/"+model_json.id+"/bigger_"+model_json.image_url)
      .css({height:model_json.img_hegiht+"px",width:model_json.img_width+"px"})
      .load(->
        $(".thumbnail",div).append img
        $(img).fadeIn("slow")
      ).error(->
        console.log "error"
      )
    $(div).html @template(model_json)


class View_Projects extends Backbone.View
  el:"#content"
  render:()->
    self = @
    model_Projects.fetch(
      success:(collection)->
        arr = collection.toJSON()
        arr = _.shuffle(arr)
        mosaic.add arr
        mosaic.calculate()
        self.render_projects(100)
    )
  render_projects:(limit=50)->
    i = 0
    while data = mosaic.next()
      if i is limit
        break
      view_project = new View_Project
      @$el.append view_project.render data
      ++i

$ ->
  window.mosaic = new ImpactMosaic(model_Projects)
  view = new View_Projects
  view.render()

  next_scrollY = 300
  scroll_up = true
  lock = false
  $(window).scroll ->
    if window.mosaic.need_data(@scrollY)
      view.render()
    if lock
      return
    if @scrollY > next_scrollY and scroll_up
      lock = true
      $("#header-group").slideUp("slow",->
        scroll_up = false
        lock = false
      )
    if not scroll_up and @scrollY<200
      lock = true
      $("#header-group").slideDown("normal",->
        next_scrollY = $(window)[0].scrollY+100
        scroll_up = true
        lock = false
      )
  y_arr = []
  lock = false

  $(window).mousemove (event)->
    if lock
      return
    if event.clientY < 200 and not scroll_up
      lock = true
      $("#header-group").slideDown("normal",->
        lock = false
        next_scrollY = $(window)[0].scrollY+100
        scroll_up = true
      )


