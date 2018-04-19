var camera, controls, scene, renderer, clock;
var particleSystem;
var phi, theta;
var objects = [];
var targets = { table: [], sphere: [], helix: [], grid: [] };
var projector, mouse = {x:0, y:0};
var spheres = [];
var isMouseDown = false;
var lastObjectSaved = null;

init();
animate();

function init() {
    clock = new THREE.Clock;

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x000000 );
    //scene.fog = new THREE.Fog(0xffffff, 0.0015, 10000);


    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    projector = new THREE.Projector();

    var container = document.getElementById( 'container' );
    container.appendChild( renderer.domElement );

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100000 );
    camera.position.z = 1800;

    /* ******* CONTROLS *********** */
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.rotateSpeed = 0.07;

    /* ******* LUMIERE AMBIANTE *********** */
    var light = new THREE.AmbientLight( 0x404040, 5 ); // soft white light
    scene.add( light );

    //var pointlight = new THREE.PointLight( 0xff00ff, 1, 10000 );
    //scene.add( pointlight );


    /* ******* SPHERE *********** */

    //buildSphere(pictures[0], 1000, 0, 0, 4000, 200, 200);
    buildSphere(pictures[1], 1200, 0, 0, 0, 200, 200);
    //buildSphere(pictures[2], 600, 0, 0, -4000, 200, 200);



    buildParticlesSystem(3000, 20, 8000, 10000);

    window.addEventListener('resize', onWindowResize, false );
    document.addEventListener('click', onClick, false);
};

function buildSphere(pics, diameter, px, py, pz, width, height){
    var geometry = new THREE.BoxGeometry( width, height, 5 );
    var vector = new THREE.Vector3(px, py, pz);
    var sphere = new THREE.Group();
    sphere.position.x = px;
    sphere.position.y = py;
    sphere.position.z = pz;

    for ( var i = 0, l = pics.length; i < l; i ++ ) {
        phi = Math.acos( -1 + ( 2 * i ) / l );
        theta = Math.sqrt( l * Math.PI ) * phi;


        var cubeTexture = THREE.ImageUtils.loadTexture(pics[i]);
        var cubeMaterial = new THREE.MeshLambertMaterial({ map: cubeTexture });

        var object = new THREE.Mesh( geometry, cubeMaterial );


        object.position.x = diameter * Math.cos( theta ) * Math.sin( phi );
        object.position.y = diameter * Math.sin( theta ) * Math.sin( phi );
        object.position.z = diameter * Math.cos( phi );

        vector.copy( object.position ).multiplyScalar( 2 );
        object.lookAt( vector );
        targets.sphere.push( object );

        objects.push(object);
        sphere.add(object);
    }

    spheres.push(sphere);
    scene.add(sphere);
}

function buildParticlesSystem(quantity, size, minDistance, maxDistance){
    var particles = new THREE.Geometry;
    var spherical = new THREE.Spherical();

    for (var p = 0; p<=quantity; p++) {
        spherical.radius = Math.random() * (maxDistance-minDistance) + minDistance;
        spherical.phi = Math.random() * Math.PI;
        spherical.theta = Math.random() * Math.PI * 2;

        var particle = new THREE.Vector3().setFromSpherical(spherical);

        particles.vertices.push(particle);
    }

    var particleMaterial = new THREE.ParticleBasicMaterial({
        color: 0xFFFFFF,
        size: size,
        map: THREE.ImageUtils.loadTexture(
            "./img/particle3.png"
        ),
        blending: THREE.AdditiveBlending,
        transparent: true
    });

    particleSystem = new THREE.ParticleSystem(particles, particleMaterial);
    scene.add(particleSystem);

}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    requestAnimationFrame( animate );
    if (!isMouseDown) {
        var delta = clock.getDelta(); // Rotation Horloge
        for (var i=0; i<spheres.length; i++){
            spheres[i].rotation.y += delta/20;
        }
        particleSystem.rotation.y -= delta/50; // Rotation des particules
    }

    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    render();
}

function render() {
    renderer.render( scene, camera );
}

function onClick(event) {
    // update the mouse variable
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    // Find intersections
    // Create a Ray with origin at the mouse position
    // and direction into the scene (camera direction)
    var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
    projector.unprojectVector( vector, camera );
    var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

    // Create an array containing all objects in the scene with which the ray intersects
    var intersects = ray.intersectObjects( objects );

    if (intersects.length > 0) {
        // Source : https://discourse.threejs.org/t/solved-rotate-camera-to-face-point-on-sphere/1676
        item = intersects[0].object;
        if (item.uuid != lastObjectSaved) {
            // Save new object as last object
            lastObjectSaved = item.uuid;

            // Get the current camera position
            const { x, y, z } = camera.position;

            // Move camera to the target
            const point = intersects[0].point;
            const camDistance = camera.position.length();
            camera.position.copy(point).normalize().multiplyScalar(camDistance);

            isMouseDown = true;
            controls.enableRotate = false;
            requestAnimationFrame( animate );
        }
    } else {
        lastObjectSaved = null;
        isMouseDown = false;
        controls.enableRotate = true;
        requestAnimationFrame( animate );
    }
};