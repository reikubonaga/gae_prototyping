Corridor ?= {}

class Corridor.TopView extends Backbone.View
  el:"#content"
  wallPosition:
    left:8
    right:8
  cubes:[]
  initialize:->
    @projector = new THREE.Projector
    @container = document.createElement("div")
    $(@el).append @container
    @scene = new THREE.Scene

    @camera = new THREE.PerspectiveCamera(70,window.innerWidth/window.innerHeight,1,1000)
    camera = @camera
    camera.position.x = 200
    camera.position.y = 200
    camera.position.z = 800
    @scene.add camera

    for i in [0..8]
      @make_cube_right()
      @make_cube_left()

    @renderer = new THREE.CanvasRenderer()
    @renderer.setSize( window.innerWidth, window.innerHeight )
    @container.appendChild @renderer.domElement

    $(document).mousewheel @onDocumentMouseWheel
    $(document).mousedown @onDocumentMouseDown

    $("#start_fb").popover().click ->
      $("#my-modal").modal("toggle")
    $("#my-modal .closefun").click ->
      $("#my-modal").modal("hide")
    self = @
    $("#my-modal .start-fb").click ->
      Corridor.FB.login((response)->
        if response.authResponse
          Corridor.FB.api('/me/friends',(response)->
            self.friends = response["data"]
          )
        else
          console.log "login error"
      ,
        scope: 'email,user_photos,friends_photos'
      )
    @animate()

  animate:=>
    requestAnimationFrame( @animate )
    @render()
  render:->
    @renderer.render( @scene, @camera )
  scroll_z:0
  scroll_z_old:0
  onDocumentMouseWheel:(event,delta)=>
    @moveCamera Math.PI
    z = @camera.position.z;
    if @friends?
      if z/80<@scroll_z+8
        for i in [0..8]
          @scroll_z = @scroll_z-1
          @read_friend()
    @scroll_z_old = delta
    @camera.position.z = (z+20*delta+50*@scroll_z_old)|0;

  p:Math.PI
  onDocumentMouseDown:(e)=>
    mouse_x =   ((e.pageX-e.target.offsetParent.offsetLeft) / @renderer.domElement.width)  * 2 - 1
    mouse_y = - ((e.pageY-e.target.offsetParent.offsetTop) / @renderer.domElement.height) * 2 + 1
    vector = new THREE.Vector3(mouse_x, mouse_y, 0.5)
    @projector.unprojectVector(vector, @camera);
    ray = new THREE.Ray(@camera.position, vector.subSelf(@camera.position).normalize());

    intersects = ray.intersectObjects( @cubes )
    if intersects.length > 0
      action = intersects[0].object.action
      @moveRoad(action.z)
      @moveCamera(action.p)
  move_lock : false
  moveCamera:(n_p)->
    if @move_lock
      return
    if n_p is @p
      return
    @move_lock = true
    self = @
    start_p = @p
    flame = 20
    speed = 45
    _move = ->
      self.camera.lookAt new THREE.Vector3(
        self.camera.position.x+Math.sin(self.p),
        self.camera.position.y,
        self.camera.position.z+Math.cos(self.p))
    move = ->
      self.p += (n_p-start_p)/flame
      _move()
    end = ->
      self.p = n_p
      _move()
      self.move_lock = false
    for i in [0..(flame-1)]
      setTimeout(move,speed*i)
    setTimeout(end,speed*flame)
  moveRoad:(n_p)->
    if n_p is @camera.position.z
      return
    start_p = @camera.position.z
    self = @
    now_p = start_p
    flame = 20
    speed = 45
    move = ->
      now_p += (n_p-start_p)/flame
      self.camera.position.z = now_p
    for i in [0..flame]
      setTimeout(move,speed*i)

  make_cube_right:(url)=>
    @make_cube(400,url,false)

  make_cube_left:(url)=>
    @make_cube(0,url,true)

  make_cube:(x,url,isLeft)=>
    url ?= "https://blog.so-net.ne.jp/_images/blog/_f94/nasser/leonid_afremov_art_work_2.jpg";
    texture = new THREE.ImageUtils.loadTexture url
    material = new THREE.MeshLambertMaterial
      map:texture

    materials = []
    for i in [0..6]
      materials.push(new THREE.MeshBasicMaterial
          color: 0x2a2a2a
        )
    materials2 = []
    for i in [0..6]
      if isLeft and i is 0
        materials2.push material
      else if not isLeft and i is 1
        materials2.push material
      else
        materials2.push(new THREE.MeshBasicMaterial
          color: 0xffffff
        )
    if isLeft
      z_i = @wallPosition.left
      @wallPosition.left -= 1
    else
      z_i = @wallPosition.right
      @wallPosition.right -= 1

    cube = new THREE.Mesh( new THREE.CubeGeometry( 25, 250, 100, 1, 1, 1, materials ), new THREE.MeshFaceMaterial() )
    cube.position.x = x
    cube.position.y = 150
    cube.position.z = 80*z_i
    cube.overdraw = true
    @scene.add( cube )

    cube = new THREE.Mesh( new THREE.CubeGeometry( 3, 70, 70, 1, 1, 1, materials2 ), new THREE.MeshFaceMaterial() )
    if isLeft
      cube.position.x = x+13
    else
      cube.position.x = x-13
    cube.position.y = 150
    cube.position.z = 80*z_i+3
    cube.action =
      url:url
      z:cube.position.z+40
    if isLeft
      cube.action.p = Math.PI/2*3;
    else
      cube.action.p = Math.PI/2;
    cube.overdraw = true;
    @scene.add cube;
    @cubes.push cube
  read_friend:=>
    @_read_friend(@get_next_friend(),@make_cube_right)
    @_read_friend(@get_next_friend(),@make_cube_left)
  get_next_friend:=>
    randnum = Math.floor( Math.random() * @friends.length )
    friend = @friends[randnum];
    @friends.splice(randnum,1);
    return friend
  _read_friend:(friend,make_cube)=>
    self = @
    Corridor.FB.api('/'+friend.id+'/photos',(response)->
      photos = response["data"]
      sum = photos.length
      if sum is 0
        self._read_friend(self.get_next_friend(),make_cube)
        return
      set_photos = []
      for i in [0..sum-1]
        if sum is 0
          break
        if set_photos.length is 5
          break;
        if photos[i]["picture"]
          set_photos.push photos[i]["picture"]
      for i in [0..5]
        make_cube set_photos[i]
    )

Corridor.topView = new Corridor.TopView
