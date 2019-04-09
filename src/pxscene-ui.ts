/**
 * Copyright 2018 Comcast Cable Communications Management, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Queue from 'promise-queue';
import { pxObject, pxsceneObject } from './objects';

// @ts-ignore
let console = global.console;
// @ts-ignore
let setTimeout = global.setTimeout;

// -------------------------------------------------------------------- //
// Module variables
// -------------------------------------------------------------------- //

/**
 * A reference to the global px object.
 * @type {Object}
 */
// @ts-ignore
const PX = px; // eslint-disable-line no-undef

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
 * A reference to the root element added to the Scene instance.
 *
 * This is used to unmount all of the components when the scene closes.
 * @type {Object}
 */
var ROOT_ELEMENT;

/**
 * A queue for making sure that updates do not overlap in their execution.
 * Updates triggered by calls to a component's setState() method are qeueued
 * so that they are processed one at a time.
 * @type {Queue}
 */
const UPDATE_QUEUE = new Queue(1, Infinity);

// -------------------------------------------------------------------- //

/** Super interface for all component props. */
export interface pxComponentProps {
  children?: Array<pxComponent<any, any> | pxObject>;
  ref?: (pxComponent) => any;
}

/** Super interface for all component state. */
export interface pxComponentState {
  __empty?: never; // This prevents the default empty state from being added to.
}

export interface Map {
  [key: string]: any;
}

/**
 * A pxComponent is a composite element which represents a combination of
 * other pxComponents and/or pxObjects.
 */
export class pxComponent<
  P extends pxComponentProps = pxComponentProps,
  S extends pxComponentState = pxComponentState
> {
  props: P;
  context: Map = {} as Map;
  refs: Map = {} as Map;
  __state: S;
  __parent: pxComponent<any, any> | pxObject = null;
  __children: Array<pxComponent<any, any> | pxObject> = [];
  __root: pxsceneObject = null;
  __error: (error) => void;
  [key: string]: any;

  constructor(props: P = {} as P) {
    // The props passed into this component.
    this.props = props;
    // The context inherited by this component from its parent.
    this.context = {};
    // Convenience container for references held by this component.
    this.refs = {};
    // The internal container for this component's state.
    this.__state = {} as S;
    // The parent element (pxComponent or pxObject) of this component.
    this.__parent = null;
    // The child elements (pxComponent or pxObject) of this component.
    this.__children = [];
    // The actual pxscene object whose tree this component is rendered under.
    this.__root = null;
    // The handler for errors within this component.
    this.__error = null;
  }

  get parentObject() {
    return this.__root.parent;
  }

  get className() {
    return this.constructor.name;
  }

  get modules() {
    return {};
  }

  set state(state: S) {
    // This setter allows the state to be set directly within the constructor.
    // This setter shall be removed by the time the component is mounted.
    this.__setInitialState(state);
  }

  get state(): S {
    return this.__state;
  }

  __setInitialState(state: S) {
    // Update the private variable.
    this.__state = Object.assign(this.__state, state);
  }

  // This is here only to provide a type declaration for setState().
  setState<K extends keyof S>(state: Pick<S, K>) {}

  addChildren(...children) {
    // Children added to a component this way will be passed as the special
    // props.children to be used by the component's render method.
    this.props.children = this.props.children || [];
    this.props.children = this.props.children.concat(children);
    return this;
  }

  getChildContext() {
    return {};
  }

  render() {
    return {};
  }

  forceUpdate() {
    // TODO It seems to improve app stability (less freezes/crashes) if we add a
    // small delay before component updates are applied. This delay hopefully
    // gives pxScene more time to 'unlock' the objects event queues before an
    // update tries to add/remove event listeners.
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 50);
    })
      .then(() => {
        UPDATE_QUEUE.add(async () => {
          // There aren't any changes in state or props.
          var nextState = calculateNextState(this, {});
          var nextProps = calculateNextProps(this, {});
          await updateComponent(this, nextProps, nextState, true);
        });
      })
      .catch(error => {
        console.error('Error updating component: ', error);
        this.__error(error);
      });
  }

  /*
   * Component lifecycle methods.
   */

  componentWillMount() {}

  componentDidMount() {}

  componentWillReceiveProps(nextProps: P) {}

  shouldComponentUpdate(nextProps: P, nextState: S) {
    return true;
  }

  componentWillUpdate(nextProps: P, nextState: S) {}

  componentDidUpdate(prevProps: P, prevState: S) {}

  componentWillUnmount() {}
}

