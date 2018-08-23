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

class HelloWorld extends pxsceneUI.pxComponent {
  // 1) As with React, the default constructor for component classes take any
  // props (a JSON object) as its argument.
  constructor(props) {
    super(props);
  }

  render() {
    // 2) As with React, the render() method can access the props via
    // 'this.props'.
    // 3) This component also declares some default values for undefined props.
    const { xPos, yPos, text, color = 0x000000ff, fontSize = 18 } = this.props;

    return new pxText({
      x: xPos,
      y: yPos,
      text: text,
      textColor: color,
      pixelSize: fontSize
    });
  }
}

module.exports = HelloWorld;
