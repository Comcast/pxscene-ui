const px2react = require('px2react');
const pxText = px2react.pxText;

class HelloWorld extends px2react.pxComponent {
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