// -------------------------------------------------------------------- //
// These methods are used for calculating the props/states of a
// component during an update.
// -------------------------------------------------------------------- //

/**
 * Calculates what a component's props would be after applying a set of proposed
 * changes.
 *
 * @param  {pxComponent} component The pxComponent to apply the changes to.
 * @param  {Object}      newProps  The proposed changes to props.
 * @return {Object}                A copy of the component's props, with the
 *                                 changes applied.
 */
function calculateNextProps(component, newProps) {
  // Return a copy of the current props, with the changes merged in.
  return Object.assign({}, component.props, newProps);
}

/**
 * Calculates what a component's state would be after applying a set of proposed
 * changes.
 * @param  {pxComponent} component The pxComponent to apply the changes to.
 * @param  {Object}      newState  The proposed changes to state.
 * @return {Object}                A copy of the component's state, with the
 *                                 changes applied.
 */
function calculateNextState(component, newState) {
  // Return a copy of the current state, with the changes merged in.
  return Object.assign({}, component.__state, newState);
}

/**
 * Replaces the current props/state of a component.
 *
 * @param  {pxComponent} component The pxComponent whose props/state to change.
 * @param  {Object}      nextProps The new props to replace the old ones with.
 * @param  {Object}      nextState The new state to replace the old one with.
 * @return {void}
 */
function applyComponentUpdates(component, nextProps, nextState) {
  component.props = nextProps;
  component.__state = nextState;
}

/**
 * Updates the state of a component.
 *
 * A pxComponent's setState() method is actually a copy of this function --
 * with the context bound to the pxComponent and the 'skipUpdate' parameter
 * curried in,
 *
 * @param {boolean} skipUpdate If true, then the state of the component shall
 *                             be updated immediately, without triggering a
 *                             full update.
 * @param {Object}  state      The changes to update the state with.
 * @return {void}
 */
function setState(skipUpdate, state) {
  if (skipUpdate) {
    // Calculate what the next state would be.
    var nextState = calculateNextState(this, state);
    // The props of this component don't change when the state changes.
    var nextProps = calculateNextProps(this, {});
    // Apply the changes immediately without triggering an update.
    applyComponentUpdates(this, nextProps, nextState);
  } else {
    // Queue a task to recursively update this component and its children.
    // TODO It seems to improve app stability (less freezes/crashes) if we add a
    // small delay before component updates are applied. This delay hopefully
    // gives pxScene more time to 'unlock' the objects event queues before an
    // update tries to add/remove event listeners.
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 50);
    })
      .then(() => {
        UPDATE_QUEUE.add(async () => {
          // Delay calculating the next props/state so that any ongoing updates
          // can be resolved first.
          var nextState = calculateNextState(this, state);
          var nextProps = calculateNextProps(this, {});
          await updateComponent(this, nextProps, nextState);
        });
      })
      .catch(error => {
        console.error('Error updating component: ', error);
        this.__error(error);
      });
  }
}

/**
 * For a given component, determines the context that should be passed onto its
 * child components.
 *
 * @param  {pxComponent} component The pxComponent to calculate the context for.
 * @return {Object}                The context object to be passed to the
 *                                 component's children.
 */
function calculateChildContext(component) {
  // Calculate the context for this component's children by merging its
  // current context with the one returned by its getChildContext() method.
  return Object.assign({}, component.context, component.getChildContext());
}

// -------------------------------------------------------------------- //
// These methods are called around the various lifecycle methods of a
// component.
// -------------------------------------------------------------------- //

