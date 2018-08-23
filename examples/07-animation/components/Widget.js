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

class Widget extends pxsceneUI.pxComponent {
  constructor(props) {
    super(props);

    this.state = {
      x: props.x,
      y: props.y,
      hasFocus: props.hasFocus
    };
  }

  get modules() {
    return {
      keys: 'px:tools.keys.js'
    };
  }

  render() {
    const { w, h, label } = this.props;
    // 1) The render() method no longer updates the position of the widget
    // according to the current state. The position of the underlying pxScene
    // object shall be set by componentDidMount and componentWillUpdate instead.
    const { hasFocus } = this.state;

    let labelObj = new pxTextBox({
      x: 5,
      y: 5,
      w: w,
      h: h,
      alignHorizontal: ALIGN_HORIZONTAL.CENTER,
      alignVertical: ALIGN_VERTICAL.CENTER,
      text: hasFocus ? '>' + label + '<' : label,
      textColor: hasFocus ? 0xffffffff : 0xff0000ff
    });

    let boxObj = new pxRect({
      x: 5,
      y: 5,
      w: w,
      h: h,
      lineWidth: 1,
      lineColor: hasFocus ? 0xffffffff : 0xff0000ff,
      fillColor: hasFocus ? 0xff0000ff : 0xffffffff
    });

    return new pxRect({
      w: w,
      h: h,
      fillColor: 0x444444ff,
      onMouseDown: this.handleMouseClick.bind(this),
      onKeyDown: this.handleKeypress.bind(this),
      // 2) Attach the Widget's handler for the 'onFocus' event.
      onFocus: this.onFocus.bind(this),
      onBlur: this.onBlur.bind(this),
      // 3) This creates the same reference to the pxRect instance as in the
      // previous example. The only difference is that we're using the ES6
      // arrow function here, which automatically binds itself to 'this'.
      ref: widget => {
        this.refs.widget = widget;
      }
    }).addChildren(boxObj, labelObj);
  }

  handleMouseClick() {
    this.setState({
      hasFocus: true
    });
  }

  handleKeypress(event) {
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

    this.setState({
      x: x,
      y: y
    });

    if (handled) {
      event.stopPropagation();
    }
  }

  componentDidMount() {
    const { hasFocus, x, y } = this.state;

    // 4) Since render() no longer updates the position of the widget, we rely
    // on componentDidMount to initialize the widget's position according to the
    // initial state.
    this.refs.widget.x = x;
    this.refs.widget.y = y;
    // 5) We're also going to initialize the alpha of the widget according to
    // whether or not it has focus.
    this.refs.widget.a = hasFocus ? 1 : 0.5;

    if (hasFocus) {
      this.refs.widget.focus = true;
      this.refs.widget.moveToFront();
    }
  }

  // 6) This is the standard lifecycle method from React. pxsceneUI invokes this
  // method before each time render() is called (except for the first time).
  componentWillUpdate(nextProps, nextState) {
    // 7) For each update, animate the widget so that it "glides" into its
    // new position.
    // 8) IMPORTANT: You can invoke the animate() method on any pxObject
    // instance. This method is equivalent to the animate() method defined by
    // the pxScene API.
    // 9) NOTE: We could alternatively perform this animation within
    // componentDidUpdate instead. It's performed here to give an example of how
    // to use componentWillUpdate.
    this.refs.widget.animate(
      {
        x: nextState.x,
        y: nextState.y
      },
      0.5
    );
  }

  componentDidUpdate(prevProps, prevState) {
    const { hasFocus } = this.state;

    if (hasFocus && !prevState.hasFocus) {
      this.refs.widget.focus = true;
      this.refs.widget.moveToFront();
    }
  }

  // 10) When the Widget gains focus, this handler method animates its alpha to
  // give it the appearance of fading in.
  onFocus() {
    this.refs.widget.animate(
      {
        a: 1
      },
      0.25
    );
  }

  onBlur() {
    // 11) When the Widget loses focus, animate its alpha to give it the
    // appearance of fading out.
    this.refs.widget.animate(
      {
        a: 0.5
      },
      0.25
    );

    this.setState({
      hasFocus: false
    });
  }
}

module.exports = Widget;
