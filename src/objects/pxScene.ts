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
 * A pxScene serves as a stand-in for the actual pxScene Scene instance
 * that it represents.
 */
export class pxScene extends pxObject {
  __root: pxsceneScene = null;

  constructor(props: pxSceneProps = {} as pxSceneProps) {
    super(props);
    this.props.t = 'scene';
  }

  /**
   * Getters for read-only pxScene Scene properties.
   */

  get ready() {
    return this.__root.ready;
  }

  /**
   * Getters/setters for pxScene Scene properties.
   */

  set url(url) {
    this.__root.url = url;
  }

  get url() {
    return this.__root.url;
  }
}

// -------------------------------------------------------------------- //
// Type definitions
// -------------------------------------------------------------------- //

/** The props for creating pxScene instances. */
export interface pxSceneProps extends pxObjectProps {
  url?: String;
}

/** The underlying pxScene Scene instance to be managed through pxsceneUI. */
export interface pxsceneScene extends pxsceneObject {
  url: String;
  ready: Promise<any>;
}