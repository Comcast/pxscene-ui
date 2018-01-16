This is a more interesting "Hello World" example that makes use of React-style component modules.

GOALS:
* Create a HelloWorld component class that renders a text object onscreen.
* Modify *index.js* to render an instance of the HelloWorld component instead of rendering the text object directly.

NOTES:
* There's a new entry in the 'resolve.modules' field within *webpack.config.js*. This instructs Webpack to look in the current directory for modules such as HelloWorld.js.
