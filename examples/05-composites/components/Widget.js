const px2react = require('px2react');
const pxRect = px2react.pxRect;
const pxTextBox = px2react.pxTextBox;
const ALIGN_VERTICAL = px2react.ALIGN_VERTICAL;
const ALIGN_HORIZONTAL = px2react.ALIGN_HORIZONTAL;

// 1) The Widget is also composed of multiple objects.
class Widget extends px2react.pxComponent {
  constructor(props) {
    super(props);

    // 2) Initialize the 'selected' state of each Widget to 'false'.
    this.state = {
      selected: false
    };
  }

  render() {
    const { x, y, w, h, label } = this.props;
    // 3) The 'selected' state affects the appearance of this Widget.
    const { selected } = this.state;

    // 4) Create the label for the Widget. Its position is relative to the
    // root element that this method returns.
    let labelObj = new pxTextBox({
      x: 5,
      y: 5,
      w: w,
      h: h,
      alignHorizontal: ALIGN_HORIZONTAL.CENTER,
      alignVertical: ALIGN_VERTICAL.CENTER,
      text: selected ? '>' + label + '<' : label,
      textColor: selected ? 0xffffffff : 0xff0000ff
    });

    // 5) Create a rectangle for the background of the label. Its position is
    // also relative to the root element.
    let boxObj = new pxRect({
      x: 5,
      y: 5,
      w: w,
      h: h,
      lineWidth: 1,
      lineColor: selected ? 0xffffffff : 0xff0000ff,
      fillColor: selected ? 0xff0000ff : 0xffffffff
    });

    // 5) Create a rectangle for the drop shadow behind the Widget.
    // 6) This rectangle is the root element for the Widget, so add the above
    // elements as its children.
    // 7) IMPORTANT: The parent element always has a lower z-order than its
    // children (i.e. appears underneath them).
    // 8) IMPORTANT: The order of the arguments to addChildren(..) determines
    // their default z-ordering. The last child in the list has the highest
    // z-order.
    return new pxRect({
      x: x,
      y: y,
      w: w,
      h: h,
      fillColor: 0x444444ff,
      // 9) Attach the Widget's handler for the 'onMouseDown' event.
      // 10) Focus is not required for an object to receive mouse-click events.
      onMouseDown: this.handleMouseClick.bind(this)
    }).addChildren(boxObj, labelObj);
  }

  handleMouseClick() {
    // 11) Clicking on a Widget toggles its 'selected' state.
    this.setState({
      selected: !this.state.selected
    });
  }
}

module.exports = Widget;
