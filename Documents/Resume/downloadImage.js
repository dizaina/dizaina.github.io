function convertCanvasToImage(name) {
  let canvas = document.getElementById(name);
  let image = new Image();
  image.src = canvas.toDataURL("image/jpeg", 1.0);
  return image;
}
copy(convertCanvasToImage("canvas2"))