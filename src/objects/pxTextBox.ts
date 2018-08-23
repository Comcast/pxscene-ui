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

import { pxText, pxTextProps, pxsceneText } from './pxText';

/**
 * A pxTextBox serves as a stand-in for the actual pxScene TextBox instance
 * that it represents.
 */
export class pxTextBox extends pxText {
  __root: pxsceneTextBox = null;

  constructor(props: pxTextBoxProps = {} as pxTextBoxProps) {
    super(props);
    this.props.t = 'textBox';
  }

  /**
   * Getters/setters for pxScene TextBox properties.
   */

  set wordWrap(wordWrap) {
    this.__root.wordWrap = wordWrap;
  }

  get wordWrap() {
    return this.__root.wordWrap;
  }

  set xStartPos(xStartPos) {
    this.__root.xStartPos = xStartPos;
  }

  get xStartPos() {
    return this.__root.xStartPos;
  }

  set xStopPos(xStopPos) {
    this.__root.xStopPos = xStopPos;
  }

  get xStopPos() {
    return this.__root.xStopPos;
  }

  set ellipsis(ellipsis) {
    this.__root.ellipsis = ellipsis;
  }

  get ellipsis() {
    return this.__root.ellipsis;
  }

  set truncation(truncation) {
    this.__root.truncation = truncation;
  }

  get truncation() {
    return this.__root.truncation;
  }

  set alignHorizontal(alignHorizontal) {
    this.__root.alignHorizontal = alignHorizontal;
  }

  get alignHorizontal() {
    return this.__root.alignHorizontal;
  }

  set alignVertical(alignVertical) {
    this.__root.alignVertical = alignVertical;
  }

  get alignVertical() {
    return this.__root.alignVertical;
  }

  set leading(leading) {
    this.__root.leading = leading;
  }

  get leading() {
    return this.__root.leading;
  }

  /**
   * Wrappers for pxScene TextBox methods.
   */

  measureText() {
    return this.__root.measureText();
  }
}

// -------------------------------------------------------------------- //
// Type definitions
// -------------------------------------------------------------------- //

/** The props for creating pxTextBox instances. */
export interface pxTextBoxProps extends pxTextProps {
  wordWrap?: boolean;
  xStartPos?: number;
  xStopPos?: number;
  ellipsis?: boolean;
  truncation?: any;
  alignHorizontal?: any;
  alignVertical?: any;
  leading?: number;
}

/** The underlying pxScene TextBox instance to be managed through pxsceneUI. */
export interface pxsceneTextBox extends pxsceneText {
  wordWrap: boolean;
  xStartPos: number;
  xStopPos: number;
  ellipsis: boolean;
  truncation: any;
  alignHorizontal: any;
  alignVertical: any;
  leading: number;
  measureText: () => Object;
}
