<!DOCTYPE html>
<html>
<head>
  <meta charset=utf-8>
  <title>3D</title>
  <link rel="stylesheet" href="css/default.css">
  
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

    <script src="js/three.min.js"></script>
    <script src="js/animation/tween.min.js"></script>
    <script src="js/renderer/CSS3DRenderer.js"></script>
    <script src="js/controls/TrackballControls.js"></script>
    <script src="js/main.js"></script>
    <script src="js/utils.js"></script>
    <script src="js/shapes.js"></script>
    <script src="js/tri.js"></script>
    <script type="text/javascript">

    /* *******************************************
    ********  JEREMY / CLEMENT / THIBAULT ********
    ******** WEB 3D -- UPJV ********************** */

        var pictures = [];
        pictures = <?php echo json_encode($GLOBALS['pictures']); ?>;
        var triImages = null;

        var camera, scene, renderer, projector;
        var controls;
        var lastTarget;

        var objects = [];
        var targets = { planet: [], gallery: [] };
        var lastElementClicked = null;

        init();
        animate();
    </script>
</body>
</html>