var Queue = require('promise-queue');

// -------------------------------------------------------------------- //
// Module variables
// -------------------------------------------------------------------- //

/**
 * A reference to the global px object.
 * @type {Object}
 */
// eslint-disable-next-line no-undef
const PX = px;

/**
 * The names of the events that objects can register handlers for.
 * @type {Array.<string>}
 */
const EVENTS = [
  'onMouseDown',
  'onMouseUp',
  'onMouseMove',
  'onMouseEnter',
  'onMouseLeave',
  'onFocus',
  'onBlur',
  'onKeyDown',
  'onKeyUp',
  'onChar',
  'onResize'
];

/**
 * A reference to the active pxScene Scene instance.
 * @type {Object}
 */
var SCENE;

/**
 * A queue for making sure that updates do not overlap in their execution.
 * Updates triggered by calls to a component's setState() method are qeueued
 * so that they are processed one at a time.
 * @type {Queue}
 */
const UPDATE_QUEUE = new Queue(1, Infinity);

// -------------------------------------------------------------------- //

class pxObject {
  constructor(props) {
    this.props = props || {};
    this.props.t = 'object';
    this.__parent = null;
    this.__children = [];
    this.__root = null;
  }

  get className() {
    return this.constructor.name;
  }

  addChildren(...children) {
    this.__children = this.__children.concat(children);
    return this;
  }

  set a(a) {
    this.__root.a = a;
  }

  get a() {
    return this.__root.a;
  }

  set focus(focus) {
    this.__root.focus = focus;
  }

  get focus() {
    return this.__root.focus;
  }

  animate(json, duration, tween, type, count) {
    this.__root.animate(json, duration, tween, type, count);
  }
}

class pxRect extends pxObject {
  constructor(props) {
    super(props);
    this.props.t = 'rect';
  }
}

class pxText extends pxObject {
  constructor(props) {
    super(props);
    this.props.t = 'text';
  }

  set text(text) {
    this.__root.text = text;
  }

  get text() {
    return this.__root.text;
  }

  set textColor(textColor) {
    this.__root.textColor = textColor;
  }

  get textColor() {
    return this.__root.textColor;
  }
}

class pxTextBox extends pxText {
  constructor(props) {
    super(props);
    this.props.t = 'textBox';
  }
}

class pxImage extends pxObject {
  constructor(props) {
    super(props);
    this.props.t = 'image';
  }
}

// -------------------------------------------------------------------- //

/**
 * A pxComponent is a composite element which represents a combination of
 * other pxComponents and/or pxObjects.
 */
class pxComponent {
  constructor(props) {
    this.props = props || {};
    this.__state = {};
    this.__parent = null;
    this.__children = [];
    this.__root = null;
    this.__refs = {};

    // By default, calling setState triggers an automatic update.
    this.setState = this.__setState.bind(this, false);
  }

  get className() {
    return this.constructor.name;
  }

  get modules() {
    return {};
  }

  set state(state) {
    // Allow the state to be set directly only once.
    // For now, assume that this only happens in the component's constructor.
    this.__setInitialState(state);
  }

  get state() {
    return this.__state;
  }

  get refs() {
    return this.__refs;
  }

  __setInitialState(state) {
    // Update the private variable.
    this.__state = state;
    // Redefine this method so that it can't be used again to set the state.
    this.__setInitialState = function() {
      console.warn('Use "setState" to update the state of a component');
    };
  }

  async __setState(skipUpdate, state) {
    // Calculate what the next state would be.
    var nextState = Object.assign({}, this.__state, state);
    // The props of this component don't change when the state changes.
    var nextProps = Object.assign({}, this.props);

    if (skipUpdate) {
      this.__applyUpdates(nextProps, nextState);
    } else {
      // Queue a task to recursively update this component and its children.
      UPDATE_QUEUE.add(
        async function() {
          await updateComponent(this, nextProps, nextState);
        }.bind(this)
      ).catch(
        function(error) {
          console.error('Error updating ' + this.className + ': ' + error);
        }.bind(this)
      );
    }
  }

  __applyUpdates(nextProps, nextState) {
    this.props = nextProps;
    this.__state = nextState;
  }

