var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight;

var container;

var camera, scene, scene2, renderer;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();


function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    scene = new THREE.Scene();
    scene2 = new THREE.Scene();

    scene.fog = new THREE.Fog( 0x000000, 1500, 4000 );
    scene2.fog = scene.fog;

    camera = new THREE.PerspectiveCamera( 35, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 5000 );
    camera.position.z = 1500;

    scene.add( camera );

    // GROUND

    var imageCanvas = document.createElement( "canvas" ),
        context = imageCanvas.getContext( "2d" );

    imageCanvas.width = imageCanvas.height = 128;

    context.fillStyle = "#444";
    context.fillRect( 0, 0, 128, 128 );

    context.fillStyle = "#fff";
    context.fillRect( 0, 0, 64, 64);
    context.fillRect( 64, 64, 64, 64 );

    var textureCanvas = new THREE.Texture( imageCanvas, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping );
    materialCanvas = new THREE.MeshBasicMaterial( { map: textureCanvas } );

    textureCanvas.needsUpdate = true;
    textureCanvas.repeat.set( 1000, 1000 );

    var textureCanvas2 = new THREE.Texture( imageCanvas, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping, THREE.NearestFilter, THREE.NearestFilter );
    materialCanvas2 = new THREE.MeshBasicMaterial( { color: 0xffccaa, map: textureCanvas2 } );

    textureCanvas2.needsUpdate = true;
    textureCanvas2.repeat.set( 1000, 1000 );

    var geometry = new THREE.PlaneGeometry( 100, 100 );


    var meshCanvas = new THREE.Mesh( geometry, materialCanvas );
    meshCanvas.rotation.x = Math.PI / 2;
    meshCanvas.scale.set( 1000, 1000, 1000 );
    meshCanvas.doubleSided = true;

    var meshCanvas2 = new THREE.Mesh( geometry, materialCanvas2 );
    meshCanvas2.rotation.x = Math.PI / 2;
    meshCanvas2.scale.set( 1000, 1000, 1000 );
    meshCanvas2.doubleSided = true;


    // PAINTING

    var callbackPainting = function( image ) {

        texturePainting2.image = image;
        texturePainting2.needsUpdate = true;

        scene.add( meshCanvas );
        scene2.add( meshCanvas2 );

        var geometry = new THREE.PlaneGeometry( 100, 100 ),
        mesh = new THREE.Mesh( geometry, materialPainting ),
        mesh2 = new THREE.Mesh( geometry, materialPainting2 );

        addPainting( scene, mesh );
        addPainting( scene2, mesh2 );

        function addPainting( zscene, zmesh ) {

            zmesh.scale.x = image.width / 100;
            zmesh.scale.y = image.height / 100;

            zscene.add( zmesh );

            var meshFrame = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0x000000, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 5 } )  );

            meshFrame.scale.x = 1.1 * image.width / 100;
            meshFrame.scale.y = 1.1 * image.height / 100;

            zscene.add( meshFrame );

            var meshShadow = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.9, transparent: true } )  );

            meshShadow.position.z = - 1.1 * image.height/2;
            meshShadow.scale.x = 1.1 * image.width / 100;
            meshShadow.scale.y = 1.1 * image.height / 100;
            meshShadow.rotation.x = -Math.PI / 2;
            zscene.add( meshShadow );

            meshShadow.position.y = - 1.1 * image.height/2;

            var floorHeight = - 1.117 * image.height/2;
            meshCanvas.position.y = meshCanvas2.position.y = floorHeight;

        }


    };

    var texturePainting = THREE.ImageUtils.loadTexture( "http://www.whitegadget.com/attachments/pc-wallpapers/84671d1320124706-art-art-pic.jpg", THREE.UVMapping, callbackPainting ),
        texturePainting2 = new THREE.Texture(),
        materialPainting = new THREE.MeshBasicMaterial( { color: 0xffffff, map: texturePainting } ),
        materialPainting2 = new THREE.MeshBasicMaterial( { color: 0xffccaa, map: texturePainting2 } );

    texturePainting2.minFilter = texturePainting2.magFilter = THREE.NearestFilter;
    texturePainting.minFilter = texturePainting.magFilter = THREE.LinearFilter;


    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    renderer.setClearColor( scene.fog.color, 1 );
    renderer.autoClear = false;

    renderer.domElement.style.position = "relative";
    container.appendChild( renderer.domElement );


    document.addEventListener( 'mousemove', onDocumentMouseMove, false );

}


function onDocumentMouseMove(event) {

    mouseX = ( event.clientX - windowHalfX );
    mouseY = ( event.clientY - windowHalfY );

}



function animate() {

    //requestAnimationFrame( animate );

    render();

}

function render() {

    camera.position.x += ( mouseX - camera.position.x ) * .05;
    camera.position.y += ( - ( mouseY - 200) - camera.position.y ) * .05;

    camera.lookAt( scene.position );

    renderer.enableScissorTest( false );
    renderer.clear();
    renderer.enableScissorTest( true );

    //renderer.setViewport( 0, 0, SCREEN_WIDTH/2, SCREEN_HEIGHT );
    renderer.setScissor( 0, 0, SCREEN_WIDTH/2 - 2, SCREEN_HEIGHT );
    renderer.render( scene, camera );


    //renderer.setViewport( SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2, SCREEN_HEIGHT );
    renderer.setScissor( SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2 - 2, SCREEN_HEIGHT  );
    renderer.render( scene2, camera );


}
