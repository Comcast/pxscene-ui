const px2react = require('px2react');
// 1) This imports the new HelloWorld component module.
const HelloWorld = require('HelloWorld');

// TODO This ugly promise workaround is necessary because the App constuctor
// makes calls to the PxScene module which requires the underlying scene to be
// initialized. This promise has to stay here until the pxScene API provides a
// synchronous version of import().
px2react.then(function() {
  px2react.render(
    // 2) The HelloWorld component now contains the same pxText that was drawn
    // in the previous example.
    new HelloWorld()
  );
});
