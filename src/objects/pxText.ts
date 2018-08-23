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
 * A pxText serves as a stand-in for the actual pxScene Text instance
 * that it represents.
 */
export class pxText extends pxObject {
  __root: pxsceneText = null;

  constructor(props: pxTextProps = {} as pxTextProps) {
    super(props);
    this.props.t = 'text';
  }

  /**
   * Getters for read-only pxScene Text properties.
   */

  get ready() {
    return this.__root.ready;
  }

  /**
   * Getters/setters for pxScene Text properties.
   */

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

  set pixelSize(pixelSize) {
    this.__root.pixelSize = pixelSize;
  }

  get pixelSize() {
    return this.__root.pixelSize;
  }

  set fontUrl(fontUrl) {
    this.__root.fontUrl = fontUrl;
  }

  get fontUrl() {
    return this.__root.fontUrl;
  }

  set font(font) {
    this.__root.font = font;
  }

  get font() {
    return this.__root.font;
  }
}

// -------------------------------------------------------------------- //
// Type definitions
// -------------------------------------------------------------------- //

/** The props for creating pxText instances. */
export interface pxTextProps extends pxObjectProps {
  text?: String;
  textColor?: number;
  pixelSize?: number;
  fontUrl?: String;
  font?: Object;
}

/** The underlying pxScene Text instance to be managed through pxsceneUI. */
export interface pxsceneText extends pxsceneObject {
  text: String;
  textColor: number;
  pixelSize: number;
  fontUrl: String;
  ready: Promise<any>;
  font: Object;
}
