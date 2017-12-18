const px2react = require('px2react');
const pxObject = px2react.pxObject;
const Widget = require('Widget');

class App extends px2react.pxComponent {
  render() {
    // 1) Widget now has a 'hasFocus' prop for setting its initial focus.
    let widget1 = new Widget({
      x: 100,
      y: 100,
      w: 100,
      h: 50,
      label: 'Widget 1',
      hasFocus: true
    });

    let widget2 = new Widget({
      x: 100,
      y: 200,
      w: 100,
      h: 50,
      label: 'Widget 2',
      hasFocus: false
    });

    return new pxObject({ x: 0, y: 0 }).addChildren(widget1, widget2);
  }
}

module.exports = App;
