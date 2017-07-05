var path = require('path');
module.exports = exports = {
  entry: [
      './src/main.js'
  ],
  devtool: 'source-map',
  output: {
      path: path.join(__dirname,'dist'),
      filename: 'clustering.js',
      library: ["cl"],
		  libraryTarget: "umd",
      publicPath: '/'
  },
  resolve: {
      extensions: ['.js']
  },
  module: {
      loaders: [
          {
              test: /\.js$/,
              exclude: /node_modules/,
              loader: ["babel-loader?presets[]=es2015"]
          }
      ]
  },
  watch: true
};
