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
const ALIGN_HORIZONTAL = pxsceneUI.ALIGN_HORIZONTAL;
const ALIGN_VERTICAL = pxsceneUI.ALIGN_VERTICAL;
const ANIMATION = pxsceneUI.ANIMATION;

class Widget extends pxsceneUI.pxComponent {
  render() {
    // 1) If a 'refCallback' isn't specified, then have it default to a no-op
    // function.
    const { x, y, w, h, label, refCallback = () => {} } = this.props;

    let text = new pxTextBox({
      w: w,
      h: h,
      text: label,
      alignHorizontal: ALIGN_HORIZONTAL.CENTER,
      alignVertical: ALIGN_VERTICAL.CENTER,
      pixelSize: 15,
      // 2) As shown in previous examples, this just allows this component to
      // create a reference to one of its own elements.
      ref: textBox => {
        this.refs.textBox = textBox;
      },
      textColor: 0xff0000ff
    });

    return new pxRect({
      x: x,
      y: y,
      w: w,
      h: h,
      // 3) IMPORTANT: The twist here is that the 'ref' callback makes an
      // additional call to the function passed in as the 'refCallback' prop.
      ref: rect => {
        // 4) NOTE: Using the 'ref' callback just to set a property on a class
        // is a common pattern for accessing elements. While the callback CAN
        // have other side-effects, it's considered an anti-pattern.
        refCallback(rect);
        // 5) Per usual, we can also create a reference within this class. It
        // just won't be used in this example.
        this.refs.rect = rect;
      },
      fillColor: 0xffffffff,
      a: 1
    }).addChildren(text);
  }

  // 6) Define a method for animating the pxTextBox element. But it won't be
  // called by this class itself.
  animateText() {
    this.refs.textBox.animate(
      { pixelSize: 20 },
      0.5,
      ANIMATION.TWEEN_EXP1,
      ANIMATION.OPTION_OSCILLATE,
      ANIMATION.COUNT_FOREVER
    );
  }
}

module.exports = Widget;
