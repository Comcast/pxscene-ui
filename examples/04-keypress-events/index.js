const px2react = require('px2react');
const HelloWorld = require('HelloWorld');

// TODO This ugly promise workaround is necessary because the App constuctor
// makes calls to the PxScene module which requires the underlying scene to be
// initialized. This promise has to stay here until the pxScene API provides a
// synchronous version of import().
px2react.then(function() {
  px2react.render(
    new HelloWorld({
      xPos: 150,
      yPos: 150,
      text: 'Hello World!',
      color: 0xffff00ff,
      fontSize: 24
    })
  );
});