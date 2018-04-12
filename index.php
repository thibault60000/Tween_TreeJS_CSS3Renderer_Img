<!DOCTYPE html>
<html>
	<head>
		<meta charset=utf-8>
		<title>3D</title>
		<style>
			body { margin: 0; overflow: hidden;}
			canvas { width: 100%; height: 100% }
		</style>
	</head>
	<body>
        <?php
            $GLOBALS['pictures'] = array();
            readDirFiles('./img');

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