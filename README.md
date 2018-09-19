# pxscene-ui

This library provides the means to create UI components within **pxScene** (aka Spark) apps using patterns from **ReactJS**.

- [Introduction](#introduction)
  - [Features](#features)
  - [Caveats](#caveats)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Examples](#examples)
- [Documentation](#documentation)
  - [Supported React Features](#supported-react-features)
    - [Lifecycle Methods](#lifecycle-methods)
    - [Error Boundaries](#error-boundaries)
    - [Other React APIs](#other-react-apis)
    - [Refs](#refs)
    - [Context](#context)
    - [Instance Properties](#instance-properties)
  - [APIs Specific to pxscene-ui](#apis-specific-to-pxscene-ui)
    - [pxComponent Class](#pxcomponent-class)
    - [pxObject Classes](#pxobject-classes)
    - [Building Object Trees](#building-object-trees)
    - [Adding Children to Components](#adding-children-to-components)
    - [Event Handling](#event-handling)
    - [Animations](#animations)
    - [Other APIs](#other-apis)
  - [TypeScript Support](#typescript-support)
- [Additional Resources](#additional-resources)
- [TODOs](#todos)
- [Contributing](#contributing)
- [Credits](#credits)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Introduction

Since most frontend libraries assume a browser-based environment, we can't really use an existing one for pxScene development. Rather than re-creating the wheel from scratch, my goal was to apply industry-standard patterns to the development of pxScene apps. React is one such pattern, whose well-defined rules and behaviors made it a prime candidate for me to base a pxScene library on.

### Features

- Familiar React API & patterns using ES6 classes.
- Supports TypeScript (types included).
- Optional add-on for integration with Redux.

### Caveats

- **This is NOT ReactJS.** This library is original work based on publicly-available documentation for ReactJS.
- **This is NOT React-Native.** This library acts as a simple layer which translates (during runtime) the React patterns into objects and calls defined by the pxScene API.
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

You should look over the [pxScene API](http://www.pxscene.org/docs/apis/) as well. Familiarize yourself with the basic UI elements, their respective properties, and how they can be manipulated.

### Installation

Install the [pxscene-ui package](https://www.npmjs.com/package/pxscene-ui) from NPM and add it as a dependency to your project.

```
npm install --save-dev pxscene-ui
```

### Examples

Examples for helping you get started can be found in the [examples folder](./examples).

## Documentation

### Supported React Features

While pxscene-ui is not a direct clone of React, it does try to support the more popular React features, using the same syntax whenever possible. Unless otherwise noted, the behaviors for these features should mirror those of their React counterparts. For this reason, most of the documentation below comes straight from React's own documentation.

_NOTE: React has designated some of these as "legacy" APIs since version 12. In fact, React v16 introduced **numerous** breaking changes._

- [Lifecycle Methods](#lifecycle-methods)
- [Error Boundaries](#error-boundaries)
- [Other React APIs](#other-react-apis)
- [Refs](#refs)
- [Context](#context)
- [Instance Properties](#instance-properties)

#### Lifecycle Methods

##### render()

> The render() method is the only required method in a class component. It must return an instance of a [pxObject](#pxobject-classes) or [pxComponent](#pxcomponent-class).

_NOTE: boolean, null, and array return values are currently unsupported._

##### constructor()

```
constructor(props)
```

> The constructor for a component is called before it is mounted. You should call `super(props)` before any other statement within the constructor.
>
> Typically, constructors are only needed for two purposes:
>
> - To initialize the component instance's state by assigning an object to `this.state`.
> - To bind event handler methods to an instance of the component.

##### componentWillMount()

```
componentWillMount()
```

> componentWillMount() is invoked just before mounting occurs. It is called before `render()`.
>
> Avoid introducing any side-effects or subscriptions in this method. For those use cases, use `componentDidMount()` instead.

##### componentDidMount()

```
componentDidMount()
```

> `componentDidMount()`` is invoked immediately after a component is mounted (added to the current scene). Initialization that requires pxScene objects should go here. If you need to load data from a remote endpoint, this is a good place to instantiate the network request.
>
> You may call `setState()` immediately in `componentDidMount()`.

##### componentWillReceiveProps()

```
componentWillReceiveProps(nextProps)
```

> `componentWillReceiveProps()` is invoked before a mounted component receives new props. If you need to update the state in response to prop changes (for example, to reset it), you may compare this.props and nextProps and perform state transitions using `this.setState()` in this method.

##### shouldComponentUpdate()

```
shouldComponentUpdate(nextProps, nextState)
```

> Use `shouldComponentUpdate()` to let pxscene-ui know if a component’s output is not affected by the current change in state or props.
>
> `shouldComponentUpdate()` is invoked before rendering when new props or state are being received. Defaults to true. This method is not called for the initial render or when `forceUpdate()` is used.

##### componentWillUpdate()

```
componentWillUpdate(nextProps, nextState)
```

> `componentWillUpdate()` is invoked just before rendering when new props or state are being received. Use this as an opportunity to perform preparation before an update occurs. This method is not called for the initial render.
>
> Note that you cannot call `this.setState()` here; nor should you do anything else (e.g. dispatch a Redux action) that would trigger an update to a component before `componentWillUpdate()` returns.

##### componentDidUpdate()

```
componentDidUpdate(prevProps, prevState)
```

> `componentDidUpdate()` is invoked immediately after updating occurs. This method is not called for the initial render.
>
> You may call `setState()` immediately in `componentDidUpdate()`.

##### componentWillUnmount()

```
componentWillUnmount()
```

> `componentWillUnmount()` is invoked immediately before a component is unmounted and destroyed. Perform any necessary cleanup in this method, such as invalidating timers, canceling network requests, or cleaning up any subscriptions that were created in `componentDidMount()`.
>
> You should not call `setState()` in `componentWillUnmount()` because the component will never be re-rendered. Once a component instance is unmounted, it will never be mounted again.

#### Error Boundaries

> Error boundaries are components that catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI instead of the component tree that crashed. Error boundaries catch errors during rendering, in lifecycle methods, and in constructors of the whole tree below them.
>
> A class component becomes an error boundary if it defines the `componentDidCatch()` lifecycle method.
> This method is called when there is an error during rendering, in a lifecycle method, or in the constructor of any child component.

```
componentDidCatch(error)
```

> Error boundaries only catch errors in the components below them in the tree. An error boundary can’t catch an error within itself.

#### Other React APIs

Unlike the lifecycle methods above (which pxscene-ui calls for you), the methods below are the methods you can call from your components.

##### setState()

```
setState(nextState)
```

Merges `nextState` (a JavaScript object) with the current state. This is the primary method you use to trigger UI updates from event handlers and server request callbacks.

##### forceUpdate()

```
forceUpdate()
```

> By default, when your component’s state or props change, your component will re-render. If your `render()` method depends on some other data, you can tell pxscene-ui that the component needs re-rendering by calling `forceUpdate()`.
>
> Calling `forceUpdate()` will cause `render()` to be called on the component, skipping `shouldComponentUpdate()`.

#### Refs

Refs provide a way to access pxScene objects or pxscene-ui components created in the `render()` method.

There are a few good use cases for `refs`:

- Managing focus.
- Triggering imperative animations.

Avoid using refs for anything that can be done declaratively.

##### Adding a Ref to a pxScene Object

Pass a function as the `ref` property when you invoke the constructor for a `pxObject`. This function receives the reference to the new object, which it can then save as just another variable within the context of the calling component instance.

_NOTE: pxscene-ui passes `null` to the `ref` function when the referenced object has been removed._

_Example:_

```javascript
render() {
  return new pxText({
    a: 1,
    text: 'Hello World',
    focus: false,
    ref: obj => {
      this.refs.textRef = obj; // Saves a reference to the pxScene text object.
    }
  });
}

componentDidUpdate(prevProps) {
  if (this.props.focused !== prevProps.focused) {
    // Manage the focus based on the new props.
    this.refs.textRef.focus = this.props.focused;
  }
  this.refs.textRef.text = 'Goodbye World'; // Manipulate the pxScene object directly.
  this.refs.textRef.animate({ a: 0 }, 0.5); // Trigger an animation.
}
```

##### Adding a Ref to a Class Component

Pass a function as the `ref` property when you invoke the constructor for a `pxComponent`. This function receives the reference to the new component, which it can then save as just another variable within the context of the calling component instance.

_NOTE: pxscene-ui passes `null` to the `ref` function when the referenced component has been unmounted._

_Example:_

```javascript
render() {
  return new MyComponent({
    prop1: 'foo',
    prop2: 'bar',
    ref: comp => {
      this.refs.compRef = comp; // Saves a reference to the component instance.
    }
  });
}

componentDidUpdate() {
  this.refs.compRef.somePublicMethod(); // Invokes a public method of MyComponent.
}
```

#### Context

> Context provides a way to pass data through the component tree without having to pass props down manually at every level.
>
> Context is designed to share data that can be considered “global” for a tree of components, such as the current authenticated user, theme, or preferred language.

For pxscene-ui apps, the context API is useful for passing down font/image resources that can be created once, then shared by multiple components that require them.

A component class can become a context provider simply by overriding the `getChildContext()` class method, where `getChildContext()` returns a map that represents the context to be passed on to the component's children.

Any component in the context provider's child component tree can then access the context through `this.context`.

_NOTE: By implementing its own `getChildContext()` method, a component can override the context that it receives from its parent and pass a different one to its own children._

_Example:_

```javascript
// The context provider.
class ParentComponent extends pxComponent {
  getChildContext() {
    return {
      boldFont: createFontResource({
        url: 'http://myserver.com/resources/fonts/XfinityStandard-Bold.ttf'
      }),
      logoImage: createImageResource({
        url: 'http://myserver.com/resources/images/logo.png'
      })
    };
  }
}

// The context consumer, to be instantiated within ParentComponent's tree.
class ChildComponent extends pxComponent {
  render() {
    const { boldFont, logoImage } = this.context; // Shared resources are in the context.

    return new pxObject().addChildren(
      new pxText({ text: 'Hello World', font: boldFont }),
      new pxImage({ resource: logoImage })
    );
  }
}
```

#### Instance Properties

##### props

> `this.props` contains the props that were defined by the caller of this component.

`this.props.children` is a special prop. It represents the array of children that are this component's direct descendants (See [Adding Children to Components](#adding-children-to-components)).

##### state

> The state contains data specific to this component that may change over time. The state is user-defined, and it should be a plain JavaScript object.
>
> Never mutate `this.state` directly, as calling `setState()` afterwards may replace the mutation you made. Treat `this.state` as if it were immutable.

### APIs Specific to pxscene-ui

This section covers patterns that are specific to pxscene-ui and not necessarily reflective of React (or even pxScene).

#### pxComponent Class

The `pxComponent` class is simply the pxscene-ui version of `React.component`. All component classes in pxscene-ui must extend `pxComponent`.

Instantiate a component by calling its constructor directly, passing in a map containing any props that the component might require.

_Example:_

```javascript
import { pxComponent } from 'pxscene-ui';

class MyComponent extends pxComponent {
  // Component code
}

new MyComponent({ prop1: 'foo', prop2: 'bar' });
```

#### pxObject Classes

Just as React maintains virtual DOM elements for an HTML app, pxscene-ui maintains virtual objects for a pxScene app. These virtual objects are implemented as a collection of `pxObject` classes.

In the absence of a markup language such as JSX, pxscene-ui requires that `render()` methods "declare" pxScene objects by returning instances of these virtual objects. This is similar to using `React.createElement()` instead of JSX in React apps.

For every object type defined by the pxScene API, there is a corresponding pxscene-ui `pxObject` class:

- pxObject
- pxRect
- pxText
- pxTextBox
- pxImage
- pxImage9
- pxWayland

These classes have the same inheritance hierarchy as their pxScene counterparts. They also support the same properties and methods.

Instantiate a virtual pxScene object with its respective class constructor. Initialize the object's properties by calling the constructor with a map of the desired values. Properties which are not explicitly initialized take on their default values.

For example, the following code creates a virtual pxScene textBox with default position (x = 0, y = 0):

```javascript
import { pxTextBox } from 'pxscene-ui'; // All pxObject classes are exported by the module.

new pxTextBox({
  w: 100,
  h: 25,
  text: 'Hello World'
});
```

#### Building Object Trees

Call the `addChildren()` method of a `pxObject` instance to add other `pxObject` and/or `pxComponent` instances as its children. `addChildren()` accepts zero or more arguments, where each argument is an instance of `pxObject` or `pxComponent`, and adds the children in the order that they are passed.

_Example:_

```javascript
let parent = new pxObject({ x: 0, y: 0 });
let childText1 = new pxText({ x: 0, y: 10, text: '1st Child' });
let childText2 = new pxText({ x: 0, y: 30, text: '2nd Child' });
let childComp = new MyComponent();

parent.addChildren(childText1, childText2, childComp);
```

#### Adding Children to Components

Call the `addChildren()` method of a `pxComponent` instance to add other `pxObject` and/or `pxComponent` instances as its children. `addChildren()` accepts zero or more arguments, where each argument is an instance of `pxObject` or `pxComponent`, and adds the children in the order that they are passed.

_Example:_

```javascript
let parent = new MyComponent();
let childText1 = new pxText({ x: 0, y: 10, text: '1st Child' });
let childText2 = new pxText({ x: 0, y: 30, text: '2nd Child' });
let childComp = new ChildComponent();

parent.addChildren(childText1, childText2, childComp);
```

You can also add child elements to a `pxComponent` instance by passing them (in an array) via the `children` props to the component.

_Example:_

```javascript
let childText1 = new pxText({ x: 0, y: 10, text: '1st Child' });
let childText2 = new pxText({ x: 0, y: 30, text: '2nd Child' });
let childComp = new ChildComponent();

let parent = new MyComponent({ children: [childText1, childText2, childComp] });
```

#### Event Handling

Similar to React, you can attach an event handler to a pxScene object by passing it as a function attribute.

_NOTE: A pxScene object can only receive events if it or a child object within its tree has focus (i.e. its `focus` property is set to `true`)._

_Example:_

```javascript
class MyComponent extends pxComponent {
  render() {
    return new pxRect({
      w: 50,
      h: 25,
      fillColor: 0xff0000ff,
      ref: rect => (this.refs.rect = rect),
      onMouseDown: this.onMouseDownHandler.bind(this) // Bind the function to the correct context.
    });
  }

  onMouseDownHandler() {
    this.refs.rect.fillColor = 0x00ff00ff;
  }
}
```

These are the supported events:

- onMouseDown
- onMouseUp
- onMouseMove
- onMouseEnter
- onMouseLeave
- onFocus
- onBlur
- onKeyDown
- onKeyUp
- onChar
- onResize

#### Animations

The current pattern for animating UI elements is to do so imperatively: by first creating a `ref` to a pxScene object within `render()`, and then manipulating that object directly through the reference (in one of the lifecycle methods).

_NOTE: This is analogous to a React HTML app creating a `ref` to a DOM element, and then manipulating that element directly with something like jQuery. Admittedly, this isn't very clean or declarative._

_NOTE: See the [Refs](#refs) section for more details on creating React-style `refs` in pxscene-ui._

Through the object reference, you can call the pxScene animation methods (either `animate()` or `animateTo()`). You can also just alter the object's properties directly.

_Example:_

```javascript
render() {
  return new pxText({
    x: 0,
    y: 0,
    a: 1,
    text: 'Hello World',
    ref: obj => {
      this.refs.text = obj; // Saves a reference to the pxScene text object.
    }
  });
}

componentDidUpdate() {
  this.refs.text.x = 50; // Have the text jump immediately to the target position.
  this.refs.text.animate({ a: 0 }, 0.5); // Slowly fade out the text.
}
```

#### Other APIs

The pxscene-ui module exports a handful of other functions/variables.

##### pxScene Constants

The pxscene-ui module exports the following constants defined by the pxScene API (along with their nested values):

- ALIGN_HORIZONTAL
- ALIGN_VERTICAL
- ANIMATION
- STRETCH
- TRUNCATION

_Example:_

```javascript
import { ALIGN_HORIZONTAL } from 'pxscene-ui'; // Import the exported constant.
const { LEFT, CENTER, RIGHT } = ALIGN_HORIZONTAL; // Destructure the nested values.
```

##### createFontResource()

Creates an font resource that can be shared. This is basically a wrapper around the `Scene.create(..)` method defined in the pxScene API.

_Example:_

```javascript
import { pxText, createFontResource } from 'pxscene-ui';

let boldFont = createFontResource({
  url: 'http://myserver.com/resources/fonts/XfinityStandard-Bold.ttf'
});

new pxText({ text: 'Hello World', font: boldFont });
```

##### createImageResource()

Creates an image resource that can be shared. This is basically a wrapper around the `Scene.create(..)` method defined in the pxScene API.

_Example:_

```javascript
import { pxImage, createImageResource } from 'pxscene-ui';

let logoImage = createImageResource({
  url: 'http://myserver.com/resources/images/logo.png'
});

new pxImage({ resource: logoImage });
```

##### getSceneInfo()

Returns the `info` property of the root scene. Returns `undefined` if the scene has not been created yet.

##### getSceneWidth()

Returns the current width (in pixels) of the root scene. Returns `undefined` if the scene has not been created yet.

##### getSceneHeight()

Returns the current height (in pixels) of the root scene. Returns `undefined` if the scene has not been created yet.

#### TypeScript Support

The pxscene-ui module includes the type definitions necessary for creating class components in TypeScript.

Type-checking is automatically applied to the lifecycle methods within the class component.

To add type-checking to the `props` of a component, you must first define an interface for the props. This interface must extend `pxsceneUI.pxComponentProps`. For `state`, you must define an interface that extends `pxsceneUI.pxComponentState`.

```typescript
import { pxComponentProps, pxComponentState } from 'pxscene-ui';

interface WidgetProps extends pxComponentProps {
  x: number;
  y: number;
}

interface WidgetState extends pxComponentState {
  selected: boolean;
}
```

You then declare your component class as follows:

```typescript
class Widget extends pxComponent<WidgetProps, WidgetState> {
  // Check the type of the props that the constructor is called with.
  constructor(props: WidgetProps) {
    super(props);
  }
}
```

_NOTE: If your component class implements a constructor method, then make sure to declare the type of its `props` argument as well._

You're not required to provide types for either `props` or `state`.

In the following example, we only care about type-checking the component's `state`:

```typescript
class Widget extends pxComponent<any, WidgetState> {
  // ...
}
```

We can even leave type-checking out altogether:

```typescript
class Widget extends pxComponent<any, any> {
  // ...
}
```

...which is just equivalent to:

```typescript
class Widget extends pxComponent {
  // ...
}
```

## Additional Resources

## TODOs

- ~~Create README.~~
- Improve algorithm for detecting changes to an element's list of children.
- Create function to replace direct calls to constructors (à la `React.createElement()`).
- Create a markup for declaring elements in `render()`.

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Credits

- **Harry Hur** (https://github.com/hhur200) - _Creator and maintainer_

## License

This project is licensed under the Apache 2.0 License. See [LICENSE](./LICENSE) for details.

## Acknowledgments

- **Jordan Walke** - For creating React, a powerful yet surprisingly "simple" library (simple enough for someone like me to even attempt a facsimile of it).
- **Preact** - For giving me the idea that a React clone was even remotely feasible.
- **Connie Fry** - For tirelessly supporting pxScene app devs, especially those of us who do weird and unexpected stuff.
- **Val Apgar** - For allowing me the freedom to do weird and unexpected stuff (at work).
