<!DOCTYPE html>
<html>
	<head>
		<meta charset=utf-8>
		<title>3D</title>
		<style>
			body { margin: 0; overflow: hidden;}
			canvas { width: 100%; height: 100% }

            #navbar {
                padding: 2%;
                background-color: rgb(0, 0, 0);
                text-align: right;

            }

            #change-form {
                color: #FFF;
                text-decoration: none;
                text-transform: uppercase;
            }

            #change-form:hover {
                color: rgb(255, 0, 0);
                -webkit-transition: ease-in-out .5s;
                transition: ease-in-out .5s;
            }
		</style>
	</head>
	<body>
        <?php
            $GLOBALS['pictures'] = array();
            readDirFiles('./resized/1024x768');

            function readDirFiles($dir){
                if ($handle = opendir($dir)) {
                    $dir_content = array();
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
        <nav id="navbar">
                <a id="change-form" href="#" onclick="changeForm()">Changer la forme</a>
        </nav>
		<div id="container">
            
		</div>
        <script>
            var pictures = [];
            pictures = <?php echo json_encode($GLOBALS['pictures']); ?>;
        </script>
         <script src="js/three.js"></script>
         <script src="js/orbitControls.js"></script>
         <script src="js/main3.js"></script>
	</body>
</html>