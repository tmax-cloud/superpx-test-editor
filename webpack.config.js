const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const webpack = require('webpack');

module.exports = (env) => {
  return {
    mode: 'development',
    devServer: {
      allowedHosts: 'all',
      historyApiFallback: true,
    },
    entry: {
      app: './src/index.tsx',
      'editor.worker': 'monaco-editor/esm/vs/editor/editor.worker.js',
      javaWorker: './src/java/java.worker.ts',
    },
    output: {
      globalObject: 'self',
      filename: (chunkData) => {
        switch (chunkData.chunk.name) {
          case 'editor.worker':
            return 'editor.worker.js';
          case 'javaWorker':
            return 'javaWorker.js';
          default:
            return '[name]/bundle.[hash].js';
        }
      },
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
    },
    resolve: {
      fallback: {
        assert: require.resolve('assert'),
        buffer: require.resolve('buffer'),
        console: require.resolve('console-browserify'),
        constants: require.resolve('constants-browserify'),
        crypto: require.resolve('crypto-browserify'),
        domain: require.resolve('domain-browser'),
        events: require.resolve('events'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify/browser'),
      },

      extensions: ['.ts', '.tsx', '.js', '.jsx', '.css'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?/,
          loader: 'ts-loader',
        },
        {
          test: /\.s?css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)(\?.*$|$)/,
          loader: 'file-loader',
          options: {
            name: 'public/assets/[name].[ext]',
            EsModule: false,
          },
        },
      ],
    },
    plugins: [
      new NodePolyfillPlugin(),
      new htmlWebpackPlugin({
        template: './src/index.html',
      }),
      new webpack.EnvironmentPlugin({
        WS_URL: env.WS_URL,
      }),
    ],
  };
};
