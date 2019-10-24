const VueLoader = require('vue-loader');
const path = require('path');

module.exports = {
    devtool: 'source-map',
    entry: [
        './app/app.js'
    ],
    output: {
        filename: 'app.js',
        path: __dirname,
    },
    mode: 'development',
    resolve: {
        extensions: ['.vue', '.js'],
        alias: {
            'vue$': 'vue/dist/vue.js',
            '@': __dirname,
            '@app': path.resolve(__dirname, './app/'),
            '@libs': path.resolve(__dirname, './app/libs/'),
            '@textLayer': path.resolve(__dirname, './app/textLayer/'),
            '@develop': path.resolve(__dirname, './app/develop/'),
            '@world': path.resolve(__dirname, './app/world/')
        }
    },
    plugins: [
        new VueLoader.VueLoaderPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.css$/,
                loader: 'css-loader',
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'file-loader',
                query: {
                    limit: 10000,
                    name: '../img/[name].[hash:7].[ext]'
                }
            }
        ]
    }
};
