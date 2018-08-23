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

// 1) pxsceneUI.render() serves as the entry point for every pxsceneUI app.
// 2) pxsceneUI.render() takes a single element as an argument. This element
// can either be a pxObject (which correspond to Object classes supported by
// the pxScene API) or a pxComponent (which we will cover later).
// 3) This illustrates the absolute minimum for a pxsceneUI app. The app draws
// a single object -- in this case, a text object.
pxsceneUI.render(
  // 4) As a rule, the JSON parameter passed to the constuctor of a pxObject
  // (in this case, a pxText) is identical to the JSON that you would pass to
  // the Scene.create() method for creating the corresponding pxScene object.
  new pxText({
    x: 50,
    y: 50,
    text: 'Hello World!',
    textColor: 0xffff00ff,
    pixelSize: 24
  })
);
