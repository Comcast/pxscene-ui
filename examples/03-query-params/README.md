Here's an example of how the app can make use of query parameters.

GOALS:
* Allow the position of the HelloWorld component to be specified as a launch parameter.

NOTES:
* Pass query parameters as you would for HTML-based web apps:
```
http://localhost:8080/bundle.js?xPos=100&yPos=150
```
* You can access the query parameters from anywhere within the app, not just from *index.js*.
