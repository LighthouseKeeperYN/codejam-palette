const canvas = document.querySelector('.canvas');
const ctx = canvas.getContext('2d');

let pixelSize = 4;

let color = {
  colorA: [255, 255, 255],
  colorB: [0, 0, 0],
  curr: [0, 0, 0],
  prevColor: [0, 0, 0]
}
let cursor = {
  curr: {
    x: 0,
    y: 0,
  },
  last: {
    x: 0,
    y: 0,
  }
}

let isDrawing = false;
ctx.fillStyle = colorToString(color.colorA);

function colorToString(color) {
  return `rgba(${color[0]},${color[1]},${color[2]},${color[3] !== 'undefined' ? color[3] : 1})`
}

function drawLine(x0, y0, x1, y1) {
  let dx = Math.abs(x1 - x0);
  let sx = x0 < x1 ? 1 : -1;

  let dy = Math.abs(y1 - y0);
  let sy = y0 < y1 ? 1 : -1;

  let err = (dx > dy ? dx : -dy) / 2;

  while (true) {
    ctx.fillRect((x0 * pixelSize), (y0 * pixelSize), pixelSize, pixelSize);

    if (x0 === x1 && y0 === y1) break;
    let e2 = err;
    if (e2 > -dx) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dy) {
      err += dx;
      y0 += sy;
    }
  }
}

// function toCanvasCoordinates(cursor) {
//   return [cursor[0] - canvas.offsetLeft, cursor[1] - canvas.offsetTop];
// }
// function toScreenCoordinates(cursor) {
//   return [cursor[0] + canvas.offsetLeft, cursor[1] + canvas.offsetTop];
// }

canvas.addEventListener('mousedown', e => {
  isDrawing = true;

  cursor.last.x = e.layerX;
  cursor.last.y = e.layerY;

  ctx.fillRect(toPixel(e.layerX), toPixel(e.layerY), pixelSize, pixelSize);
});

canvas.addEventListener('mouseup', e => {
  isDrawing = false;
});

canvas.addEventListener('mousemove', e => {
  if (!isDrawing) return;

  cursor.curr.x = e.layerX;
  cursor.curr.y = e.layerY;

  pencil();

  cursor.last.x = cursor.curr.x;
  cursor.last.y = cursor.curr.y;
});

function scaleDown(coordinate) {
  return Math.floor(coordinate / pixelSize);
}

function toPixel(coordinate) {
  return Math.floor(coordinate / pixelSize) * pixelSize;
}

function pencil() {
  drawLine(
    scaleDown(cursor.last.x),
    scaleDown(cursor.last.y),
    scaleDown(cursor.curr.x),
    scaleDown(cursor.curr.y)
  )
}


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


