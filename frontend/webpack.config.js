var path = require("path");
var webpack = require("webpack");
var argv = require("yargs").argv;

var DIST_DIR = path.resolve(__dirname, "static");
var SRC_DIR = path.resolve(__dirname, "src");

var config = {
  entry: SRC_DIR + "/app/index.js",
  output: {
    path: DIST_DIR,
    filename: "bundle.js",
  },
  module: {
    loaders: [
      {
        test: /\.js?/,
        include: SRC_DIR,
        loader: "babel-loader",
        exclude: /node_modules/,
        query: {
          presets: ["react", "es2015", "stage-2"],
        },
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader",
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ],
  },
  resolve: {
    extensions: ["", ".js", ".jsx", ".css"],
    modulesDirectories: ["node_modules"],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(argv.ENV),
      },
    }),
  ],
};

module.exports = config;
