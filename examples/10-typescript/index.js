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

import App from 'App';
const pxsceneUI = require('pxscene-ui');

// 1) Even though the App component is written in TypeScript, we can import it
// into a plain JavaScript module such as we do here.
// 2) However, we lose the ability to type-check the props that we'd be passing
// to App here, if App were to accept props (which it doesn't).
pxsceneUI.render(new App());
