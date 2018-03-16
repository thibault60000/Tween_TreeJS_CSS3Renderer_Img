// Objet Scene : Obligatoire pour démarrer un projet Three.js
var scene = new THREE.Scene();

// Constructeur de la caméra  (champs de vision, ratio largeur/hauteur, distance mini, distance max) 
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.set(5,5,5);
camera.lookAt(scene.position);

// Objet qui effectue le rendu 3D (WebGL)
var renderer = new THREE.WebGLRenderer();

// Taille de la fenêtre qui affichera la scène
renderer.setSize( window.innerWidth, window.innerHeight );

// Intègre la fenêtre de rendu dans la page web
document.body.appendChild( renderer.domElement );

var axisHelper = new THREE.AxesHelper(5);
scene.add(axisHelper);

var geometry = new THREE.PlaneGeometry(7,7);
var material = new THREE.MeshLambertMaterial( { color: 0x00ffdd });
var plane = new THREE.Mesh( geometry, material );
plane.position.set(0,0,0);
plane.rotation.x = - Math.PI/2;
scene.add( plane );

var geometry2 = new THREE.SphereGeometry( 1, 32, 32 );
var material2 = new THREE.MeshLambertMaterial( {color: 0xffff00} );
var sphere = new THREE.Mesh( geometry2, material2 );
sphere.position.set(0,1,0);
scene.add( sphere );

// lumiere ambiante
var lightAmb = new THREE.AmbientLight(0xffffff) ;
scene.add(lightAmb);

// Point lumineux
var lightPoi = new THREE.PointLight(0xffffff, 1, 100);
lightPoi.position.set(30,40,50);
scene.add(lightPoi); 

// Spot light
var lightSpot = new THREE.SpotLight (0xff0000, 1, 100, Math.PI/4);
lightSpot.position.set(30,40,50);
lightSpot.target=sphere;
scene.add(lightSpot);

var chrono=new THREE.Clock();
chrono.start();
temps=chrono.getElapsedTime();
console.log(temps);

// Fonction qui rafraichit la scène
function render() {
    // Permet d'appeler une fonction une fonction de rendu en boucle (fonction render en paramètre) environ 60fois/s
    //requestAnimationFrame(render);
    // renderer.render donne l'ordre de rafraichir la scene
    renderer.render(scene, camera);
    }

// Appelle la fonction render
render();