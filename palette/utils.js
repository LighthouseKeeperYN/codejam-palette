function rgbToHex(rgb) {
  return `#${((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1)}`;
}

function hexToRGB(hex) {
  const m = hex.match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
  return [
    parseInt(m[1], 16),
    parseInt(m[2], 16),
    parseInt(m[3], 16),
  ];
}

function colorToString(colorsArray) {
  return `rgba(${colorsArray[0]},${colorsArray[1]},${colorsArray[2]},${colorsArray[3] ? (colorsArray[3] / 255) : 1})`;
}

function scaleDown(coordinate, pixelSize) {
  return Math.floor(coordinate / pixelSize);
}

function toPixel(coordinate, pixelSize) {
  return Math.floor(coordinate / pixelSize) * pixelSize;
}

module.exports = {
  rgbToHex, hexToRGB, colorToString, scaleDown, toPixel,
};
