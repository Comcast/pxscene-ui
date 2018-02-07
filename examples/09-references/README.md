Some more advanced examples of using React-style references.

GOALS:
* Show how to obtain a reference to a child pxComponent from a parent component.
* Show how to gain access to a child’s pxObject element from a parent component.

NOTES:
* Use care when calling a child component's methods (through a component reference), as it circumvents the usual component contract established through props.
* Accessing a child's elements is generally not recommended because it breaks component encapsulation, but it can occasionally be useful for triggering focus or measuring the size or position of a child element.