  __componentWillReceiveProps(nextProps) {
    // Temporarily allow setState to be called within willReceiveProps without
    // triggering any updates.
    this.setState = this.__setState.bind(this, true);
    this.componentWillReceiveProps(nextProps);
    this.setState = this.__setState.bind(this, false);
  }

  __sendComponentWillUpdate(nextProps, nextState) {
    // Prevent setState() from being called within componentWillUpdate().
    delete this.setState;
    this.componentWillUpdate(nextProps, nextState);
    this.__applyUpdates(nextProps, nextState);
    // Re-enable this component's setState() method.
    this.setState = this.__setState.bind(this, false);
  }

  addChildren(...children) {
    // Children added to a component will be passed as props.
    this.props.children = this.props.children || [];
    this.props.children = this.props.children.concat(children);
    return this;
  }

  render() {
    return {};
  }

  /*
   * Component lifecycle methods.
   */

  componentWillMount() {}

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentWillUpdate(nextProps, nextState) {}

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}
}

// -------------------------------------------------------------------- //
// Methods for rendering components and objects
// -------------------------------------------------------------------- //

/**
 * Initializes the pxScene Scene instance.
 *
 * @return {Promise} A promise that resolves to the initialized scene instance.
 */
function initScene() {
  // Check if the scene has already been initialized.
  if (typeof SCENE == 'object') {
    console.info('Scene instance already initialized');
    // Just return a promise that resolves to the existing scene.
    return Promise.resolve(SCENE);
  }

  console.info('Initializing scene instance');

  /*
   * Return a promise that imports the scene asynchronously through px.
   * This is the only way to create the root scene instance.
   */
  return PX.import({
    scene: 'px:scene.1.js'
  }).then(function(imports) {
    if (typeof imports.scene != 'object') {
      return Promise.reject(
        'Could not find "scene" object in imported modules'
      );
    }

    // Update the module variable referencing the scene instance.
    SCENE = SCENE || imports.scene;
    console.info('Scene instance initialized');

    // Pass the scene to any promises down the chain.
    return SCENE;
  });
}

/**
 * Imports the external modules required by a component.
 *
 * Once a module is successfully imported, a reference to the module is added
 * as a property of the component.
 *
 * @param  {pxComponent} component The pxComponent instance.
 * @return {Promise}               A promise that resolves to the component.
 */
function importModules(component) {
  // Determine the JS modules to import for the component.
  var modules = component.modules || {};
  if (Object.keys(modules).length === 0) {
    // Nothing to import.
    return Promise.resolve(component);
  }

  console.info('Importing modules for ' + component.className);

  /*
   * Import the modules asynchronously through px.
   * This is the only way for components to import supported modules
   * such as 'ws' and 'https'.
   */
  return PX.import(modules).then(function(imports) {
    console.info(
      'Imported modules for ' +
        component.className +
        ': ' +
        JSON.stringify(modules)
    );
    // Add imported module references directly to the component.
    attachModules(component, imports);

    // Pass the updated component to any promises down the chain.
    return component;
  });
}

/**
 * Adds imported modules to a component by defining them as properties of the
 * component.
 *
 * @param  {pxComponent}  component The pxComponent instance.
 * @param  {Map.<Object>} modules   A collection of name-to-object mappings for
 *                                  for the modules imported for the component.
 * @return {void}
 */
function attachModules(component, modules) {
  for (var key in modules) {
    // Make sure to add only modules that were declared by the component's
    // modules property.
    if (component.modules.hasOwnProperty(key)) {
      // Add a reference to the module as a property within the component.
      component[key] = modules[key];
      console.info('Attached "' + key + '" module to ' + component.className);
    }
  }
}

/**
 * Registers an object's callback functions for the events that they're meant
 * to handle.
 *
 * @param  {pxObject} object The pxObject instance whose callback functions are
 *                           to be registered.
 * @return {void}
 */
function registerEventHandlers(object) {
  // Only register callbacks for supported events.
  for (var i = EVENTS.length - 1; i >= 0; i--) {
    // Callback functions should have the same name as the events that they're
    // meant to handle.
    var eventName = EVENTS[i];

    // The callback functions should be defined within the object's props.
    if (typeof object.props[eventName] === 'function') {
      // Register the callback via the pxscene API.
      object.__root.on(eventName, object.props[eventName]);
    }
  }
}

