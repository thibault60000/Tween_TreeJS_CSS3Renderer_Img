<!DOCTYPE html>
<html>
<head>
  <meta charset=utf-8>
  <title>3D</title>
  <link rel="stylesheet" href="css/default.css">
  <script src="js/three.min.js"></script>
  <script src="js/tween.min.js"></script>
  <script src="js/renderer/CSS3DRenderer.js"></script>
  <script src="js/controls/TrackballControls.js"></script>
</head>
<body id="main">
    <?php
    $GLOBALS['pictures'] = array();
    $GLOBALS['triNames'] = array();
    readDirFiles('./resized/1024x768');

    function readDirFiles($dir){
        if ($handle = opendir($dir)) {
            $dir_content = array();
            if ($dir != "./resized/1024x768") {
                array_push($GLOBALS['triNames'], $dir);
            }
            
            while (false !== ($entry = readdir($handle))) {
                if ($entry != "." && $entry != "..") {
                    if(is_dir("$dir/$entry")){readDirFiles("$dir/$entry");}
                    else{array_push($dir_content, "$dir/$entry");}
                }
            }
            array_push($GLOBALS['pictures'], $dir_content);
            closedir($handle);
        }
    }
    ?>
    
    <main>
        <nav id="navbar">
            <button id="change-shape">Changer la forme</button>
        </nav>
        <nav id="tri-navbar">
            <?php
            for ($indexDirectory=0; $indexDirectory < sizeof($GLOBALS['triNames']); $indexDirectory++) { 
                echo '<button id="tri'. $indexDirectory .'" onClick="changeTriMethod('. $indexDirectory .');">'. basename($GLOBALS['triNames'][$indexDirectory]) .'</button>';
            }
            ?>
        </nav>
        <div id="container-loader"></div>
        <div id="container"></div>
    </main>

    <script>
        var pictures = [];
        pictures = <?php echo json_encode($GLOBALS['pictures']); ?>;
        var images = pictures[0];

        var camera, scene, renderer, projector;
        var geometry, material, mesh;
        var controls;
        var lastTarget;

        var objects = [];
        var targets = { planet: [], helix: [] };
        var lastElementClicked = null;

        init();
        animate();

        function _sleep(time) {
            return new Promise((resolve) => setTimeout(resolve, time));
        }

        function _setElements() {
            for ( var i = 0; i < images.length; i ++ ) {
                var item = images[ i ];

                var element = document.createElement( 'div' );
                element.id = i;
                element.className = 'element';
                element.style.backgroundColor = 'rgba(0,127,127, 0.75)';

                var image = document.createElement( 'img' );
                image.src = images[i];
                image.className = 'element-image';
                element.appendChild( image );                

                var object = new THREE.CSS3DObject( element, camera );
                object.position.x = Math.random() * 4000 - 2000;
                object.position.y = Math.random() * 4000 - 2000;
                object.position.z = Math.random() * 4000 - 2000;

                element.parent = object;
                object.element.addEventListener( 'click', function ( event ) {
                    if (lastElementClicked != null) {
                        lastElementClicked.classList.remove('active-element');
                    }

                    // Set new element clicked
                    lastElementClicked = this;
                    this.classList.add('active-element');
                    
                    // Set camera position base
                    var from = {
                        x : camera.position.x,
                        y : camera.position.y,
                        z : camera.position.z
                    };

                    // To destination position
                    var x, y, z;
                    if (lastTarget == 'planet') { x = targets.planet[this.id].position.x } else { x = targets.helix[this.id].position.x }
                    if (lastTarget == 'planet') { y = targets.planet[this.id].position.y } else { y = targets.helix[this.id].position.y }
                    if (lastTarget == 'planet') { z = targets.planet[this.id].position.z } else { z = targets.helix[this.id].position.z }
                    var vector = new THREE.Vector3( x, y, z ); vector.multiplyScalar( 1.2 );
                    var to = {
                        x : vector.x,
                        y : vector.y,
                        z : vector.z
                    };

                    // Animate camera position to destination clicked position
                    var tween = new TWEEN.Tween(from)
                    .to(to, 600)
                    .easing(TWEEN.Easing.Linear.None)
                    .onUpdate(function () {
                        camera.position.set(this.x, this.y, this.z);
                        camera.lookAt(new THREE.Vector3(0,0,0));
                    })
                    .onComplete(function () {
                        camera.lookAt(new THREE.Vector3(0,0,0));
                    })
                    .start();
                });

                scene.add( object );
                objects.push( object );
            }
        }

        function _setShapes() {
            // planet
            var vector = new THREE.Vector3();
            for ( var i = 0, l = objects.length; i < l; i ++ ) {
                var object = objects[ i ];

                var phi = Math.acos( -1 + ( 2 * i ) / l );
                var theta = Math.sqrt( l * Math.PI ) * phi;

                var object = new THREE.Object3D();

                object.position.x = 1000 * Math.cos( theta ) * Math.sin( phi );
                object.position.y = 1000 * Math.sin( theta ) * Math.sin( phi );
                object.position.z = 1000 * Math.cos( phi );

                vector.copy( object.position ).multiplyScalar( 2 );

                object.lookAt( vector );

                targets.planet.push( object );
            }

            // helix
            var vector = new THREE.Vector3();
            for ( var i = 0, l = objects.length; i < l; i ++ ) {

                var object = objects[ i ];

                var phi = i * 0.175 + Math.PI;

                var object = new THREE.Object3D();

                object.position.x = 1100 * Math.sin( phi );
                object.position.y = - ( i * 8 ) + 450;
                object.position.z = 1100 * Math.cos( phi );

                vector.copy( object.position );
                vector.x *= 2;
                vector.z *= 2;

                object.lookAt( vector );

                targets.helix.push( object );
            }
        }

        function _setRenderer() {
            renderer = new THREE.CSS3DRenderer();
            renderer.setSize( window.innerWidth, window.innerHeight );
            renderer.domElement.style.position = 'absolute';
            renderer.domElement.style.top = 0;
            document.getElementById( 'container' ).appendChild( renderer.domElement );
        }

        function _setControls() {
            controls = new THREE.TrackballControls( camera, renderer.domElement );
            controls.rotateSpeed = 0.01;
            controls.addEventListener( 'change', render );

            var button = document.getElementById( 'change-shape' );
            button.addEventListener( 'click', function ( event ) {
                if ( lastTarget == 'planet' ) {
                    lastTarget = 'other';
                    changeShape( targets.helix, 2000 );
                } else {
                    lastTarget = 'planet';
                    changeShape( targets.planet, 2000 );
                }
            }, false );

            // First shape
            lastTarget = 'planet';
            changeShape( targets.planet, 3000 );
        }

        function _setParticleSystem(){
        }

        function _resetCamera() {
            camera.position.z = 2200;
        }

        function init() {
            camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 5000 );
            camera.position.z = 2200;

            scene = new THREE.Scene();
            projector = new THREE.Projector();

            _setElements();
            _setShapes();
            _setRenderer();
            _setControls();
            _setParticleSystem();

            var dirLight = new THREE.DirectionalLight( 0xffffff, 0.05 );
            dirLight.position.set( 0, -1, 0 ).normalize();
            dirLight.color.setHSL( 0.1, 0.7, 0.5 );
            scene.add( dirLight );

            document.getElementById("tri0").classList.add('active-tri');
            window.addEventListener( 'resize', onWindowResize, false );
        }

        function changeShape( targets, duration ) {
            TWEEN.removeAll();
            for ( var i = 0; i < objects.length; i ++ ) {

                var object = objects[ i ];
                var target = targets[ i ];

                new TWEEN.Tween( object.position )
                .to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
                .easing( TWEEN.Easing.Exponential.InOut )
                .start();

                new TWEEN.Tween( object.rotation )
                .to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
                .easing( TWEEN.Easing.Exponential.InOut )
                .start();

            }
            new TWEEN.Tween( this )
            .to( {}, duration * 2 )
            .onUpdate( render )
            .start();
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

        function changeTriMethod(index) {
            var containerLoader = document.getElementById("container-loader"); containerLoader.style.display = 'block';
            var loader = document.createElement("div"); loader.className = "loader"; containerLoader.appendChild(loader);

            // Change active value
            document.getElementsByClassName("active-tri")[0].classList.remove('active-tri');
            document.getElementById("tri" + index).classList.add('active-tri');


            // Disable all buttons to change tri
            for( var x = 0; x < 5; x++ ) {
                nodeTri = document.getElementById("tri" + x); if (nodeTri != null) { nodeTri.setAttribute("disabled", ""); } else { break; }
            }
            
            // Clear all existing elements into scene and source code
            for (var i = objects.length; i >= 0; i--) { scene.remove(objects[i]); }
                var container = document.getElementById("container"); while (container.firstChild) { container.removeChild(container.firstChild); }
            objects = [];
            targets = { planet: [], helix: [] };

            // Set elements, shapes into arrays and rendered them
            images = pictures[index];
            _resetCamera();
            _setElements();
            _setShapes();
            _setRenderer();

            // Do transformation
            if (lastTarget == 'planet') {
                changeShape( targets.planet, 3000 );
            } else {
                changeShape( targets.helix, 3000 );
            }

            // Set controls
            controls = new THREE.TrackballControls( camera, renderer.domElement );
            controls.rotateSpeed = 0.01;
            controls.addEventListener( 'change', render );

            // Apply sleep then remove appearance of loader
            _sleep(5000).then(() => {
                // Disable all buttons to change tri
                for( var x = 0; x < 5; x++ ) {
                    nodeTri = document.getElementById("tri" + x); if (nodeTri != null) { nodeTri.removeAttribute('disabled'); } else { break; }
                }

                // Unshow loader container
                containerLoader.removeChild(loader); containerLoader.style.display = 'none';
            });
        }
    </script>
</body>
</html>