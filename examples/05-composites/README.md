An example of high-order components consisting of child components.

GOALS:
* Show how to use a root element to hold the children of a composite component.
* Show how to handle mouse-click events.
* Introduce z-ordering.

NOTES:
* Clicking on a widget now toggles its color between red and white.
* Also shows how to minify the final *bundle.js* file (eg. for production environments). This makes use of the MinifyPlugin for Babel, which *package.json* declares as a dependency. We enable the plugin by adding it to the build configuration in *webpack.config.js*.
