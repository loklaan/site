var getConfig = require('hjs-webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var config = getConfig({
  in: 'src/app.js',
  out: 'dist',
  clearBeforeBuild: true
});

module.exports = config;
