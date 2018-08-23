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

const pxsceneUI = require('pxscene-ui');
const pxText = pxsceneUI.pxText;

// 1) pxsceneUI.pxComponent is the equivalent of React.Component -- it is the
// root class of all components.
class HelloWorld extends pxsceneUI.pxComponent {
  // 2) As with React, every component must define a render() method.
  render() {
    // 3) As with React, the render() method must return EXACTLY ONE element,
    // which can either be a pxObject or another pxComponent. For this example,
    // render() returns the same pxText that we created in the previous example.
    return new pxText({
      x: 50,
      y: 50,
      text: 'Hello World!',
      textColor: 0xffff00ff,
      pixelSize: 24
    });
  }
}

module.exports = HelloWorld;
