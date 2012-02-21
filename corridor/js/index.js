
window.fbAsyncInit = function() {
    FB.init({
            appId      : '191040330938892', // App ID
            status     : true, // check login status
            cookie     : true, // enable cookies to allow the server to access the session
            xfbml      : true  // parse XFBML
        });
    FB.getLoginStatus(function(response) {
            if (response.status == "connected") {
                FB.api('/me/friends',function(response){
                        friends = response["data"];
                });          
            }
        });
};

// Load the SDK Asynchronously
(function(d){
    var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement('script'); js.id = id; js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";
    ref.parentNode.insertBefore(js, ref);
}(document));

var container;

var camera, scene, renderer, objects = [], images = [], friends = [];
var projector = new THREE.Projector();  
init();
animate();

function init() {
    
    container = document.createElement( 'div' );
    var insEle = document.getElementById("content");
    insEle.appendChild( container );
    
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.x = 200;
    camera.position.y = 200;
    camera.position.z = 600;
    scene.add( camera );
    
    // 壁と額を設置
    var now_z_i_left = 8;
    var now_z_i_right = 8;

    function make_cube(x,url){
        if(typeof url === "undefined") url = "https://blog.so-net.ne.jp/_images/blog/_f94/nasser/leonid_afremov_art_work_2.jpg";
        var z_i;
        var materials = [];
        for ( var i = 0; i < 6; i ++ ) {
            //materials.push( new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff } ) );
            materials.push( new THREE.MeshBasicMaterial( { color: 0x2a2a2a } ) );

        }
        var materials2 = [];
        for ( var i = 0; i < 6; i ++ ) {
            materials2.push( new THREE.MeshBasicMaterial( { color: 0x2a2a2a } ) );
        }
        
        if(x>200){
            z_i = now_z_i_right;
            --now_z_i_right;
        }else{
            z_i = now_z_i_left;
            --now_z_i_left;
        }
        //var texture = new THREE.Texture( img );
        var texture  = new THREE.ImageUtils.loadTexture(url);
        var material = new THREE.MeshLambertMaterial({map: texture});
        
        if(x>200){
            
            materials2[1] = material;
        }else{
            materials2[0] = material;
        }
        
        var cube = new THREE.Mesh( new THREE.CubeGeometry( 25, 250, 100, 1, 1, 1, materials ), new THREE.MeshFaceMaterial() );
        cube.position.x = x;
        cube.position.y = 150;
        cube.position.z = 80*z_i;
        cube.overdraw = true;
        scene.add( cube );
          
        var cube = new THREE.Mesh( new THREE.CubeGeometry( 3, 70, 70, 1, 1, 1, materials2 ), new THREE.MeshFaceMaterial() );
        cube.position.x = x>200?x-13:x+13;
        cube.position.y = 150;
        cube.position.z = 80*z_i+3;
        cube.action = {url:url,z:cube.position.z+40};
        if(x>200){
            cube.action.p = Math.PI/2;
        }else{
            cube.action.p = Math.PI/2*3;
        }
        cube.overdraw = true;
        scene.add( cube );
        objects.push(cube);
    }
        
    for(var i=0;i<8;++i){
        make_cube(0);
        make_cube(400);
    }
    renderer = new THREE.CanvasRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    container.appendChild( renderer.domElement );

    //スクロールの動作
    var camera_p = camera.position;
    var before_z = 0;
    var min_i = 0;
    function onDocumentMouseWheel( event,delta ) {
        moveCamera(Math.PI);
        var z = camera_p.z;
        if(typeof friends !== "undefined"){
            if(z/80<min_i+8){
                for(var i=0;i<8;++i){
                    min_i = min_i-1;
                    read_friend();
                }
            }
        }
        before_z = delta;
        camera_p.z = (z+20*delta+50*before_z)|0;
    }
    $(document).mousewheel(onDocumentMouseWheel);
    p = Math.PI;
    //スクロールの動作
    function onDocumentMouseDown(e){
        var mouse_x =   ((e.pageX-e.target.offsetParent.offsetLeft) / renderer.domElement.width)  * 2 - 1;
        var mouse_y = - ((e.pageY-e.target.offsetParent.offsetTop) / renderer.domElement.height) * 2 + 1;
        var vector = new THREE.Vector3(mouse_x, mouse_y, 0.5);
        projector.unprojectVector(vector, camera);
        var ray = new THREE.Ray(camera.position, vector.subSelf(camera.position).normalize());

        var intersects = ray.intersectObjects( objects );
        if ( intersects.length > 0 ) {
            action = intersects[0].object.action;
            //camera_p.z = action.z;
            moveRoad(action.z);
            moveCamera(action.p);
        }
    }
    $(document).mousedown(onDocumentMouseDown);
    var lock = false;
    function moveCamera(n_p){
        if(lock) return;
        if(n_p==p) return;
        lock = true;
        var start_p = p;
        function move(){
            p += (n_p-start_p)/20;
            camera.lookAt(new THREE.Vector3(camera_p.x+Math.sin(p),camera_p.y,camera_p.z+Math.cos(p)) );
        }
        function end(){
            p = n_p;
            camera.lookAt(new THREE.Vector3(camera_p.x+Math.sin(p),camera_p.y,camera_p.z+Math.cos(p)) );
            lock = false;
        }
        for(i=0;i<19;++i){
            setTimeout(move,45*i);
        }
        setTimeout(end,45*20);
    }

    function moveRoad(n_p){
        if(n_p==camera_p.z) return;
        var start_p = camera_p.z;
        var now_p = start_p;
        function move(){
            now_p += (n_p-start_p)/20;
            camera_p.z = now_p;
        }
        for(i=0;i<20;++i){
            setTimeout(move,45*i);
        }
    }
    $('#start_fb').popover().click(function(){
      $('#my-modal').modal("toggle");
    });
    $('#my-modal .closefun').click(function(){
      $('#my-modal').modal("hide");
    });
    $('#my-modal .start-fb').click(function(){
       FB.login(function(response) {
           if (response.authResponse) {
                console.log('Welcome!  Fetching your information.... ');
                FB.api('/me/friends',function(response){
                        friends = response["data"];
                });
            } else {
               console.log('User cancelled login or did not fully authorize.');
            }
        }, {scope: 'email,user_photos,friends_photos'});      
    });
    function read_friend(){
        var randnum = Math.floor( Math.random() * friends.length );
        var right = friends[randnum];
        friends.splice(randnum,1);
        FB.api('/'+right.id+'/photos',function(response){
                var photos = response["data"];
                var length = photos.length;
                var set_photos = [];
                for(var i=0;i<length;++i){
                    if(set_photos.length == 5) break;
                    if(typeof photos[i].picture !== "undefined"){
                        set_photos.push(photos[i].picture);
                    }
                }
                for(var i=0;i<5;i++){
                    make_cube(400,set_photos[i]);
                }
        });
        randnum = Math.floor( Math.random() * friends.length );
        var left = friends[randnum];
        friends.splice(randnum,1);
        FB.api('/'+right.id+'/photos',function(response){
                var photos = response["data"];
                var length = photos.length;
                var set_photos = [];
                for(var i=0;i<length;++i){
                    if(set_photos.length == 5) break;
                    if(typeof photos[i].picture !== "undefined"){
                        set_photos.push(photos[i].picture);
                    }
                }
                for(var i=0;i<set_photos.length;i++){
                    make_cube(0,set_photos[i]);
                }
        });
    }
}


function animate() {
    requestAnimationFrame( animate );
    render();
}

function render() {
    renderer.render( scene, camera );
}