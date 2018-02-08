An example for creating common fading transitions to update displayed content.

GOALS:
* Show how to use two otherwise-identical elements to fade out old content and fade in new content.
* Show how to use componentWillUnmount to cleanup after a component once it's been destroyed.

NOTES:
* We'll again be using the 'ref' feature (shown in previous examples) to animate the underlying pxScene elements.
* This is just one possible approach for creating such transitions. The point is that transition animations boil down to identifying the appropriate lifecycle method(s) to use for initiating the animations.
* *webpack.config.js* now runs an additional plugin to copy static image resources to the build folder. This allows the webpack-dev-server to host the resources when we run 'npm run start'.
