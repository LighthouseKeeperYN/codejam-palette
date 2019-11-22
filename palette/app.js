const rgbToHex = require('./utils.js').rgbToHex;
const hexToRGB = require('./utils.js').hexToRGB;
const colorToString = require('./utils.js').colorToString;
const scaleDown = require('./utils.js').scaleDown;
const toPixel = require('./utils.js').toPixel;

const cursor = {
  curr: {
    x: 0,
    y: 0,
  },
  last: {
    x: 0,
    y: 0,
  },
};

const toolsIDs = {
  pencil: 'pencil',
  bucket: 'bucket',
  colorPicker: 'color-picker',
};

const tools = {
  pencilButton: document.getElementById(toolsIDs.pencil),
  bucketButton: document.getElementById(toolsIDs.bucket),
  colorPickerButton: document.getElementById(toolsIDs.colorPicker),
};

const colorButtonsIDs = {
  colorCurr: 'color-curr',
  colorPrev: 'color-prev',
  colorA: 'color-a',
  colorB: 'color-b',
};

const colorButtons = {
  curr: document.getElementById(colorButtonsIDs.colorCurr),
  prev: document.getElementById(colorButtonsIDs.colorPrev),
  a: document.getElementById(colorButtonsIDs.colorA),
  b: document.getElementById(colorButtonsIDs.colorB),
};

const colors = {
  curr: JSON.parse(localStorage.getItem(colorButtonsIDs.colorCurr)) || [0, 128, 0],
  prev: JSON.parse(localStorage.getItem(colorButtonsIDs.colorPrev)) || [255, 255, 255],
  a: JSON.parse(localStorage.getItem(colorButtonsIDs.colorA)) || [0, 0, 128],
  b: JSON.parse(localStorage.getItem(colorButtonsIDs.colorB)) || [128, 0, 0],
  canvas: '#e5e5e5',
};

const pixelSize = 32;
let selectedTool = localStorage.getItem('selectedTool') || toolsIDs.pencil;
let isDrawing = false;

const canvas = document.querySelector('.canvas');
const ctx = canvas.getContext('2d');
ctx.fillStyle = colors.canvas;
ctx.fillRect(0, 0, canvas.width, canvas.clientWidth);
if (localStorage.getItem('imgData')) {
  const img = new Image();
  img.src = localStorage.getItem('imgData');
  img.onload = () => {
    ctx.drawImage(img, 0, 0);
  };
}

