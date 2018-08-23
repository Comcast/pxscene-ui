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

pxsceneUI.render(
  // 1) Attributes previously hard-coded within the HelloWorld component
  // shall now be passed into the component as props.
  // 2) The default constructor for the pxComponent class accepts an optional
  // JSON object that holds any props which the component may need.
  new HelloWorld({
    xPos: 50,
    yPos: 50,
    text: 'Hello World!',
    color: 0xffff00ff,
    fontSize: 24
  })
);
