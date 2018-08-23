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

class App extends pxsceneUI.pxComponent {
  render() {
    // 1) Widget now has a 'hasFocus' prop for setting its initial focus.
    let widget1 = new Widget({
      x: 100,
      y: 100,
      w: 100,
      h: 50,
      label: 'Widget 1',
      hasFocus: true
    });

    let widget2 = new Widget({
      x: 100,
      y: 200,
      w: 100,
      h: 50,
      label: 'Widget 2',
      hasFocus: false
    });

    return new pxObject({ x: 0, y: 0 }).addChildren(widget1, widget2);
  }
}

module.exports = App;
