An introduction to event-handling, specifically for keypress events.

GOALS:
* Allow the user to move the text around the screen by pressing the directional keys.
* Introduce the concept of component state.

NOTES:
* A pxComponent imports pxScene modules by overriding the 'modules' getter method.
* A pxComponent defines an event handler and attaches it as a property to a pxObject.
* Call 'stopPropagation()' to prevent an event from bubbling up.
* An introduction to focus, which later examples cover in more detail.
