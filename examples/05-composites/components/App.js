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
const pxObject = pxsceneUI.pxObject;
const Widget = require('Widget');

// 1) The App is a high-order component consisting of two Widget components.
class App extends pxsceneUI.pxComponent {
  render() {
    let widget1 = new Widget({
      x: 100,
      y: 100,
      w: 100,
      h: 50,
      label: 'Widget 1'
    });

    let widget2 = new Widget({
      x: 100,
      y: 200,
      w: 100,
      h: 50,
      label: 'Widget 2'
    });

    // 2) Recall that the render() method must return EXACTLY one element.
    // 3) In HTML apps, a high-order React component's render() usually returns
    // a 'div' to serve as its root element. This root element holds all of the
    // child elements (which can be other components or DOMElements).
    // 4) IMPORTANT: Here, the pxObject is the root element of App. The Widget
    // components are its children and are positioned relative to its position.
    // 5) The root element doesn't necessarily have to be a pxObject.
    return new pxObject({ x: 0, y: 0 }).addChildren(widget1, widget2);
  }
}

module.exports = App;
