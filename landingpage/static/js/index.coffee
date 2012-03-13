class window.Landing
  constructor:(el,text,option={})->
    @el = el
    @text = text
    @option = {}
  nowtext: ""
  stack:[]
  setShowText:(text,jel,option={interval:80})->
    @stack.push
      text:text
      option:option
      jel:jel
      type:"showText"
  setMoveElement:(jel,option={speed:400})->
    @stack.push
      jel:jel
      option:option
      type:"moveElement"
  setSleep:(second)->
    @stack.push
      second:second
      type:"sleep"
  start:->
    if @stack.length == 0
      return
    if @stack.length is 1
      @exe @stack[0]
      return
    num = 0
    self = @
    fuc = (exe)->
      if num is self.stack.length
        return
      $.when(self.exe(self.stack[num])).done(fuc)
      ++num
    fuc()
  exe:(stack)->
    stack.dfd = $.Deferred()
    switch stack.type
      when "showText" then @showText stack
      when "moveElement" then @moveElement stack
      when "sleep" then @sleep stack
    return stack.dfd.promise()

  showText:(d)->
    jel = d.jel
    nowtext = jel.html()
    nexttext = d.text
    interval = d.option.interval
    timerID = 0
    textfun = ->
      if nexttext.length is 0
        clearInterval timerID
        d.dfd.resolve()
        return
      addtext = nexttext.substring(0,1)
      nexttext = nexttext.substring 1
      nowtext += addtext
      jel.html nowtext
    timerID = setInterval(textfun,interval)

  moveElement:(d)->
    speed = d.option.speed
    position = d.jel.offset().top
    $('body').animate({scrollTop:position}, speed, 'swing',->
      d.dfd.resolve()
    )
  sleep:(d)->
    fun = ->
      d.dfd.resolve()
    setTimeout(fun,d.second)

