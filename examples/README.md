# Example Apps
All of the examples here are standalone apps, each with its own index.js -- which serves as the entry point to the app -- and configuration files.

There are many excellent online resources for React, so the examples here mainly aim to illustrate the nuances of **pxsceneUI**. Likewise, these examples won't go into too much detail for things like NPM and Webpack, since those are defacto industry standards for building React apps. However, whenever appropriate, we try to introduce the patterns and methods that we've found useful for developing and building the apps.

## Requirements
* **Node.js** - You should already have this installed as a requirement for pxScene and its simulator (https://nodejs.org)
* **NPM** - The package manager for JavaScript. This should come installed along with Node.js (https://www.npmjs.com)
* **pxScene** - You need this in order to run the example apps within the pxScene simulator (http://www.pxscene.org/)

## How to Run
Each example comes complete with its own *package.json* (for declaring its dependencies) and *webpack.config.js* (for building the app).

### Install Dependencies
The first thing that you must do for *every* example is to install its package dependencies -- including the **pxsceneUI** package -- via NPM.
```
1) cd 00-helloworld
2) npm install
```
This installs all of the required packages into the *node_modules* folder (within the folder of the example). You will need to re-run this step if you delete the contents of the *node_modules* folder.

### Host the App Locally
The easiest and quickest way to start the app is with the webpack-dev-server, which is a little Node.js Express server that serves the app locally from your computer.
```
1) cd 00-helloworld
2) npm run start
```
This makes the app available at http://localhost:8080/bundle.js, which you can then load from the pxScene simulator.

### Build the App Bundle
You can also build the actual app bundle which can then be served from a remote server.
```
1) cd 00-helloworld
2) npm run build
```
This creates the *bundle.js* file and places it in the *build* folder (within the folder of the example).
