let rgbToHex = require('./rgb-to-hex.js');

test('coverts rgb array [151,34,34] to hex string #972222', () => {
  expect(rgbToHex([151, 34, 34])).toBe('#972222');
});