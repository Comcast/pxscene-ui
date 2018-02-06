const px2react = require('px2react');
const pxObject = px2react.pxObject;
const pxImage = px2react.pxImage;

// 1) Our example app will basically cycle through this array of URLs for the
// image to display.
const pictures = [
  'http://localhost:8080/resources/images/cat01.jpeg',
  'http://localhost:8080/resources/images/cat02.jpeg',
  'http://localhost:8080/resources/images/cat03.jpeg',
  'http://localhost:8080/resources/images/cat04.jpeg',
  'http://localhost:8080/resources/images/cat05.jpeg'
];

// 2) NOTE: There is a known pxScene bug where the onClose event overrides
// global functions including 'clearInterval'. We're just going to save a
// reference to 'clearInterval' so that we can call it later.
const clearIntervalBackup = clearInterval;

class App extends px2react.pxComponent {
  constructor(props) {
    super(props);

    // 3) Keep a state of the current index within the pictures array, as well
    // as the URLs to use for the outgoing and incoming frames.
    this.state = {
      currIndex: 0, // Initialize the current index.
      outgoingUrl: null, // Show nothing in the initial outgoing frame.
      incomingUrl: pictures[0] // Show the first picture in the incoming frame.
    };
  }

  render() {
    const { outgoingUrl, incomingUrl } = this.state;

    // 4) Create a frame for the outgoing picture. We'll fade this one out as
    // we fade in the frame for the incoming picture.
    let outgoingBuffer = new pxImage({
      w: 640,
      h: 480,
      stretchX: 1,
      stretchY: 1,
      url: outgoingUrl,
      // 5) The outgoing frame will always start out with an alpha of 1.
      a: 1,
      ref: image => {
        this.refs.outgoing = image;
      }
    });

    // 6) Create a frame for the incoming picture. We'll fade this one in as
    // we fade out the frame for the outgoing picture.
    let incomingBuffer = new pxImage({
      w: 640,
      h: 480,
      stretchX: 1,
      stretchY: 1,
      url: incomingUrl,
      // 7) The incoming frame will always start out with an alpha of 0.
      a: 0,
      ref: image => {
        this.refs.incoming = image;
      }
    });

    return new pxObject({ x: 100, y: 100 }).addChildren(
      outgoingBuffer,
      incomingBuffer
    );
  }

  componentDidMount() {
    // 8) When the App first mounts, we immediately set the outgoing frame's
    // alpha to 0. Since its image URL is initialized to null, there's nothing
    // to show and hence nothing to fade out.
    this.refs.outgoing.a = 0;
    // 9) Animate the incoming frame to fade it in.
    this.refs.incoming.animate({ a: 1 }, 0.5);

    // 10) Start a timer to update the image URLs to display.
    this.refreshTimer = setInterval(
      // 11) In a real-world application, we might have a function here that
      // determines which image URL to use through a library call or some other
      // external service.
      // 12) Our example here just increments the array index every few seconds.
      function() {
        let nextIndex = this.state.currIndex + 1;
        if (nextIndex >= pictures.length) {
          nextIndex = 0;
        }

        // 13) Update the state accordingly.
        this.setState({
          currIndex: nextIndex,
          outgoingUrl: this.state.incomingUrl,
          incomingUrl: pictures[nextIndex]
        });
      }.bind(this), // 13) IMPORTANT: bind() is your best friend!
      3000
    );
  }

  componentDidUpdate(prevProps, prevState) {
    // 14) Fade out the outgoing frame since it's been updated to show the
    // previous image URL.
    this.refs.outgoing.animate({ a: 0 }, 0.5);
    // 15) Fade in the incoming frame since it's been updated to show the
    // next image URL.
    this.refs.incoming.animate({ a: 1 }, 0.5);
  }

  componentWillUnmount() {
    // 16) When App is destroyed, don't forget to stop the timer.
    clearIntervalBackup(this.refreshTimer);
  }
}

module.exports = App;
