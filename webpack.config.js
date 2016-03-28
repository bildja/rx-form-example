var path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  module: {
    loaders: [{
      test: /\.css$/,
      loader: 'style!css'
    }, {
      test: /\.styl$/,
      loader: 'style-loader!css-loader!stylus-loader'
    }, {
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel', // 'babel-loader' is also a legal name to reference
      query: {
        presets: ['es2015']
      }
    }]
  },
};