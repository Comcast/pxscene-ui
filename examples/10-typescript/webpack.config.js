/**
* Copyright 2018 Comcast Cable Communications Management, LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

var path = require('path');
const SmartBannerPlugin = require('smart-banner-webpack-plugin');
// Webpack's built-in UglifyJsPlugin currently doesn't support stage-0 presets,
// so we use MinifyPlugin instead.
const MinifyPlugin = require('babel-minify-webpack-plugin');

/* This is the base config. */
var config = {
  entry: './index.js',
  target: 'node',
  output: {
    // Webpack will place generated files in the 'build' folder.
    path: path.resolve(__dirname, 'build'),
    // Merge all JS files into a single bundle.js file.
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        // We'll be using ts-loader instead of babel-loader to transpile
        // everything. package.json has been updated accordingly.
        // TypeScript compiler options are declared in tsconfig.json.
        test: /\.(ts|js)$/,
        use: {
          loader: 'ts-loader'
        },
        exclude: /node_modules/
      },
      {
        // We can still run all TS/JS files through ESLint before transpiling.
        // This requires a new eslint plugin and some changes to .eslintrc.
        test: /\.(ts|js)$/,
        enforce: 'pre',
        use: {
          loader: 'eslint-loader',
          options: {
            emitWarning: true,
            emitError: false
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    // Resolves TS/JS modules/files imports without absolute/relative paths.
    modules: [
      // Search in 'node_modules' folders.
      'node_modules',
      // Search in the 'components' folder.
      path.resolve(__dirname, 'components')
    ]
  },
  plugins: [
    // TODO This is a really cheesy workaround to disable the default black
    // background in pxscene. pxscene assumes that the entirety of an app is
    // executed within the same context and looks for 'wantsClearscreen' to be
    // exported within that context. This is the only way to export this
    // function "globally" and have it accessible across all of our modules.
    new SmartBannerPlugin({
      banner:
        'module.exports.wantsClearscreen = function() { return false; };\n',
      raw: true,
      entryOnly: true
    })
  ],
  devServer: {
    // Prevent webpack-dev-server from inserting a script into the bundle that
    // only applies to HTML apps.
    inline: false,
    // This allows the webpack-dev-server to reflect changes in modules without
    // a full reload.
    hot: true
  }
};

// Minify the bundled JS for the 'production' environment.
if (process.env.NODE_ENV == 'production') {
  config.plugins.push(new MinifyPlugin());
}

module.exports = config;
