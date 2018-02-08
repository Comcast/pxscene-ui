const px2react = require('px2react');
const pxRect = px2react.pxRect;
const pxTextBox = px2react.pxTextBox;
const ALIGN_VERTICAL = px2react.ALIGN_VERTICAL;
const ALIGN_HORIZONTAL = px2react.ALIGN_HORIZONTAL;

class Widget extends px2react.pxComponent {
  constructor(props) {
    super(props);

    // 1) Initialize the state based on the props.
    this.state = {
      x: props.x,
      y: props.y,
      // 2) The 'selected' state from the previous example is now 'hasFocus',
      // which we initialize with the value from props.
      hasFocus: props.hasFocus
    };
  }

  // 3) This is the same getter from the example for keypress events.
  get modules() {
    return {
      keys: 'px:tools.keys.js'
    };
  }

  render() {
    const { w, h, label } = this.props;
    // 4) The state determines the appearance and position of this widget.
    const { x, y, hasFocus } = this.state;

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
      x: x,
      y: y,
      w: w,
      h: h,
      fillColor: 0x444444ff,
      onMouseDown: this.handleMouseClick.bind(this),
      onKeyDown: this.handleKeypress.bind(this),
      // 5) Attach the Widget's handler for the 'onBlur' event.
      onBlur: this.onBlur.bind(this),
      // 6) IMPORTANT: This is similar to 'refs' in React. A ref is a reference
      // to the actual pxScene object that render() creates. These refs are
      // useful when you need direct access to properties or methods of the
      // pxScene object.
      // 7) IMPORTANT: Just as with React, refs should not be accessed before
      // render() returns.
      ref: function(widget) {
        // 8) This just sets 'this.refs.widget' to the pxRect instance being
        // created.
        this.refs.widget = widget;
      }.bind(this)
    }).addChildren(boxObj, labelObj);
  }

  // 9) The mouse-click handler now just sets a Widget's 'hasFocus' state to
  // 'true'.
  handleMouseClick() {
    this.setState({
      hasFocus: true
    });
  }

  // 10) This is the same handler mathod from the example for keypress events.
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

  // 11) This is the standard lifecycle method from React. px2react invokes this
  // method after render() returns for the first time.
  componentDidMount() {
    const { hasFocus } = this.state;

    // 12) This is the same pattern that HTML apps use in React to set the
    // initial focus on a particular DOMElement.
    if (hasFocus) {
      // 13) IMPORTANT: This is just setting the 'focus' property of the actual
      // pxScene object.
      this.refs.widget.focus = true;
      // 14) You can invoke the moveToFront() method on any pxObject instance to
      // move it to the top of the z-order. moveToFront() is equivalent to the
      // moveToFront() method defined by the pxScene API.
      this.refs.widget.moveToFront();
    }
  }

  // 15) This is the standard lifecycle method from React. px2react invokes this
  // method after each time render() returns (except for the first time).
  componentDidUpdate(prevProps, prevState) {
    const { hasFocus } = this.state;

    // 16) Changes to 'x' and 'y' in the state also cause componentDidUpdate()
    // to be invoked. Therefore, only update 'focus' if 'this.state.hasFocus'
    // is different from 'prevState.hasFocus'.
    if (hasFocus && !prevState.hasFocus) {
      this.refs.widget.focus = true;
      this.refs.widget.moveToFront();
    }
  }

  // 16) When the Widget loses focus, this handler method updates the 'hasFocus'
  // state to trigger a re-rendering.
  onBlur() {
    this.setState({
      hasFocus: false
    });
  }
}

module.exports = Widget;
