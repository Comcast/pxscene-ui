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
const pxRect = pxsceneUI.pxRect;
const pxTextBox = pxsceneUI.pxTextBox;
const ALIGN_VERTICAL = pxsceneUI.ALIGN_VERTICAL;
const ALIGN_HORIZONTAL = pxsceneUI.ALIGN_HORIZONTAL;

// 1) This is the same exact Widget we used for the project in Example-05.
// 2) It's here to show that TypeScript is optional, and that you can still
// create components in "plain" JavaScript using the same 'pxsceneUI' module
// that you'd use for components written in TypeScript.
export default class Widget extends pxsceneUI.pxComponent {
  constructor(props) {
    super(props);

    this.state = {
      selected: false
    };
  }

  render() {
    const { x, y, w, h, label } = this.props;
    const { selected } = this.state;

    let labelObj = new pxTextBox({
      x: 5,
      y: 5,
      w: w,
      h: h,
      // 3) Since *this* Widget isn't written in TypeScript, we don't have the
      // ability to type-check the properties for creating pxscene objects.
      bogus: 'This should not be here',
      alignHorizontal: ALIGN_HORIZONTAL.CENTER,
      alignVertical: ALIGN_VERTICAL.CENTER,
      text: selected ? '>' + label + '<' : label,
      textColor: selected ? 0xffffffff : 0xff0000ff
    });

    let boxObj = new pxRect({
      x: 5,
      y: 5,
      w: w,
      h: h,
      lineWidth: 1,
      lineColor: selected ? 0xffffffff : 0xff0000ff,
      fillColor: selected ? 0xff0000ff : 0xffffffff
    });

    return new pxRect({
      x: x,
      y: y,
      w: w,
      h: h,
      fillColor: 0x444444ff,
      onMouseDown: this.handleMouseClick.bind(this)
    }).addChildren(boxObj, labelObj);
  }

  handleMouseClick() {
    this.setState({
      selected: !this.state.selected
    });
  }
}
