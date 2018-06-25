/* *******************************************
********  JEREMY / CLEMENT / THIBAULT ********
******** WEB 3D -- UPJV ********************** */

function sleep(time) {
      return new Promise((resolve) => setTimeout(resolve, time));
}

function resetCamera() {
      camera.position.z = 2200;
}