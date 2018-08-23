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
var webpack = require('webpack');
const SmartBannerPlugin = require('smart-banner-webpack-plugin');

/* This is the base config. */
var config = {
  entry: './index.js',
  output: {
    // Webpack will place generated files in the 'build' folder.
    path: path.resolve(__dirname, 'build'),
    // Merge all JS files into a single bundle.js file.
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        // Convert all non-standard JS to standard syntax.
        test: /\.(js)$/,
        use: {
          loader: 'babel-loader',
          options: {
            // Handle syntax for ES2015, ES2016, etc.
            // 'stage-0' is ES2017 (needed for await/async).
            presets: ['stage-0']
          }
        }
      }
    ]
  },
  resolve: {
    // Resolves JS modules/files imports without absolute/relative paths.
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

module.exports = config;