function drawLine(x0, y0, x1, y1) {
  const dx = Math.abs(x1 - x0);
  const sx = x0 < x1 ? 1 : -1;

  const dy = Math.abs(y1 - y0);
  const sy = y0 < y1 ? 1 : -1;

  let err = (dx > dy ? dx : -dy) / 2;

  while (true) {
    ctx.fillRect((x0 * pixelSize), (y0 * pixelSize), pixelSize, pixelSize);

    if (x0 === x1 && y0 === y1) break;
    const e2 = err;
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

function pencil() {
  drawLine(
    scaleDown(cursor.last.x, pixelSize),
    scaleDown(cursor.last.y, pixelSize),
    scaleDown(cursor.curr.x, pixelSize),
    scaleDown(cursor.curr.y, pixelSize),
  );
}

function fill(startX, startY) {
  const imgData = ctx.getImageData(0, 0, 512, 512);
  const startColor = ctx.getImageData(startX, startY, 1, 1).data;
  const startR = startColor[0];
  const startG = startColor[1];
  const startB = startColor[2];

  const pixelStack = [[startX, startY]];

  function matchStartColor(pixelPos) {
    const r = imgData.data[pixelPos];
    const g = imgData.data[pixelPos + 1];
    const b = imgData.data[pixelPos + 2];

    return (r === startR && g === startG && b === startB);
  }

  function paintPixel(pixelPos) {
    imgData.data[pixelPos] = colors.curr[0];
    imgData.data[pixelPos + 1] = colors.curr[1];
    imgData.data[pixelPos + 2] = colors.curr[2];
    imgData.data[pixelPos + 3] = 255;
  }

  if (startColor[0] === colors.curr[0]
    && startColor[1] === colors.curr[1]
    && startColor[2] === colors.curr[2]
  ) return;

  while (pixelStack.length) {
    const newPos = pixelStack.pop();
    const x = newPos[0];
    let y = newPos[1];
    let leftMarked = false;
    let rightMarked = false;

    let pixelPos = (y * canvas.width + x) * 4;

    while (y-- >= 0 && matchStartColor(pixelPos)) {
      pixelPos -= canvas.width * 4;
    }

    pixelPos += canvas.width * 4;
    y++;

    while (y++ <= canvas.width && matchStartColor(pixelPos)) {
      paintPixel(pixelPos);

      if (x > 0) {
        if (matchStartColor(pixelPos - 4)) {
          if (!leftMarked) {
            pixelStack.push([x - 1, y]);
            leftMarked = true;
          }
        } else if (leftMarked) {
          leftMarked = false;
        }
      }

      if (x <= canvas.width) {
        if (matchStartColor(pixelPos + 4)) {
          if (!rightMarked) {
            pixelStack.push([x + 1, y]);
            rightMarked = true;
          }
        } else if (rightMarked) {
          rightMarked = false;
        }
      }

      pixelPos += canvas.width * 4;
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

function colorPicker(x, y) {
  const pxData = ctx.getImageData(x, y, 1, 1).data.slice(0, -1);
  colorButtons.curr.parentElement.style.backgroundColor = colorToString(pxData);
  colorButtons.prev.parentElement.style.backgroundColor = colorToString(colors.curr);
  colors.prev = colors.curr;
  colors.curr = pxData;
}

function selectTool(tl) {
  Object.values(tools).forEach((button) => {
    button.classList.remove('tool-item--selected');
  });

  selectedTool = tl.id;
  tl.classList.add('tool-item--selected');
}

Object.values(tools).forEach((tool) => {
  if (tool.id === selectedTool) tool.classList.add('tool-item--selected');

  tool.addEventListener('click', () => {
    selectTool(tool);
  });
});

window.onbeforeunload = () => {
  localStorage.setItem('imgData', canvas.toDataURL());
  localStorage.setItem(colorButtonsIDs.colorCurr, JSON.stringify(colors.curr));
  localStorage.setItem(colorButtonsIDs.colorPrev, JSON.stringify(colors.prev));
  localStorage.setItem(colorButtonsIDs.colorA, JSON.stringify(colors.a));
  localStorage.setItem(colorButtonsIDs.colorB, JSON.stringify(colors.b));
  localStorage.setItem('selectedTool', selectedTool);
};

document.addEventListener('keypress', (e) => {
  if (e.code === 'KeyP') {
    selectTool(tools.pencilButton);
  }
  if (e.code === 'KeyB') {
    selectTool(tools.bucketButton);
  }
  if (e.code === 'KeyC') {
    selectTool(tools.colorPickerButton);
  }
});

Object.keys(colorButtons).forEach((name) => {
  colorButtons[name].parentElement.style.backgroundColor = colorToString(colors[name]);
  colorButtons[name].value = rgbToHex(colors[name]);
});

Object.values(colorButtons).forEach((button) => {
  button.addEventListener('change', (e) => {
    e.target.parentElement.style.backgroundColor = e.target.value;
    if (e.target.id === colorButtonsIDs.colorCurr) {
      colorButtons.prev.parentElement.style.backgroundColor = rgbToHex(colors.curr);
      colors.curr = hexToRGB(e.target.value);
    }
    if (e.target.id === colorButtonsIDs.colorA) {
      colors.a = hexToRGB(e.target.value);
    }
    if (e.target.id === colorButtonsIDs.colorB) {
      colors.b = hexToRGB(e.target.value);
    }
  });

  button.parentElement.parentElement.addEventListener('click', (e) => {
    if (e.target.tagName !== 'LABEL' && e.target.tagName !== 'INPUT') {
      colorButtons.prev.parentElement.style.backgroundColor = colorToString(colors.curr);

      if (e.currentTarget.children[0].children[0].id === colorButtonsIDs.colorPrev) {
        colorButtons.curr.parentElement.style.backgroundColor = colorToString(colors.prev);
        [colors.prev, colors.curr] = [colors.curr, colors.prev];
      }
      if (e.currentTarget.children[0].children[0].id === colorButtonsIDs.colorA) {
        colorButtons.curr.parentElement.style.backgroundColor = colorToString(colors.a);
        colors.prev = colors.curr;
        colors.curr = colors.a;
      }
      if (e.currentTarget.children[0].children[0].id === colorButtonsIDs.colorB) {
        colorButtons.curr.parentElement.style.backgroundColor = colorToString(colors.b);
        colors.prev = colors.curr;
        colors.curr = colors.b;
      }
    }
  });
});

canvas.addEventListener('mousedown', (e) => {
  if (selectedTool === toolsIDs.pencil) {
    ctx.fillStyle = colorToString(colors.curr);
    isDrawing = true;

    cursor.last.x = e.layerX;
    cursor.last.y = e.layerY;

    ctx.fillRect(toPixel(e.layerX, pixelSize), toPixel(e.layerY, pixelSize), pixelSize, pixelSize);
  }
  if (selectedTool === toolsIDs.bucket) {
    ctx.fillStyle = colorToString(colors.curr);

    fill(e.layerX, e.layerY);
  }
  if (selectedTool === toolsIDs.colorPicker) {
    colorPicker(e.layerX, e.layerY);
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (selectedTool === toolsIDs.pencil && isDrawing) {
    cursor.curr.x = e.layerX;
    cursor.curr.y = e.layerY;

    pencil();

    cursor.last.x = cursor.curr.x;
    cursor.last.y = cursor.curr.y;
  }
});

document.addEventListener('mouseup', () => {
  if (selectedTool === toolsIDs.pencil) {
    isDrawing = false;
  }
});
