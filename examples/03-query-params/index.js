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
const HelloWorld = require('HelloWorld');

// 1) Check if the query params specify values for 'xPos' or 'yPos'.
// 2) Define default values if the query params leave out either.
const { xPos = 0, yPos = 0 } = px.appQueryParams;

pxsceneUI.render(
  new HelloWorld({
    xPos: xPos,
    yPos: yPos,
    text: 'Hello World!',
    color: 0xffff00ff,
    fontSize: 24
  })
);