/**
 * Renders an element (pxObject or pxComponent) by adding pxscene objects
 * that compose the element (and all of its children) to the current scene.
 *
 * @param  {(pxObject|pxComponent)} element The element to be rendered.
 * @param  {Object} parent  The pxscene Object to add the new element to.
 *                          If null, then the new element shall be added as a
 *                          child to the root object of the current scene.
 * @return {Promise}        A promise that resolves to the rendered element.
 */
function renderElement(element, parent) {
  // By default, add the element to the current scene's root object.
  parent = parent || SCENE.root;

  // renderComponent() and renderObject() will recursively call this method.
  if (element instanceof pxComponent) {
    return renderComponent(element, parent);
    // return renderComponent(element, parent);
  } else {
    return renderObject(element, parent);
  }
}

/**
 * Renders a pxObject element by adding pxscene objects that compose the
 * element (and all of its children) to the current scene.
 *
 * @param  {pxObject} object  The pxObject to be rendered.
 * @param  {Object}   parent  The pxscene Object to add the new element to.
 * @return {Promise}          A promise that resolves to the rendered pxObject.
 */
function renderObject(object, parent) {
  var props = Object.assign({}, object.props);
  // Specify the correct parent before creating the new pxScene object.
  props.parent = parent;
  // Save a reference to the newly-created pxScene object.
  object.__root = SCENE.create(props);

  registerEventHandlers(object);

  // Continue rendering any children that the pxObject might have, with the
  // newly-created pxScene object as their parent.
  var children = object.__children;
  var promises = [];
  for (var i = 0, numChildren = children.length; i < numChildren; i++) {
    // Create a promise to render each child asynchronously.
    promises.push(renderElement(children[i], object.__root));
  }

  // Return a promise that resolves when every child promise has resolved.
  return Promise.all(promises).then(function(children) {
    // Make sure that each child element has a reference to its parent element.
    for (var c = children.length - 1; c >= 0; c--) {
      children[c].__parent = object;
    }
    // Pass the rendered object to any promises down the chain.
    return object;
  });
}

/**
 * Renders a pxComponent element by adding pxscene objects that compose the
 * element (and all of its children) to the current scene.
 *
 * @param  {pxComponent} component The pxComponent to be rendered.
 * @param  {Object}      parent    The pxscene Object to add the new element to.
 * @return {Promise}               A promise that resolves to the rendered
 *                                 pxComponent.
 */
function renderComponent(component, parent) {
  // Start by importing the external modules required by the component.
  return importModules(component)
    .then(function(component) {
      // Signal the component that its rendering is about to begin.
      component.componentWillMount();

      // The root element is returned by pxComponent.render().
      var rootElement = component.render();

      // Pass the rendered root element to the next promise in the chain.
      return renderElement(rootElement, parent);
    })
    .then(function(rootElement) {
      // Make sure that the component retains references to both its root
      // element and its root pxscene object.
      component.__root = rootElement.__root;
      component.__children.push(rootElement);

      // Make sure that the root element has a reference to its parent element.
      rootElement.__parent = component;

      // Signal the component that its rendering has finished.
      console.log('componentDidMount ' + component.className);
      component.componentDidMount();

      // Pass the rendered component to the next promise in the chain.
      return component;
    })
    .catch(function(error) {
      console.error(
        'Failed to render component ' + component.className + ': ' + error
      );
    });
}

// -------------------------------------------------------------------- //
// Methods for updating components and objects
// -------------------------------------------------------------------- //

/**
 * Unregisters an object's callback functions from the events that they're
 * meant to handle.
 *
 * @param  {pxObject} object The pxObject instance whose callback functions are
 *                           to be unregistered.
 * @return {void}
 */
function unregisterEventHandlers(object) {
  // Only unregister callbacks for supported events.
  for (var i = EVENTS.length - 1; i >= 0; i--) {
    // Callback functions should have the same name as the events that they're
    // meant to handle.
    var eventName = EVENTS[i];

    // The callback functions should be defined within the object's props.
    if (typeof object.props[eventName] === 'function') {
      // Unregister the callback via the pxscene API.
      // FIXME delListener doesn't seem to do anything.
      // This is likely causing a memory leak.
      object.__root.delListener(eventName, object.props[eventName]);
    }
  }
}

