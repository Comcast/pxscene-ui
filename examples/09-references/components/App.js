const px2react = require('px2react');
const pxObject = px2react.pxObject;
const Widget = require('Widget');
const ANIMATION = px2react.ANIMATION;

// 1) For this example, our App component contains two nearly identical
// instances of the Widget component. The goal is to animate the two using two
// different methods involving references.
class App extends px2react.pxComponent {
  render() {
    // 2) Create the first Widget with a 'ref' attribute in order to obtain a
    // reference to the Widget component itself.
    let widget1 = new Widget({
      x: 100,
      y: 100,
      w: 100,
      h: 50,
      label: 'Widget 1',
      // 3) IMPORTANT: This is similar to the usage of the 'ref' attribute in
      // previous examples. The difference here is that the 'ref' callback is
      // being attached to a pxComponent instead of a pxObject element.
      // 4) When the 'ref' attribute is used on a custom component declared as
      // a class, the 'ref' callback receives the mounted instance of the
      // component as its argument.
      ref: widget => {
        // 5) IMPORTANT: As in React, the reference here is only defined after
        // this App component has been mounted (which implies that the Widget
        // has also been mounted).
        // 6) IMPORTANT: Furthermore, a reference to a pxComponent is updated
        // anytime the referenced pxComponent is updated.
        this.refs.widget1Component = widget;
      }
    });

    // 7) Create a second Widget with a 'refCallback' prop, which is just a
    // callback to create a reference to the pxRect element within the Widget
    // component.
    let widget2 = new Widget({
      x: 100,
      y: 200,
      w: 100,
      h: 50,
      label: 'Widget 2',
      // 8) IMPORTANT: The 'refCallback' name is arbitrary. You can name this
      // prop whatever you want.
      refCallback: rect => {
        // 9) Once again, this reference is only defined after this App
        // component has been mounted.
        this.refs.widget2Rect = rect;
      }
    });

    return new pxObject({ x: 0, y: 0 }).addChildren(widget1, widget2);
  }

  // 10) Once this component has mounted, we should have access to both of the
  // references.
  componentDidMount() {
    // 11) Since we have a reference to the first Widget component, we can call
    // its own 'animateText' method (defined within the Widget class).
    this.refs.widget1Component.animateText();
    // 12) With a reference to the pxRect within the second Widget, we can just
    // animate it directly.
    this.refs.widget2Rect.animate(
      { a: 0 },
      0.5,
      ANIMATION.TWEEN_EXP1,
      ANIMATION.OPTION_OSCILLATE,
      ANIMATION.COUNT_FOREVER
    );
  }
}

module.exports = App;
