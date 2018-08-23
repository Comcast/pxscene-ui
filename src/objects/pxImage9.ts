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

import { pxObject, pxObjectProps, pxsceneObject } from './pxObject';

/**
 * A pxImage9 serves as a stand-in for the actual pxScene Image9 instance
 * that it represents.
 */
export class pxImage9 extends pxObject {
  __root: pxsceneImage9 = null;

  constructor(props: pxImage9Props = {} as pxImage9Props) {
    super(props);
    this.props.t = 'image9';
  }

  /**
   * Getters for read-only pxScene Image9 properties.
   */

  get ready() {
    return this.__root.ready;
  }

  /**
   * Getters/setters for pxScene Image9 properties.
   */

  set url(url) {
    this.__root.url = url;
  }

  get url() {
    return this.__root.url;
  }

  set insetLeft(insetLeft) {
    this.__root.insetLeft = insetLeft;
  }

  get insetLeft() {
    return this.__root.insetLeft;
  }

  set insetTop(insetTop) {
    this.__root.insetTop = insetTop;
  }

  get insetTop() {
    return this.__root.insetTop;
  }

  set insetRight(insetRight) {
    this.__root.insetRight = insetRight;
  }

  get insetRight() {
    return this.__root.insetRight;
  }

  set insetBottom(insetBottom) {
    this.__root.insetBottom = insetBottom;
  }

  get insetBottom() {
    return this.__root.insetBottom;
  }

  set resource(resource) {
    this.__root.resource = resource;
  }

  get resource() {
    return this.__root.resource;
  }
}

// -------------------------------------------------------------------- //
// Type definitions
// -------------------------------------------------------------------- //

/** The props for creating pxImage9 instances. */
export interface pxImage9Props extends pxObjectProps {
  url?: String;
  insetLeft?: number;
  insetTop?: number;
  insetRight?: number;
  insetBottom?: number;
  resource?: Object;
}

/** The underlying pxScene Image9 instance to be managed through pxsceneUI. */
export interface pxsceneImage9 extends pxsceneObject {
  url: String;
  insetLeft: number;
  insetTop: number;
  insetRight: number;
  insetBottom: number;
  resource: Object;
  ready: Promise<any>;
}
