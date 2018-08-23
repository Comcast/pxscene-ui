An example for integrating with TypeScript.

Unlike most other examples, this one starts out with multiple TypeScript errors that prevent the project from building. It's intended as a minor exercise to resolve those errors.

pxsceneUI supports TypeScript as of v2.0.0. However, this is optional and it will remain possible to create plain old JavaScript projects with pxsceneUI v2.0.0 and beyond.

GOALS:

* Show how to provide type declarations for a component's props.
* Show how to provide type declarations for a component's state.
* Show how to create a project with mixed TypeScript and JavaScript source files.
* Show how to update the various configuration files to support TypeScript.

NOTES:

* Type declarations for component props follow React's pattern for TypeScript (instead of using the more traditional prop-types library).
* <i>index.js</i> is purposely left as a <i>.js</i> file as an example for building projects with mixed sources.
* There's a lot going on in this example that involve the configuration files. If you're already familiar with configuring a project for TypeScript, feel free to skip those files.
