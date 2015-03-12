var webpack = require('webpack');

var definePlugin = new webpack.DefinePlugin({
  __BROWSER_BUILD__: true
});

module.exports = {
  plugins: [ definePlugin ],
  entry: './src/girder.js',
  output: {
    path: './dist',
    filename: 'girder-client.js',   
  },
  module: {
    preLoaders: [
      {
          test: /\.js$/, 
          exclude: /node_modules/,
          loader: "jshint-loader"
      }
    ],
    loaders: [
        { 
          test: require.resolve("./src/girder.js"), 
          loader: "expose?girder"
        },{
          test: /\.js$/i,
          loader: "strict-loader"
        },{
          test: /\.html$/i, 
          loader: "html" 
        },{ 
          test: /\.styl$/i, 
          loader: ["style-loader", "css-loader", "autoprefixer-loader?browsers=last 2 version", "stylus-loader"] 
        },{ 
          test: /\.(png|jpg|svg|woff|ttf)$/, 
          loader: 'url-loader?limit=8192'
        }
    ]
  },
  externals: {
    // "reqwest": "reqwest"
  }
};
