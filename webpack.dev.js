const path = require('path');

module.exports = {
  mode: 'development',
  entry: './palette/app.js',
  plugins: [],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'palette'),
  },
};