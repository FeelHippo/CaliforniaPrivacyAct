const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');

// * * * * Shared Configuration * * * * //

const sharedConfig = () => {
    return {
        entry: {
            uspapi: './src/uspapi.js'
        },
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'dist')
        },
        devtool: "source-map",
        plugins: [
            new HtmlWebpackPlugin({
                title: 'Output Management',
                inject: false,
                template: './index.html',
                minify: {
                    collapseWhitespace: true,
                    minifyCSS: true,
                    minifyJS: true,
                    removeComments: true
                }
            })
        ],
        module: {
            rules: [
              {
                test: /\.js?$/,
                exclude: /node_modules/,
                include: [
                    path.resolve(__dirname, 'src')
                ],
                loader: 'babel-loader'
              },
              {
                test: /\.html?$/,
                include: [
                    path.resolve(__dirname, 'src')
                ],
                use: [{
                    loader: 'mustache-loader',
                    options: {
                        minify: true,
                        tiny: true
                    }
                }]
              }
            ]
        }
    };
};

const envSpecificConfig = (env) => 
    env.dev
        ? // * * * * Development Config * * * * //
            {
                devServer: {
                    contentBase: path.join(__dirname, 'dist'),
                    port: 9000,
                    open: true
                },
                plugins: [
                    new webpack.HotModuleReplacementPlugin(),
                ]
            }
        : // * * * * Production Configuration * * * * //
            {
                plugins: [
                    new CleanWebpackPlugin(),
                ]
            }

// * * * * Environment Configuration * * * * //

module.exports = env => {
    return merge(
        sharedConfig(),
        envSpecificConfig(env)
    )
}