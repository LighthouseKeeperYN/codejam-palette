/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./palette/app.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./palette/app.js":
/*!************************!*\
  !*** ./palette/app.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const rgbToHex = __webpack_require__(/*! ./utils.js */ \"./palette/utils.js\").rgbToHex;\nconst hexToRGB = __webpack_require__(/*! ./utils.js */ \"./palette/utils.js\").hexToRGB;\nconst colorToString = __webpack_require__(/*! ./utils.js */ \"./palette/utils.js\").colorToString;\nconst scaleDown = __webpack_require__(/*! ./utils.js */ \"./palette/utils.js\").scaleDown;\nconst toPixel = __webpack_require__(/*! ./utils.js */ \"./palette/utils.js\").toPixel;\n\nconst cursor = {\n  curr: {\n    x: 0,\n    y: 0,\n  },\n  last: {\n    x: 0,\n    y: 0,\n  },\n};\n\nconst toolsIDs = {\n  pencil: 'pencil',\n  bucket: 'bucket',\n  colorPicker: 'color-picker',\n};\n\nconst tools = {\n  pencilButton: document.getElementById(toolsIDs.pencil),\n  bucketButton: document.getElementById(toolsIDs.bucket),\n  colorPickerButton: document.getElementById(toolsIDs.colorPicker),\n};\n\nconst colorButtonsIDs = {\n  colorCurr: 'color-curr',\n  colorPrev: 'color-prev',\n  colorA: 'color-a',\n  colorB: 'color-b',\n};\n\nconst colorButtons = {\n  curr: document.getElementById(colorButtonsIDs.colorCurr),\n  prev: document.getElementById(colorButtonsIDs.colorPrev),\n  a: document.getElementById(colorButtonsIDs.colorA),\n  b: document.getElementById(colorButtonsIDs.colorB),\n};\n\nconst colors = {\n  curr: JSON.parse(localStorage.getItem(colorButtonsIDs.colorCurr)) || [0, 128, 0],\n  prev: JSON.parse(localStorage.getItem(colorButtonsIDs.colorPrev)) || [255, 255, 255],\n  a: JSON.parse(localStorage.getItem(colorButtonsIDs.colorA)) || [0, 0, 128],\n  b: JSON.parse(localStorage.getItem(colorButtonsIDs.colorB)) || [128, 0, 0],\n  canvas: '#e5e5e5',\n};\n\nconst shortCuts = {\n  pencil: 'KeyP',\n  bucket: 'KeyB',\n  colorPicker: 'KeyC'\n}\n\nconst pixelSize = 32;\nlet selectedTool = localStorage.getItem('selectedTool') || toolsIDs.pencil;\nlet isDrawing = false;\n\nconst canvas = document.querySelector('.canvas');\nconst ctx = canvas.getContext('2d');\nctx.fillStyle = colors.canvas;\nctx.fillRect(0, 0, canvas.width, canvas.clientWidth);\nif (localStorage.getItem('imgData')) {\n  const img = new Image();\n  img.src = localStorage.getItem('imgData');\n  img.onload = () => {\n    ctx.drawImage(img, 0, 0);\n  };\n}\n\nfunction drawLine(x0, y0, x1, y1) {\n  const dx = Math.abs(x1 - x0);\n  const sx = x0 < x1 ? 1 : -1;\n\n  const dy = Math.abs(y1 - y0);\n  const sy = y0 < y1 ? 1 : -1;\n\n  let err = (dx > dy ? dx : -dy) / 2;\n\n  while (true) {\n    ctx.fillRect((x0 * pixelSize), (y0 * pixelSize), pixelSize, pixelSize);\n\n    if (x0 === x1 && y0 === y1) break;\n    const e2 = err;\n    if (e2 > -dx) {\n      err -= dy;\n      x0 += sx;\n    }\n    if (e2 < dy) {\n      err += dx;\n      y0 += sy;\n    }\n  }\n}\n\nfunction usePencilTool() {\n  drawLine(\n    scaleDown(cursor.last.x, pixelSize),\n    scaleDown(cursor.last.y, pixelSize),\n    scaleDown(cursor.curr.x, pixelSize),\n    scaleDown(cursor.curr.y, pixelSize),\n  );\n}\n\nfunction useFillTool(startX, startY) {\n  const imgData = ctx.getImageData(0, 0, 512, 512);\n  const startColor = ctx.getImageData(startX, startY, 1, 1).data;\n  const startR = startColor[0];\n  const startG = startColor[1];\n  const startB = startColor[2];\n\n  const pixelStack = [[startX, startY]];\n\n  function matchStartColor(pixelPos) {\n    const r = imgData.data[pixelPos];\n    const g = imgData.data[pixelPos + 1];\n    const b = imgData.data[pixelPos + 2];\n\n    return (r === startR && g === startG && b === startB);\n  }\n\n  function paintPixel(pixelPos) {\n    imgData.data[pixelPos] = colors.curr[0];\n    imgData.data[pixelPos + 1] = colors.curr[1];\n    imgData.data[pixelPos + 2] = colors.curr[2];\n    imgData.data[pixelPos + 3] = 255;\n  }\n\n  if (startColor[0] === colors.curr[0]\n    && startColor[1] === colors.curr[1]\n    && startColor[2] === colors.curr[2]\n  ) return;\n\n  while (pixelStack.length) {\n    const newPos = pixelStack.pop();\n    const x = newPos[0];\n    let y = newPos[1];\n    let leftMarked = false;\n    let rightMarked = false;\n\n    let pixelPos = (y * canvas.width + x) * 4;\n\n    while (y-- >= 0 && matchStartColor(pixelPos)) {\n      pixelPos -= canvas.width * 4;\n    }\n\n    pixelPos += canvas.width * 4;\n    y++;\n\n    while (y++ <= canvas.width && matchStartColor(pixelPos)) {\n      paintPixel(pixelPos);\n\n      if (x > 0) {\n        if (matchStartColor(pixelPos - 4)) {\n          if (!leftMarked) {\n            pixelStack.push([x - 1, y]);\n            leftMarked = true;\n          }\n        } else if (leftMarked) {\n          leftMarked = false;\n        }\n      }\n\n      if (x <= canvas.width) {\n        if (matchStartColor(pixelPos + 4)) {\n          if (!rightMarked) {\n            pixelStack.push([x + 1, y]);\n            rightMarked = true;\n          }\n        } else if (rightMarked) {\n          rightMarked = false;\n        }\n      }\n\n      pixelPos += canvas.width * 4;\n    }\n  }\n\n  ctx.putImageData(imgData, 0, 0);\n}\n\nfunction colorPicker(x, y) {\n  const pxData = ctx.getImageData(x, y, 1, 1).data.slice(0, -1);\n  colorButtons.curr.parentElement.style.backgroundColor = colorToString(pxData);\n  colorButtons.prev.parentElement.style.backgroundColor = colorToString(colors.curr);\n  colors.prev = colors.curr;\n  colors.curr = pxData;\n}\n\nfunction selectTool(tool) {\n  Object.values(tools).forEach((button) => {\n    button.classList.remove('tool-item--selected');\n  });\n\n  selectedTool = tool.id;\n  tool.classList.add('tool-item--selected');\n}\n\nObject.values(tools).forEach((tool) => {\n  if (tool.id === selectedTool) tool.classList.add('tool-item--selected');\n\n  tool.addEventListener('click', () => {\n    selectTool(tool);\n  });\n});\n\nwindow.onbeforeunload = function uploadToLocalStorage() {\n  localStorage.setItem('imgData', canvas.toDataURL());\n  localStorage.setItem(colorButtonsIDs.colorCurr, JSON.stringify(colors.curr));\n  localStorage.setItem(colorButtonsIDs.colorPrev, JSON.stringify(colors.prev));\n  localStorage.setItem(colorButtonsIDs.colorA, JSON.stringify(colors.a));\n  localStorage.setItem(colorButtonsIDs.colorB, JSON.stringify(colors.b));\n  localStorage.setItem('selectedTool', selectedTool);\n};\n\ndocument.addEventListener('keypress', function activateShortCut(e) {\n  if (e.code === shortCuts.pencil) {\n    selectTool(tools.pencilButton);\n  }\n  if (e.code === shortCuts.bucket) {\n    selectTool(tools.bucketButton);\n  }\n  if (e.code === shortCuts.colorPicker) {\n    selectTool(tools.colorPickerButton);\n  }\n});\n\nObject.keys(colorButtons).forEach((name) => {\n  colorButtons[name].parentElement.style.backgroundColor = colorToString(colors[name]);\n  colorButtons[name].value = rgbToHex(colors[name]);\n});\n\nObject.values(colorButtons).forEach((button) => {\n  button.addEventListener('change', (e) => {\n    e.target.parentElement.style.backgroundColor = e.target.value;\n    if (e.target.id === colorButtonsIDs.colorCurr) {\n      colorButtons.prev.parentElement.style.backgroundColor = rgbToHex(colors.curr);\n      colors.curr = hexToRGB(e.target.value);\n    }\n    if (e.target.id === colorButtonsIDs.colorA) {\n      colors.a = hexToRGB(e.target.value);\n    }\n    if (e.target.id === colorButtonsIDs.colorB) {\n      colors.b = hexToRGB(e.target.value);\n    }\n  });\n\n  button.parentElement.parentElement.addEventListener('click', function changeColor(e) {\n    if (e.target.tagName !== 'LABEL' && e.target.tagName !== 'INPUT') {\n      colorButtons.prev.parentElement.style.backgroundColor = colorToString(colors.curr);\n\n      if (e.currentTarget.children[0].children[0].id === colorButtonsIDs.colorPrev) {\n        colorButtons.curr.parentElement.style.backgroundColor = colorToString(colors.prev);\n        [colors.prev, colors.curr] = [colors.curr, colors.prev];\n      }\n      if (e.currentTarget.children[0].children[0].id === colorButtonsIDs.colorA) {\n        colorButtons.curr.parentElement.style.backgroundColor = colorToString(colors.a);\n        colors.prev = colors.curr;\n        colors.curr = colors.a;\n      }\n      if (e.currentTarget.children[0].children[0].id === colorButtonsIDs.colorB) {\n        colorButtons.curr.parentElement.style.backgroundColor = colorToString(colors.b);\n        colors.prev = colors.curr;\n        colors.curr = colors.b;\n      }\n    }\n  });\n});\n\ncanvas.addEventListener('mousedown', (e) => {\n  if (selectedTool === toolsIDs.pencil) {\n    ctx.fillStyle = colorToString(colors.curr);\n    isDrawing = true;\n\n    cursor.last.x = e.layerX;\n    cursor.last.y = e.layerY;\n\n    ctx.fillRect(toPixel(e.layerX, pixelSize), toPixel(e.layerY, pixelSize), pixelSize, pixelSize);\n  }\n  if (selectedTool === toolsIDs.bucket) {\n    ctx.fillStyle = colorToString(colors.curr);\n\n    useFillTool(e.layerX, e.layerY);\n  }\n  if (selectedTool === toolsIDs.colorPicker) {\n    colorPicker(e.layerX, e.layerY);\n  }\n});\n\ncanvas.addEventListener('mousemove', (e) => {\n  if (selectedTool === toolsIDs.pencil && isDrawing) {\n    cursor.curr.x = e.layerX;\n    cursor.curr.y = e.layerY;\n\n    usePencilTool();\n\n    cursor.last.x = cursor.curr.x;\n    cursor.last.y = cursor.curr.y;\n  }\n});\n\ndocument.addEventListener('mouseup', () => {\n  if (selectedTool === toolsIDs.pencil) {\n    isDrawing = false;\n  }\n});\n\n\n//# sourceURL=webpack:///./palette/app.js?");

/***/ }),

/***/ "./palette/utils.js":
/*!**************************!*\
  !*** ./palette/utils.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function rgbToHex(rgb) {\n  return `#${((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1)}`;\n}\n\nfunction hexToRGB(hex) {\n  const m = hex.match(/^#?([\\da-f]{2})([\\da-f]{2})([\\da-f]{2})$/i);\n  return [\n    parseInt(m[1], 16),\n    parseInt(m[2], 16),\n    parseInt(m[3], 16),\n  ];\n}\n\nfunction colorToString(colorsArray) {\n  return `rgba(${colorsArray[0]},${colorsArray[1]},${colorsArray[2]},${colorsArray[3] ? (colorsArray[3] / 255) : 1})`;\n}\n\nfunction scaleDown(coordinate, pixelSize) {\n  return Math.floor(coordinate / pixelSize);\n}\n\nfunction toPixel(coordinate, pixelSize) {\n  return Math.floor(coordinate / pixelSize) * pixelSize;\n}\n\nmodule.exports = {\n  rgbToHex, hexToRGB, colorToString, scaleDown, toPixel,\n};\n\n\n//# sourceURL=webpack:///./palette/utils.js?");

/***/ })

/******/ });