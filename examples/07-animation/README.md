An example for creating animations.

GOALS:
* Show how to animate pxScene objects via pxScene's built-in animation API.
* Introduce the React lifecycle method componentWillUpdate.
* Show an example for handling the onFocus event.

NOTES:
* This builds on the previous example for managing component focus.
* We'll use animations to move the widgets around the screen.
* A widget now gradually fades out when it loses focus; it gradually fades in when it regains focus.
* This example shows just one of the possible approaches to implementing the animations. As with React components in general, it's possible to perform the same animations using a different combination of lifecycle methods and/or event handlers.
* *webpack.config.js* now has a new rule that runs all JavaScript files through a linter during build time. Any linting errors shall be printed to the console.
* Since we're using ESLint as our linter, *package.json* now lists it as a dev dependency along with the Webpack loader for supporting ESLint.
* There's a new *.eslintrc* file in the project folder that ESLint requires. This file also allows editors like Atom to flag potential errors.
