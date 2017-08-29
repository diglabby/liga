const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        slider: './slider/src/index.js',
    },
    output: {
        path: path.join(__dirname, "js"),
        publicPath: "/js",
        filename: "[name].bundle.js"
    },
    devServer: {
      contentBase: "./slider"
    },
    module: {
        rules: [
            {
              test: /\.js$/,
              exclude: [/node_modules/],
              use: [{
                loader: 'babel-loader',
                options: {
                  presets: ['es2015'],
                },
              }],
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader?modules=true&localIdentName=[name]__[local]___[hash:base64:5]'
            }
        ],
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ],
};
