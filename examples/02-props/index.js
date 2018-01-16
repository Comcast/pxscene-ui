const px2react = require('px2react');
const HelloWorld = require('HelloWorld');

// TODO This ugly promise workaround is necessary because the App constuctor
// makes calls to the PxScene module which requires the underlying scene to be
// initialized. This promise has to stay here until the pxScene API provides a
// synchronous version of import().
px2react.then(function() {
  px2react.render(
    // 1) Attributes previously hard-coded within the HelloWorld component
    // shall now be passed into the component as props.
    // 2) The default constructor for the pxComponent class accepts an optional
    // JSON object that holds any props which the component may need.
    new HelloWorld({
      xPos: 50,
      yPos: 50,
      text: 'Hello World!',
      color: 0xffff00ff,
      fontSize: 24
    })
  );
});
