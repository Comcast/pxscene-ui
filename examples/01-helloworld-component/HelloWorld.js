const px2react = require('px2react');
const pxText = px2react.pxText;

// 1) px2react.pxComponent is the equivalent of React.Component -- it is the
// root class of all components.
class HelloWorld extends px2react.pxComponent {
  // 2) As with React, every component must define a render() method.
  render() {
    // 3) As with React, the render() method must return EXACTLY ONE element,
    // which can either be a pxObject or another pxComponent. For this example,
    // render() returns the same pxText that we created in the previous example.
    return new pxText({
      x: 50,
      y: 50,
      text: 'Hello World!',
      textColor: 0xffff00ff,
      pixelSize: 24
    });
  }
}

module.exports = HelloWorld;
