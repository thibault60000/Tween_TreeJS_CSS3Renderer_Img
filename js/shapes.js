function changeShape( targets, duration ) {
    // Suppression des actions
    TWEEN.removeAll();

    for ( var i = 0; i < objects.length; i ++ ) {

        var object = objects[ i ];
        var target = targets[ i ];

        // Animation 'ease-in-out' concernant la position de chaque élément
        // On prend ici réceptionne ici la position de l'élément actuel,
        // et on le dirige vers sa position ciblée déjà préchargée lors du
        // chargement des formes.
        new TWEEN.Tween( object.position )
            .to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
            .easing( TWEEN.Easing.Exponential.InOut )
            .start()
        ;

        // On effectue la même action avec la rotation
        new TWEEN.Tween( object.rotation )
            .to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
            .easing( TWEEN.Easing.Exponential.InOut )
            .start()
        ;

    }

    new TWEEN.Tween( this )
        .to( {}, duration * 2 )
        .onUpdate( render )
        .start()
    ;
}

// Pour chaque élément, nous utilisons l'utilitaire CSS3DRenderer qui nous permet
// de convertir pour chaque élément ses propriétés javascript en proprités CSS.
// Chaque élément dispose :
//     - d'un conteneur (div)
//     - d'une image (img)
function setElements() {
    for ( var i = 0; i < triImages.length; i ++ ) {
        var item = triImages[ i ];

        var element = document.createElement( 'div' );
        element.id = i;
        element.className = 'element';
        element.style.backgroundColor = 'rgba(0,127,127, 0.75)';

        var image = document.createElement( 'img' );
        image.src = triImages[i];
        image.className = 'element-image';
        element.appendChild( image );                

        var object = new THREE.CSS3DObject( element, camera );
        object.position.x = Math.random() * 4000 - 2000;
        object.position.y = Math.random() * 4000 - 2000;
        object.position.z = Math.random() * 4000 - 2000;

        element.parent = object;

        // Pour l'élément, on lui attribue l'évènement de click dans
        // lequel on lui permettra d'effectuer une action de zoom.
        object.element.addEventListener( 'click', function ( event ) {
            if (lastElementClicked != null) {
                lastElementClicked.classList.remove('active-element');
            }

            // On set le nouvel élément cliqué et on lui ajoute la
            // classe CSS 'active-element' afin d'obtenir un visuel de
            // surbrillance
            lastElementClicked = this;
            this.classList.add('active-element');
            
            // On met la position de base
            var from = {
                x : camera.position.x,
                y : camera.position.y,
                z : camera.position.z
            };

            // Vers la position de destination
            var x, y, z;
            if (lastTarget == 'planet') { x = targets.planet[this.id].position.x } else { x = targets.gallery[this.id].position.x }
            if (lastTarget == 'planet') { y = targets.planet[this.id].position.y } else { y = targets.gallery[this.id].position.y }
            if (lastTarget == 'planet') { z = targets.planet[this.id].position.z } else { z = targets.gallery[this.id].position.z }
            var vector = new THREE.Vector3( x, y, z ); vector.multiplyScalar( 1.2 );
            var to = {
                x : vector.x,
                y : vector.y,
                z : vector.z
            };

            // Animation de la position de la camera vers la destination cliquée
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
                .start()
            ;
        });

        // On ajoute les éléments dans la scène mais également
        // dans la liste des objets qui permet un préchargement
        // (gain de performances)
        scene.add( object );
        objects.push( object );
    }
}

function doPlanet() {
    var vector = new THREE.Vector3();

    // Pour chaque objet présent dans la liste des objets à représenter
    // on calcule sa position x, y, z (positionnement dans le plan)
    // et le place dans sa liste respective selon sa forme
    for ( var i = 0, objectsLength = objects.length; i < objectsLength; i ++ ) {
        var object = objects[ i ];

        var phi = Math.acos( -1 + ( 2 * i ) / objectsLength );
        var theta = Math.sqrt( objectsLength * Math.PI ) * phi;

        var object = new THREE.Object3D();
        object.position.x = 1000 * Math.cos( theta ) * Math.sin( phi );
        object.position.y = 1000 * Math.sin( theta ) * Math.sin( phi );
        object.position.z = 1000 * Math.cos( phi );

        vector.copy( object.position ).multiplyScalar( 2 );

        // On représente grâce à cette fonction la position de l'élément
        // dans l'espace attribué
        object.lookAt( vector );
        targets.planet.push( object );
    }
}


function doGallery() {
    var vector = new THREE.Vector3();

    // Même principe que la forme de la planète
    for ( var i = 0, objectsLength = objects.length; i < objectsLength; i ++ ) {

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
        targets.gallery.push( object );
    }
}


function setShapes() {
    doPlanet();
    doGallery();    
}