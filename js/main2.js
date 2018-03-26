var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight, 0.1,
1000);
var clock = new THREE.Clock;

camera.position.z = 5;

/* ********* DECLARE LA SCENE ********** */
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild(renderer.domElement);

/* ******** AFFICHE LE REPERE 3D ********* */
var axisHelper = new THREE.AxesHelper(5);
scene.add(axisHelper);

/* ***************** CUBE TEXTURE IMAGE ************* */

/* var cubeTexture = THREE.ImageUtils.loadTexture('./img/gobelet.jpg');
var cubeMaterial = new THREE.MeshLambertMaterial({ map: cubeTexture });
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var cube = new THREE.Mesh( geometry, cubeMaterial );
scene.add( cube ); */

/* ************** CUBE TEXTURE AND MULTIPLE COLOR ********** */
var cubeTexture = THREE.ImageUtils.loadTexture('./img/gobelet.jpg');
var cubeMaterial = new THREE.MeshLambertMaterial({ map: cubeTexture });
var materials = [];
materials.push(new THREE.MeshLambertMaterial({ map: cubeTexture, color: 0xff0000 })); // right face
materials.push(new THREE.MeshLambertMaterial({ map: cubeTexture, color: 0xffff00 })); // left face
materials.push(new THREE.MeshLambertMaterial({ map: cubeTexture, color: 0xffffff })); // top face
materials.push(new THREE.MeshLambertMaterial({ map: cubeTexture, color: 0x00ffff })); // bottom face
materials.push(new THREE.MeshLambertMaterial({ map: cubeTexture, color: 0x0000ff })); // front face
materials.push(new THREE.MeshLambertMaterial({ map: cubeTexture, color: 0xff00ff })); // back face
var cubeMaterial = new THREE.MeshFaceMaterial(materials);
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var cube = new THREE.Mesh( geometry, cubeMaterial );
cube.rotation.x = 0.4;
cube.rotation.y = 0.5;
scene.add( cube );

/* ******* LUMIERE AMBIANTE *********** */
var light = new THREE.AmbientLight( 0x404040, 5 ); // soft white light
scene.add( light );

/* ********* SYSTEME DE PARTICULES ********** */
var particles = new THREE.Geometry;
for (var p = 0; p<=2000; p++) {
  var particle = new THREE.Vector3(Math.random() * 500 - 250, Math.random() * 500 - 250, Math.random() * 500 - 250);
  particles.vertices.push(particle);
}
var particleMaterial = new THREE.ParticleBasicMaterial({ color: 0xeeeeee, size: 2 });
var particleSystem = new THREE.ParticleSystem(particles, particleMaterial);

// POUR METTRE UNE IMAGE SUR LES PARTICULES 
// var particleTexture = THREE.ImageUtils.loadTexture('./image.png');
// var particleMaterial = new THREE.ParticleBasicMaterial({ map: particleTexture, transparent: true, size: 5 });

scene.add(particleSystem);

/* ******** ACTUALISE LA SCENE 60FOIS PAR SECONDE ******** */
function render() {
  requestAnimationFrame(render);
  
  var delta = clock.getDelta(); // Rotation Horloge
  cube.rotation.y -= delta; // Rotation du Cube
  particleSystem.rotation.y += delta; // Rotation des particules
   
  renderer.render(scene, camera);
}


render();