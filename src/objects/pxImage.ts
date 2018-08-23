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
 * A pxImage serves as a stand-in for the actual pxScene Image instance
 * that it represents.
 */
export class pxImage extends pxObject {
  __root: pxsceneImage = null;

  constructor(props: pxImageProps = {} as pxImageProps) {
    super(props);
    this.props.t = 'image';
  }

  /**
   * Getters for read-only pxScene Image properties.
   */

  get ready() {
    return this.__root.ready;
  }

  /**
   * Getters/setters for pxScene Image properties.
   */

  set url(url) {
    this.__root.url = url;
  }

  get url() {
    return this.__root.url;
  }

  set stretchX(stretchX) {
    this.__root.stretchX = stretchX;
  }

  get stretchX() {
    return this.__root.stretchX;
  }

  set stretchY(stretchY) {
    this.__root.stretchY = stretchY;
  }

  get stretchY() {
    return this.__root.stretchY;
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

/** The props for creating pxImage instances. */
export interface pxImageProps extends pxObjectProps {
  url?: String;
  stretchX?: number;
  stretchY?: number;
  resource?: Object;
}

/** The underlying pxScene Image instance to be managed through pxsceneUI. */
export interface pxsceneImage extends pxsceneObject {
  url: String;
  stretchX: number;
  stretchY: number;
  resource: Object;
  ready: Promise<any>;
}
