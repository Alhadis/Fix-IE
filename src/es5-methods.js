Date.now                = Date.now                || function(){return +new Date};
String.prototype.trim   = String.prototype.trim   || function(){return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");};
Object.defineProperties = Object.defineProperties || function(obj, props){for(var i in props) Object.defineProperty(obj, i, props[i]);};
Array.isArray           = Array.isArray           || function(obj){return "[object Array]" === Object.prototype.toString.call(obj)};
Number.isNaN            = Number.isNaN            || function(val){return val !== val};
String.prototype.repeat = String.prototype.repeat || function(num){return Array(num + 1).join(this)};
