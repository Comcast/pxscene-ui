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

import * as pxsceneUI from 'pxsceneUI';
const pxRect = pxsceneUI.pxRect;
const pxTextBox = pxsceneUI.pxTextBox;
const ALIGN_VERTICAL = pxsceneUI.ALIGN_VERTICAL;
const ALIGN_HORIZONTAL = pxsceneUI.ALIGN_HORIZONTAL;

// 1) This is the type declarations for this component's props. Notice how the
// interface can remain private to this module.
interface WidgetProps extends pxsceneUI.pxComponentProps {
  x: number;
  y: number;
  w: number;
  h: number;
  label: String;
}

// 2) This is the type declarations for this component's state.
interface WidgetState extends pxsceneUI.pxComponentState {
  selected: boolean;
}

// 3) This is the same exact Widget we used for the project in Example-05. The
// only difference is that we are now declaring types for its props/state by
// having the class extend pxComponent<WidgetProps, WidgetState>. This is the
// same pattern used by React.
// 4) Type declarations are optional for both the props and the state. You can
// provide type declarations for both, either, or neither (as is the case for
// the App component).
export default class Widget extends pxsceneUI.pxComponent<
  WidgetProps,
  WidgetState
> {
  // 5) A constructor method is NOT required for enforcing prop types.
  // 6) But if a constructor method is defined, then its 'props' argument MUST
  // be declared with the correct type.
  constructor(props: WidgetProps) {
    super(props);

    this.state = {
      // 7) FIXME: THIS CAUSES A TYPESCRIPT ERROR. 'selected' must be a boolean.
      // Fix this error by initializing 'selected' to false.
      selected: 'hello',
      // 8) FIXME: THIS CAUSES A TYPESCRIPT ERROR. 'hello' is not a declared
      // state variable.
      hello: 'there'
    };
  }

  // 9) pxsceneUI provides type declarations for all component lifecycle methods.
  // 10) FIXME: THIS CAUSES A TYPESCRIPT ERROR. componentDidMount() doesn't
  // accept any arguments.
  componentDidMount(bogusArg) {}

  render() {
    const { x, y, w, h, label } = this.props;
    const { selected } = this.state;

    let labelObj = new pxTextBox({
      x: 5,
      y: 5,
      w: w,
      h: h,
      alignHorizontal: ALIGN_HORIZONTAL.CENTER,
      alignVertical: ALIGN_VERTICAL.CENTER,
      text: selected ? '>' + label + '<' : label,
      textColor: selected ? 0xffffffff : 0xff0000ff
    });

    let boxObj = new pxRect({
      x: 5,
      y: 5,
      w: w,
      h: h,
      lineWidth: 1,
      // 11) FIXME: THIS CAUSES A TYPESCRIPT ERROR. 'lineColor' can only be a
      // number.
      lineColor: selected ? '0xffffffff' : 0xff0000ff,
      fillColor: selected ? 0xff0000ff : 0xffffffff
    });

    return new pxRect({
      x: x,
      y: y,
      w: w,
      h: h,
      fillColor: 0x444444ff,
      onMouseDown: this.handleMouseClick.bind(this)
    }).addChildren(boxObj, labelObj);
  }

  handleMouseClick() {
    this.setState({
      // 12) FIXME: THIS CAUSES A TYPESCRIPT ERROR. 'bogus' is not a declared
      // state variable.
      bogus: 'This is not a state variable',
      selected: !this.state.selected
    });
  }
}