function updateObjectProps(oldObject, newObject) {
  // Copy essential pxObject properties from old into new.
  newObject.__parent = oldObject.__parent;
  newObject.__root = oldObject.__root;

  // Apply the updated props to the underlying pxscene object.
  for (var key in newObject.props) {
    // Only update properties that the pxscene object already has.
    if (
      newObject.props.hasOwnProperty(key) &&
      newObject.__root.hasOwnProperty(key)
    ) {
      newObject.__root[key] = newObject.props[key];
    }
  }

  return newObject;
}

/**
 * Deletes an element (pxObject or pxComponent) by removing pxscene objects
 * that compose the element (and all of its children) from the current scene.
 *
 * @param  {(pxObject|pxComponent)} element The element to be removed.
 * @return {(pxObject|pxComponent)}         A promise that resolves to the
 *                                          removed element.
 */
function deleteElement(element) {
  // Create separate promises to update the children recursively.
  var promises = [];
  for (var i = element.__children.length - 1; i >= 0; i--) {
    promises.push(deleteElement(element.__children[i]));
  }

  // Return a promise that resolves when every child promise has resolved.
  return Promise.all(promises).then(function() {
    if (element instanceof pxObject) {
      unregisterEventHandlers(element);
    } else {
      element.componentWillUnmount();
    }
    element.__root.remove();
    // Pass the removed object to any promises down the chain.
    return element;
  });
}

/**
 * Replaces an element (pxObject or pxComponent) by removing it (and all its
 * children) from the scene, and then re-creating a new tree of elements in
 * its place.
 *
 * @param  {(pxObject|pxComponent)} oldElement The element to be removed (along
 *                                             with any children).
 * @param  {(pxObject|pxComponent)} newElement The element to be created (along
 *                                             with any children) in the
 *                                             original's place.
 * @return {Promise}            A promise that resolves to the new element.
 */
function replaceElement(oldElement, newElement) {
  var parent = oldElement.__parent;

  // Find the target element within its parent's children array.
  for (var i = parent.__children.length - 1; i >= 0; i--) {
    if (parent.__children[i] === oldElement) {
      // First render the new element.
      return renderElement(newElement, parent.__root.parent)
        .then(function() {
          // Remove the outgoing element.
          return deleteElement(oldElement);
        })
        .then(function() {
          // Update the reference to the root pxscene object.
          parent.__root = newElement.__root;

          // Explicitly mark the outgoing element for GC.
          parent.__children[i] = null;
          // Insert the new element in its place.
          parent.__children[i] = newElement;

          // Make sure that the root element has a reference to its parent element.
          newElement.__parent = parent;
          // Pass the new object to any promises down the chain.
          return newElement;
        });
    }
  }

  return Promise.reject('Could not find element to replace within parent');
}

/**
 * Updates an element (pxObject or pxComponent) and all of its children in
 * response to potential changes to their properties (the result of state/props
 * changes in a parent component). May re-render, replace or delete elements in
 * the process.
 *
 * @param  {(pxObject|pxComponent)} oldElement The element to be updated.
 * @param  {(pxObject|pxComponent)} newElement The new element that the existing
 *                                             one should be updated to.
 * @return {Promise}            A promise that resolves to the updated element.
 */
async function updateElement(oldElement, newElement) {
  // Check trivial case where the class of the element has changed.
  if (oldElement.className !== newElement.className) {
    // Just re-create the entire object tree.
    return await replaceElement(oldElement, newElement);
  }

  // updateComponent() and updateObject() will recursively call this method.
  if (oldElement instanceof pxComponent) {
    var nextProps = Object.assign({}, newElement.props);

    // Signal the component that new props are incoming.
    // NOTE: componentWillReceiveProps() is allowed to call setState().
    oldElement.__componentWillReceiveProps(nextProps);

    var nextState = Object.assign({}, oldElement.__state);
    return await updateComponent(oldElement, nextProps, nextState);
  } else {
    return await updateObject(oldElement, newElement);
  }
}

