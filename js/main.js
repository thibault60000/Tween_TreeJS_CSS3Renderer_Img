/* *******************************************
********  JEREMY / CLEMENT / THIBAULT ********
******** WEB 3D -- UPJV ********************** */

function init() {
      camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 5000 );
      camera.position.z = 2200;

      scene = new THREE.Scene();
      projector = new THREE.Projector();

      // On met en place ici le premier tri
      setFirstTri();
      // On remplit les informations des éléments dans cette fonction
      setElements();
      // On met en place les éléments dans leurs listes respectives
      setShapes();
      // On met en place le rendu de la forme demandée
      setRenderer();
      // On initialise les contrôles
      setControls();

      window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
      requestAnimationFrame( animate );
      TWEEN.update();
      controls.update();
}

function render() {
      renderer.render( scene, camera );
}

function setRenderer() {
      renderer = new THREE.CSS3DRenderer();
      renderer.setSize( window.innerWidth, window.innerHeight );
      renderer.domElement.style.position = 'absolute';
      renderer.domElement.style.top = 0;
      document.getElementById( 'container' ).appendChild( renderer.domElement );
}

function setControls() {
      // Définition des contrôles (avec gestion de la rotation)
      controls = new THREE.TrackballControls( camera, renderer.domElement );
      controls.rotateSpeed = 0.01;
      controls.addEventListener( 'change', render );

      var button = document.getElementById( 'change-shape' );
      button.addEventListener( 'click', function ( event ) {
            if ( lastTarget == 'planet' ) {
                lastTarget = 'other';
                changeShape( targets.gallery, 2000 );
            } else {
                lastTarget = 'planet';
                changeShape( targets.planet, 2000 );
            }
      }, false );

      // On met en place la première forme qui est la sphère
      lastTarget = 'planet';
      changeShape( targets.planet, 3000 );
}