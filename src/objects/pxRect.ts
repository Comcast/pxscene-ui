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
 * A pxRect serves as a stand-in for the actual pxScene Rectangle instance
 * that it represents.
 */
export class pxRect extends pxObject {
  __root: pxsceneRect = null;

  constructor(props: pxRectProps = {} as pxRectProps) {
    super(props);
    this.props.t = 'rect';
  }

  /**
   * Getters/setters for pxScene Rectangle properties.
   */

  set fillColor(fillColor) {
    this.__root.fillColor = fillColor;
  }

  get fillColor() {
    return this.__root.fillColor;
  }

  set lineColor(lineColor) {
    this.__root.lineColor = lineColor;
  }

  get lineColor() {
    return this.__root.lineColor;
  }

  set lineWidth(lineWidth) {
    this.__root.lineWidth = lineWidth;
  }

  get lineWidth() {
    return this.__root.lineWidth;
  }
}

// -------------------------------------------------------------------- //
// Type definitions
// -------------------------------------------------------------------- //

/** The props for creating pxRect instances. */
export interface pxRectProps extends pxObjectProps {
  fillColor?: number;
  lineColor?: number;
  lineWidth?: number;
}

/** The underlying pxScene Rect instance to be managed through pxsceneUI. */
export interface pxsceneRect extends pxsceneObject {
  fillColor: number;
  lineColor: number;
  lineWidth: number;
}