/**
 * Updates a pxObject element and all of its children in response to potential
 * changes to their properties (the result of state/props changes in a parent
 * component). May re-render, replace or delete elements in the process.
 *
 * @param  {pxObject} oldObject The pxObject instance to update.
 * @param  {pxObject} newObject The pxObject instance that contains the
 *                              properties that the existing instance should be
 *                              updated to.
 * @return {Promise}            A promise that resolves to the updated object.
 */
async function updateObject(oldObject, newObject) {
  // TODO For now, just re-create the entire object tree if the number of
  // children has changed.
  if (oldObject.__children.length !== newObject.__children.length) {
    // Pass the updated object to any promises down the chain.
    return await replaceElement(oldObject, newObject);
  }

  // For simplcity's sake, unregister any active event handlers first.
  unregisterEventHandlers(oldObject);

  updateObjectProps(oldObject, newObject);

  // Register any new/changed event handlers.
  // FIXME Disabling this until unregisterEventHandlers is fixed.
  // registerEventHandlers(newObject);

  // Create separate promises to update the children recursively.
  var promises = [];
  for (var i = oldObject.__children.length - 1; i >= 0; i--) {
    promises.push(
      updateElement(oldObject.__children[i], newObject.__children[i])
    );
  }
  newObject.__children = oldObject.__children;

  // HACK This is to force the JS engine to resolve all of the promises even
  // though none of them are doing anything truly asynchronous.
  promises.push(
    new Promise(function(resolve, reject) {
      setTimeout(function() {
        resolve();
      }, 1);
    })
  );
  // End HACK

  await Promise.all(promises);

  // Pass the updated object to any promises down the chain.
  return newObject;
}

/**
 * Updates a pxComponent element and all of its children in response to
 * potential changes to the state/props of the component. May re-render,
 * replace or delete elements in the process.
 *
 * @param  {pxComponent} component The pxComponent instance to update.
 * @param  {Object}      nextProps The new props values being passed in to
 *                                 this component.
 * @param  {Object}      nextState The incoming changes to the state of this
 *                                 component.
 * @return {Promise}               A promise that resolves to the updated
 *                                 component.
 */
async function updateComponent(component, nextProps, nextState) {
  // Make copies of the component's state/props before any changes are applied.
  var prevProps = Object.assign({}, component.props);
  var prevState = Object.assign({}, component.__state);

  // TODO Possible optimization through comparison of props/state.

  // shouldComponentUpdate() is called whenever new state/props is received.
  if (!component.shouldComponentUpdate(nextProps, nextState)) {
    // If the component decided to skip the update, just apply the changes.
    component.__applyUpdates(nextProps, nextState);

    // Pass the component to any promises down the chain.
    return component;
  }

  // Signal the component that an update is imminent.
  component.__sendComponentWillUpdate(nextProps, nextState);

  // Prepare to update the component's root element with any changes that
  // might be reflected in the new root element returned by render().
  var oldElement = component.__children[0];
  var newElement = component.render();

  // Recursively update the component's root element.
  // Once this update is complete, we know that the component and all of its
  // children have been updated.
  await updateElement(oldElement, newElement);
  // Signal the component that its update has finished.
  component.componentDidUpdate(prevProps, prevState);

  // Pass the updated component to any promises down the chain.
  return component;
}

// -------------------------------------------------------------------- //
// Public methods
// -------------------------------------------------------------------- //

/**
 * Adds an element (pxObject or pxComponent) and any children it may have
 * to the current scene, creating the tree of pxscene Object instances headed
 * by the element in the process.
 *
 * An app should only call this method once to add its root element.
 *
 * @param  {(pxObject|pxComponent)} element The element to add.
 * @param  {Object} parent  The pxscene Object to add the new element to.
 *                          If null, then the new element shall be added as a
 *                          child to the root object of the current scene.
 * @return {void}
 */
var render = function(element, parent) {
  initScene()
    .then(function(scene) {
      // Queue the render job to prevent updates from taking place before
      // the components have mounted.
      UPDATE_QUEUE.add(async function() {
        await renderElement(element, parent);
      });
    })
    .catch(function(error) {
      console.error(error);
    });
};

module.exports.render = render;
module.exports.pxComponent = pxComponent;
module.exports.pxObject = pxObject;
module.exports.pxRect = pxRect;
module.exports.pxText = pxText;
module.exports.pxTextBox = pxTextBox;
module.exports.pxImage = pxImage;