const px2react = require('px2react');
const pxText = px2react.pxText;

// TODO This ugly promise workaround is necessary because the App constuctor
// makes calls to the PxScene module which requires the underlying scene to be
// initialized. This promise has to stay here until the pxScene API provides a
// synchronous version of import().
px2react.then(function() {
  // 1) px2react.render() serves as the entry point for every px2react app.
  // 2) px2react.render() takes a single element as an argument. This element
  // can either be a pxObject (which correspond to Object classes supported by
  // the pxScene API) or a pxComponent (which we will cover later).
  // 3) This illustrates the absolute minimum for a px2react app. The app draws
  // a single object -- in this case, a text object.
  px2react.render(
    // 4) As a rule, the JSON parameter passed to the constuctor of a pxObject
    // (in this case, a pxText) is identical to the JSON that you would pass to
    // the Scene.create() method for creating the corresponding pxScene object.
    new pxText({
      x: 50,
      y: 50,
      text: 'Hello World!',
      textColor: 0xffff00ff,
      pixelSize: 24
    })
  );
});
