/** IE8< polyfill for addEventListener */
(function(){
	if(!document.createElement("div").addEventListener){

		var cache = "_eventListeners",


		/** Ties an event listener to an element. */
		addEvent = function(name, fn){
			var THIS = this;
			if(!(cache in THIS))    THIS[cache]       = {};
			if(!THIS[cache][name])  THIS[cache][name] = [];

			/** Check that we're not adding duplicate listeners for this event type. */
			var handlers = THIS[cache][name], i;
			for(i in handlers)
				if(fn === handlers[i][0]) return;

			handlers.push([fn, fn = function(fn){
				return function(e){
					var e = e || window.event;
					if(!("target" in e))    e.target          = e.srcElement;
					if(!e.preventDefault)   e.preventDefault  = function(){this.returnValue = false;}
					return fn.call(THIS, e);
				};
			}(fn)]);

			THIS.attachEvent("on" + name, fn);
		},



		/** Removes an event listener from an element. */
		removeEvent = function(name, fn){
			var THIS = this;
			if(!(cache in THIS))    THIS[cache]       = {};
			if(!THIS[cache][name])  THIS[cache][name] = [];

			var handlers = THIS[cache][name], i;
			for(i in handlers){
				if(fn === handlers[i][0]){
					THIS.detachEvent("on"+name, handlers[i][1]);
					delete handlers[i];
				}
			}
		};


		Object.defineProperty(Element.prototype, "addEventListener",    {value: addEvent});
		Object.defineProperty(Element.prototype, "removeEventListener", {value: removeEvent});
		document.addEventListener     = window.addEventListener     = addEvent;
		document.removeEventListener  = window.removeEventListener  = removeEvent;
	}
}());
