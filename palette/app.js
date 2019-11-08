const canvas = document.querySelector('.canvas');
const ctx = canvas.getContext('2d');

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

const buttons = document.querySelector('.s-canvas-buttons');
buttons.children[0].addEventListener('click', () => loadImg(4, './assets/canvas/4x4.json', 'hex'));
buttons.children[1].addEventListener('click', () => loadImg(32, './assets/canvas/32x32.json', 'rgb'));
buttons.children[2].addEventListener('click', () => {
  const img = new Image();
  img.src = './assets/canvas/image.png';
  img.onload = () => {
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, 0, 0, 512, 512);
  };
});
