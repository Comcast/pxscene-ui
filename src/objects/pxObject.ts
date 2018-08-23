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

/**
 * A pxObject serves as a stand-in for the actual pxScene Object instance
 * that it represents: it aims to provide a transparent interface to the
 * underlying pxScene object, as well as hold the data used to create and
 * update the pxScene object. A pxObject also provides the means to compare
 * multiple possible states of a pxScene object without having to create or
 * alter actual instances of that object.
 */

export class pxObject {
  props: pxObjectProps;
  __parent: Object = null;
  __children: Object[] = [];
  __root: pxsceneObject = null;

  constructor(props: pxObjectProps = {} as pxObjectProps) {
    this.props = props;
    this.props.t = 'object';
  }

  get className() {
    return this.constructor.name;
  }

  addChildren(...children) {
    this.__children = this.__children.concat(children);
    return this;
  }

  /**
   * Getters for read-only pxScene Object properties.
   */

  get parentObject() {
    return this.__root.parent;
  }

  get numChildren() {
    return this.__root.numChildren;
  }

  get children() {
    return this.__root.children;
  }

  /**
   * Getters/setters for pxScene Object properties.
   */

  set x(x) {
    this.__root.x = x;
  }

  get x() {
    return this.__root.x;
  }

  set y(y) {
    this.__root.y = y;
  }

  get y() {
    return this.__root.y;
  }

  set w(w) {
    this.__root.w = w;
  }

  get w() {
    return this.__root.w;
  }

  set h(h) {
    this.__root.h = h;
  }

  get h() {
    return this.__root.h;
  }

  set cx(cx) {
    this.__root.cx = cx;
  }

  get cx() {
    return this.__root.cx;
  }

  set cy(cy) {
    this.__root.cy = cy;
  }

  get cy() {
    return this.__root.cy;
  }

  set sx(sx) {
    this.__root.sx = sx;
  }

  get sx() {
    return this.__root.sx;
  }

  set sy(sy) {
    this.__root.sy = sy;
  }

  get sy() {
    return this.__root.sy;
  }

  set a(a) {
    this.__root.a = a;
  }

  get a() {
    return this.__root.a;
  }

  set r(r) {
    this.__root.r = r;
  }

  get r() {
    return this.__root.r;
  }

  set id(id) {
    this.__root.id = id;
  }

  get id() {
    return this.__root.id;
  }

  set interactive(interactive) {
    this.__root.interactive = interactive;
  }

  get interactive() {
    return this.__root.interactive;
  }

  set painting(painting) {
    this.__root.painting = painting;
  }

  get painting() {
    return this.__root.painting;
  }

  set clip(clip) {
    this.__root.clip = clip;
  }

  get clip() {
    return this.__root.clip;
  }

  set mask(mask) {
    this.__root.mask = mask;
  }

  get mask() {
    return this.__root.mask;
  }

  set draw(draw) {
    this.__root.draw = draw;
  }

  get draw() {
    return this.__root.draw;
  }

  set focus(focus) {
    this.__root.focus = focus;
  }

  get focus() {
    return this.__root.focus;
  }

  /**
   * Wrappers for pxScene Object methods.
   */

  getChild(i) {
    return this.__root.getChild(i);
  }

  remove() {
    this.__root.remove();
  }

  removeAll() {
    this.__root.removeAll();
  }

  moveToFront() {
    this.__root.moveToFront();
  }

  moveToBack() {
    this.__root.moveToBack();
  }

  moveForward() {
    this.__root.moveForward();
  }

  moveBackward() {
    this.__root.moveBackward();
  }

  animate(json, duration, tween, type, count) {
    return this.__root.animate(json, duration, tween, type, count);
  }

  animateTo(json, duration, tween, type, count) {
    return this.__root.animateTo(json, duration, tween, type, count);
  }

  getObjectById(id) {
    return this.__root.getObjectById(id);
  }
}

// -------------------------------------------------------------------- //
// Type definitions
// -------------------------------------------------------------------- //

/** The props for creating pxObject instances. */
export interface pxObjectProps {
  t?: String;
  id?: String;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  cx?: number;
  cy?: number;
  sx?: number;
  sy?: number;
  a?: number;
  r?: number;
  interactive?: boolean;
  painting?: boolean;
  clip?: boolean;
  mask?: boolean;
  draw?: boolean;
  focus?: boolean;
  ref?: (pxsceneObject) => any;
  onMouseDown?: (Object) => any;
  onMouseUp?: (Object) => any;
  onMouseMove?: (Object) => any;
  onMouseEnter?: (Object) => any;
  onMouseLeave?: (Object) => any;
  onFocus?: (Object) => any;
  onBlur?: (Object) => any;
  onKeyDown?: (Object) => any;
  onKeyUp?: (Object) => any;
  onChar?: (Object) => any;
  onResize?: (Object) => any;
}

/** The underlying pxScene Object instance to be managed through pxsceneUI. */
export interface pxsceneObject {
  t: String;
  id: String;
  x: number;
  y: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
  sx: number;
  sy: number;
  a: number;
  r: number;
  interactive: boolean;
  painting: boolean;
  clip: boolean;
  mask: boolean;
  draw: boolean;
  focus: boolean;
  parent: pxsceneObject;
  numChildren: number;
  children: pxsceneObject[];
  getChild: (number) => pxsceneObject;
  remove: () => void;
  removeAll: () => void;
  moveToFront: () => void;
  moveToBack: () => void;
  moveForward: () => void;
  moveBackward: () => void;
  getObjectById: (String) => pxsceneObject;
  animate: (
    json: Object,
    duration: number,
    tween: number,
    type: number,
    count: number
  ) => Object;
  animateTo: (
    json: Object,
    duration: number,
    tween: number,
    type: number,
    count: number
  ) => Promise<any>;
}
