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
 * A pxWayland serves as a stand-in for the actual pxScene Wayland instance
 * that it represents.
 */
export class pxWayland extends pxObject {
  __root: pxsceneWayland = null;

  constructor(props: pxWaylandProps = {} as pxWaylandProps) {
    super(props);
    this.props.t = 'wayland';
  }

  /**
   * Getters for read-only pxScene Wayland properties.
   */

  get api() {
    return this.__root.api;
  }

  get clientPID() {
    return this.__root.clientPID;
  }

  get remoteReady() {
    return this.__root.remoteReady;
  }

  /**
   * Getters/setters for pxScene Wayland properties.
   */

  set displayName(displayName) {
    this.__root.displayName = displayName;
  }

  get displayName() {
    return this.__root.displayName;
  }

  set cmd(cmd) {
    this.__root.cmd = cmd;
  }

  get cmd() {
    return this.__root.cmd;
  }

  set remoteServer(remoteServer) {
    this.__root.remoteServer = remoteServer;
  }

  get remoteServer() {
    return this.__root.remoteServer;
  }

  set fillColor(fillColor) {
    this.__root.fillColor = fillColor;
  }

  get fillColor() {
    return this.__root.fillColor;
  }

  /**
   * Wrappers for pxScene Wayland methods.
   */

  suspend(bool) {
    this.__root.suspend(bool);
  }

  resume(bool) {
    this.__root.resume(bool);
  }

  destroy(bool) {
    this.__root.destroy(bool);
  }
}

// -------------------------------------------------------------------- //
// Type definitions
// -------------------------------------------------------------------- //

/** The props for creating pxWayland instances. */
export interface pxWaylandProps extends pxObjectProps {
  displayName?: String;
  cmd?: String;
  remoteServer?: String;
  fillColor?: number;
}

/** The underlying pxScene Wayland instance to be managed through pxsceneUI. */
export interface pxsceneWayland extends pxsceneObject {
  displayName: String;
  cmd: String;
  remoteServer: String;
  fillColor: number;
  api: Object;
  clientPID: number;
  hasApi: boolean;
  remoteReady: Promise<any>;
  suspend: (boolean) => {};
  resume: (boolean) => {};
  destroy: (boolean) => {};
}
