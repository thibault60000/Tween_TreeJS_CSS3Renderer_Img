var camera, controls, scene, renderer;
var phi, theta;
var objects = [];
var targets = { table: [], sphere: [], helix: [], grid: [] };

init();
animate();

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x000000 );
    //scene.fog = new THREE.Fog(0xffffff, 0.0015, 10000);


    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );


    var container = document.getElementById( 'container' );
    container.appendChild( renderer.domElement );

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100000 );
    camera.position.z = 1800;

    /* ******* CONTROLS *********** */
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    /* ******* LUMIERE AMBIANTE *********** */
    var light = new THREE.AmbientLight( 0x404040, 5 ); // soft white light
    scene.add( light );

    //var pointlight = new THREE.PointLight( 0xff00ff, 1, 10000 );
    //scene.add( pointlight );


    /* ******* SPHERE *********** */

    buildSphere(pictures[0], 1000, 200, 200);
    //buildSphere(pictures[1], 2500, 500, 500);
    //buildSphere(pictures[2], 3000, 600, 600);

    /*var geometry = new THREE.SphereGeometry( 4800, 32, 32 );
    var material = new THREE.MeshBasicMaterial( {color: 0x404040} );
    var sphere = new THREE.Mesh( geometry, material );
    scene.add( sphere );*/

    window.addEventListener('resize', onWindowResize, false );
}

function buildSphere(pics, diameter, width, height){
    var geometry = new THREE.BoxGeometry( 200, 200, 1 );
    var vector = new THREE.Vector3();

    for ( var i = 0, l = pics.length; i < l; i ++ ) {
        phi = Math.acos( -1 + ( 2 * i ) / l );
        theta = Math.sqrt( l * Math.PI ) * phi;


        var cubeTexture = THREE.ImageUtils.loadTexture(pics[i]);
        var cubeMaterial = new THREE.MeshLambertMaterial({ map: cubeTexture });

        var object = new THREE.Mesh( geometry, cubeMaterial );


        /*var img = new THREE.MeshLambertMaterial({ //CHANGED to MeshBasicMaterial
            map:THREE.ImageUtils.loadTexture(pics[i])
        });
        img.map.needsUpdate = true; //ADDED

        // plane
        var object = new THREE.Mesh(new THREE.PlaneGeometry(width, height),img);
        object.overdraw = true;*/

        object.position.x = diameter * Math.cos( theta ) * Math.sin( phi );
        object.position.y = diameter * Math.sin( theta ) * Math.sin( phi );
        object.position.z = diameter * Math.cos( phi );


        vector.copy( object.position ).multiplyScalar( 2 );
        object.lookAt( vector );
        targets.sphere.push( object );

        objects.push(object);
        scene.add(object);
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
function animate() {
    requestAnimationFrame( animate );
    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    render();
}
function render() {
    renderer.render( scene, camera );
}