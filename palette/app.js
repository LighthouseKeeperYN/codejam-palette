const canvas = document.querySelector('.canvas');
const ctx = canvas.getContext('2d');

let cursorX, cursorY, ;

function paint(cellSize, img, format) {
  if (format === 'hex') {
    for (let y = 0; y < cellSize; y++) {
      for (let x = 0; x < cellSize; x++) {
        ctx.fillStyle = `#${img[y][x]}`;
        ctx.fillRect((512 / cellSize) * y, (512 / cellSize) * x, 512 / cellSize, 512 / cellSize);
      }
    }
  }

  if (format === 'rgb') {
    for (let y = 0; y < cellSize; y++) {
      for (let x = 0; x < cellSize; x++) {
        ctx.fillStyle = `rgba(${img[y][x][0]},${img[y][x][1]},${img[y][x][2]},${img[y][x][3]})`;
        ctx.fillRect(16 * y, 16 * x, 16, 16);
      }
    }
  }
}

function loadImg(pixelSize, src, format) {
  let img;

  fetch(src)
    .then((res) => res.json())
    .then((data) => { img = data; })
    .then(() => paint(pixelSize, img, format));
}


function toPixel(coordinate, cellSize) {
  return Math.floor(coordinate / cellSize) * cellSize;
}

function pencil(color) {

}