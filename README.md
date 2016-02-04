Fix-IE
======

Ironically-named bundle of polyfills for Internet Explorer 8-9.


Contents:
---------
* [HTML5 Shiv 3.7.3](https://github.com/aFarkas/html5shiv)
* [Hack to get `Object.defineProperty` working on native JS objects](#IE8PP).
* EventTarget methods:
	- `addEventListener`
	- `removeEventListener`
* Element-related properties:
	- `el.classList` ([Also available here](https://github.com/Alhadis/DOMTokenList))
	- `el.childElementCount`
	- `el.firstElementChild`
	- `el.lastElementChild`
	- `el.nextElementSibling`
	- `el.previousElementSibling`
* Window-related properties/methods:
	- `window.getComputedStyle`
	- `window.innerWidth`
	- `window.innerHeight`
	- `window.pageXOffset`
	- `window.pageYOffset`
* Various ES5/ES6 class extensions:
	- `Array.prototype.forEach`
	- `Array.isArray`
	- `Number.isNaN`
	- `Date.now`
	- `String.prototype.trim`
	- `String.prototype.repeat`
	- `Object.defineProperties`


Credits:
--------

* HTML5 Shiv by [these guys](https://github.com/aFarkas/html5shiv).
* `forEach` polyfill pinched from the [Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#Polyfill).
* Everything else by me



IE8PP
------
`IE8PP` stands for "IE8 Property Punch". It's a twisted hack used to get Object.defineProperty working on native JavaScript objects in IE8, which otherwise only supports
using `defineProperty` on DOM elements. Pass it a constructor function, and use the returned value to overwrite the original:

```js
	function Point(x, y){
		this.x = x;
		this.y = y;
		
		Object.defineProperty(this, "coords", {
			get: function(){
				return [this.x, this.y];
			}
		});
	}
	
	if(window.IE8PP)
		Point = IE8PP(Point);
	
	var test = new Point(13, 16);
	console.log(test.coords); // [13, 16]
```

### "How the f-..."
This works because it's returning an HTML element, detached from the document tree. The original constructor function is fired within the context of the detached HTML node, causing all references to `this` to point to a shadow element. All properties/methods of the function's prototype are assigned to the HTML instance too.

Obviously you wouldn't expect this to work without limitations, and you'd be right:
* **Forget about `instanceof`:** Everything your function would return is now technically an instance of an `<s>` element.
* **Subclassing? Not on this boat.** `__proto__` is nonsense according to IE8. Therefore, so are your hopes of having it understand prototypal inheritance.

This sounds a lot shakier than it actually is. As long as your class function defines instance properties from the constructor, and you aren't reliant on prototype chains,
you won't have to touch a line of code to cater to IE8. Well, other than the obvious `IE8PP` call. Remember to run it *before* creating any instances, as well as assigning "static" methods:
```js
	function Point(){
		/* Stuff, etc */
	}
	
	if(window.IE8PP)
		Point = IE8PP(Point);
	
	Point.fromArray = function(arr){ return new Point(arr[0], arr[1]); }
	Point.zero = Point.fromArray([0, 0]);
```
Yeah this hack is freakin' stupid, but so is Internet Explorer. Dumb problems often lead to dumb solutions.
