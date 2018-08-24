# pxscene-ui

This library provides the means to create UI components within **pxScene** (aka Spark) apps using patterns from **ReactJS**.

## Features

- Familiar React API & patterns using ES6 classes.
- Supports TypeScript (types included).
- Optional add-on for integration with Redux.

## Caveats

- **This is NOT ReactJS.** This library is original work based on publicly-available documentation for ReactJS.
- **This is NOT React-Native.** This library is a simple layer which translates (during runtime) the React patterns into objects and calls defined by the pxScene API.
- **JSX is not supported.** You currently have to declare pxScene objects through ES6 class constructors.
- **CSS is not supported.** You must style the pxScene objects directly.

## Getting Started

### Prerequisites

#### NPM

You must have [NPM](https://www.npmjs.com/get-npm) installed in your development environment.

#### ReactJS

You should be familiar with React concepts such as components, state, props, rendering, and lifecycle methods. If you already know how to create HTML apps with React, then you're ready to create pxScene apps with pxscene-ui.

There are countless resources for React, but the [official React site](https://reactjs.org/) is a good place to start.

#### pxScene

You should look over the [pxScene API](http://www.pxscene.org/docs/apis/) as well. Familiarize yourself with the basic UI elements, their respective properties, and how they can be animated.

### Installation

Install the [pxscene-ui package](https://www.npmjs.com/package/pxscene-ui) from NPM and add it as a dependency to your project.

```
npm install --save-dev pxscene-ui
```

### Examples

Examples for helping you get started can be found at https://github.com/Comcast/pxscene-ui/tree/develop/examples.
