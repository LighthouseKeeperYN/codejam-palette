const canvas = document.querySelector('.canvas');
const ctx = canvas.getContext('2d');

const pixelSize = 128;
let selectedTool = 'pencil';

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

const color = {
  curr: JSON.parse(localStorage.getItem('color-curr')) || [255, 255, 255],
  prev: JSON.parse(localStorage.getItem('color-prev')) || [255, 255, 255],
  a: JSON.parse(localStorage.getItem('color-a')) || [0, 0, 0],
  b: JSON.parse(localStorage.getItem('color-b')) || [255, 255, 255]
};

const colorButton = {
  curr: document.getElementById('color-curr'),
  prev: document.getElementById('color-prev'),
  a: document.getElementById('color-a'),
  b: document.getElementById('color-b')
}

Object.keys(colorButton).forEach(name => {
  colorButton[name].parentElement.style.backgroundColor = colorToString(color[name]);
});

Object.values(colorButton).forEach(button => {
  button.addEventListener('change', e => {
    e.target.parentElement.style.backgroundColor = e.target.value;
    if (e.target.id === 'color-curr') {
      colorButton.prev.parentElement.style.backgroundColor = rgbToHex(color.curr);
      localStorage.setItem('color-prev', JSON.stringify(color.curr))
      color.curr = hexToRGB(e.target.value);
      localStorage.setItem('color-curr', JSON.stringify(color.curr))
    }
    // if (e.target.id === 'color-prev') {
    //   color.prev = hexToRGB(e.target.value);
    //   localStorage.setItem('color-prev', JSON.stringify(color.prev))
    // }
    if (e.target.id === 'color-a') {
      color.a = hexToRGB(e.target.value);
      localStorage.setItem('color-a', JSON.stringify(color.a))
    }
    if (e.target.id === 'color-b') {
      color.b = hexToRGB(e.target.value);
      localStorage.setItem('color-b', JSON.stringify(color.b))
    }
  });

  button.parentElement.parentElement.addEventListener('click', e => {
    if (e.target.tagName !== 'LABEL' && e.target.tagName !== 'INPUT') {
      if (e.currentTarget.children[0].children[0].id === 'color-prev') {
        colorButton.curr.parentElement.style.backgroundColor = colorToString(color.prev);
        [color.prev, color.curr] = [color.curr, color.prev];
        localStorage.setItem('color-curr', JSON.stringify(color.curr));
        localStorage.setItem('color-prev', JSON.stringify(color.prev));
      }
      if (e.currentTarget.children[0].children[0].id === 'color-a') {
        colorButton.curr.parentElement.style.backgroundColor = colorToString(color.a);
        colorButton.prev.parentElement.style.backgroundColor = colorToString(color.curr);
        localStorage.setItem('color-curr', JSON.stringify(color.a));
        localStorage.setItem('color-prev', JSON.stringify(color.curr));
        color.prev = color.curr;
        color.curr = color.a;

      }
      if (e.currentTarget.children[0].children[0].id === 'color-b') {
        colorButton.curr.parentElement.style.backgroundColor = colorToString(color.b);
        colorButton.prev.parentElement.style.backgroundColor = colorToString(color.curr);
        localStorage.setItem('color-curr', JSON.stringify(color.b));
        localStorage.setItem('color-prev', JSON.stringify(color.curr));
        color.prev = color.curr;
        color.curr = color.b;
      }
    }
  });
});

let isDrawing = false;


function rgbToHex(rgb) {
  return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
}

function hexToRGB(hex) {
  const m = hex.match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
  return [
    parseInt(m[1], 16),
    parseInt(m[2], 16),
    parseInt(m[3], 16)
  ];
}

function colorToString(clr) {
  return `rgba(${clr[0]},${clr[1]},${clr[2]},${clr[3] ? (clr[3] / 255) : 1})`;
}

function scaleDown(coordinate) {
  return Math.floor(coordinate / pixelSize);
}

function toPixel(coordinate) {
  return Math.floor(coordinate / pixelSize) * pixelSize;
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

function fill(startX, startY) {
  inProgress = true;

  const imgData = ctx.getImageData(0, 0, 512, 512);
  const startColor = ctx.getImageData(startX, startY, 1, 1).data;
  const startR = startColor[0];
  const startG = startColor[1];
  const startB = startColor[2];
  const startA = startColor[3];
  const pixelStack = [[startX, startY]];

  function matchStartColor(pixelPos) {
    const r = imgData.data[pixelPos];
    const g = imgData.data[pixelPos + 1];
    const b = imgData.data[pixelPos + 2];
    const a = imgData.data[pixelPos + 3];

    return (r === startR && g === startG && b === startB && a === startA);
  }

  function paintPixel(pixelPos) {
    imgData.data[pixelPos] = color.curr[0];
    imgData.data[pixelPos + 1] = color.curr[1];
    imgData.data[pixelPos + 2] = color.curr[2];
    imgData.data[pixelPos + 3] = color.curr[3] * 255; // * 255
  }

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

function pencil() {
  drawLine(
    scaleDown(cursor.last.x),
    scaleDown(cursor.last.y),
    scaleDown(cursor.curr.x),
    scaleDown(cursor.curr.y)
  );
}

const tools = {
  pencilButton: document.getElementById('pencil'),
  bucketButton: document.getElementById('bucket'),
  colorPickerButton: document.getElementById('color-picker')
}

Object.values(tools).forEach(tool => {
  tool.addEventListener('click', e => {
    Object.values(tools).forEach(button => {
      button.classList.remove('tool-item--selected');
    });

    selectedTool = tool.id;
    tool.classList.add('tool-item--selected');
  });
});

canvas.addEventListener('mousedown', (e) => {
  ctx.fillStyle = colorToString(color.curr);

  if (selectedTool === 'bucket') {
    fill(e.layerX, e.layerY);
  }
  if (selectedTool === 'pencil') {
    isDrawing = true;

    cursor.last.x = e.layerX;
    cursor.last.y = e.layerY;

    ctx.fillRect(toPixel(e.layerX), toPixel(e.layerY), pixelSize, pixelSize);
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (selectedTool === 'pencil' && isDrawing) {
    cursor.curr.x = e.layerX;
    cursor.curr.y = e.layerY;

    pencil();

    cursor.last.x = cursor.curr.x;
    cursor.last.y = cursor.curr.y;
  }
});

document.addEventListener('mouseup', (e) => {
  if (selectedTool === 'pencil') {
    isDrawing = false;
  }
});