function callComponentRender(component) {
  try {
    // Prevent setState() from being called within render().
    delete component.setState;
    return component.render();
  } catch (error) {
    throw error;
  } finally {
    // Re-enable the component's setState() method.
    component.setState = setState.bind(component, false);
  }
}

function callComponentWillMount(component) {
  // Redefine the component's __setInitialState method to effectively forbid
  // setting the state directly outside of the constructor.
  component.__setInitialState = () => {
    console.warn('Use "setState" to update the state of a component');
  };
  // Enable the component's setState() method for the first time.
  component.setState = setState.bind(component, false);
  component.componentWillMount();
}

function callComponentDidMount(component) {
  component.componentDidMount();
  // If the component has a function for its 'ref' props, call it now as it
  // mounts.
  const { ref = null } = component.props;
  if (typeof ref == 'function') {
    ref(component);
  }
}

function callComponentWillReceiveProps(component, nextProps) {
  try {
    // Temporarily allow setState to be called within willReceiveProps without
    // triggering any updates.
    component.setState = setState.bind(component, true);
    component.componentWillReceiveProps(nextProps);
  } catch (error) {
    throw error;
  } finally {
    component.setState = setState.bind(component, false);
  }
}

function callShouldComponentUpdate(component, nextProps, nextState) {
  // React doesn't prevent shouldComponentUpdate() from calling setState(),
  // even though doing so doesn't make much sense...
  return component.shouldComponentUpdate(nextProps, nextState);
}

function callComponentWillUpdate(component, nextProps, nextState) {
  // Prevent setState() from being called within componentWillUpdate().
  delete component.setState;
  try {
    component.componentWillUpdate(nextProps, nextState);
  } catch (error) {
    throw error;
  } finally {
    // Re-enable the component's setState() method.
    component.setState = setState.bind(component, false);
  }
}

function callComponentDidUpdate(component, prevProps, prevState) {
  component.componentDidUpdate(prevProps, prevState);
  const { ref: prevRef = null } = prevProps;
  const { ref: nextRef = null } = component.props;

  // If 'ref' now points to a different function, call null on it before
  // calling the new function.
  if (typeof prevRef == 'function' && prevRef !== nextRef) {
    prevRef(null);
  }

  // If the component has a function for its 'ref' props, call it now as it
  // updates.
  if (typeof nextRef == 'function') {
    nextRef(component);
  }
}

function callComponentWillUnmount(component) {
  // Prevent setState() from being called within componentWillUnmount().
  delete component.setState;
  component.componentWillUnmount();
}

// -------------------------------------------------------------------- //
// Methods for rendering components and objects
// -------------------------------------------------------------------- //

/**
 * Initializes the pxScene Scene instance.
 *
 * @return {Object} The initialized scene instance.
 */
