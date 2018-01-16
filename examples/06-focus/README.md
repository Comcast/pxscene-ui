An example for managing focus across multiple components.

GOALS:
* Introduce React lifecycle methods like componentDidMount and componentDidUpdate.
* Introduce px2react's implementation of the 'refs' feature from React.
* Show how to use 'refs' to directly access the properties of the underlying pxScene objects.
* Show an example for handling the onBlur event.

NOTES:
* This builds on the previous example for high-order components.
* Clicking on a widget gives it keyboard focus and removes focus from the other widget.
* Use directional keys to move the focused widget around the screen.
* Adds a new 'build-prod' script to *package.json* so that 'npm run build-prod' builds the app for the production environment. This script simply defines the NODE_ENV environment variable before running Webpack.
* Re-configures Webpack (*webpack.config.js*) to only minify the bundled app for the production environment.
