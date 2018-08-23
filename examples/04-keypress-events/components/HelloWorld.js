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
  constructor(props) {
    super(props);

    // 1) Use the props to initialize the position of this component.
    const { xPos = 0, yPos = 0 } = props;

    // 2) This is the same way that components initialize state in React.
    // 3) The state of this component tracks its current position.
    this.state = {
      x: xPos,
      y: yPos
    };
  }

  // 4) IMPORTANT: This is a pxsceneUI-specific pattern.
  // A component class *must* override this getter method in order to declare
  // the pxScene-specific modules that it wishes to import. Such modules include
  // 'ws', 'https', and 'keys'.
  get modules() {
    // 5) IMPORTANT: This method should return a map of key-value pairs.
    // The value is the name of the module to import. pxsceneUI adds the module
    // as a property of this instance. The name of the property matches the
    // corresponding key.
    return {
      // 6) This make 'px:tools.keys.js' availalble as 'this.keys'.
      keys: 'px:tools.keys.js'
    };
  }

  render() {
    // 7) Continue to use these values from the props.
    const { text, color, fontSize } = this.props;
    // 8) But use the 'x' and 'y' values from the current state.
    const { x, y } = this.state;

    return new pxText({
      x: x,
      y: y,
      text: text,
      textColor: color,
      pixelSize: fontSize,
      // 9) IMPORTANT: A pxscene object must have focus to receive keypresses.
      // 10) IMPORTANT: Since this is the only object, use the 'focus' property
      // to make sure that it always has focus. Later examples will show
      // another pattern for setting focus, especially when multiple objects are
      // involved.
      focus: true,
      // 11) IMPORTANT: 'onKeyDown' is a special pxObject property for defining
      // a handler for the 'onKeyDown' event.
      // 12) IMPORTANT: With HTML apps, the component class defines the event
      // handler and attaches it to the DOMElement as a property. Similarly,
      // the component here defines the handler and attaches it to the pxObect.
      onKeyDown: this.handleKeypress.bind(this)
    });
  }

  handleKeypress(event) {
    // 13) 'this.keys' is the 'px:tools.keys.js' module imported from pxScene.
    const { UP, DOWN, LEFT, RIGHT } = this.keys;
    var { x, y } = this.state;
    var handled = false;

    switch (event.keyCode) {
      case UP:
        y -= 20;
        handled = true;
        break;
      case DOWN:
        y += 20;
        handled = true;
        break;
      case LEFT:
        x -= 20;
        handled = true;
        break;
      case RIGHT:
        x += 20;
        handled = true;
        break;
      default:
    }

    // 14) Update the state to re-render this component with its new position.
    this.setState({
      x: x,
      y: y
    });

    if (handled) {
      // 15) IMPORTANT: This prevents the same event from bubbling up to this
      // component's parent.
      event.stopPropagation();
    }
  }
}

module.exports = HelloWorld;
