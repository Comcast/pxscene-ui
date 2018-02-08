const px2react = require('px2react');
const pxRect = px2react.pxRect;
const pxTextBox = px2react.pxTextBox;

class Widget extends px2react.pxComponent {
  render() {
    // 1) If a 'refCallback' isn't specified, then have it default to a no-op
    // function.
    const { x, y, w, h, label, refCallback = () => {} } = this.props;

    let text = new pxTextBox({
      w: w,
      h: h,
      text: label,
      alignHorizontal: 1,
      alignVertical: 1,
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
    this.refs.textBox.animate({ pixelSize: 20 }, 0.5, 1, 1, -1);
  }
}

module.exports = Widget;
