function setFirstTri() {
    triImages = pictures[0]; document.getElementById("tri0").classList.add('active-tri');
}

function changeTriMethod(index) {
    var containerLoader = document.getElementById("container-loader"); containerLoader.style.display = 'block';
    var loader = document.createElement("div"); loader.className = "loader"; containerLoader.appendChild(loader);

    // On change ici la colorisation du tri actif
    document.getElementsByClassName("active-tri")[0].classList.remove('active-tri');
    document.getElementById("tri" + index).classList.add('active-tri');


    // Pendant la durée où un nouveau tri est en cours de chargement
    // on désactive la possibilité de changer à nouveau de tri
    for( var x = 0; x < 10; x++ ) {
        nodeTri = document.getElementById("tri" + x); if (nodeTri != null) { nodeTri.setAttribute("disabled", ""); } else { break; }
    }
    
    // On retire tout les éléments existants dans le container et donc de la scène
    for (var i = objects.length; i >= 0; i--) { scene.remove(objects[i]); }
        var container = document.getElementById("container"); while (container.firstChild) { container.removeChild(container.firstChild); }
    objects = [];
    targets = { planet: [], gallery: [] };

    // On sélectionne la liste des images correspondantes au tri
    triImages = pictures[index];
    resetCamera();

    // On redéfinit chaque élément en calculant leur position
    // et on les affiche à nouveau.
    setElements();
    setShapes();
    setRenderer();

    // Do transformation
    if (lastTarget == 'planet') {
        changeShape( targets.planet, 3000 );
    } else {
        changeShape( targets.gallery, 3000 );
    }

    // On met à jour les contrôles
    controls = new THREE.TrackballControls( camera, renderer.domElement );
    controls.rotateSpeed = 0.01;
    controls.addEventListener( 'change', render );

    // On applique un temps d'arrêt en arrière-plan durant le temps
    // où nous mettons une animation CSS (le loader)
    // Et nous supprimons après le loader et l'animation
    sleep(5000).then(() => {
        // On remet les boutons de tri à nouveau disponibles
        for( var x = 0; x < 10; x++ ) {
            nodeTri = document.getElementById("tri" + x); if (nodeTri != null) { nodeTri.removeAttribute('disabled'); } else { break; }
        }

        // On supprime le container du loader
        containerLoader.removeChild(loader); containerLoader.style.display = 'none';
    });
}