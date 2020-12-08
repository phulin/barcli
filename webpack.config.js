/* eslint-disable node/no-unpublished-require */
const path = require('path');
const { DefinePlugin, ProvidePlugin } = require('webpack');
const { merge } = require('webpack-merge');

// TODO: Use browser target for client file.

const baseConfig = {
  mode: 'development',
  devtool: false,
  output: {
    path: path.resolve(__dirname, 'build', 'relay'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  plugins: [
    new DefinePlugin({
      'process.env.NODE_DEBUG': false,
      'process.env.NODE_ENV': "'development'",
    }),
  ],
};

const serverConfig = merge(baseConfig, {
  entry: {
    awesomemenu: './src/server.ts',
  },
  output: {
    libraryTarget: 'commonjs',
  },
  target: 'node',
  module: {
    rules: [
      {
        // Include ts, tsx, js, and jsx files.
        test: /\.(ts|js)x?$/,
        // exclude: /node_modules(?!\/(libram|buffer))/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      console: path.resolve(path.join(__dirname, 'src/console')),
    }),
  ],
  externals: {
    kolmafia: 'commonjs kolmafia',
  },
});

const clientConfig = merge(baseConfig, {
  entry: {
    barcli: './src/client.ts',
  },
  module: {
    rules: [
      {
        // Include ts, tsx, js, and jsx files.
        test: /\.(ts|js)x?$/,
        exclude: /node_modules(?!\/(libram|buffer))/,
        loader: 'babel-loader',
      },
    ],
  },
});

module.exports = [clientConfig, serverConfig];