async function initScene() {
  // Check if the scene has already been initialized.
  if (typeof SCENE == 'object') {
    console.info('Scene instance already initialized');
    // Just return a promise that resolves to the existing scene.
    return SCENE;
  }

  console.info('Initializing scene instance');

  /*
   * px.import() returns a promise to import the scene asynchronously.
   * Use await on the promise to keep things synchronous.
   */
  var imports = await PX.import({
    scene: 'px:scene.1.js'
  });

  if (typeof imports.scene != 'object') {
    throw new Error('Could not find "scene" object in imported modules');
  }

  // Update the module variable referencing the scene instance.
  SCENE = SCENE || imports.scene;

  // The scene instance receives an 'onClose' when it's about to close/exit.
  // Currently, only the scene instance can receive the 'onClose'.
  SCENE.on('onClose', e => {
    console.info('Scene instance closing');

    // If the scene isn't empty, then delete the root element to unmount it
    // (and all of its child components).
    if (ROOT_ELEMENT) {
      deleteElement(ROOT_ELEMENT);
      ROOT_ELEMENT = null;
    }
  });

  console.info('Scene instance initialized');

  return SCENE;
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
  return PX.import(modules).then(imports => {
    console.info('Imported modules for ' + component.className + ': ' + JSON.stringify(modules));
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
 * @param  {Object}   parent  The pxscene Object to add the new element to.
 *                            If null, then the new element shall be added as a
 *                            child to the root object of the current scene.
 * @param  {Object}   context The context that should be given to all
 *                            pxComponents in the tree headed by the rendered
 *                            element.
 * @param  {Function} onError The error handler for all elements in the tree
 *                            headed by the rendered element.
 * @return {Promise}          A promise that resolves to the rendered element.
 */
function renderElement(element, parent, context = {}, onError = null) {
  // By default, add the element to the current scene's root object.
  parent = parent || SCENE.root;

  // renderComponent() and renderObject() will recursively call this method.
  if (element instanceof pxComponent) {
    return renderComponent(element, parent, context, onError);
  } else {
    return renderObject(element, parent, context, onError);
  }
}

/**
 * Renders a pxObject element by adding pxscene objects that compose the
 * element (and all of its children) to the current scene.
 *
 * @param  {pxObject} object  The pxObject to be rendered.
 * @param  {Object}   parent  The pxscene Object to add the new element to.
 * @param  {Object}   context The context that should be given to all pxComponents
 *                            in the tree headed by the rendered pxObject.
 * @param  {Function} onError The error handler for all elements in the tree
 *                            headed by the rendered pxObject.
 * @return {Promise}          A promise that resolves to the rendered pxObject.
 */
function renderObject(object, parent, context = {}, onError = null) {
  var props = Object.assign({}, object.props);
  // Specify the correct parent before creating the new pxScene object.
  props.parent = parent;
  // Save a reference to the newly-created pxScene object.
  object.__root = SCENE.create(props);

  registerEventHandlers(object);

  // If the props include a 'ref' function, then invoke it with the new
  // pxObject.
  const { ref = null } = object.props;
  if (typeof ref == 'function') {
    ref(object);
  }

  // Continue rendering any children that the pxObject might have, with the
  // newly-created pxScene object as their parent.
  var children = object.__children;
  var promises = [];
  for (var i = 0, numChildren = children.length; i < numChildren; i++) {
    // Create a promise to render each child asynchronously.
    promises.push(renderElement(children[i], object.__root, context, onError));
  }

  // Return a promise that resolves when every child promise has resolved.
  return Promise.all(promises).then(children => {
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
 * @param  {Object}      context   The context that should be given to all
 *                                 pxComponents in the tree headed by the
 *                                 rendered pxComponent.
 * @param  {Function}    onError   The error handler for all elements in the
 *                                 tree headed by the rendered pxComponent.
 * @return {Promise}               A promise that resolves to the rendered
 *                                 pxComponent.
 */
function renderComponent(component, parent, context = {}, onError = null) {
  // Start by importing the external modules required by the component.
  return importModules(component)
    .then(component => {
      // Set the context of the new component.
      component.context = context;

      // Signal the component that its rendering is about to begin.
      callComponentWillMount(component);

      // The root element is returned by pxComponent.render().
      var rootElement = callComponentRender(component);

      // If the component has defined a componentDidCatch method, then use it as
      // the error handler for all of the elements in its tree (excluding
      // itself).
      let childOnError = onError;
      if (typeof component.componentDidCatch == 'function') {
        // Make sure to bind the function to the original component.
        childOnError = component.componentDidCatch.bind(component);
      }

      // Calculate the context for this component's children by merging its
      // current context with the one returned by its getChildContext() method.
      var childContext = calculateChildContext(component);

      // Pass the rendered root element to the next promise in the chain.
      return renderElement(rootElement, parent, childContext, childOnError);
    })
    .then(rootElement => {
      // The component's root pxscene Object must be the same as that of its
      // root element.
      component.__root = rootElement.__root;
      // The root element is just a child of the component.
      component.__children.push(rootElement);
      // Make sure that the root element has a reference to its parent element.
      rootElement.__parent = component;
      // Save a reference to the component's error boundary.
      component.__error = onError;

      // Signal the component that its rendering has finished.
      callComponentDidMount(component);
      // #if process.env.NODE_ENV !== 'production'
      console.log('componentDidMount ' + component.className);
      // #endif

      // Pass the rendered component to the next promise in the chain.
      return component;
    })
    .catch(error => {
      console.error('Error rendering component: ', error);
      if (typeof onError == 'function') {
        onError(error);
      }

      return component;
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
    if (newObject.props.hasOwnProperty(key) && newObject.__root.hasOwnProperty(key)) {
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
 * @return {(pxObject|pxComponent)}         The removed element.
 */
function deleteElement(element) {
  // Create separate promises to update the children recursively.
  for (let i = element.__children.length - 1; i >= 0; i--) {
    deleteElement(element.__children[i]);
  }

  // Delete the references to the children.
  for (let i = element.__children.length - 1; i >= 0; i--) {
    element.__children[i] = null;
  }

  if (element instanceof pxObject) {
    unregisterEventHandlers(element);
  } else {
    callComponentWillUnmount(element);
  }

  // If the element has a function for its 'ref' props, call it now as it
  // unmounts. Pass 'null' to cleanup any references held by parents.
  // This applies to pxComponents as well as pxObjects.
  const { ref = null } = element.props;
  if (typeof ref == 'function') {
    ref(null);
  }

  // Delete the reference to the pxScene object.
  element.__root.remove();
  element.__root = null;

  // Pass the removed object to any promises down the chain.
  return element;
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
 * @param  {Object}                 context    The context that should be given
 *                                             to all pxComponents in the tree
 *                                             headed by the new element.
 * @param  {Function}               onError    The error handler for all
 *                                             elements in the tree headed by
 *                                             the new element.
 * @return {Promise}            A promise that resolves to the new element.
 */
function replaceElement(oldElement, newElement, context = {}, onError = null) {
  var parent = oldElement.__parent;

  // Identify the pxScene object that the element is a child of.
  var parentObj = oldElement.parentObject;

  // Find the target element within its parent's children array.
  for (var i = parent.__children.length - 1; i >= 0; i--) {
    if (parent.__children[i] === oldElement) {
      // Remove the outgoing element first.
      // This allows any outgoing pxComponents to free up existing 'refs' before
      // any new 'refs' are created.
      return new Promise((resolve, reject) => {
        try {
          deleteElement(oldElement);
          resolve();
        } catch (error) {
          console.error('Error removing element: ', error);
          reject(error);
        }
      })
        .then(() => {
          // Then render the new element.
          return renderElement(newElement, parentObj, context, onError);
        })
        .then(() => {
          // Explicitly mark the outgoing element for GC.
          parent.__children[i] = null;
          // Insert the new element in its place.
          parent.__children[i] = newElement;

          // Make sure that the root element has a reference to its parent element.
          newElement.__parent = parent;
          // Pass the new object to any promises down the chain.
          return newElement;
        })
        .catch(error => onError(error));
    }
  }

  throw new Error('Could not find element to replace within parent');
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
 * @param  {Object}                 context    The context that should be given
 *                                             to all pxComponents in the tree
 *                                             headed by the updated element.
 * @param  {Function}               onError    The error handler for all
 *                                             elements in the tree headed by
 *                                             the updated element.
 * @return {Promise}            A promise that resolves to the updated element.
 */
async function updateElement(oldElement, newElement, context = {}, onError = null) {
  // Check trivial case where the class of the element has changed.
  if (oldElement.className !== newElement.className) {
    // Just re-create the entire object tree.
    return await replaceElement(oldElement, newElement, context, onError);
  }

  // updateComponent() and updateObject() will recursively call this method.
  if (oldElement instanceof pxComponent) {
    var nextProps = Object.assign({}, newElement.props);

    // Signal the component that new props are incoming.
    // NOTE: componentWillReceiveProps() is allowed to call setState() without
    // triggering actual updates.
    callComponentWillReceiveProps(oldElement, nextProps);

    var nextState = Object.assign({}, oldElement.__state);
    return await updateComponent(oldElement, nextProps, nextState);
  } else {
    return await updateObject(oldElement, newElement, context, onError);
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
 * @param  {Object}   context   The context that should be given to all
 *                              pxComponents in the tree headed by the updated
 *                              pxObject.
 * @param  {Function} onError   The error handler for all elements in the tree
 *                              headed by the updated pxObject.
 * @return {Promise}            A promise that resolves to the updated object.
 */
async function updateObject(oldObject, newObject, context = {}, onError = null) {
  // TODO For now, just re-create the entire object tree if the number of
  // children has changed.
  if (oldObject.__children.length !== newObject.__children.length) {
    // Pass the updated object to any promises down the chain.
    return await replaceElement(oldObject, newObject, context, onError);
  }

  // For simplcity's sake, unregister any active event handlers first.
  unregisterEventHandlers(oldObject);

  updateObjectProps(oldObject, newObject);

  // Register any new/changed event handlers.
  registerEventHandlers(newObject);

  // Create separate promises to update the children recursively.
  var promises = [];
  for (var i = oldObject.__children.length - 1; i >= 0; i--) {
    promises.push(
      updateElement(oldObject.__children[i], newObject.__children[i], context, onError)
    );
  }
  newObject.__children = oldObject.__children;

  // HACK This is to force the JS engine to resolve all of the promises even
  // though none of them are doing anything truly asynchronous.
  promises.push(
    new Promise((resolve, reject) => {
      setTimeout(() => {
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
 * @param  {boolean}     force     If true, then the update shall bypass the
 *                                 shouldComponentUpdate method.
 * @return {Promise}               A promise that resolves to the updated
 *                                 component.
 */
async function updateComponent(component, nextProps, nextState, force = false) {
  // First check if the old component's root element has been removed.
  // Since all updates are queued and processed one at a time, this can happen
  // if the old component was removed by its parent while a subsequent update is
  // still in flight.
  var oldElement = component.__children[0];
  if (oldElement === null) {
    // Do nothing.
    return component;
  }

  // Make copies of the component's state/props before any changes are applied.
  var prevProps = Object.assign({}, component.props);
  var prevState = Object.assign({}, component.__state);

  // TODO Possible optimization through comparison of props/state.

  // shouldComponentUpdate() is called whenever new state/props is received.
  if (!force && !callShouldComponentUpdate(component, nextProps, nextState)) {
    // If the component decided to skip the update, just apply the changes.
    applyComponentUpdates(component, nextProps, nextState);

    // Pass the component to any promises down the chain.
    return component;
  }

  // Signal the component that an update is imminent.
  callComponentWillUpdate(component, nextProps, nextState);

  applyComponentUpdates(component, nextProps, nextState);

  // Prepare to update the component's root element with any changes that
  // might be reflected in the new root element returned by render().
  var newElement = callComponentRender(component);

  // We'll need to pass the component context to updateElement(), in case a
  // child component needs to be replaced.
  var childContext = calculateChildContext(component);

  // If the component has defined a componentDidCatch method, then use it as
  // the error handler for all of the elements in its tree (excluding
  // itself).
  let childOnError = component.__error;
  if (typeof component.componentDidCatch == 'function') {
    // Make sure to bind the function to the original component.
    childOnError = component.componentDidCatch.bind(component);
  }

  // Recursively update the component's root element.
  // Once this update is complete, we know that the component and all of its
  // children have been updated.
  await updateElement(oldElement, newElement, childContext, childOnError);
  // Signal the component that its update has finished.
  callComponentDidUpdate(component, prevProps, prevState);
  // #if process.env.NODE_ENV !== 'production'
  console.log('componentDidUpdate ' + component.className);
  // #endif

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
 *                          If null or undefined, then the new element shall be
 *                          added as a child to the root object of the current
 *                          scene.
 * @return {void}
 */
export var render = async function(
  element: pxObject | pxComponent<any, any>,
  parent: pxsceneObject = null
) {
  // This await is needed here.
  await initScene();

  // Queue the render job to prevent updates from taking place before
  // the components have mounted.
  UPDATE_QUEUE.add(async () => {
    // Update the reference to the root element in the scene.
    ROOT_ELEMENT = await renderElement(element, parent, {}, () => {
      // Errors not handled by any error boundaries shall result in the deletion
      // of the entire tree.
      deleteElement(ROOT_ELEMENT);
      ROOT_ELEMENT = null;
    });
  });
};

/**
 * Creates a font resource that can be shared.
 * This is basically a wrapper around the Scene.create(..) method.
 *
 * @param  {Object} props The properties used to create the resource (url,
 *                        proxy, etc).
 * @return {Object}       The pxScene fontResource object created.
 */
export var createFontResource = function(props) {
  props.t = 'fontResource';
  return SCENE.create(props);
};

/**
 * Creates an image resource that can be shared.
 * This is basically a wrapper around the Scene.create(..) method.
 *
 * @param  {Object} props The properties used to create the resource (url,
 *                        proxy, w, h, etc).
 * @return {Object}       The pxScene imageResource object created.
 */
export var createImageResource = function(props) {
  props.t = 'imageResource';
  return SCENE.create(props);
};

/**
 * Returns basic info on the current scene.
 *
 * @return {Object}     The 'info' object from the current scene. Returns
 *                      'undefined' if the scene has not been created yet.
 */
export var getSceneInfo = function() {
  // Return a copy of the 'info' object if scene has been created.
  return typeof SCENE == 'object' ? Object.assign({}, SCENE.info) : undefined;
};

/**
 * Returns the current width of the scene.
 *
 * @return {number}     The width in pixel-sized units of the scene. Returns
 *                      'undefined' if the scene has not been created yet.
 */
export var getSceneWidth = function() {
  return typeof SCENE == 'object' ? SCENE.w : undefined;
};

/**
 * Returns the current height of the scene.
 *
 * @return {number}     The height in pixel-sized units of the scene. Returns
 *                      'undefined' if the scene has not been created yet.
 */
export var getSceneHeight = function() {
  return typeof SCENE == 'object' ? SCENE.h : undefined;
};

// -------------------------------------------------------------------- //
// Public constants
// -------------------------------------------------------------------- //

// NOTE The following are just re-definitions for the various constants defined
// by the pxScene API. Ideally, these values would be retrieved directly from
// the Scene object. But that could only be done during runtime and only after
// the Scene object has been created. These definitions make it possible for
// developer modules to import the same constant values that are defined at
// build time.
export var ALIGN_HORIZONTAL = { LEFT: 0, CENTER: 1, RIGHT: 2 };
export var ALIGN_VERTICAL = { TOP: 0, CENTER: 1, BOTTOM: 2 };
export var ANIMATION = {
  STATUS_ENDED: 3,
  STATUS_CANCELLED: 2,
  STATUS_INPROGRESS: 1,
  STATUS_IDLE: 0,
  COUNT_FOREVER: -1,
  OPTION_REWIND: 16,
  OPTION_FASTFORWARD: 8,
  OPTION_LOOP: 2,
  OPTION_OSCILLATE: 1,
  EASE_OUT_BOUNCE: 10,
  EASE_OUT_ELASTIC: 9,
  EASE_IN_ELASTIC: 8,
  EASE_IN_BACK: 7,
  EASE_IN_CUBIC: 6,
  EASE_IN_QUAD: 5,
  TWEEN_STOP: 4,
  TWEEN_EXP3: 3,
  TWEEN_EXP2: 2,
  TWEEN_EXP1: 1,
  TWEEN_LINEAR: 0
};
export var STRETCH = { NONE: 0, STRETCH: 1, REPEAT: 2 };
export var TRUNCATION = { NONE: 0, TRUNCATE: 1, TRUNCATE_AT_WORD: 2 };

// -------------------------------------------------------------------- //
// Module exports
// -------------------------------------------------------------------- //

export * from './objects';
