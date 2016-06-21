var path = require("path"),
    webpack = require("webpack");

module.exports = {

    entry: {
        //'editors': path.resolve(__dirname, 'editors'),
        'example': path.resolve(__dirname, 'example/example')
    },

    output: {
        path: path.resolve(__dirname, 'example'),
        filename: '[name]-bundle.min.js'
    },

    module: {

      loaders: [
          {
              test:  /\.jsx?$/,
              loader: 'babel',
              exclude: /node_modules/,
              query: {
                  presets: ['react', 'es2015']
              }
          }
      ]
  },

  plugins: [
          new webpack.optimize.UglifyJsPlugin({
            compress: {
              warnings: false,
            },
          })
      ],

  resolve: {
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js', '.jsx']
    }
}
