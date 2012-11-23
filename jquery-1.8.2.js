/*!
 * jQuery JavaScript Library v1.8.2
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: Thu Sep 20 2012 21:13:05 GMT-0400 (Eastern Daylight Time)
 */
(function( window, undefined ) {
var
	// A central reference to the root jQuery(document)
	rootjQuery,

	// The deferred used on DOM ready
	readyList,

	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,
	location = window.location,
	navigator = window.navigator,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// Save a reference to some core methods
	core_push = Array.prototype.push,
	core_slice = Array.prototype.slice,
	core_indexOf = Array.prototype.indexOf,
	core_toString = Object.prototype.toString,
	core_hasOwn = Object.prototype.hasOwnProperty,
	core_trim = String.prototype.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,

	// Used for detecting and trimming whitespace
	core_rnotwhite = /\S/,
	core_rspace = /\s+/,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	rquickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return ( letter + "" ).toUpperCase();
	},

	// The ready event handler and self cleanup method
	DOMContentLoaded = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
			jQuery.ready();
		} else if ( document.readyState === "complete" ) {
			// we're here because readyState === "complete" in oldIE
			// which is good enough for us to call the dom ready!
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	},

	// [[Class]] -> type pairs
	class2type = {};

jQuery.fn = jQuery.prototype = {
	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;
					doc = ( context && context.nodeType ? context.ownerDocument || context : document );

					// scripts is true for back-compat
					selector = jQuery.parseHTML( match[1], doc, true );
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						this.attr.call( selector, context, true );
					}

					return jQuery.merge( this, selector );

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.8.2",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + ( this.selector ? " " : "" ) + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	eq: function( i ) {
		i = +i;
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ),
			"slice", core_slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready, 1 );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ core_toString.call(obj) ] || "object";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// scripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, scripts ) {
		var parsed;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			scripts = context;
			context = 0;
		}
		context = context || document;

		// Single tag
		if ( (parsed = rsingleTag.exec( data )) ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts ? null : [] );
		return jQuery.merge( [],
			(parsed.cacheable ? jQuery.clone( parsed.fragment ) : parsed.fragment).childNodes );
	},

	parseJSON: function( data ) {
		if ( !data || typeof data !== "string") {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );

		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( rvalidchars.test( data.replace( rvalidescape, "@" )
			.replace( rvalidtokens, "]" )
			.replace( rvalidbraces, "")) ) {

			return ( new Function( "return " + data ) )();

		}
		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && core_rnotwhite.test( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var name,
			i = 0,
			length = obj.length,
			isObj = length === undefined || jQuery.isFunction( obj );

		if ( args ) {
			if ( isObj ) {
				for ( name in obj ) {
					if ( callback.apply( obj[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( obj[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in obj ) {
					if ( callback.call( obj[ name ], name, obj[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.call( obj[ i ], i, obj[ i++ ] ) === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var type,
			ret = results || [];

		if ( arr != null ) {
			// The window, strings (and functions) also have 'length'
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			type = jQuery.type( arr );

			if ( arr.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( arr ) ) {
				core_push.call( ret, arr );
			} else {
				jQuery.merge( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}

		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value, key,
			ret = [],
			i = 0,
			length = elems.length,
			// jquery objects are treated as arrays
			isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( key in elems ) {
				value = callback( elems[ key ], key, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, pass ) {
		var exec,
			bulk = key == null,
			i = 0,
			length = elems.length;

		// Sets many values
		if ( key && typeof key === "object" ) {
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], 1, emptyGet, value );
			}
			chainable = 1;

		// Sets one value
		} else if ( value !== undefined ) {
			// Optionally, function values get executed if exec is true
			exec = pass === undefined && jQuery.isFunction( value );

			if ( bulk ) {
				// Bulk operations only iterate when executing function values
				if ( exec ) {
					exec = fn;
					fn = function( elem, key, value ) {
						return exec.call( jQuery( elem ), value );
					};

				// Otherwise they run against the entire set
				} else {
					fn.call( elems, value );
					fn = null;
				}
			}

			if ( fn ) {
				for (; i < length; i++ ) {
					fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
				}
			}

			chainable = 1;
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready, 1 );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", DOMContentLoaded );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.split( core_rspace ), function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" && ( !options.unique || !self.has( arg ) ) ) {
								list.push( arg );
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Control if a given callback is in the list
			has: function( fn ) {
				return jQuery.inArray( fn, list ) > -1;
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				args = args || [];
				args = [ context, args.slice ? args.slice() : args ];
				if ( list && ( !fired || stack ) ) {
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ]( jQuery.isFunction( fn ) ?
								function() {
									var returned = fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise()
											.done( newDefer.resolve )
											.fail( newDefer.reject )
											.progress( newDefer.notify );
									} else {
										newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
									}
								} :
								newDefer[ action ]
							);
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ] = list.fire
			deferred[ tuple[0] ] = list.fire;
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function() {

	var support,
		all,
		a,
		select,
		opt,
		input,
		fragment,
		eventName,
		i,
		isSupported,
		clickFn,
		div = document.createElement("div");

	// Preliminary tests
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	all = div.getElementsByTagName("*");
	a = div.getElementsByTagName("a")[ 0 ];
	a.style.cssText = "top:1px;float:left;opacity:.5";

	// Can't get basic test support
	if ( !all || !all.length ) {
		return {};
	}

	// First batch of supports tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: ( div.firstChild.nodeType === 3 ),

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: ( a.getAttribute("href") === "/a" ),

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.5/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: ( input.value === "on" ),

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// Tests for enctype support on a form(#6743)
		enctype: !!document.createElement("form").enctype,

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

		// jQuery.support.boxModel DEPRECATED in 1.8 since we don't support Quirks Mode
		boxModel: ( document.compatMode === "CSS1Compat" ),

		// Will be defined later
		submitBubbles: true,
		changeBubbles: true,
		focusinBubbles: false,
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true,
		boxSizingReliable: true,
		pixelPosition: false
	};

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
		div.attachEvent( "onclick", clickFn = function() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			support.noCloneEvent = false;
		});
		div.cloneNode( true ).fireEvent("onclick");
		div.detachEvent( "onclick", clickFn );
	}

	// Check if a radio maintains its value
	// after being appended to the DOM
	input = document.createElement("input");
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	input.setAttribute( "checked", "checked" );

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "name", "t" );

	div.appendChild( input );
	fragment = document.createDocumentFragment();
	fragment.appendChild( div.lastChild );

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	fragment.removeChild( input );
	fragment.appendChild( div );

	// Technique from Juriy Zaytsev
	// http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
	// We only care about the case where non-standard event systems
	// are used, namely in IE. Short-circuiting here helps us to
	// avoid an eval call (in setAttribute) which can cause CSP
	// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
	if ( div.attachEvent ) {
		for ( i in {
			submit: true,
			change: true,
			focusin: true
		}) {
			eventName = "on" + i;
			isSupported = ( eventName in div );
			if ( !isSupported ) {
				div.setAttribute( eventName, "return;" );
				isSupported = ( typeof div[ eventName ] === "function" );
			}
			support[ i + "Bubbles" ] = isSupported;
		}
	}

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, div, tds, marginDiv,
			divReset = "padding:0;margin:0;border:0;display:block;overflow:hidden;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px";
		body.insertBefore( container, body.firstChild );

		// Construct the test element
		div = document.createElement("div");
		container.appendChild( div );

		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		// (only IE 8 fails this test)
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Check if empty table cells still have offsetWidth/Height
		// (IE <= 8 fail this test)
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
		support.boxSizing = ( div.offsetWidth === 4 );
		support.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== 1 );

		// NOTE: To any future maintainer, we've window.getComputedStyle
		// because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. For more
			// info see bug #3333
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = document.createElement("div");
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";
			div.appendChild( marginDiv );
			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== "undefined" ) {
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			// (IE < 8 does this)
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Check if elements with layout shrink-wrap their children
			// (IE 6 does this)
			div.style.display = "block";
			div.style.overflow = "visible";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			container.style.zoom = 1;
		}

		// Null elements to avoid leaks in IE
		body.removeChild( container );
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	fragment.removeChild( div );
	all = a = select = opt = input = fragment = div = null;

	return support;
})();
var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

jQuery.extend({
	cache: {},

	deletedIds: [],

	// Remove at next major release (1.9/2.0)
	uuid: 0,

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var thisCache, ret,
			internalKey = jQuery.expando,
			getByName = typeof name === "string",

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && getByName && data === undefined ) {
			return;
		}

		if ( !id ) {
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				elem[ internalKey ] = id = jQuery.deletedIds.pop() || jQuery.guid++;
			} else {
				id = internalKey;
			}
		}

		if ( !cache[ id ] ) {
			cache[ id ] = {};

			// Avoids exposing jQuery metadata on plain JS objects when the object
			// is serialized using JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}
		}

		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ] = jQuery.extend( cache[ id ], name );
			} else {
				cache[ id ].data = jQuery.extend( cache[ id ].data, name );
			}
		}

		thisCache = cache[ id ];

		// jQuery data() is stored in a separate object inside the object's internal data
		// cache in order to avoid key collisions between internal data and user-defined
		// data.
		if ( !pvt ) {
			if ( !thisCache.data ) {
				thisCache.data = {};
			}

			thisCache = thisCache.data;
		}

		if ( data !== undefined ) {
			thisCache[ jQuery.camelCase( name ) ] = data;
		}

		// Check for both converted-to-camel and non-converted data property names
		// If a data property was specified
		if ( getByName ) {

			// First Try to find as-is property data
			ret = thisCache[ name ];

			// Test for null|undefined property data
			if ( ret == null ) {

				// Try to find the camelCased property
				ret = thisCache[ jQuery.camelCase( name ) ];
			}
		} else {
			ret = thisCache;
		}

		return ret;
	},

	removeData: function( elem, name, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var thisCache, i, l,

			isNode = elem.nodeType,

			// See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,
			id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !cache[ id ] ) {
			return;
		}

		if ( name ) {

			thisCache = pvt ? cache[ id ] : cache[ id ].data;

			if ( thisCache ) {

				// Support array or space separated string names for data keys
				if ( !jQuery.isArray( name ) ) {

					// try the string as a key before any manipulation
					if ( name in thisCache ) {
						name = [ name ];
					} else {

						// split the camel cased version by spaces unless a key with the spaces exists
						name = jQuery.camelCase( name );
						if ( name in thisCache ) {
							name = [ name ];
						} else {
							name = name.split(" ");
						}
					}
				}

				for ( i = 0, l = name.length; i < l; i++ ) {
					delete thisCache[ name[i] ];
				}

				// If there is no data left in the cache, we want to continue
				// and let the cache object itself get destroyed
				if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
					return;
				}
			}
		}

		// See jQuery.data for more information
		if ( !pvt ) {
			delete cache[ id ].data;

			// Don't destroy the parent cache unless the internal data object
			// had been the only thing left in it
			if ( !isEmptyDataObject( cache[ id ] ) ) {
				return;
			}
		}

		// Destroy the cache
		if ( isNode ) {
			jQuery.cleanData( [ elem ], true );

		// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
		} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
			delete cache[ id ];

		// When all else fails, null
		} else {
			cache[ id ] = null;
		}
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return jQuery.data( elem, name, data, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var parts, part, attr, name, l,
			elem = this[0],
			i = 0,
			data = null;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attr = elem.attributes;
					for ( l = attr.length; i < l; i++ ) {
						name = attr[i].name;

						if ( !name.indexOf( "data-" ) ) {
							name = jQuery.camelCase( name.substring(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		parts = key.split( ".", 2 );
		parts[1] = parts[1] ? "." + parts[1] : "";
		part = parts[1] + "!";

		return jQuery.access( this, function( value ) {

			if ( value === undefined ) {
				data = this.triggerHandler( "getData" + part, [ parts[0] ] );

				// Try to fetch any internally stored data first
				if ( data === undefined && elem ) {
					data = jQuery.data( elem, key );
					data = dataAttr( elem, key, data );
				}

				return data === undefined && parts[1] ?
					this.data( parts[0] ) :
					data;
			}

			parts[1] = value;
			this.each(function() {
				var self = jQuery( this );

				self.triggerHandler( "setData" + part, parts );
				jQuery.data( this, key, value );
				self.triggerHandler( "changeData" + part, parts );
			});
		}, null, value, arguments.length > 1, null, false );
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				// Only convert to a number if it doesn't change the string
				+data + "" === data ? +data :
				rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery.removeData( elem, type + "queue", true );
				jQuery.removeData( elem, key, true );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook, fixSpecified,
	rclass = /[\t\r\n]/g,
	rreturn = /\r/g,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea|)$/i,
	rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classNames, i, l, elem,
			setClass, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call(this, j, this.className) );
			});
		}

		if ( value && typeof value === "string" ) {
			classNames = value.split( core_rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className && classNames.length === 1 ) {
						elem.className = value;

					} else {
						setClass = " " + elem.className + " ";

						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( setClass.indexOf( " " + classNames[ c ] + " " ) < 0 ) {
								setClass += classNames[ c ] + " ";
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var removes, className, elem, c, cl, i, l;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call(this, j, this.className) );
			});
		}
		if ( (value && typeof value === "string") || value === undefined ) {
			removes = ( value || "" ).split( core_rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];
				if ( elem.nodeType === 1 && elem.className ) {

					className = (" " + elem.className + " ").replace( rclass, " " );

					// loop over each item in the removal list
					for ( c = 0, cl = removes.length; c < cl; c++ ) {
						// Remove until there is nothing to remove,
						while ( className.indexOf(" " + removes[ c ] + " ") >= 0 ) {
							className = className.replace( " " + removes[ c ] + " " , " " );
						}
					}
					elem.className = value ? jQuery.trim( className ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.split( core_rspace );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val,
				self = jQuery(this);

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, i, max, option,
					index = elem.selectedIndex,
					values = [],
					options = elem.options,
					one = elem.type === "select-one";

				// Nothing was selected
				if ( index < 0 ) {
					return null;
				}

				// Loop through all the selected options
				i = one ? index : 0;
				max = one ? index + 1 : options.length;
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Don't return options that are disabled or in a disabled optgroup
					if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
							(!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				// Fixes Bug #2551 -- select.val() broken in IE after form.reset()
				if ( one && !values.length && options.length ) {
					return jQuery( options[ index ] ).val();
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	// Unused in 1.8, left in so attrFn-stabbers won't die; remove in 1.9
	attrFn: {},

	attr: function( elem, name, value, pass ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( pass && jQuery.isFunction( jQuery.fn[ name ] ) ) {
			return jQuery( elem )[ name ]( value );
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;

			} else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			ret = elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return ret === null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var propName, attrNames, name, isBool,
			i = 0;

		if ( value && elem.nodeType === 1 ) {

			attrNames = value.split( core_rspace );

			for ( ; i < attrNames.length; i++ ) {
				name = attrNames[ i ];

				if ( name ) {
					propName = jQuery.propFix[ name ] || name;
					isBool = rboolean.test( name );

					// See #9699 for explanation of this approach (setting first, then removal)
					// Do not do this for boolean attributes (see #10870)
					if ( !isBool ) {
						jQuery.attr( elem, name, "" );
					}
					elem.removeAttribute( getSetAttribute ? name : propName );

					// Set corresponding property to false for boolean attributes
					if ( isBool && propName in elem ) {
						elem[ propName ] = false;
					}
				}
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				// We can't allow the type property to be changed (since it causes problems in IE)
				if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
					jQuery.error( "type property can't be changed" );
				} else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to it's default in case type is set after value
					// This is for element creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		},
		// Use the value property for back compat
		// Use the nodeHook for button elements in IE6/7 (#1954)
		value: {
			get: function( elem, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.get( elem, name );
				}
				return name in elem ?
					elem.value :
					null;
			},
			set: function( elem, value, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.set( elem, value, name );
				}
				// Does not return so that setAttribute is also used
				elem.value = value;
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		// Align boolean attributes with corresponding properties
		// Fall back to attribute presence where some booleans are not supported
		var attrNode,
			property = jQuery.prop( elem, name );
		return property === true || typeof property !== "boolean" && ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		var propName;
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			// value is true since we know at this point it's type boolean and not false
			// Set boolean attributes to the same name and set the DOM property
			propName = jQuery.propFix[ name ] || name;
			if ( propName in elem ) {
				// Only set the IDL specifically if it already exists on the element
				elem[ propName ] = true;
			}

			elem.setAttribute( name, name.toLowerCase() );
		}
		return name;
	}
};

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	fixSpecified = {
		name: true,
		id: true,
		coords: true
	};

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret;
			ret = elem.getAttributeNode( name );
			return ret && ( fixSpecified[ name ] ? ret.value !== "" : ret.specified ) ?
				ret.value :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				ret = document.createAttribute( name );
				elem.setAttributeNode( ret );
			}
			return ( ret.value = value + "" );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			if ( value === "" ) {
				value = "false";
			}
			nodeHook.set( elem, value, name );
		}
	};
}


// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret === null ? undefined : ret;
			}
		});
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Normalize to lowercase since IE uppercases css property names
			return elem.style.cssText.toLowerCase() || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});
var rformElems = /^(?:textarea|input|select)$/i,
	rtypenamespace = /^([^\.]*|)(?:\.(.+)|)$/,
	rhoverHack = /(?:^|\s)hover(\.\S+|)\b/,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	hoverHack = function( events ) {
		return jQuery.event.special.hover ? events : events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
	};

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	add: function( elem, types, handler, data, selector ) {

		var elemData, eventHandle, events,
			t, tns, type, namespaces, handleObj,
			handleObjIn, handlers, special;

		// Don't attach events to noData or text/comment nodes (allow plain objects tho)
		if ( elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data( elem )) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		events = elemData.events;
		if ( !events ) {
			elemData.events = events = {};
		}
		eventHandle = elemData.handle;
		if ( !eventHandle ) {
			elemData.handle = eventHandle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = jQuery.trim( hoverHack(types) ).split( " " );
		for ( t = 0; t < types.length; t++ ) {

			tns = rtypenamespace.exec( types[t] ) || [];
			type = tns[1];
			namespaces = ( tns[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: tns[1],
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			handlers = events[ type ];
			if ( !handlers ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var t, tns, type, origType, namespaces, origCount,
			j, events, special, eventType, handleObj,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = jQuery.trim( hoverHack( types || "" ) ).split(" ");
		for ( t = 0; t < types.length; t++ ) {
			tns = rtypenamespace.exec( types[t] ) || [];
			type = origType = tns[1];
			namespaces = tns[2];

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector? special.delegateType : special.bindType ) || type;
			eventType = events[ type ] || [];
			origCount = eventType.length;
			namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.|)") + "(\\.|$)") : null;

			// Remove matching events
			for ( j = 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					 ( !handler || handler.guid === handleObj.guid ) &&
					 ( !namespaces || namespaces.test( handleObj.namespace ) ) &&
					 ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					eventType.splice( j--, 1 );

					if ( handleObj.selector ) {
						eventType.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( eventType.length === 0 && origCount !== eventType.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery.removeData( elem, "events", true );
		}
	},

	// Events that are safe to short-circuit if no handlers are attached.
	// Native DOM events should not be added, they may have inline handlers.
	customEvent: {
		"getData": true,
		"setData": true,
		"changeData": true
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		// Don't do events on text and comment nodes
		if ( elem && (elem.nodeType === 3 || elem.nodeType === 8) ) {
			return;
		}

		// Event object or event type
		var cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType,
			type = event.type || event,
			namespaces = [];

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "!" ) >= 0 ) {
			// Exclusive events trigger only for the exact event (no namespaces)
			type = type.slice(0, -1);
			exclusive = true;
		}

		if ( type.indexOf( "." ) >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}

		if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
			// No jQuery handlers for this event type, and it can't have inline handlers
			return;
		}

		// Caller can pass in an Event, Object, or just an event type string
		event = typeof event === "object" ?
			// jQuery.Event object
			event[ jQuery.expando ] ? event :
			// Object literal
			new jQuery.Event( type, event ) :
			// Just the event type (string)
			new jQuery.Event( type );

		event.type = type;
		event.isTrigger = true;
		event.exclusive = exclusive;
		event.namespace = namespaces.join( "." );
		event.namespace_re = event.namespace? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
		ontype = type.indexOf( ":" ) < 0 ? "on" + type : "";

		// Handle a global trigger
		if ( !elem ) {

			// TODO: Stop taunting the data cache; remove global events and always attach to document
			cache = jQuery.cache;
			for ( i in cache ) {
				if ( cache[ i ].events && cache[ i ].events[ type ] ) {
					jQuery.event.trigger( event, data, cache[ i ].handle.elem, true );
				}
			}
			return;
		}

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data != null ? jQuery.makeArray( data ) : [];
		data.unshift( event );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		eventPath = [[ elem, special.bindType || type ]];
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			cur = rfocusMorph.test( bubbleType + type ) ? elem : elem.parentNode;
			for ( old = elem; cur; cur = cur.parentNode ) {
				eventPath.push([ cur, bubbleType ]);
				old = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( old === (elem.ownerDocument || document) ) {
				eventPath.push([ old.defaultView || old.parentWindow || window, bubbleType ]);
			}
		}

		// Fire handlers on the event path
		for ( i = 0; i < eventPath.length && !event.isPropagationStopped(); i++ ) {

			cur = eventPath[i][0];
			event.type = eventPath[i][1];

			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}
			// Note that this is a bare JS function and not a jQuery handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				// IE<9 dies on focus/blur to hidden element (#1486)
				if ( ontype && elem[ type ] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					old = elem[ ontype ];

					if ( old ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( old ) {
						elem[ ontype ] = old;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event || window.event );

		var i, j, cur, ret, selMatch, matched, matches, handleObj, sel, related,
			handlers = ( (jQuery._data( this, "events" ) || {} )[ event.type ] || []),
			delegateCount = handlers.delegateCount,
			args = core_slice.call( arguments ),
			run_all = !event.exclusive && !event.namespace,
			special = jQuery.event.special[ event.type ] || {},
			handlerQueue = [];

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers that should run if there are delegated events
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && !(event.button && event.type === "click") ) {

			for ( cur = event.target; cur != this; cur = cur.parentNode || this ) {

				// Don't process clicks (ONLY) on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.disabled !== true || event.type !== "click" ) {
					selMatch = {};
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];
						sel = handleObj.selector;

						if ( selMatch[ sel ] === undefined ) {
							selMatch[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( selMatch[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, matches: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( handlers.length > delegateCount ) {
			handlerQueue.push({ elem: this, matches: handlers.slice( delegateCount ) });
		}

		// Run delegates first; they may want to stop propagation beneath us
		for ( i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++ ) {
			matched = handlerQueue[ i ];
			event.currentTarget = matched.elem;

			for ( j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++ ) {
				handleObj = matched.matches[ j ];

				// Triggered event must either 1) be non-exclusive and have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test( handleObj.namespace ) ) {

					event.data = handleObj.data;
					event.handleObj = handleObj;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						event.result = ret;
						if ( ret === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	// *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
	props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop,
			originalEvent = event,
			fixHook = jQuery.event.fixHooks[ event.type ] || {},
			copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = jQuery.Event( originalEvent );

		for ( i = copy.length; i; ) {
			prop = copy[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Target should not be a text node (#504, Safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328; IE6/7/8)
		event.metaKey = !!event.metaKey;

		return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},

		focus: {
			delegateType: "focusin"
		},
		blur: {
			delegateType: "focusout"
		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( jQuery.isWindow( this ) ) {
					this.onbeforeunload = eventHandle;
				}
			},

			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

// Some plugins are using, but it's undocumented/deprecated and will be removed.
// The 1.7 special event interface should provide all the hooks needed now.
jQuery.event.handle = jQuery.event.dispatch;

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8 –
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === "undefined" ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}

		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj,
				selector = handleObj.selector;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "_submit_attached" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "_submit_attached", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "_change_attached" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "_change_attached", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) { // && selector != null
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	live: function( types, data, fn ) {
		jQuery( this.context ).on( types, this.selector, data, fn );
		return this;
	},
	die: function( types, fn ) {
		jQuery( this.context ).off( types, this.selector || "**", fn );
		return this;
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			return jQuery.event.trigger( type, data, this[0], true );
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments,
			guid = fn.guid || jQuery.guid++,
			i = 0,
			toggler = function( event ) {
				// Figure out which function to execute
				var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
				jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

				// Make sure that clicks stop
				event.preventDefault();

				// and execute the function
				return args[ lastToggle ].apply( this, arguments ) || false;
			};

		// link all the functions, so any of them can unbind this click handler
		toggler.guid = guid;
		while ( i < args.length ) {
			args[ i++ ].guid = guid;
		}

		return this.click( toggler );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver ���� JFIF   d d  �� Ducky     U  �� Adobe d�   �� � 






��  �� �� �          	           	 	! 1AQaq"2����B#�R3	��br�$4DCT
���S%s�5�&��*     !1AQaq������"2��Bbr#��R����&��3Ss��$4%5��   ? �c�pE�u<�v��Ym��C�@���A%%����%��A�<�`Ȃ��ho`*�8BJ�d @���i�ycj���RUם	"&�q���rR��&�{I�+�K~�A��r �jU7U7֠��"�XHI��P�B;� �I�T�.�oA��r��%��T}
���J	
Gg���*;TO!�� �K��ƨHwd �J�K���"XČTJ$E�ܢ��GdGx�� ���%�7#xDB�g��d��$ ��ʦ��y2�S
F�]j�(� `���l�A�,@�S� B3
w�¸=� ��g`"L Dw�Q��4"d$Ā����MP���� =�ĂB�4I�D1����PRc���s�R�"���6��S�9��yd#� ��-�P�HD�nP"�j�
ݴ�pǼJ([�
PO6q���,���"�L<H(b7 ;�h�i���7 ���	���2�y�����ἇ����ނJK�$1Jij�Jy&������Up����2 ����2���I)����:DM6�ES��y�M�,��Wb��%��o8�AT��n�o�A��Er����
#�����,�	+)�d��A�e卪�SmIW^t$��mƊ���J󠛀Y�&��-�K=�q����!T�T�Z�Ct��a!'��CTQ�i'iPn��2�����uQ�4���Ix@�*�C-($H)��T��QPA<�>\T�].�� 1ݐA*.ΚPX�c1Q(�Gr��e��o�����܍����h!�#tbP��C*����wILX)�u�,�L�Y���!��ȱN0�5�J���mǠp��n��)�
��O
�o�9���0ߵF��Љ�0�(r�ڕ5Fُw����SO-�렻���1S2J�/�:����B7���P`��%	6@�t�5���H=�����ʂ�ADw:&��I*�҃Faa�!2�:��x=����˷®�ݜ�1&-9���j�̙F%��


�"�� ����������A�IpC�G��A$�x�f
��Ӷ�d�4Pú@qcAc4#t��(��Y	���#�̠UV(tF�*
H���TЗ4e�)JSB@EN�)���Ѩ�RP�7��()*6ȓ4(;� ��B8�2T��Uk8��Mr	X��hނ��;1p� !�&��q�T̀�����($w��P���T9DĬIBM� G]>�Ad`2| "������QΉ�8RJ�at�јXb�L�����@g!7���𫲷g:I�NDF�,����;c3&E�~D(�FP�� ��poA2f�,C,��7����n������?D��c9I7=��nR���Z<)z׫e)l��:q4^��������
;���$O��>�E�+���-�У���S���?+ ����!_p �#�Yā��ޑn[_����,y�_Z�d��!I.���~�	�;��a%Q��_��		D�2R�� ��Pa�&`K�(��F�B���@e-��N5d
�Y�&��h��XJ�7;F��a�|d!��E�A7�ˌb�d��_@t	A#���o}���	�&%bJl�:��j#��{� 1�����tM�U�����Be t%]��z9	�u�o�]��9�bLZr"7qe��1��2(�K�!@2� D���z
	1���^H�Bv�:
4W$s� L� �FQ�Adw��&lx\�u����28�'���a1yI��������=�c=�"�e�H�;������
7 �Dz�ւ�"Y'��RK���߶�n��bG�ITp{W�BBQ0���t@5=�d���J1:��P�t�PKt�D�Y Ck[��Tc�J�P744��A� �L��P!ݣ�҃	Dx
@.�Y<cz�;wn��v׺��<bD��pv�=�v�-ўm������J��%dZF�.{G��D�O1;���Wr����fHB:*����Hq�I��J�cYH��A��;*�����q�v��Ӎ���
���c\p"m���#�A�Hc�BA~zT���r\��n��e�b��J���/eQfc�n
+�o�e ��� ��$�{h��%���d�Z"���ƥF���F8�)�� uQ��|�!�T7x~�
fD�"�OoeǼK�!��`��PU%;�P�I�7�#�HH}*T"cI),�;HdCom��6	L9b�U,S�΀Ns��%T�p�-��a>���Pm(0�b;�
��R�@
�ԨP0�5��?��HӲ�؈8̧wn8�INq�1p���(<N�ձ�t7u�{H+Pz~�6^�C7W%��v�AW��=��&q�P/Ay��Ux_����x�aR��AB�3����Db�c"��^�(P���2�N!t��4�G��~*�c�Ǒ����Mh<�g`2� ��ЊU�ҽkʐ��3#�(<�#��mR�k�c,�!�����TS2$��@"{{(=�^a
C�R�bIIg��C"{mTX�Ja�B�b�Nts��1*�Ӈ�h(>^3	�^��iA�$��(@�U�Z� of��Щ���,�1}��<Q�kځM"vň�۷�~fI�(�n��:���"x��"J}]�@LR
 8��
5J��dbI��Y(��*��BFR#�%�+�Ԡ�R �B6z	�p&r 	)$�s�p"�wf��z�Z���ݶb#!���d�c�D�7b֪*�@Id@lKZ�L��D���ip��1�&7�ʿ�A��" n~�.'�Ԩ���"��{t����6���X�̥�ւ��-#p�=��@"rO'���C�+�J�YJ3$ ��v�I$8դ�U^�B��1��A� �BF��F�A�e8ۻp��ƂJs�I��DOhaA��86�j����$�С �=*Gi9.DG�C@��1A�[�~��ח���1��7
�зӲ�L�RE�꽴���`�T�i�f ��	�R�a��e#e��� ����dȪ�?u3"K��d'�����%��{0B
\�$��B���JfRI�U!QI.
PX�L�D��h1��@��B�윽�qƪ$�  M8*������8EЀP#�1*�� �
����V�S�L�EU��8�7�%�����4JFN.@g���(�h��ֲ�����=�B����y$�xH(�:���-B]���<�Y&a�S#�Aj
�F��m@�<{|ؔ�xI�����9#�r� E�.����[! $[ĶD��� "KD:��� 	
8-��n��DOʳ&��I��:��g��ޤ���D��n�,9��m�>q����tw� 
A��-�F��#��K�=6w�d@��RD��(=��#��l��0�UA$��&@ M���Gh&'�"��	�ځx���)��ow�@rF 
�)� ��]Y�$#%X�B@H��l�AwJ D*��tO3@@��{��P5�(�(�):�gZ,P�8�.��^U)D6��(#Qq@�	"�B�I��M�&���a�(4R����@B^��&H�厄����3!#>��)���@�mѸ~���r��ۃ����
�΃��J"A��Ӷ��4��d�dЕ:p�9�|w܎�n�l��1�  ��(xp�����jUHTRK�� FB$"�px���)(���'/}�q��,�N
���F$w�3t ��J���B�)�A���� �Uh,N3��@��l��j�F
B㎼h!=��E@P�d�O/I�xdT���PZ�N8�̒ C�u��b�	%â�&�t�P3�I&� �@av�$������P(����B�Q�:�P!��6%#�u=����H�d\�7 x��5�d��H	�-�(.�@�@�����hCp`����ruJ���;|*��k�&Ec�
ąDڊ{(��1*8WQ��h�yJ�*�?:
e"I��١��� )A����� �4���d*�Pߥ����"q��o@�-�����=�.��P"��B"H;��V��EF�� �@
�HB�D���P���h���8Ԉ���K�8�X)xwD��&��
d'//#�C

�7D���!ܑ� �xqG�R�������yI��2�L�B��]����A����u�>��=ܒ��d �N)Ae5�n@�!��h$�� a�J@���,y
1i��	��Jq�Dd�"& m)e7)AL{�01��2EC� ��h7�7H��� `\��9��a��,��'*)L�y�OVA
���G�%�� (%v�p�t2������+Adf	"cio)�փ	D�a�*�DE�e�A#�i�u$0B��Z�JBA
m���b^\wIRi��#-ƈ'��$��e?c/�A�D��Ev����h,��C�(�N�	5���q�${Gbh� �A � �s�rl�����(&�F"�A����.���ADक2+) ��h!s-˼��U�C��"���bB�mE=�

�И�
+���4N<�Cq����2�$�Cl��AU����spe  �{A�yH�a�
���u����M�8�<���D���ޏ��L�f{c���˿η���G�|1�>>�c��\w!EԉWi�u6j,��ļ%�욍�S~�QoM����?{�}?��WҌ�#i ��Awzܸ���.�=F.I�a$���x��O}橏w$����%�USX���b^�Ia.�D�	(m"ǐ�0p#�����h��FM"bҖSr�Ǻc�$T<@
YV�y�q��9N� %��A���MvH����r�����d��h{�X�p�WiG	A�C) ��)(�
��4F`�&6�`v��h0�Ov��D_V^R1���RC.�u�*�$��� (j%��t�&�]�2�Lh�x�M��S�2��D@�In�Wk*���JP;��x�젓XJq��G�q6&���Tr
IS"�� �+Ƃ2ܻ�PH�UX�<M2+�hV$*&�S�@��(�	�P�º���D��T1Pw���y�S)L�6����QJ
S�b#&�1iK)�J
c�1��D��* ,�A����D��P ��ێ�Ŷ�Y/�Z% %d����tP �{�݃m�5�
��@H��E���'[�#���eb��!D	�҃,Dg��W�����($D�;�"A�H*Q-Aa8m� �HX�cqA7�P2��LY[��	��@�P��Pm�	Gj/tG)uւ�Gtb1����7�����C����"��beuP�ݟE������e(�W��9c��A��.��@�' '�8�{��Qؔ(?0 ��Db���Q����� V�粃	HH�i�S+j)8��� �nG�i@�g��U�(AE[�;(! b@G|�,�ۖ��F0{��	�J
�H�t6�.���# �;��߭�r�%;K
��A���������΂@J�`6��c���2ƻ�B�Ar�:�
 ,v�	 -��w7��=����#tdNI��0�
����:�+��Mc7%?�bR���W�d�F<��*�GP�X�vn������?O/��?@=>�|�'Y���4���vNv��ſ�cϦ&&&C��z�S����K #hB!b4����
�jL����(ֱ�j���=_.��2g
*���A;��d&ܵ����1�� ��N��PPE;��tܔ� ��~�h4c��8�(��Xh�΃���ě� 	$�^��&yv�3ЄjW���汓�`1�Ѡ~Q1���& �;h$��Fa����A��b$� �Et@�y�  &`�(���T� �'���'���� c5T�U�z% %d����tP �{�݃m�5�
��@H��E���'[�#���eb��!D	�҃,Dg��W�����($D�;�"A�H*Q-Aa8m� �HX�cqA7�P2��LY[��	��@�P��Pm�	Gj/tG)uւ�Gtb1����7�����C����"��beuP�ݟE������e(�W��9c��A��.��@�' '�8�{��Qؔ(?0 ��Db���˟�D���T��D��O�lR�nT���@�� O@K��%�r���
�j�gy(��6�
MP�I�+��O��JX� X�	(�;h1X��O	�+ػPIw��� ��@��%� eq�
�D9*BH��}�
$D�&@�.��@#	!%v��d#Cj
O�����@��{�P�N��j,V ����A��DQ�
J7������6��b
:kPm��$EX���U v*�K�~��y��RD��M�q��{�v���A�<�O@ A��K=��h������z�B".Wp$����C� H# կA�c��F5���_Je�|����ҷ���Q%�(T\i}R�&2��X�� ��ATt��WK��>�PX��)B�1 �rZ "v�'�
�f�*
N�� @Y�'��%�P�a�M��X�G�A�3���Pʛy&�h$�
�pW~'�A%,p�,{���^��
��'����]�$��~� �r�]l�2�͆��'*� !���C���P��1��0RK��(1�1�Q���(��] �
n(�A
@���U@=���� #"{�x�=�T�0�Q�(tP���AL�A1;�*Q\�3�e�x������2 D �m��'��H3T,5;���=��KT9(Ȃ�!,[�+:�l��e�,P	J�
�<�U$]WJ&Ļ�K2p`���L��� ���"�!$b�P>�����ݿ{�=�;~��!.���*z��H ~���7�\b��
8~��'���h}1LL��%�!R'O��PiziL[�DH�~�.�=5Q��2����,_�2t?�dZ�C��G&>��	���f_�~z<��=F�2�
�6����2�� ����I^��� m�����ឦCo����ևP��Z�Oᾢ;'��DK�� ��}T|+��:��I*��Y�9PS�W58�އv�˭Q��-�nR���*g�(��m=�|Տ���AG�Z��� ��x���ϯ�7�����:kk��?z������B�g�j,�-�jT!�W^�]wA���u�dROK�ѣ�?���u� � Gv}h��mM���;� �z2�%�7���E�G�� ��C���=D��P�?�X�b�E� o=Ha�:� O +>������/}[ ��zy��� �W�K�*�/���f�����A���J؀z^T(��׭�r�O�pI�׀u� �ւ�叫���\
�g^4W�JT�� ���	m���~�U]��֕(��_��/P���I��/N��B?*}w4��S���9:�J�_�D�R�|����}0�Ĝ�p
?�^�T8|���Ҝ�C�L�B%��
 ��Z�(����2;��za�w���� �SzT����Ą=G�^'�z�
9t�:�*Qg�c�8㉇��_t��o������*�>K|K��� Q���r���\�ҕ����mP��4q�ׄM@�%����R@��K�"  �^���� ~���J0��0}K��8�ο���J�(q��A12�/K�9�A
�ä��J�(��!�@�a���Q?�o�%�Ǥ�J(��L
��RE�����C��"ҥ?"�+��8z���2��̿��8ҥ����(ꞔ�9}@ۙ���*Q��� �� ��d��D�OP}�-�NT����Ɵ'�#��Y�/��t�e���יwdlOKz��k`��/��ҳ����N2M��De����U�6ۏM�H��|�?��/����[�)�3�����|��[�>���noM�|�^�L3~���ǎ3��r�5����6�qF;��|��������v�f��f3LtDu�R.�+ZL�8�k���"�^?���H�Q=O�K꘾,�K?ŝ/�W�t7DsK�=�q��͛|c�r�6�k���yï���]koUk��n2�i���k�1��&̱��-�n�NI�kNo�i�{_����Y����c��7�����|u긽]Vs���e��p��=1��2�wL�w#*W�o��CSmf��i���OX4Xc��\�e�2q�n�uL|�Ҽ�^4��
q���*Q���`�J S��xYI(�����}K�̼'�}A\j���D��?����=+~����w�R�����"#�O�"\/��G� �֕Z�)���~� \~g\��ѩR�~K�Hb��/LU	���� )q��*Q�|���9	��`���=C���B�~M�G����f� ���U]��֕('���~<^��
�r���Ӥ�*Q'�����~��P�y%J��"e*Q?���G��I�� ���=��E)=z2����dC���
�å��JT���/S�C��tc"�>�.�=-��/�c;O]�$X��� �BzVE��G����Bp�� ^Q�Z��� MA?z�@��l#��6�z_m�~�Ǯ�����*��jU� Fu�0:��R��������?��g��� ��(
��UM)QP��z�	u��o��� 鎿�.��T$�Բ+t�r���<࿨t&'�P�������>�C�t"%O�AT?�֠�>�
;^�ԣ�c _DVU��(��>����S�}t
��؄����J5U/�O$D�p��I!�	@(w���(�c�@q�(P�Tb6�+H���4�@�$�H9+Aa�m�Ҟ��5UT|�:V{�u'�?Pe ���
�������WO�|]�b~����	�� �{C���M�R|%���jm͊/����=����21~Jd�D�o��Kc�����wų7b���;9��Z�ώ?����\���_�k��*���?�=?�R����K�a���f_N��� �|?�<����~�M��i�6?��n�z����)JG�n���H��ݬ�?+�F.=]]]Y=�Jt�o�� �i� �o��k����� ��뷿�-O���N�� �v_�b���?������x� S� �.j��?�V��-�k��^���׽����꾁���� �O���=_E�a��χ�d�8�� ��nL���}_�����2߲[wgD��������������G���s�~�:?N�]�����ԡ��:�K'�x<��D��d}��v�]m�9�:~���d>�����˦�ͻI�3�i��6��^����y�� �[����� ��� �æ�OA�m��`�ݓ�v�w��/����J��)��e��������τ�`��,�c�>�Y�mE4�>wO��<���x�t�#����n��_�~��c��O$["h��C����C��0�+2�;�p_}YJ��ȓ���j�~�v�R�1A�A���FX�-c��N�ê">Y�M�}]���	F."��v����A@>�pm;*�Y�� �*�QbB9Ӽ �K z ��e�[��{�����T��	�U�DH$��cF%@��<��/E?~M���-x�&h��ᭀ�5�S,kr��4'�_C�z�cS%�d+�j<�bJBĜ:���h.O�T{��g;|˿��� �#)m�H��)@2��QX�,�
z�q�OtB���s8�(�ŊA�}@����%U_Aj	<�x� �_��6�� ��Ts�P|�:A�t�u'�
��6#[��� �dH V��BS�*|�T��j�	C��T@ �\#ݵsTs�}��R$H.�(G�P	��&D�UG5fZ K(�N�:�N/ʀy��"ೋT�1	���#�<��=��GD�Ӎ2g���"JT�W�D�&k�$���	[� �T�� ];�S��*�9@4�A��9��'�XpP���//&�FѴ�� 1~��c$����`�t�9�1DH�U(Y��PҞ�t6B��҂`EI2Ph*
��@� B�@q
��PIBq���z,m����@�%�A�c�*HT��2Č��6�TsRa(�|2TJ^�tc1��%$���/eRwv�qapA{���
�{��<N�˅��"����=�?��Pt9{��W��� U^w�� 5��u+f��ԕ�% �.U�ADfL`d�V
��D�Ig��J�H���a 6�%Q)�}�ޠ����M�.�R��2��
�>1�� FR������.�&�De�0*����ʶ�r(�Pt����<�j�
ށo�+�n��nB��!�Dd
�H{��>��MN3݌��V���oԐR@YO0B1}(
�u��M5�p�d�� �"#������3�$�vƫA�=D�dc$u'��	z��z��Q���3�V�'�#� � "�!GQ2� .b b������A��%,J�+s�wR;���5L}Q��'v0����%R�>�lP�$�(]W�Eh�3&a�'@�@�_(*�@A�T*�$�9,��cmX��P��C��UB��D<}Q#%�ĞA�ܨ$���V���G��w��l�"d�B(I	� �JT������)Ǭ�ز��/�C�0bj,?��?��|=�W�L'O�K�X��)$�������S�Sw��c��j�� �=�n�`���Q��� C�}6�������� �S���ߔ�
#tT� K$��d7 '�[D�U�P��:�ܪ:�$a50�dU���Z����(b)�!��.��{�i�PD̈$���X�s$@�.�Ar�5�9�H�:�D�`K�C���A�9奨8O?� �"�!R%� 1MU���2b���$J�{��N�H�2
3PO:q1S����D�� Dm(.�#[iPr����"�J� �
�Q�B�\��q
��Ps�gșw���& iA�H}�u%I��h�LS({ĝP;ۗe<�Ԝr��TJ^� ���%{��@rH�q�H�����-T ��]�Ǵs:��P3$b�Jx�Gn^�
�Z�c��J�KvB�Q
�(tQ��y�C$($!d[�J&	�v8�� �!��ǔ��������{�H1Rɴ���K,d�@UQe�Z�� �$��\(:=�sH���0��v�/0E' #��4�?m��y`�a� ��~W�D�H��P����!F{@���� Zs��H�A=Գ5���2��@�Q��N��Aq��(
��}/�A�
�����e�_°��l���K� �H�
��鏩$J@CU8��e��uP@����'���r8��z�"e���AC/$�@����@B�Q>�z�	w ��5!����VA <&�e�Q39�aQ�
�=���r�?,�JH�(���P1�;c�D�F���U��/�drO�h�bwA~�Ѓ��$A:��T(u02I4�w�s�.�Ry������UVDD#�1{:H�W�QuG���#�����sFF%�� u�A#�J I�}�A:�.�����~�$�TLA& �I����c���z|�2���	'� !�� )ڕ����7�zy�z/�tFR�|��P�e������V��o/o�~����?��NY�ԋ�������>ɯ�? ��gh�"�1��&�������*��?ˇ��i��o��|����:�W�O�u�g���������:Y��rd��@�[-o�[���l���%�z��>��4�x��|[H�Eiu��f#�x��?��_|��q�m���y�� �|�7Ɵ�C�]���}?�}w��:\�WSya�H�l�Bj��[s�}�����{ڹ�h6�.�,R�xq�tV&�m����c�i��������ӷ���k��^�e�nl��5�ϋ��>�,��sf*8=F�ny��� Y�]\F�bO
����M�������p�n�l���5�r]��Ϋ7ͺ?%���?�����S��ݿK:Ls��X��<~7r�eg����>�L������]DA��
1Dܷ�/�Ň�f_]��N�0��8�?2b�� �ڕG�z�% :1G�PIu]��
\�DieD�"�ie���)	�q@l��g��le�K$R�k-9�"@*��ND�*�d�q@U]=�DH�dd$��������]I<,~�	��).B�%DX�� u�c#�e���fz"O���������QPu �R�Q��6�FJ� �t�$������@\�>�z��$�) A
F����'�H.P�	
��P�0�u=���� rfܑ2
�$ ce?��d�&g0��j�ܨ��.<�DB	(@h$��opQYȵҀK.9K`���*s�:�D�;H]#��u�9�� �
 ���9���Q���s�c�2=�T��Ñ�0�e�IX�B��@X��E<U��C���.F㆖րNq��eds B�W=�F�Nb�2d�������R��
��G�Aw�1w��"�����".� S���)��"lO��U�85X�c��khT�8T$�1b;-f-��&5W ��BO��!��BVD�A6��B.
 y�+ΨQM���A@@pO*
LEa�n7@̲3�G�hr@�ww��A�\��(�#�iO2EApUR⁃D���A�U
�d��8�{Ph��S���r�1���!S���@�@���E �(��~�2Ȱ@XwJ9����Uh�v��]lh� 2�lI�Xi@�!)�x�#mP�qj
Y�r�=�+�@��r���Ho�PQ�FAww���E���Q������Q]r��Ծ�@��U;�R�
A�x���,���qޒ�B
�7uH�=dq�C�!$���U����8��L?䲪�!�~(�-�k�_)�_��ױd����ub�0-8�� ����� �'z����� �O��t�rea.V=�����3L����c������U.ۭ�I���Q���;���y�.\�.��������rǞl�0D������4����7��d_e�u����L{$'�z��R-��_2�?L�I��H�l��L�~�l��_]v�kv[����]���'&#�膴rj����s�o�~^t�3�!�a;���k{���w	꺶���w����{ÿ��-���MG���ۿ��>���?࿅FHU�1� "v(�4�m�F�KWei�Y�Ȳȥ��a�k��3]�5�u�Mfg�|"9Dp��t����\z|As�)�m`���V�f����t�a�t���c(f $����#ܔ]\e�bŇt��Z���"UPD�7�uփe� �I1'���%Q9�x�
D}�t�@|��s�#�A�u���<P_�e���N%<LC��<�0�<�tK�g���BD�j�~�9��̑BO�p�az���%	;��t���l�P-΅�T���#(_�$��5����^k@|�����Z"O4q�l��,D��숔Q��Q�U4��RR����uvH�D{���A^� �Ǻ����3C��u
x�P(���"���TY�0�]�� qQj	>� K{�e�4 ��:+R��UN��J��{8� ��H.��w��f "U	� *���r� ��#X{/��E�DlC�vZ��胓WB�,I�ނe��JA���ʀ�	HB/S��4Z,���R@�(�b_��27��GM	=�9#��u@6y�N�A]̈	�8�䇘��P�n#�P rB�d"��;�@|�r �����\�����!*
�UK�� �D��(?
Ph��3B#�t��-@7�A�K��Nh4�i;bC�A$v7��hT+��	r�jrFy úQ�n�U�D�T ���U�(6D B@	�'�h�ADD�x�
���Y8�YL��<��@�Hē>�P��RP�
a�E�wLd��I8��!HX�{ŋ�B�a��)8�2$]Cm!UT۲��0���T��yG`�K����F;ĤGv
�_p���}�dr�ta��E�r� >��򨥎fR8��B����Ɓ�W.$�@�R��A�Yd��. �Ďд�Y"��#�%_���2���$)B�~�z�.� �����4Ov1#�2W��~t=D��w����'�@��2@�D�$38-�	��PnX�1�P�]
s��@�S�E��ۃ.�@�]�,��e�>�'�@��B���B�8Z��>��%"uP�HUU4]@��� ]�T�ߨ2������7U������X8"�
ĸ7��W꾕�zNHu}4��Iqu1	(�xdCsҠ�^��ߦ����!�����<��������~k�� �.�NN�����VYEi�A�5����uQ�����Y&��z����&-�v�g�?lR}��u��:�D�\a��� I� �i��+��+���O�������Y��588��?�n� z^^?N�~ K/���O��)��k�����v}3�2;}]�&+6��c��.�Ӿ�2��W����Y�ZػCSw�؏eg��\~��]�������m��n�����4�|���7M	 �u���g� ��A��m<�]�����9}5u����D�d�'����}� ���zX9�{l�����t�0Pv��!�Mx��.���!�����Ix��#�, �U���<�Ӟ��1��e	�ux�|p����U9�Q��
�YAt*��.lx�c ���]��s��w��C�8PHL�^Y�"#Oy
G: ��1b����Hp)~w��rKi�bF��3��&E��D�{h9d�$Q�
B���J"O<�<�	�����/����~tΖ� ���%�Y O��y����"$�!���h��7ȏ5"�r�좹��̃�\�Ū��rݴ��.�+*TS0�An錐>�'�A��R � ��P��p�PA(BH�vm�*�&���F�x$T*uJ	�R��-q��P���@&�80(@-A�m"%�݁r����Q%����7��ଝ��P@a)��M�Ce6P����&2����Y��`�vM~��c�nЄ��]x;Z�	�j"���A��u���E*
wB�vZ�Of!�$nW�.�4]h
4@w^v��4`e�b � 4^e��APD���o����)H+&�6*UM�h,�&��1"a,�D&�� e �b%��B��A�$v��v���(4bg���% \�kڂ��� $
4&���t��)9 5P�G��A6G�;��5E�
�cp�E"�{-$�X2�e��}��2 d]�HN(P,1�Y�I �D�F
���gT�W��&��m�	�4e�J��sdQ}h���O�7�Y�FCv�2 ��Gǲ�H0�@#eJ�/�,'�U�4B>�,�ٶ@��w�PXLH�x�v����,r �+��J����/�w" q�I��#4�Ip
�z�o9�h����'�3�ߘ���'8-���}~�
.���:�'��L�������*�,e�I
������:���tן�ʁЖ5<J��]W��爉�I�2v�R�C�F��?

s��T�eඊ�j3Gl��U�.�W�@��'.�5�mm��
Y���$���~e��c��ub��_�;�<s;	 ���S��U@;�g� Ae���2��zhh:t����I�ɏ 2�(�����S�� A� �вy=Ayt]D��?�ydʬ�B����=F?U�iˡ�a�&VXz�� n�b9���>�w����N��YO�@L�v��~�4/��D��W��X	�
�='᎚C������͒a����U�G���G�����I���B$��E��A�z?�:�c�Y��9&�e�7m��Gڃ����t�.)t^��f	��sr�I��UG��R1T�n�Ψ�>��tq�,G=�q����"�1�{"�m�d�?���Z礷F@ĨGǲ��L;�6g*����G4f�7s!��e��@Cl��8����+��[G[PC� ϋQFt�s菁U	 8֊�3�r�/ub���]�rm{Ȕ<(W���ru1�6){����W&H-���O��@ɔȻ�x�g��rL��ȒB�VO�����0��B9���D9�[ �ś���b�7��u�	�!"�T����@M۶n�(�(��R�1��Dv�"H2_�D�#�dT�$IX�փ�n��q-ߧ.TY"qru�U��@�T��I�( &�v�$L����H��Pi��Ii�gpPqf�P|��
�,\)	�z�cS"�{�S���Ua���H A'��
��t��-@p��W�g,x
! y��*�����v	#Bn�]�#�%0�j*=�z	�8���6)�b.8P��iR,�DZ
c�Pl�^Ͼ�Hn dS�$'

2e�U�JD�H!�/�+���v�"Tɍ��O-h& �@P��oe��9D!݈����T�3� $�;��}u�%1B�aP�ƠK��	����R�<'�Sho�����X��I
�� �IVR-m(
�V6H����6C yTE]��_��A	��[�n�D9���GT /.ڃ�r�MqLo)`B4ӕ�Ee�q�BJ��BW��	�(d1�"|�2��gIn���RWRZ�ê���$J�1�Y	��f� (mK6��ĥ(���
�� �IVR-m(
��� xR���4x1��d�5�Ph�������g�����5��Ԡ9q��&�B2ꃲ�����.5a.k{PU�b#4b�P��_�@e#1p�$ �۲��6��d�4����ḢBSv�.�AF���,M���yۍԠ�K���("	H� ���D
�tp()�;�����A�nIA7@"`����bI1* 	 �m�@�/n�A ��

bI%7��  7H+���ғ��
U	7%ʸ��A>XD��*O��ƀ�*��D��H���J
���ADF����L�}�y�Be����T!���R��1@T�%Oz
RQI*�!�B���(,��� �	����~��c3��3$��Ŝ)ǅ$F�T�Tk���c$��H�����PRDbPm ع%�PX�!܍�ܚ>�z�w�ĠH-���h���*JL������q�7!*�UQ�S���bGq��m��m�TS0ݤ 1
��5����(2� <��:3ydg�Q�U�?UB�d�u����X6���k
TM�ʸ���W�w�AS̻����H��X� v��P���8,�TU�ċQ��<���IGt
~%ř�4ffVW12��q�EC���T!��$��&F(
��!<���BT1#�� }FH��U	����A��d�T�*9MxPif��KBL�D������!&$n,�H]O
 3��J�J�x��B��	ci$)PId0� q ع%�Ue�R;���:��	�H�q@�� �n8QB}_�Ĥ�[�]M��
��h,r�a ���m`.*2���	@	����� �RQ�.t�A��^.e���UG�i@Nq�"Rc(�
F�Z��)U�x�}=���e���RBP�@%���2))'���T5�
�%�ek?���� �t$@%�9T�(�� �ƃ	��
w���;q�������(	����H���PS ;������ܒ��K*�0Z��P�$Ĩ $�E�o}���)��#��()�$��KD� � �x^�JO�)T$ܗ*���aN��<K�o,��+ .�/}(4v�U��`� ⠣iċPl�>4�DJo�^�+�,-DfVW12��q�A	�bs��AP����IJ3��RD�!<�4e�'*��+��D,aU��c)IE$�T��
����;��|&FJxju��A�?ɚ����!x�"J7����^/��F�����
Gm�-�Uy�X�%X�%+~,�C"�hQt"�zPL@F�M�X}TC'�5�\H�S�'��p�\xr��@�	4"�F�}� ��I!�%�o�����^dvK��b�t�����cD���@h$���7WW[�h(�T�Fظp��%��"$&��ʝ5�;�Op��@R�;()"YNQugQfS�@�I2L�*H�)�hLb;�J����Eg�C'&$:.�O}�����D���J2���P,�%�}�J ��؞	��(�1�E#"^��� R@U�P)7x����
JN���Vu���a�4$�A;(L�Ġ��"M�`�@�7�#���Aa=�� ��j
e��'b�	@��(43���@*�$񸠰�7R��I�J
d|�e�����;(0ˏ%�!6�x�(�`6��:��)A% F�D�(.�����ӔdULu<�$�PXNb�M@��*Mɓ��!]��τ� ���J){
,�ݹge,�t�$��22��F�d
��S�'19)1ErW�g��q�-�@��;�$��E����TWNaW�ǔ�LX��Ā���[���KV�Yh6.�P"$�Qr�ޔ�݁
n4����\�c5�\T!N<��~���.bܿ�T�8�HD!� �~�� uPe�1J7+}�TY�ȈH�,I�o=j����a"%d��:�yǘf�P%pW��AGQ� ظp��%��y�$&��+�ހ����	
�g��E9��������)N5�N������)�j���;Д
�����1��$";Y�ʢ����";�i�~M@g�&*H�5ETO��~�R�����JPrOu���C��t���(&RL���
��szr	HAW��IE/aAg2�D��)f+� �XFD�D#j�QA�d������%]�=�NfFO,`w�IE �Ps�����[�}�9 <��d:Pe��U�RP����A1�0"*v�B-���n�߅��Ad2yq]�ĉP�8�zg��%�'�/�
�,����%��Vue=�	$�$������X����D�#���(l���(Vp�2rbC�����I�!Y4I.!�T��)� I �Ȃ\��A���	�����Ar��Q1�2%�K���� e$Qn�5�w�;�  ��4���0X����g[PI6�BI������J
�n"$�� m
�0)�.TΎ�E,�q�=O�
�$��d��%G :*�I%�D;v�kj��r=��B�)Ψr��d�&x��
e9��Ve�_��2P"���;�)�!�
�G�%l� -��`� *�`�Gqe4%"�"���	!9J�
��'#�K/s��:JfCr&�$�A��($�dP��T���4s*e=�h 1їZsdC�Ebt�K��4J��$m��H��ւ��%D풃���RÍP�����;i,�����I���
�U����M�H���Ϙ1�[����@<� �J(K�V���ٺK#$ �kT_0� ���ߑ� �#�!��:�'D��<��P�2�`*s�ݷi�	M�<PH�*���䜀&!W��;�(�A3NqH�����Ѩ0� NR��aK�v}���"�;��
�G���.A#��!P����G�U$ A_g�P�'�D�1�n�q�Ö�W�PRPy!Læ��4��"@ �m��@IH�G�:@��#%(elgr v?�����	M�@�ʂFfH�#pF����9y��1�|�'�V��H��
��Tp`����X�$C�h涨!9'#�K/r��(�H�`��^ �xPI�{"�������>�
��	wQA3BQ" � �xp��0�����Re;�T�q�ЗuR=�R�dQ�:��(DJ�2#�*� *��4;�n��Y�y�^_���X�,A�P,\�a@v�;�qs���Ac�Q!�=�U��}�Ri���*G���(4%�*����_��G&8J��$��n��i�y0��k�+�;b��ؐ$��c�9%��/ª֠єd{��"�(���A�b�D?y8\


OI��Y��
�wU�����Yn��}�t��� �Ed�uV,~��R�R!b	{���ܨ�R�
�
 ��I���}�Kp���F\젤����%P����
 =�U��}�YO�b7y���2��
�t��I��)y�v�$[UJ�Kl�Ҷ[�_�@��`;��K��lu���D�(����["�Yd$�m��5
($sc�3&$�
a^�2	b�E@P�rM��@�5��/�m�c)D� ��W����YHy�#w���/x�ДbT���.I~�	��(b���{9�kA�)��� ^�������Sb@ �7�Q��䖺�{
�Z�FQ������ ��-Xq�����p(4:��� $B�� 6���B`�!����(7vQAtPO{#��@��`����kf!�����S�K��T�}�y#
FD�@lU�s:( �A-�;P�R�~-()����@�e$�H�i2��oR��X�Ǽ�o�!ķeQ0�`��"�KD��4�D2��*U	��:����a.]�����8������jwNDH�72���A2�$���p��T9O���1��K��}�Qɹ�w��#�%3lGx��BO��A�*�n�����ʍ����],��F��!��DB$���@�g)���x��o�$Dy� �"&�(*���G`Gb�i0S!�E�v%>��e�B����K{�T,S&;�,�%P8�P2��������l����h�#.�( ��؂A��9�%1��k}�E�X���h�D/���D��k�؎��	G.�g`�(!(���D�C���I�˻��	%4�Qc��w��K�+��j�DŔ)w�IU^Z�Ad2(�D��(����PH�e7�N�-A���2-��T�ۂ�z
d4��ħӕA��え_817	ob�*��d�'{%�$�� FC `��VSPQ-�0�pmDeփ!�Ш���{h�(��RHPumh�g2 �R:���ADRD���X�s�A;�v*��{h.8��؉��t�u�x�,��4�AmX��Ah�"*���hð�z2�>�D�`�X��J�}TD�#� %Iw�}R�����m�%F�lh�w�#$,��(���A�`5��v�H�
Pm�Id�7$�^_�Ƃ���I��������J6�������3�DH!���iybI%3�xǈE�y
!�""q�{5��"%7(P����ɐ$�
�h���,��B.�t]@�@��q����87���@f TEL���D��@��qD*��^4d�m����R���M��f�પ(`M(�"<� 8v��h�0$�*B"����d!�̠�@��J "H	� Hn��AO�J���l�Jr��D��W�r׺��C!�9 2��Ie��+UB�C���FR����}��E���c���kʂ�,�n}�Q��
 @Hm��(T�uG���T����� �H2NExh����JX ��Ae��;�$�.�vPC$�8�pP��U��8�$@TmF���Hb�|�$��VրJ&s"
`U#�_شE$LJP(��>���`R�[qPW���Hm��!	�N�Z�b��N$Պ�����!b����o��l;��+ p�DJ ��:ī��AI"9T�pJ0G�(()���ڂTi�Ɓ�a�yR2B��R��ݴ� cX�wh�����LSrI���h)I D�0K� ��A{���l^L}�Q�i�s0�A����$�S8��x�^'���2�B"'��Z
����ҁn#̀�a[F�N8q�NҤ")
���A2,�
Pm�Id�7$�^_�Ƃ���I��������J6�������3�DH!���iybI%3�xǈE�y
!�""q�{5��"%7(P����ɐ$�
�h���,��B.�t]@�@��q����87���@f TEL���D��@��qD*��^4d�m����R���M��f�પ(`M(K����mٯ�@gh)(���売P(!B
*�R��ќs(� �%r�,h1�'̷͔��e ������m���Qd����!PI�T��H���Ȩ��rp�R���`D{K�8PS,i��`� �U�[�( �ð��p� ?8�W3�1 J��n��ƀ,��a	DB�
ţ��t_B��ڂ��!�N{�J8B�(11�f��k�&��b@B �;��$�IR*��
{� ��H�z�%��_$AATIYBZ
J#�b9h�
AB�����<�4g�2  �\�Kd	�e3-�"H+���Fq2�g'w�Y($��@D��TC��?m'�62*&�ܜ(�q�y��N�n2�& (b��
%��/1�. ��4��LH�%[��q�-��F�Q и���1h�1�У�6��dH`���AR���Lo�;D�I�����$����<��T����� ���2޳IF"�C��,IPU@�VP���G$d<�	�2��E��>��,q�D��{�F$�\q�ґ�7�� �츠�&97c HEK9#�U(Y"{�*D�ջ(,�l����TB"]��dN3$����?�É��(��F䑠�/AXL��"����{�d8�Q'����%%�T#�$"�7��{�q��
]�[A�`Vbd��Y6�((���%8�8UJ"6FM��� ���29@)��WFӲ��0�q�[�*.�		�`ɻaM�H��{�J8�9�,�ݸPYnA$7@Ay���1��"xǺl6&ـY�T�P9eّ.�T��Ab�&�=��R�,/A���2���.�(1 	�b���i��fv����؎Z;%�P� ��!,O:
�()��L�����J	!�P;r��eO�@D��͌����'
)p^FG����2ƛ��	�
X�e���	l;�w��#�s8��	V�.�h�l���@4.8p�� LZ;LwE�(�
������k�>1������~��./�����=����m΃a����z��c��� �� O��Oe�l~�vJ� ��A��h�[�����|^)v�_��ǋ���co��O{
�Ϻ�O �w\�O ����O �w�O ��N��O ��l�O ����O O��
�O gٍ
��O �T�8�O �tXJ�O �>tx�O hٿ��O u��ݝO �%M�O ���O ;?��O 4A�O ��`�O �z�'�O V�=�O ��I�O ��HJ�O �H7o�O �|Tv�O ����O L����O `ң�O ��%��O ��F̟O ��ԟO B	uܟO kL[�O w=�O �n���O ۊ��O j�b"�O XFh2�O �CW�O 2�Y�O �u�O �@%��O ��\١O �>$��O *�9�O i2��O ��P
�O .��:�O ��Wl�O ����O Z骭�O "nǣO ˟֣O �e#�O ����O xx�*�O hO�J�O �Suf�O �k��O ܑ��O i���O o��O �����O ���O ��:�O �G�i�O ��$��O M~x��O �E���O *�I��O �����O �pǧO v�CȧO ��+ͧO ȪR�O ����O ��a�O ���O (�>�O ���-�O �>�8�O 8v5O�O ���Z�O �'�]�O M��v�O 淥z�O T���O �Q���O ����O ��M��O ��W��O �jl��O �8h��O ����O �ʌ��O ԏ��O  5>��O �$��O ]��O 4O���O 6����O �_=��O 'h$��O ����O "����O 5�_��O 8����O ��)��O 3/ԥ�O �7X��O ��v��O �~���O �,��O A�l��O F�.��O |���O �����O *�N��O �nc��O ]md��O +���O y�@ĩO �1ƩO ��ʩO ��NʩO `q�ʩO �R�ҩO N��֩O H �٩O �4pީO �X��O ��&�O �˩��O �s���O �ɫ�O U/1�O d���O [>���O N0A��O �ċ��O ��y��O T���O ��q��O ��O �̂�O T���O ���O �Ȝ�O �`>�O �H=�O �I�O �`p�O ���O ���O �7 �O r�&�O i�'�O ��(�O H��)�O -��+�O �b�0�O "�1�O fX1�O ��&2�O l��4�O ��4�O �5�O 7�O �
�O �6�O cLK�O "4w�O D���O ��!�O �S4"�O �@{$�O �&�O �)�O b��)�O T�m.�O 5g�0�O �<�0�O =�8�O 7N>�O 8ETD�O �RE�O d�pF�O BRG�O G�J�O �^vQ�O �'	U�O �XW�O bifW�O ��[�O �~�^�O 3�n�O ^^(o�O $Uq�O 7�:{�O �A1}�O ��B��O ÐЍ�O |�Q��O �Y��O KY��O �A���O �N��O ePT��O C�X��O ��Ⱦ�O �����O �ƾ��O �X��O �����O R����O ��s��O �-��O �m���O �O6��O Ί:��O ��9��O �X!��O �AS��O �%n��O sy���O �ݮ��O ��� �O �� �O ��
�O ~��O ���O �>^�O ��D�O }N_�O 
o��O �h��O Q���O |Ǵ�O ��-��O �6���O ;"���O /|��O '?��O י���O �����O ��X��O ���O T���O ��7�O ��T�O 
��O �K7-�O �Z-�O ��%.�O FL4�O 7�;7�O i�4I�O 'BnR�O �C�c�O �� j�O ;��r�O �,s�O ��x�O 
)��O �I>��O ." ��O ��;��O ����O �s��O ��v��O q���O ���O �I"�O �$�O k�-=�O ��=�O -�[�O �7tk�O �Sw�O 7�!��O l~��O 	����O !����O H>���O 
Pu��O 	m���O ���O  �.�O �a=�O M��Z�O ��i�O �Ŏ�O eY���O Il^��O �â��O q�ݳ�O ����O ��D��O 3���O �S
��O j��O ��3�O z�_N�O a��N�O �V�O�O "�U�O `ʆY�O m��k�O Tؼq�O 3����O �����O Q���O A�I��O 0&ٽ�O �H���O i
�:�O �έ=�O ��UC�O �IQK�O T��Q�O I��T�O ��]�O ���b�O ~�d�O ���o�O ��[s�O �׿��O ��c��O �uϛ�O A�ث�O �>���O �����O D�f��O a�	��O );���O ����O {���O ���O ���O AdD�O �O%�O �k)�O /c/,�O c��0�O �q�4�O ���5�O �ohF�O h�g�O ��o�O ��v�O ?�\z�O N��z�O .]��O k����O P0��O \��O gW���O 
��O �vH��O lJ���O  ۚ��O ���O ����O �2)��O xn��O ϫ���O ����O <N��O ��N��O ����O y��O �
��O G`��O ��{��O �B���O ?��O 	x��O ��9��O �)p��O �˦�O ����O wdɧ�O �ۧ�O @���O �M��O �yK��O ����O Q���O ���O ����O /R?��O �G��O Õ���O \�)��O xe/��O ��l��O ����O ]�ƫ�O ��ի�O ����O [fJ��O L�۬�O ~-��O n��O Px��O 
f���O �/��O ��G��O ��e��O �̟��O Q!���O `T,��O n���O j1���O �l���O Ơ���O �
7��O �T��O 1m���O �[��O ��~��O 00���O �#��O %V��O �t���O �y���O ����O ����O ?��O P2*��O Dft��O �3���O Y�t��O pH���O ����O fj��O �h���O r���O �r,��O �rD��O 	2E��O �Fu��O i�9��O *���O ����O �����O ��D��O k���O �����O >36��O ��q��O K�L �O ��d �O 2�� �O U���O �m��O ���O �p��O ���O ڌ��O ���O �3�O ��8�O ��z�O �o{�O �{�O �x��O ٞ��O oD+�O ƓE�O մu�O "���O ��G�O �R�O c��O �y�O /_�O OC�O ��W�O &9��O L\��O VФ�O E��O ���O ���O ���O hz��O �	�O K�b	�O S}�	�O L�z
�O ��
�O R�
�O ��B�O ICg�O Ο��O AJ�O ����O Ƞ��O ̖
#�O gN#�O �d0#�O 
�D#�O h��#�O VJ�#�O �
�p�O 2ztq�O ��yq�O hL�q�O �)�q�O �pr�O Z�r�O �ڥr�O ���r�O \>Zs�O �js�O z�s�O E>t�O F"Bu�O m3�u�O ��u�O m�v�O �#v�O O�v�O ƺ�w�O �n@x�O �Wx�O ��^y�O �a�y�O ]y�y�O ��z�O ��[z�O ��S{�O =��{�O X��{�O Ď�|�O [�|�O ��>}�O �P}�O ȕ�}�O �/�}�O !ԁ~�O T/�~�O ��~�O %h�O �$��O ��O �
7��O �qQ��O VX��O s��O 3Ū��O �>��O eF{��O ����O ����O Q���O ={��O �X�0�O ��y8�O ;�]=�O �q�R�O OC1c�O #փ�O �ϔ��O V���O ��@��O ��L��O SLN��O �����O _ٜ�O �$w��O 5����O ��)��O Z�d��O C�X��O q����O ���O +^:��O A����O o|��O $�	�O �	�O ����O rRB�O ��3�O FvwK�O BwY�O i��\�O w�!e�O /T7o�O O<yr�O �`�v�O �7�v�O ��w��O |���O "���O �쯣�O ��L��O �ܷ�O C*T��O �����O z����O !<���O �����O �R���O �4l��O ����O ���O Ey.�O �3�(�O _�D5�O ���:�O �+?�O ~kJ�O ?�N�O V]{Z�O �!a�O �][e�O h�n�O &a�o�O �_n~�O �(}�O �#��O �4��O 广��O ����O 6Fy��O �1ʾ�O ����O ~��O �����O �g3��O L����O �I ��O ڝ���O fw4��O _]��O �-�O ��[+�O b�q>�O <�A�O >��L�O ��N�O 
��a�O �[�m�O �0��O ��.��O �61��O dˉ�O �័�O �j��O 
�O } ��O �7��O S�\�O �%�O |�y%�O ΁(�O 1z�*�O 5�5�O ���6�O �-@�O $d�N�O m} R�O �U�O �Lya�O ��c�O # p�O I��r�O C���O �2���O GWx��O A����O %��O i^��O #�P��O �Q���O wJf�O �2�O ���O �1��O ���)�O xx�/�O �%8�O 	wI�O {�dN�O ��&O�O 
�Ko�O ea�q�O &Z�zP ���P f��P �YƉP 4�S�P ���P ��[�P �
�P m���P T��P �e\�P ���P M�<�P 8EK�P ���P ��ΤP k���P ���P f�P ��̭P =�0�P R)|�P �3a�P r#��P ~˸P  aϿP o�P �n��P J�M�P Nt%�P pXb�P ��#�P A���P ���P ����P ����P *��P �*��P t��P #�%�P b���P s,�P ���P ;�P ̺oP e�AP �qP �x�P ���&P �k�*P ;D@0P W/�AP ���FP H��FP �zHP i�HP Y��LP A��QP �RP k�FSP ���TP ��VP M,�VP ���WP �lZP ��[P �),iP u�oP �MZtP V)xtP �RQuP ���vP �
�ЈP ����P gYI�P 2mm�P ��1�P fòP JR�P ����P rX�P �@�P 8�P e�1�P ���+P ZvDBP 6�CP �QHP Gt�JP �!�rP x��xP ��o�P ��j�P u�A�P �<��P �y�P o��P ��*�P �� P �~(P ���
�P EǦ�P ez��P ����P �F��P ��u	P �P CO�P ^�"P ��#P �`�%P �)/'P �u]?P �Z�_P �>qgP �|�jP &�F{P s��P ��.�P ��P 3�<�P 56��P ���P i�+�P ^��P �x�P d�T�P hF�P q,�P rh��P vZN P �a�+P �A�0P ��-<P �1'QP �:�XP ���fP y�P �P ���P ��A�P ��½P M���P �ؑ�P �|?�P 炧�P ���P a�BP �t�P $�8)P 	�3<P �^dRP -�TP X��XP ��[P �`P 1��cP h�"�P ��y�P  ��P ����P �o&�P 		�P ���P �p*P ;��-P Z�2P ��:P 9�]>P �Y:@P }��[P �7TqP Y�˃P Sۼ�P �]˔P ��C�P �
'�P l{��P �%��P Q]��P �^ �P f���P �+��P _��P n���P �ka�P DI��P �0��P �gP ���P �<P N�P :��P 3�tP Z4P ��8P �p�9P ��,^P :��P �F��P l4��P �Yn�P �9��P %:>�P y��
�`�P �K1 P �!M P ���%P @K�9P ��;MP ���fP �M�mP ��n!P ��!P =ȷ�!P ϲ�!P P�Բ!P 1��!P 4��!P P "�!P m.�!P �Yk$!P c`C!P �F!P �-�X!P {��k#P Q��#P ��6�#P ��#P �y7�#P �#P _��#P 󘡷#P /�>�#P �9��#P ����#P �*��#P Ʋ��#P \��#P ~Pp�#P �;q�#P ��k�#P ����#P �AG�#P �t�#P ���#P ����#P �; �#P n���#P S1�#P bTr#P w��#P ��#P h5#P �	�#P D�e#P �U$#P �i.#P �7:#P nZ�>#P �T|V#P �h�\#P ʵ�]#P G�f^#P �e�f#P Pj#P $]j#P �j�n#P G�o#P w%�x%P ��>�%P @���%P }+�%P �ah�%P Z�ә%P �$��%P T�
�%P p���%P A
Ң%P T ��%P �$թ%P uh9�%P �Fݯ%P �c*�%P qf��%P 6���%P 9օ�%P ����%P ��-�%P pC4�%P ļ'�%P &�j�%P ��v�%P ����%P �@b�%P Ov}�%P �
'P d6�'P �44'P �'P н'P Ȍ('P ��.2'P ��3'P '3�4'P ��V='P ��-F'P �r�F'P �'�G'P ʉ�G'P sx�]'P �EIk)P �Ɍ)P ��ܱ)P )�)P nŐ�)P �A{�)P ��s�)P K-�)P ����)P �')P J�x)P 2|m()P ��.)P F��@)P J��a)P �m+P c��+P fI��+P �
<�+P ,Q��+P �ɲ�+P e��+P ,�+P 
̧�+P ��b�+P N;
+P ?W�+P ��Y
P �^L+P p�!+P z��!+P �t#+P ��(+P mS;++P =�y;+P t�4?+P ��T+P �4JY+P {��k-P ~K��-P u�e�-P �:�-P ��̢-P ��ҭ-P W)��-P 2���-P yv�-P [��-P ����-P ף��-P J��-P Ho��-P �D? -P �=�)-P p�c.-P 2e�5/P tbށ/P jv��/P ���/P ��z�/P ��}�/P Ep5�/P ���/P q�ä/P �kW�/P cz�/P H1+�/P �|��/P v�D�/P 0��/P Su�/P ����/P ���/P �8�/P SW/P K�/P �	`/P �lR/P �{z%/P  ��*/P �./P J�D/P 10L/P ʴ�L/P �!;Q/P �5�T/P ]EtW/P =d�X/P ^y`[/P y�^a/P z�h/P ���l/P �Qm/P Q�Wr/P /Qz/P �: {/P �v}/P �

~/P �/�1P 6���1P ����1P 'z(�1P &ڼ�1P +V/�1P �E��1P ���1P onf1P §|1P zr	1P �1P CH�71P U��L1P bRh1P &�l1P ��$r1P :(�s3P �Hr�3P ��n�3P �l��3P �3P q���3P eR��3P ���3P ��3P �
u3P c��E3P {a�K3P �N�Y3P -�p3P �_z3P �{5P �ۄ5P 	 ��5P I���5P /��5P �o�5P B2�5P B�i�5P Ԗ%�5P �c��5P |e�5P �)5P O,v5P �/5P n�[5P X�!"5P \l�)5P ���,5P ���-5P �?�15P ��.25P ^f:5P ��4B5P �s^G5P y�[5P ���]5P ���a5P 7�2n7P ��:�7P $U�7P ����7P ���7P ��7P ��n�7P آ�7P �0��7P �E1�7P ��7P 2�$�7P ]�m�7P ~�a�7P ���!7P 2K0*7P �
O9P Y�`Q9P '߮X9P ��-i9P �j;P D�΀;P )�׀;P ��;P u���;P �N��;P q<�;P 6�;P |F��;P ֊t�;P 얭;P `	��;P �8��;P ���;P ��C�;P }yX�;P b��;P z�2�;P �ٱ�;P &!��;P #��;P 8���;P �)�;P ۉ��;P lI�;P ۶�;P ցi;P S�_;P 	�h	;P J��	;P �$;P ��
0�?P �Ƀ�?P v�?P ��I�?P ��?P e�&�?P urf�?P p�
�?P ����?P �^�?P ���?P ��?�?P y��?P �N�?P ����?P B��?P Ռ��?P <һ�?P �(�?P ��?P -��?P �,��?P p���?P E�?P ���?P �=V�?P ~6N ?P �_�?P ��M?P q��?P �;B?P ʬ�?P �x	?P �i�	?P l�?P x ?P ���?P 4��?P ;�?P e`�?P �d?P �lL?P �%�?P �p?P �a�?P p'�?P �^�?P T�?P Q��?P Bv� ?P ��"?P Z�$?P Ч�&?P ��&?P r">)?P ~e.*?P �R+?P ��+?P ~�1?P ��C3?P �'i4?P �O�4?P ���7?P ��(<?P ��p<?P ^%�??P ,�@?P ��A?P �~�A?P ��pH?P MBqH?P �}�J?P F��L?P ���O?P K?�O?P MN�P?P ��Q?P �R?P Z�nS?P �3&U?P �XV?P �-�Z?P sB�\?P ���]?P | _?P j��`?P �R�g?P �\1h?P P<Ui?P �fn?P ���o?P &k�q?P W�Ut?P �`�t?P �|Mu?P ���u?P �+Gv?P �`fv?P ,�,w?P ;mx?P ~��x?P �J7}?P ���~AP ��҃AP J���AP �V@�AP ��D�AP �ך�AP $3@�AP �%P�AP ����AP +���AP ���AP ���AP %��%AP �s�(AP �RG*AP ���;AP o~�JAP JORQAP [�~CP j軂CP  A�CP 窈�CP ��ӰCP �@�CP 0*g�CP �]��CP ���CP ]k"�CP �1�CP �+H�CP �E��CP /���CP vQ�CP ��&CP ���2CP ��FCP �W�HCP �ETCP � �qEP �ҁEP �s��EP �LˎEP �ie�EP A���EP �Uh�EP �դEP ���EP �Ǻ�EP �}�EP �1��EP �V��EP !�F�EP ����EP ��T�EP Hj$�EP ����EP ��
GP WipGP �g�GP ˹�GP d�GP �>�!GP ��&GP bκ(GP H�Y)GP ]�H0GP ;J�XGP � v^GP I�-hGP ��LhGP `K�jGP g��jGP ^umGP c�qGP �{^tGP KsowIP ���IP B��IP A�d�IP HiƑIP �G[�IP X	��IP ��d�IP ��j�IP ���IP ��ݹIP V���IP ���IP ����IP ��I�IP �&'IP �{
�(KP ��/KP 4r�5KP ԶAKP ��=`KP �!
gMP kSr�MP ���MP �kQ�MP \Q{�MP �F�MP =@ӢMP ����MP �N�MP �(��MP ����MP E���MP *q�MP F��MP ���
MP 0�[MP .i�MP g��+MP ��6MP ��<MP �&IMP ʤ3SMP �!lMP �=�{OP \,��OP #�]�OP �K$�OP +�P�OP �:b�OP ۱ �OP �:�OP ���OP 6l'�OP X0��OP � nOP N��/OP ۑ�yQP �A�QP 5@�QP JA�QP �1�QP �^�QP �bP�QP y���QP ���QP �c�QP 6���QP +g�QP �!@�QP LjN�QP �z�QP �h"�QP |�K�QP ��P�QP �b�QP  2@�QP ���QP t�d�QP J�QP -刺QP H'�QP <Z��QP �A�QP �`u�QP ��8�QP �{��QP �!�QP ��p�QP �=X�QP �{N�QP  Xw�QP "z�QP I��QP O��QP rH(�QP ~@<�QP ��T�QP Ӗ��QP HM�QP ʔ��QP ���QP j���QP ��QP T* �QP ��QP ��	 QP ���QP ���QP L�:QP �XBQP ͟�QP ~k
�*�YP ��0�YP dM�YP k�ĆYP �	�YP ��7�YP �0��YP ;�H�YP ��YP [k��YP �Ӵ�YP ,�3�YP m׉YP �t��YP }��YP ��1�YP ṭ�YP ƊYP ��YP ��J�YP gЋYP |�YP p��YP Ɣ$�YP ��8�YP �s�YP ��1�YP "$B�YP �G�YP _n��YP 0���YP >O-�YP BF/�YP �"U�YP �]��YP 2+ݎYP ~5)�YP �=G�YP ����YP f�YP �MU�YP u�j�YP �,��YP ?ʐYP o�K�YP �V͑YP 0�_�YP �͒YP �n�YP ��YP ��Q�YP �U�YP ��g�YP ̱�YP ~*c�YP z)�YP ��^�YP F�ĕYP i/�YP u綖YP ���YP ���YP m8�YP �]:�YP �JڗYP a>�YP ��YP ϲT�YP Fzd�YP k�v�YP A;��YP %BҘYP 9��YP n!�YP ��ʙYP O=-�YP Fe�YP W ��YP ���YP �^y�YP �t�YP �W��YP �V��YP (��YP �/��YP ��3�YP _Q�YP �f��YP x�YP ����YP 9՟YP J�YP ���YP L�A�YP ��f�YP ?̔�YP z;��YP �rΠYP vԠYP N�
�YP oS�YP �P��YP �6��YP Z�ϡYP Ĺ�YP Bt�YP ���YP  ���YP 瘢YP ��ԢYP �d/�YP �'��YP �ֶ�YP �R!�YP u�I�YP ����YP �UƤYP 3�դYP 4��YP �%��YP �0�YP ����YP ���YP a)&�YP ��\�YP �[~�YP �ǣ�YP ���YP #�c�YP %0��YP ��x�YP T@ըYP ��z�YP �T��YP ���YP A�ȩYP �ʩYP ��'�YP ��,�YP vsC�YP Z�I�YP w�j�YP �&o�YP .銪YP ,�˪YP ���YP /'�YP ����YP E��YP �YP :%O�YP 4˭�YP �ĭYP -!�YP 
�&�YP Ԩ;�YP e�\�YP �^ޮYP i�c�YP �'s�YP �įYP ��˯YP ���YP ���YP L�d�YP S�p�YP 7� �YP ��A�YP !�J�YP �^p�YP ?�A�YP �v��YP �YP k��YP ��K�YP ���YP �)�YP 3S�YP Spf�YP �\��YP �#��YP $�ȴYP 4��YP (d�YP _1��YP ����YP ث	�YP 	@�YP ��C�YP [���YP �#�YP '�%�YP �<]�YP g�b�YP ��e�YP ЙɶYP g��YP ����YP yJ��YP �$�YP mm �YP �,��YP �lǸYP 1�ԸYP �ڸYP ���YP �8�YP ��o�YP �Ns�YP ���YP /{߹YP ��YP �|K�YP ?,��YP ���YP �O��YP 3i�YP W��YP l�-�YP >i2�YP ~;�YP �,��YP �:��YP �o�YP �c(�YP f@�YP w*B�YP #�c�YP ����YP (�żYP ��ּYP τ�YP ���YP ^��YP oL��YP ��YP [&_�YP ɓ��YP ��Q�YP t�i�YP ڎ��YP a���YP ��YP !	��YP �l�YP L �YP �
Q�YP #��YP ���YP �ԙ�YP �&��YP ?[��YP �,��YP RL��YP �$E�YP ��g�YP �ʺ�YP 4�!�YP �Y6�YP �<�YP ��b�YP ֙�YP �R��YP ;���YP �O�YP \~N�YP ��k�YP ��q�YP �ۨ�YP � �YP �2�YP g��YP �w��YP ����YP �o��YP �J��YP ��i�YP <$��YP {��YP ��6�YP ��9�YP 1�b�YP ����YP �۩�YP ����YP ��=�YP �*N�YP �x�YP �2��YP WG�YP ׿g�YP Hr��YP Ӟ�YP �2T�YP ���YP ����YP }��YP �8�YP �C�YP ކ\�YP ��y�YP v���YP �d��YP �"�YP Scn�YP 	���YP ���YP $m@�YP �Ej�YP 
Ct�YP �o��YP ����YP &"�YP ����YP M���YP gx��YP ����YP ����YP �0!�YP �Or�YP ��L�YP �� �YP �W��YP ���YP �g��YP O�.�YP ���YP �,�YP �/�YP ���YP m��YP �zi�YP ��o�YP Tz��YP �9�YP D�A�YP ֠g�YP ��r�YP �ͭ�YP �A��YP &��YP ����YP A]��YP ?���YP ���YP ���YP ��YP ��)�YP @�S�YP ��YP ?���YP �m�YP �uy�YP ��YP l��YP u}��YP :t��YP ���YP ��"�YP iyt�YP ���YP �B��YP �� �YP �5&�YP ��,�YP ��K�YP Vb�YP D�O�YP ����YP S�!�YP ��D�YP �}[�YP ���YP �a��YP ��YP �.n�YP ��YP ��8�YP �ir�YP ���YP �
��YP Ǔ�YP ��:�YP ��YP ����YP ���YP u�YP O�YP �v�YP ����YP F)��YP ��)�YP �j��YP ���YP ���YP ����YP �&��YP �5�YP :Xs�YP ��"�YP ����YP �<��YP X��YP 	�YP Ϳ��YP ۯ��YP PG��YP ���YP Q�!�YP ��&�YP �>8�YP ���YP ����YP ��`�YP d���YP ���YP �CK�YP ���YP �Y��YP @
��YP �~ �YP ��%�YP ��5�YP �S�YP �^�YP ����YP $e�YP cj��YP ^�2�YP C�Q�YP 	���YP �}�YP �|��YP ۠�YP {
��YP �t��YP f���YP ~5��YP Aw!�YP � R�YP �f�YP ;)��YP C ��YP ���YP Y%��YP /"�YP L$��YP Ȼ��YP �?��YP ����YP �<H�YP }���YP �e��YP `���YP �5�YP (�3�YP �PL�YP 9�YP x���YP %��YP �^�YP ��|�YP ?-^�YP ����YP ����YP H1O�YP �Oi�YP �E��YP ���YP �`��YP �S	�YP V�N�YP �iR�YP [ \�YP {�a�YP ��~�YP ���YP [���YP .���YP ��%�YP �{�YP �i�YP i���YP ����YP ���YP F:�YP _�YP }ņ�YP F��YP u�YP w���YP S���YP ����YP ����YP ���YP �/8�YP >�M�YP �]^�YP X`�YP ����YP ����YP � YP �%A YP ��[ YP +�h YP 
YP �my
YP |~�
YP �æ
YP ���
YP �
YP ��YP âiYP ˓�YP c[�YP z��YP 鰦
YP ���YP �*KYP f�}YP 4TYP � YP �-*YP �ABYP p�pYP � �YP ���YP )YYP z�NYP ��nYP ��YP �tYP ��4YP |�]YP ૶YP N!�YP �W�YP �YP E�&YP g�+YP <�`YP \�YP ��
YP (�YP �C�YP W��YP �WYP gXfYP $=�YP *��YP �%IYP 2.QYP ��WYP ﶚYP ��)YP ��lYP �5�YP �H�YP I#YP sV
6EYP 2%dEYP &��FYP /y�FYP sv�FYP ��/GYP '�EGYP Y�GGYP �UHYP 4p[HYP �cHYP ���HYP ��HYP �K�HYP �HYP <��HYP v#�HYP U��HYP ���HYP ��!IYP �1uIYP �aJYP ��dJYP ���JYP L�JYP ��#LYP ��?LYP pFLYP xYLYP X�uLYP ���LYP �#�LYP ?��LYP s�LYP �4\MYP Q/�MYP G��NYP ���NYP ��NYP ��NYP ߼*OYP k�`OYP '�OYP K��OYP �C�OYP ���OYP :�PYP �!PYP ݗPYP ��-PYP �{PYP ���PYP 06�PYP ���PYP h��PYP ��QYP QަQYP ��QYP ���QYP "|�QYP T��QYP g?@RYP ܖ�RYP ��	SYP ��SYP ��:SYP ���SYP ��TYP ��GTYP ��eTYP CH�TYP 	��TYP �@�TYP ec&UYP ��.UYP fy6UYP ^%hUYP �muUYP VȡUYP ��UYP VͮUYP _��UYP ʛ�UYP �]�UYP �y:VYP M�dVYP �ؑVYP bJ�VYP �VYP �e�VYP *�EWYP ���XYP ���XYP �)�XYP �� YYP �XYYP ��YYP 5�5YYP �zYYP D`�YYP 7J�YYP ��YYP ���YYP �z}ZYP N �ZYP �hn[YP �9�[YP H�[YP y��[YP o��[YP /��[YP ���[YP �e	\YP ��;\YP [W]YP >bd]YP �w]YP ��]YP `�]YP ���]YP ���]YP �^YP Drc^YP ��e^YP �t^YP (0�^YP f\�^YP hI _YP ?�
aYP M�aYP ��aYP ���bYP �cYP <�)cYP �UpcYP �I�cYP ���cYP  Y�cYP �N9dYP �4�dYP �)eYP �E
eYP �7eYP �leYP !��eYP Ұ�eYP E�fYP ��:fYP M!LfYP �fYP mj�fYP ���fYP �gYP �.gYP ���gYP ��gYP u��gYP RUhYP "nJhYP r�ShYP �+YhYP .jhYP f��hYP Ӊ�hYP ϚAiYP }�iYP l�iYP 3��iYP �	jYP ��)jYP �b.jYP ��jYP ��jYP U��jYP +w)kYP �Q:kYP �J?kYP �T0lYP tH[lYP ��^lYP �]�lYP R� mYP ?8(mYP �"@mYP T)�mYP ���mYP �!�mYP e��mYP �gnYP gLnYP ���nYP x��nYP �}oYP }s�oYP \8�oYP �CpYP �CpYP ��pYP ��pYP ���pYP !}�pYP &�(qYP LqYP ��qYP ��qYP ��rYP ��"rYP �?rYP �VrYP �irYP �TqrYP ��@sYP �EsYP �{FsYP >�VsYP h&^sYP &`sYP �r�sYP i�sYP �OwtYP ?�tYP dڴtYP "�>uYP %UuYP *�uYP �vYP �ivYP w��vYP {�wYP ��wYP �S(xYP ,
<xYP P�xYP |"yYP i�iyYP �S�yYP ��zYP �C�zYP �G�zYP ���zYP ���zYP {YP H"�{YP ig�{YP �{YP W��{YP ���{YP S:|YP f�P|YP -�]|YP �l�|YP ���}YP .��}YP ʴ~YP $�~YP -7�~YP ؐYP W2YP ���YP ��YP ��[P o��[P 䶔�[P �{Є[P �ϣ�[P :3��[P ��T�[P М��[P Ѱ��[P ���[P �֕�[P k
��[P w�&�[P �r�[P ���[P jz��[P �o�[P 
�]P &<��]P b=��]P ,#3�]P K�]P A7�]P �<�]P ��]P  �]P �%��]P ����]P ����]P 1���]P [H�]P ��~�]P �e��]P v^��]P ����]P ��l�]P ����]P .i0�]P ���]P Ҋ�]P iV�]P �L;�]P �MP�]P w���]P ��]P Re��]P v���]P �qV�]P ��`�]P ]���]P X��]P H��]P �t��]P a���]P ���]P �"��]P �ԏ�]P �\? ]P 4_� ]P BF� ]P i�� ]P ��K]P ��]P 6�o]P �f�]P ��6]P �R]P ��]P ZN]P ~(/]P ªd]P �Cs]P ݥ]P ���]P 6��]P =�]P ��J]P Z!�]P 8
�]P �L]P �bI]P q��
]P ��]P ��

!]P �!�!]P j��!]P ���"]P ��n#]P �;$]P �B$]P ��
%]P B�N%]P :3�%]P �.�%]P ��
aQ}]P �
�}]P ���}]P &3~]P ��4~]P �'I~]P {�R~]P �Ɂ~]P Ƃx]P ��_P *���_P ���_P �pI�_P 3�_P Z�g�_P 8�C�_P  ��_P '�Ɇ_P ֿz�_P .p�_P �j��_P �i�_P ,�Y�_P Wʌ_P �U�_P Y�n�_P }�Ď_P ��_P *%�_P R"6�_P +Ŕ_P �V��_P ��t�_P ���_P ��Ƙ_P �!�_P #�&�_P ����_P <�К_P �^�_P ��S�_P DI[�_P A��_P >�֟_P �~v�_P ����_P X���_P ��E�_P Ds��_P �՗�_P ��;�_P фj�_P �G�_P �'��_P \�L�_P ;^��_P �4�_P tr��_P ���_P U��_P ��!�_P ���_P ߋ3�_P �0N�_P _5^�_P pm�_P ��`�_P �Z9�_P HW��_P �(�_P �g�_P 6�\�_P ?C �_P ��
�_P S���_P �K��_P ���_P �h��_P p���_P �6m�_P �on�_P >�_P ۝Y�_P i��_P ����_P ��:�_P vC��_P Yk�_P ���_P ����_P v��_P �;�_P �p�_P ��a�_P �9��_P ����_P ���_P �P��_P )<��_P ����_P �XU�_P `���_P h��_P �@%�_P 
 _P ��G_P ���_P �
�_P �0y_P �_P ԝ
_P J�

�iP ^}r�iP �f�iP �ۋ�iP �`9�iP ���iP �Vg�iP  oh�iP ���iP �q��iP ���iP �4�iP ��.�iP ^��iP ��v�iP p��iP ���iP �9iP oyxiP ��iP zϮiP |�iP �k�iP � iP �%�iP �
��mP .�mP t8�mP Ƥs�mP 0晐mP 	�t�mP zpT�mP �ŤmP �.�mP ��^�mP �O
�mP ¨5�mP C��mP *���mP ц-�mP ���mP �%�mP N�}�mP {A��mP �ex�mP [#S�mP |���mP �A+�mP ���mP cK��mP ��xmP �XmP l�mP v!mP �g"mP �Ş"mP 1�'mP i��*mP L\�.mP �=�2mP l\"4mP ��'8mP Q�9mP ���:mP ���>mP �p%AmP ��\DmP 5jOGmP ̓�QmP ~�<YmP ���ZmP ���[mP ,P�\mP �n�_mP t�emP �IximP ��jkmP _(mmP �E]rmP �CumP /5<xmP [�xoP ��d�oP ��`�oP �^�oP bX�oP �� �oP �Hb�oP 	���oP �2��oP �
�oP {��oP ����oP �	�oP _��oP /��oP �v�oP o��oP �oP �-�oP �j�#oP �"c*oP u!�.oP V�m1oP �
EoP ûXHoP ��ZHoP +��NoP [�PoP �e�]oP ��coP D�toP ��}qP 
V��qP �7%�qP ?E�qP r��qP 
AQ�qP `�5�qP �O_�qP /1s�qP ��
"�sP ��V�sP �ٗ�sP �S�sP PBb�sP �]�sP M�x�sP W,՜sP ���sP ��sP euv�sP ΧsP s�2�sP 	�7�sP Fђ�sP Ŧq�sP 4�a�sP \,��sP +��sP ����sP 5��sP 3��sP �6��sP [!��sP ��\�sP +S��sP �s�sP ���sP (#�sP �Q]�sP �LO�sP Y�wsP �~�sP f lsP .
tsP ;�yuP �"�uP 9��uP (���uP ?���uP X-�uP ��uP }6�uP ���uP \�9�uP /}�uP #�!�uP �M��uP �株uP <iW�uP ����uP �im�uP !K�uP 	�m�uP YS��uP �[7�uP ��H�uP d��uP �'�uP �u|�uP �0�uP ț��uP RdV�uP Ӥb�uP ��k�uP �Q��uP �W��uP �<��uP ���uP ty)�uP )�^�uP ��c�uP ����uP 0��uP ���uP ���uP B�,�uP 6��uP �F uP %� uP h�uP f��uP ğ�uP P]	uP ��BuP �ƓuP w��uP �QuP �]uP ��uP 4�f"uP ���$uP $c1)uP :�*uP DU�.uP ��:uP ���:uP ��:uP ��*<uP %��?uP ��@uP ڢCAuP ��DuP �FYFuP �|FuP ��JuP c�OuP �SPuP zMzRuP ���RuP 6	'UuP �
�$a{P x�Dg{P Y��t}P �v�}P �i3�}P yL��}P ~C�}P J��}P -:��}P  1�}P ��j�}P xD��}P Ǫ��}P S��9}P �H->}P �s�E}P -��W}P �{�`}P E��b}P `�={P qtv�P %7a�P ���P �V�P %�z�P 
��P �Χ��P \<hąP c�F˅P g�υP ,��҅P U\VޅP �+��P V-��P &IT�P �:��P ��6��P �����P 'm���P �����P �����P ����P 
-���P ��� �P x�:�P [y�P ���P KsH�P ����P �l4�P ��=�P ̻U@�P �vH�P w��K�P *L�P 9�;T�P ��U�P ��Y�P b�>\�P ��N_�P }Ga�P �/d�P ���f�P �(�g�P `6m�P ͧ�u�P ι*w�P �ѵy�P �@C{�P j/怇P �;6��P DO<��P `���P L8��P  �R��P <x���P ��ЇP ~�؇P .���P Q�{�P v����P �*�P ZL��P ���P ~��!�P �o�$�P ���$�P Bݾ%�P 2�IV�P �ʞY�P �A�v�P �x P �����P )N��P �l��P n���P �ó�P ��W��P �6�ȉP ���҉P ��܉P �.�P ��1��P �@�P <����P F�q�P �H�P ����P �
�P ��;�P ���P ��.�P ���6�P �'7�P �_8�P I�>�P ��6H�P ���I�P �=rK�P 7�Uu�P �e�|�P y���P ���P ;�.��P �t�P W���P ��"�P ��-�P tmY[�P * ga�P �t�j�P bgn�P �zG|�P ��M��P "K���P 9QƏP �E�׏P ��P�P MS	�P ���"�P �nT(�P d�/`�P D](a�P �b�P �N�z�P ��́�P 3���P �����P nm��P n�sӑP ⽷�P ���P jtb�P ��P 1m3�P a�~O�P �*m]�P X�Oe�P |�~p�P �����P ܶ��P �����P ���P (�*֓P f��ۓP �;��P 2�y�P �]��P S�(�P �
���P ��%��P ӕ>�P �-f�P ��
�P `(��P }h��P �
Z
�P ��

�7u�P +��v�P ��Nw�P E!�w�P �gz�P �U|�P 9���P ����P �^6��P "8P ����P ��܅�P n����P ��'��P ]���P TF��P ��/��P X@��P N�L��P X���P ��Ε�P �g��P �pn��P Z嗟P �[헟P ��R��P �N���P �����P ⟜�P ��?��P �����P ��ʝ�P �5ꝟP �\螟P x�.��P sD���P =�]��P 6�c��P o�Ϩ�P J���P V7s��P �'��P 	�,��P qZٮ�P �T��P ����P ��6��P �>S��P /ְ��P !dն�P �,�P �з�P ��﷟P S�J��P N q��P \�也P ����P ��~��P �����P �Ȼ�P ����P �b���P k9��P ��d��P AA���P ��P ���P .PßP w�dßP q�ȟP ��ɟP j	�ɟP "��ʟP ��˟P �c'͟P ���͟P b�͟P ���ΟP ?��ϟP K��ϟP ||�ПP V��ПP �]�џP q��џP /��џP ��ҟP ���ԟP *�4ןP �TןP ��gןP 0�ןP ���ןP IZ۟P ��YܟP b�YܟP �ݟP yeޟP �G3ߟP �a}ߟP -��ߟP ��-��P ��P ���P M�P ��-�P zs�P �b~�P N���P S��P g��P ŧV�P �V��P L���P tq0�P �W��P �h>�P ���P ���P #���P B�H�P _6o�P ���P ���P �����P �=��P ��^��P ��Z��P *fk��P X���P ����P  ����P ����P �����P �8���P Zo��P ����P ��5��P ���P xg��P �FD��P E���P s6��P �ȑ�P �Y��P �S�P �<�P -I��P �p��P [�	�P A��P ���
��P �>��P ܕ[��P >����P ߓ��P �9���P 2��P �
L�P e�M�P v��M�P �j�O�P R4�P�P 'ŌR�P H~S�P ��;S�P �PRT�P WfdT�P ��%V�P XX�V�P U��W�P �[aZ�P �ǪZ�P "�l\�P �%�\�P J��]�P ���^�P ,8_�P ��4a�P �Nja�P 
�n�P [�n�P Q��n�P \�'p�P 8jp�P BP�r�P gL�y�P fw�z�P �	C{�P ��|{�P ���}�P m�̀�P �Z���P %���P �	���P ��P )$8��P i�܆�P �6��P 6����P �:E��P �劣P Y����P P����P ��/��P �����P )&Q��P �}��P ~|ؑ�P ��L��P �a^��P �����P �oU��P �gN��P �I���P �V���P �����P �~���P �wə�P n����P ��P G�7��P q�ס�P O�P �*i��P �.]��P CQ��P ��z��P ��_��P ���P lD.��P �Q���P �jx��P �5��P =����P ����P Ҽ=��P �K���P 3���P ��j��P �SѸ�P �%Z��P 6�t��P 24ϻ�P /�ϻ�P �C��P � 辣P ���P �H��P �����P .����P ���P ��FãP չyãP Rn�ãP }�\ģP �S*ţP H��ţP ��ǣP �-ȣP |1DȣP �ɣP ���ʣP �ḷP �g#ͣP r�УP �ӣP �q�ӣP E�#ԣP 6~mԣP ��ԣP �	JգP ��գP ��x֣P = ףP �S�أP �~�ۣP 
�P ���P �jj�P �A��P .�|�P 'Ї�P ���P �4�P ��G�P ��s�P �_��P ��P Z��P G���P F���P �Q���P ���P ����P s�}�P 
�P ���P E��P ��3�P K5p�P !��P �S�P ���P ��r�P 3G��P 5�P KJ��P !P?�P i�c�P K���P ����P RO�P �(��P W�;�P F�P �~��P -i�P Ґ�P �]8�P v� �P ^��!�P ���#�P �2�#�P <L�#�P �4�#�P �j$�P �7@%�P =-�&�P ɔ_*�P }�/+�P �q-�P ��U.�P f1�.�P ���/�P ֥0�P �� 3�P T�4�P >�-4�P 4j6�P �L�6�P ���6�P ��_7�P �d�:�P p�3=�P �Ζ=�P &�-?�P e�l?�P ���?�P ���?�P el!@�P �B�@�P ?�D�P ś~E�P '
�E�P ��F�P W\�G�P �@�G�P ��`I�P ���I�P ���J�P 4��J�P X'sK�P @��K�P A[
L�P - �L�P 6��M�P OUfP�P ��fP�P ���P�P �);R�P c��S�P ���S�P T��S�P "U�P cCU�P +%SU�P �3gU�P Y�U�P �V�P _�LV�P �VV�P W< W�P ��X�P ���Y�P ��Y�P rW�Y�P ^ehZ�P �	\�P k3d]�P _pp^�P �.k`�P ׫|`�P y��`�P ^�`�P ���c�P ��e�P �?�e�P X�f�P ��g�P T
i�P Q�mi�P ���k�P �7�o�P YX�p�P ټKr�P ���r�P C��r�P �^{t�P �u�P ��c{�P  ��{�P ��{�P .=I|�P ��[|�P ��_|�P �?@}�P ��~�P �w�P >w���P V���P �����P 7�*��P �Pn��P �ꖂ�P C@D��P Ze���P %9~��P V"���P ޅ�P H󐆥P x���P ��̇�P A����P WDV��P q�m��P �,*��P �j̋�P X��P *���P �AՌ�P 3o���P �HC��P ɠF��P �$ꏥP $.E��P I판�P \zא�P 
���P E@쑥P �R��P QR���P K�ⓥP a;���P ˕�P ��0��P .���P �OM��P ��꘥P A�+��P zS:��P J���P v^��P 0�d��P ��C��P �^���P ִf��P �ў�P �TJ��P �� ��P �����P F����P ��馥P  +��P ��6��P �8��P (ys��P 8k���P ��p��P ؾ驥P ����P F��P U65��P �`䫥P �����P �:��P z���P FlȰ�P �����P nK��P K����P G��P 3�P ��j��P N����P �#]��P c�^��P s���P #����P ���P ؐ���P ��A��P ����P �Y'��P F�>��P �$��P f,���P ���P \����P xҿ�P p
¥P ��h¥P yְ¥P (��åP �	�åP ���åP �#9ťP �PVťP ���ťP �k)ƥP 68VǥP I�ɥP ���ɥP CAR˥P "��˥P {�t̥P ݷͥP ���ΥP ʽXХP ��yХP ���ХP �GѥP �!�ѥP ��եP 7�եP AL֥P �%iץP Y�ץP nH�ץP ��إP ���إP Ez�٥P ���٥P _F�٥P ��,ڥP �ZڥP caڥP !�
ܥP ` ܥP �b�ܥP 
(3��P �ߤ �P =z��P ����P ����P n���P ����P �)��P õ�P �S�P �*��P ��	�P �t�P �: �P �-��P ��a
�P ���P ���P t�#�P 2���P 
w��P � �P �� �P Mj2!�P ��2"�P SE�"�P x��"�P }CI&�P ��&�P ���&�P 2ZO'�P ���'�P �~*�P �/*�P ��m*�P �W�*�P �^+�P .[+�P x�M,�P \-�P 8� /�P {H�/�P a6R0�P Lk�1�P �3�P �<4�P �=4�P ��4�P y"�4�P ��4�P ���5�P ���6�P mt�7�P X�L8�P ���8�P ��*9�P ���9�P �F:�P K�M;�P f:=�P v��>�P H)�>�P C|A�P S@�A�P c�C�P 
��C�P �$�D�P Z�F�P �,G�P �j/G�P ���H�P PJ�P l�8J�P *�,K�P h2L�P aԮL�P ⺳L�P ���L�P B(qM�P �t�M�P ���N�P �@O�P U�O�P ��EP�P ��P�P X3kQ�P eA�R�P G��R�P �ǊS�P �T�P ��4T�P +P7T�P 
�T�P ��U�P �!�U�P ��U�P �]X�P Q��X�P ��Y�P B�
[�P 6
 �q�P ��(r�P Һur�P �8�r�P �ޠr�P s��r�P UNs�P �às�P �T�s�P ��:t�P ��iu�P Q�v�P ���v�P Kq�w�P ��w�P �9�x�P ^�y�P �֮{�P ``/|�P STE|�P ��}�P IuO}�P 
&���P =_���P j���P ���P E��P �����P �2��P �����P �<���P ^����P �W �P ��� �P z\��P b�@�P 
Y03�P �L�3�P �6O4�P �0�4�P ��5�P �5�P X�|6�P �ڼ7�P l�7�P ��8�P }-9�P 9>9�P ýn9�P =�9�P ۅ�:�P ��:�P ~`�;�P V��;�P ��<�P �go=�P ��=�P �Y{>�P ��~>�P ~�KA�P 7i�B�P �=�B�P �_�B�P _�C�P �W�C�P tuF�P ��nI�P %��I�P ��I�P ��J�P ���K�P (6(L�P E$�L�P =�4M�P �H]M�P Z�rM�P }�M�P 9m�N�P ��N�P 壳P�P �G�P�P ���Q�P p�Q�P ��R�P �oR�P h5�R�P ���R�P �D�U�P 7MYV�P -.yV�P D�V�P P��V�P �,W�P �JW�P �ޖW�P �I[Y�P �!�Y�P �$z[�P С�\�P Ũ]�P �9]�P ȡ�]�P T�^�P !G_�P p>c�P ��Dc�P ���d�P �U�d�P <�Ze�P jxhe�P �7�e�P X&�e�P ���g�P ���g�P Dh�P A��h�P J�Zi�P Qߛi�P ���j�P �|n�P 939p�P f�Bp�P 3�q�P �k�q�P ��r�P 0�Bs�P ��Hs�P U��s�P wF�s�P x��s�P 4Q�s�P V�t�P K@u�P ���u�P `mQv�P ��v�P {�Ew�P uчw�P �ly�P ICy�P v�ky�P *�y�P #�z�P WS4z�P @S8z�P �=�z�P ��{�P `�P{�P F?�|�P 3d~�P �,�P K��P s���P {����P �$��P �1傩P {�a��P ��ꄩP b�H��P a��P iYƈ�P 4����P 9P a ���P Q聐�P X���P �����P ����P V���P ����P XP���P �D9��P -}>��P �$���P ᙩP N�Κ�P ����P *?=��P zH�P ׸��P �LS��P ��ʨ�P �ӛ��P �
\�խP G��حP �٭P r�ܭP ��dܭP b�ܭP W\
/��P ��6�P fO�P ����P ���P ��	�P Yu��P �c~�P ��^
�P ���P s��P �H�P �i��P T�~�P ���P 4L�P <���P �ʆ�P ����P 	��P H-�P ���P S��P OT%�P =��P ��/�P ���!�P ��^"�P �&�$�P �%(%�P ��=&�P ���&�P )=*(�P ��r(�P ���)�P Ν&+�P G�+�P /	r,�P �g2-�P 1��-�P ���-�P �>.�P rx.�P |�
0�P 9�2�P 4�P ��4�P ��L5�P ��7�P ��78�P �Vx<�P ,U@�P �\A�P �)kB�P A�VC�P �k�C�P �HD�P V�MG�P ���M�P E �N�P p��P�P �+ZQ�P ���S�P ��S�P }�S�P ?dLX�P �Q�X�P k�Y�P VZ�P �\�P l|]�P ��^�P ϣ_�P ߶E_�P pF�_�P k��`�P �Md�P |5e�P  �e�P �IAh�P p9k�P (�Uk�P eJ�l�P K�m�P ��n�P �� p�P �R�q�P ��pr�P $�]v�P s�^w�P �m�w�P Y�Iz�P �f{�P �S(|�P ?/u|�P ;��|�P ���}�P v'2�P 0(��P �Ȋ�P ڢU��P K����P ��{��P � |��P e�m��P �y࠱P ��	��P N����P ����P c,%��P ��ñP $;cƱP �I�ȱP �U"ʱP �S�ѱP ��ԱP Vf�رP /	�ڱP �/�۱P ��]ܱP 2�(�P �,�P �h��P ��l��P �"��P H�a �P u!l�P վ�P �$��P S?t�P �B!�P ��#�P x>7$�P ��$�P <��.�P ���2�P �`O=�P �8
�P JY;�P <��
�?�P ���I�P P��K�P G�Q�P �miW�P �pW�P ���n�P d~�q�P ��s�P X"^��P W{��P ��g��P #�T��P �Tĭ�P ��8��P y����P #����P �����P }iD��P gP���P �Ȭ �P �9�P $0(
�3�P ���6�P H��6�P 6oL9�P >�?�P s.�?�P ��G@�P >/�@�P \�@�P 2��A�P �i�B�P #
��P ����P �i��P  ����P -|S��P �s���P r����P ;��P &�4��P 0����P *�`��P )���P ��K��P p�E�P 8���P �'��P s�e�P A ��P �t�P �F�P ?��P ��P ���P ���P ��r �P �P� �P �%D!�P �u�#�P ��$�P T�$�P ���&�P 	��(�P *�)�P ��,+�P j�-�P c��-�P ~M�2�P �n5�P G�5�P ��08�P �t�:�P O��>�P n[A�P ^oqB�P 5D�P >�E�P �=�E�P w�H�P �)K�P ���K�P ���L�P E;�M�P neoO�P �ssT�P �-V�P ��\�P  ��l�P 6l}m�P �l*x�P ��x�P ��Py�P ���y�P .()z�P �Ƹ}�P �a���P FϬ��P D����P �"���P �J���P �x���P F����P �/��P  2���P ��M��P ��t�P 'Y�,�P �Y_5�P ��cC�P Xy�P �P��P �e���P ��՘�P <Ȏ��P )�"��P �я��P �a
�P �*W%�P ��N&�P �/�'�P �v(�P ���O�P I3m�P vJ���P �ؗ��P m����P H3��P 8�;��P I���P �����P �Z!��P �nB��P ~���P J����P �(���P ��$��P ��P [�-�P ���/�P i�T9�P �?�P j�p�P �O1y�P ־I~�P �k4��P ��\��P ����P �<���P ���P �<��P ����P �G\��P �����P ����P �Bm�P 9\
-�P �H�3�P c�?K�P ��	��P ;���P ����P 
�j��P �j���P ���P ����P ��c��P cZ
��P 4�$��P �����P �H��P iw��P ����P ����P _f��P I�|�P ؝��P ���P �Wf�P ����P ��P �1;$�P m
/�P �p1�P ��a9�P Z��:�P �o�A�P ��F�P G*�P�P QBT�P A�T�P nE�W�P �l@Z�P ��c�P ���n�P �Qq�P #���P �����P [j��P Qޢ��P OV��P )
��P �p��P �\5��P �]P��P cS��P �S���P 1�9�P �p�%�P 
z6��P ^eS�P �<p�P I]��P �E �P Өk1�P fV�1�P R�5U�P DoW�P �˨^�P pI4`�P � k�P �����P J�ݙ�P D���P @Uڞ�P "���P ʙ���P r���P }���P ��Z��P ;66 �P ��
L�P 6�,\�P 8�&y�P (
���P G[��P ��ߒ�P 8���P �I��P �DN��P �ܚ�P glf��P ;Ⳟ�P �T���P �b���P �ʎ��P *���P �q���P +�O��P ��S��P /���P }|f��P �>���P <
Q �W�Q ��kQ [�Q ��F#Q %X%Q +Z<2Q �#�6Q I7Q @��9Q ;�#=Q ��AQ ��BQ #�*BQ �IDQ �
�DQ �SLNQ Ui ZQ O��cQ O	�dQ �.CoQ ��0vQ 
,B{Q G�?�Q '��Q o�Q �G��Q ګA�Q ȤJ�Q [Lz�Q ˑ��Q }��Q �f��Q �W�Q �E�Q >�(�Q ��W�Q dŖ�Q }2��Q ��Q �zĆQ �8؇Q f@e�Q ��Q X?i�Q *��Q �V�Q �Ц�Q �P3�Q ��Q ���Q ״�Q �)�Q ��B�Q ,ϳ�Q �K�Q �M��Q ��Q ��ݎQ V	�Q �F
�Q  Z�Q ��ŏQ *�ݏQ ~k��Q Ŋ�Q ��Q �>�Q �ڜ�Q Ȉ��Q ,�E�Q )��Q (�ޕQ ���Q qO�Q �\�Q �z�Q Zk��Q ���Q 4A�Q ���Q RΗQ �pїQ È�Q �*U�Q ���Q =�Q �KX�Q �j��Q �`��Q tښQ �!�Q �W�Q I�ƜQ [R@�Q n�Q �17�Q ���Q s��Q �H�Q <�ՠQ GܠQ ��Q B�#�Q ɴ0�Q �Q �&�Q �i��Q �ãQ �ʤQ 0IפQ �bݤQ ��Q �v��Q Pb�Q �ip�Q ׹��Q Tٝ�Q ���Q �<P�Q at�Q �ѧQ ^���Q �ݨQ v��Q su�Q �_��Q �M3�Q �?b�Q �׻�Q ���Q ��ҫQ U�ԬQ )��Q �4K�Q �1֭Q |�X�Q zqe�Q ��o�Q �֮Q V���Q b0�Q ��}�Q 3튱Q <uN�Q �)O�Q 
j�Q ���Q \��Q 	��Q �9?�Q ~�ݵQ �r��Q �b��Q �7�Q 9dJ�Q �H&�Q bU�Q �d�Q �,�Q �&��Q �-��Q �W��Q �!�Q ݋��Q �#B�Q �(��Q ���Q �}
5��Q �\�Q `���Q �{�Q ���Q esQ�Q %�Q �@�Q hvf�Q �t�Q ��{�Q �ӱ�Q ��[ Q ��Q 
Q �'�Q �-�Q ZS
t�Q �nQ �Q =��Q K
4.Q 3T\.Q 穱/Q ~#o1Q !v�1Q ʴ�2Q �4Q �A85Q R�6Q �	7Q ��7Q 'm7Q l�;7Q �Ϻ7Q �cS8Q O�9Q ż{:Q 1�	<Q ���=Q I�=Q �w�=Q �WD>Q ��E?Q u�AQ ���AQ �ѷAQ ׸CQ [�CQ �@�CQ �gWDQ ��DQ [vEQ f~EQ ���FQ ���FQ ��FQ �B�GQ ���GQ ��1HQ R
�HQ vq�HQ ���HQ ��IQ 
kIQ �6�IQ g��IQ ���IQ ��VJQ �9pJQ #_�JQ ��KQ ��LLQ �ޝLQ �=�LQ |�MQ +�MQ ���MQ ��MQ Q-NQ �'�NQ �PQ QRQ �$�SQ �6TQ 
vQ �͕vQ @؝vQ 0� wQ ֿ`wQ �0�wQ ȻxQ ԕyQ  ��zQ �C{Q B��{Q %Z|Q �і}Q -ռ}Q r�~Q �+=~Q ^�2Q �iTQ O��Q �d�Q �ob�Q �ƽ�Q > �Q ,M�Q y6݆Q A6��Q �k�Q ύ%�Q שd�Q S�h�Q H�]�Q 軶�Q �a��Q �v:�Q p�؜Q �Ɉ�Q Y��Q ����Q R/��Q <�Q �|��Q �«�Q ����Q $I�Q ,V��Q �bW�Q ��*�Q ��ҮQ �A/�Q g��Q ��R�Q G��Q �D7�Q 'ѡ�Q E�Q �8��Q �� �Q ��,�Q �C��Q 	A��Q H� �Q <�+�Q 3��Q ��:�Q �ֻQ ݣ�Q $�H�Q QȽQ ר_�Q  '3�Q �g9�Q G�n�Q g�Q�Q �@��Q e&/�Q 6��Q 6s$�Q B/F�Q EǾ�Q �_�Q �f�Q V���Q r�@�Q �J��Q ���Q �8��Q l���Q �Q��Q �w��Q �h��Q ��Q Ӥ��Q �q��Q ����Q z/�Q ����Q �V�Q �/��Q ���Q ����Q ��Q ���Q )��Q ��Q )gU�Q �b��Q �p0�Q g�n Q u�XQ �ƉQ �5�Q 6ͷQ N�$Q ��>Q ؏�Q ���Q ���
Q OJ�Q ��Q V�GQ N6JQ �X#Q S:�Q ��aQ o��Q �A% Q ��U Q �B[ Q �Ӎ!Q %o'Q mN#(Q ���(Q ��)Q ���+Q *��+Q \�H.Q F �0Q 1��0Q B3Q ��J4Q ��7Q �E9Q Nҟ;Q �W<Q �?@Q �Q�AQ ���BQ �H^DQ  0EQ �dVFQ �|�FQ t��HQ U�IQ &�3JQ g�0LQ �7LQ #�MQ &��OQ ��UQ ���UQ |aQ }N�bQ ^ءgQ xhQ �Q�hQ �aFiQ ��lQ ��qQ Đ�qQ �0tQ ��atQ ��vQ }N�vQ ,}*{Q �KH|Q 8 �|Q ��}Q �$�~Q �9B�Q �0]�Q _�#�Q �~=�Q ���Q #���Q EQ FB� Q �q�!Q ΋1Q K�:Q ��?Q 6��e	Q ��~�	Q fV(�	Q x���	Q ���	Q �ޙ�	Q ����	Q 3��	Q �@d�	Q b�J�	Q �ݺ	Q ��	Q �x�	Q �-��	Q 2�&�	Q �	Q �Yy�	Q �,��	Q w�	�	Q ��B�	Q ����	Q �T��	Q >�^�	Q �V�	Q g�	Q �^�	Q rcS	Q Bh	Q ���	Q ��6	Q �b�7	Q ���:	Q �1Q	Q �ΤT	Q �!�X	Q �w�i	Q �>VqQ ����Q <G��Q #�Q Ǧ��Q ՜6�Q ����Q ��q�Q �",�Q �Rd�Q ~�;Q w��Q ��Q W�4Q ���9Q �|�LQ ��MQ �<�OQ �PQ �E(SQ |KFSQ 
m�ZQ h�8z
©�Q �ye�Q я~Q �˿Q ���Q ���&Q B%/Q ��93Q �[-7Q ���>Q �N�BQ � �CQ �)HQ 1�o_Q M��cQ ��:|Q j@}Q ���Q X/�Q 1L��Q ��9�Q d���Q ��Q �ډQ ���Q L�Q '��Q �w��Q T:�Q �]�Q g��Q J�Q ���Q b��Q ˨a�Q �{9�Q *��Q q���Q ˇ�Q �2ȢQ eգQ G~�Q ��=�Q �C*�Q Ɇ��Q ZW!�Q �v��Q �z�Q 9�+�Q Ҟ�Q �Hz�Q '��Q ́�Q `��Q ���Q p��Q Q���Q Ͼ��Q ���Q ����Q �0��Q �]F�Q �tg�Q �F��Q �(&�Q ��J�Q 4\e�Q ����Q �T��Q �/�Q t��Q ���Q G:�Q ����Q 
��Q oI��Q d��Q p���Q �W�Q v0�Q ����Q �,7�Q i�RQ �Q �Q ��-Q  #�	Q ��Q �AQ �<�Q ��8Q f��Q 6��Q �^KQ �Y�Q ܫ�!Q �"�#Q JR|&Q 5%0)Q �g})Q �(�*Q ^ٿ/Q ��Z3Q |�95Q v�w6Q W@M7Q }��9Q p��9Q Dl�9Q �T`;Q #a�<Q �/�=Q � �AQ ��1DQ ]d	IQ �e�IQ �cLQ v
��Q ���Q P���Q �G�Q ��]�Q �̉�Q R�&�Q ����Q 3��Q ����Q �>�Q �!/�Q s�r�Q �zV�Q 7&B�Q �K �Q �f��Q �
��Q ���Q .�
�Q ���Q ���Q �lʏQ 
!Q %��!Q +!Q �N!Q �<�!Q &ζ!Q I�!Q p�D!Q Ol0%!Q 8��%!Q ���,!Q ���>!Q P�C!Q E�Oj!Q ���o!Q �Eq!Q �|q!Q ��r!Q ���t!Q Z�U~#Q Q[�#Q ��V�#Q �h�#Q ����#Q ���#Q �?�$#Q Opl5#Q xB�<#Q !]�]%Q ����%Q 54a�%Q �}و%Q :���%Q �_�%Q ����%Q 1���%Q OD��%Q �D�%Q � %Q �$�%Q �&�%Q \��(%Q �70%Q  �x4'Q W�'Q �5�'Q ��D�'Q F�ϫ'Q &�D'Q >$M'Q ĒQ'Q ��GU'Q ym�U'Q 
�g)Q ���)Q /��)Q �x��)Q �*��)Q �$Ɩ)Q ��F�)Q x���)Q �;��)Q <*0�)Q +w��)Q ��S�)Q %A�)Q ��)Q �I�/)Q V��6)Q ���?)Q ��LA)Q "MQ)Q Û�V)Q Vޔl)Q n��p)Q ��v+Q ��K�+Q ���+Q >9d�+Q n-��+Q ���+Q �n��+Q ���+Q 1�e�+Q ���+Q zN-Q z�-Q Ōl�-Q ����-Q T4=�-Q ��-Q CG�-Q cb �-Q a�Ƽ-Q Fp�-Q �k�-Q �VC-Q ]?g/Q �s��/Q �3�/Q <���/Q �/h�/Q ��X�/Q �I�/Q �[�/Q O�/Q �d��/Q ��s�/Q ���/Q -�(
/Q ��17/Q {��R/Q nu�j1Q ����1Q >���1Q �U,�1Q *���1Q 'q��1Q u��1Q ���`1Q |#�b1Q �vl3Q �|ʶ3Q <_��3Q ؖM�3Q f�m�3Q )>��3Q �g�3Q �u,3Q X3Q �;u"3Q v�Q3Q 5;>|5Q x�5Q ���5Q �	�5Q }��5Q f_�5Q �(�35Q �85Q ��Z5Q k�^7Q ~(��7Q ����7Q W4�7Q !���7Q u� 7Q BE,7Q ���/7Q �D�<7Q �QEi9Q �%ׁ9Q ��ܹ9Q Q�7�9Q �K��9Q /N�;Q ��V�;Q sC�;Q x�;Q ����;Q ߼�;Q �`�;Q �-i�;Q 1�B;Q ��7;Q sa�7;Q �\I;Q �h�O;Q q\1[;Q 0��f=Q �z��=Q ��$�=Q  y4�=Q /���=Q z��=Q 0�=Q `�,=Q ލ�F=Q �|�S=Q $�(x?Q dhf�?Q �~b�?Q ~\I�?Q ���?Q �  �?Q b���?Q |���?Q w���?Q >���?Q j�9?Q D
?Q YjT	?Q ��?Q +�?Q ~T>?Q ڛ�??Q ��G?Q ��RU?Q JZ?Q �A[o?Q �_t?Q �:�}?Q �3>~AQ *�AQ �2�AQ ���AQ \�z�AQ zSo�AQ j��AQ �nHEAQ q$JAQ ;�YJCQ �ۇ�CQ �YĜCQ :o��CQ ;Xj�CQ �,p�CQ ����CQ r��CQ R'��CQ ~o$�CQ S�[�CQ ����CQ ��> CQ ���CQ P�CQ ��4CQ �T'CQ �)CQ ���8CQ \��BCQ ��GCQ �76NCQ :�fCQ ���|EQ n%j�EQ �ž�EQ Ps�EQ  W��EQ �뼞EQ ޛ�EQ �o��EQ E6��EQ 8��EQ �o!�EQ u���EQ �)�EQ �^��EQ `���EQ ^\W�EQ ʴ��EQ �>��EQ O��	EQ X��
UQ �IUQ +{hUQ ���iUQ r}�mWQ �߃WQ 	)�WQ ��߿WQ �P]�WQ �4�WQ �T�WQ ic0�WQ $���WQ ���WQ ��g�WQ 6��WQ �HTWQ ]%&WQ �*�(WQ !C/WQ O��GWQ �Z�rWQ qR�uYQ ��YQ F�Q�YQ 6),�YQ "�YQ ��e�YQ -��YQ 8ۚ�YQ ����YQ "s��YQ �h��YQ ����YQ H���YQ ��3YQ ���YQ ���&YQ ßJ0YQ ��7YQ ͡<9YQ �QEYQ �V<OYQ ���RYQ �Z8UYQ ���fYQ ���iYQ /@lYQ ��pYQ q7q[Q #cg�[Q *�7�[Q �#�[Q �{�[Q �Ź[Q ����[Q ʯ�[Q ƊB�[Q �;�[Q cM��[Q V��[Q a/�[Q ��D]Q hl�]Q 3j�]Q L�v�]Q ��i�]Q ��B�]Q <.w�]Q T�5�]Q ��!�]Q �D��]Q �I��]Q ;�[�]Q ��
]Q �C^]Q �(�M]Q ���Y]Q ���Z]Q �A�f]Q ��(|_Q ��܇_Q ���_Q b�G�_Q (�a�_Q ��,�_Q �A�_Q �[��_Q -��_Q w��_Q 6�L%_Q ��G(_Q ��b*_Q w��@_Q Z�A_Q �� D_Q 7CI_Q S�__Q o zsaQ G��aQ ����aQ vPu�aQ �H��aQ l�`�aQ �?�GaQ /��HaQ +/IaQ �[;QaQ p�{\aQ ���iaQ Ck!maQ ���uaQ NWnvcQ j՚cQ S+e�cQ ��"cQ �N�#cQ �~�XcQ � ncQ �jGteQ ���eQ 7
�eQ �pQ�eQ @bi�eQ A�6�eQ ��qeQ � gQ ��Z�gQ �mؔgQ *��gQ w`�gQ d+�<gQ U�?gQ ���JgQ �`�UgQ /yXfiQ ��iQ �ķ�iQ  �iQ 
��iQ �k1iQ ž�5iQ �܎ciQ �fkQ ,M�kQ y�8�kQ �GĐkQ ���kQ M���kQ �xk�kQ ��8�kQ �j�kQ POz�kQ �3f�kQ ��+�kQ ƷB�kQ 4~��kQ �	\kQ ��(kQ ��SkQ ^kQ ���kQ �L�xmQ 
u>oQ ��@oQ ,��IoQ �$YoQ �R�[oQ р�coQ �N�hoQ ��koQ ��noQ ��(poQ �=�toQ ��jvoQ ��|qQ z���qQ ��N�qQ ���qQ a�qQ ?���qQ ��	�qQ "�2�qQ #�0�qQ �ԗ�qQ ��ݦqQ 1���qQ ���qQ 3��qQ /���qQ � ǬqQ �)�qQ G?�qQ �S��qQ ��qQ �~��qQ P���qQ 8b��qQ f��qQ �,r�qQ $*��qQ (�qQ n8+�qQ ����qQ _�X�qQ �]��qQ ����qQ ���qQ �r��qQ G8H�qQ �rC�qQ �%'�qQ F���qQ o�y�qQ �t"�qQ �qt�qQ 	[:�qQ V���qQ ���qQ ��Q�qQ ����qQ Z��qQ M�UqQ �"�qQ ﾀqQ ><qQ �v
�cqQ P	�qQ ���qQ CI8qQ �!�qQ �9�qQ 3�H(qQ ��(qQ 5�+qQ ��1qQ ��<2qQ ��x2qQ M �3qQ ��6qQ �<�8qQ J�8qQ k��<qQ Z��=qQ bW?qQ !>b@qQ D��CqQ e>vEqQ ��nFqQ �Z_HqQ ��MqQ M��PqQ �K�TqQ �.7UqQ ���UqQ �c�VqQ �F_qQ �U�`qQ ��cqQ B>ifqQ I�kgqQ 
wQ ��wQ 1�U'wQ ��2(wQ ��Y2wQ 
f[wQ  �jyQ �#3�yQ �;"�yQ ̭��yQ l��yQ !3��yQ ӵ�yQ �{�yQ (ǅ�yQ ��F�yQ �V�yQ '��yQ �6��yQ j� �yQ �*�yQ n�i�yQ �p�yQ �5C�yQ X��yQ q� �yQ �[��yQ ?tJ	yQ ��o
eyQ kl�qyQ $�RsyQ ���xyQ |��z{Q �TÐ{Q V�ݔ{Q r�Q�{Q �Ƴ{Q K7�{Q ���{Q �Ż�{Q �VF,{Q L�=/{Q �@2{Q H��D{Q Ga{Q �:b{Q ȕs}}Q ��C�}Q �;�}Q �:�}Q 뭜�}Q .߹�}Q �_��}Q pg
g�Q n�Mn�Q r�Q ���t�Q ܐ4z�Q ��{�Q �q�~�Q ��䭃Q ��rȃQ �Ԕ̃Q ��ۃQ <&���Q ���Q A���Q 
!�Q �P�E�Q �Yw`�Q מfq�Q �M�~�Q �󟱇Q ʴ�ЇQ h���Q ���Q K���Q ��p��Q +��Q %���Q ���։Q ����Q <#5�Q �W�;�Q �,LO�Q �����Q u+��Q ��ċQ f��̋Q YGz�Q �84�Q ��r�Q �^�}�Q ��"��Q �'��Q �}��Q _���Q @����Q ��V��Q g�o�Q ���Q I)�?�Q �NJ�Q z���Q N���Q /Ƽ��Q Oq���Q ����Q 
��Q ࿎ʕQ �~}��Q 8���Q ۭ���Q xĞ�Q �NퟕQ �Ц��Q ��m��Q գ鰕Q ���ƕQ � �ەQ Y���Q �50��Q u*���Q c0��Q ��b
�Q 5���Q ����Q �Վ)�Q @4-�Q ���0�Q �C;6�Q p8�Q �a?B�Q �yB�Q OJL�Q X�Z�Q ĕ�a�Q Z��i�Q D0er�Q c�	z�Q /_���Q Sҝ��Q ��l��Q �b�
�Q �e=�Q  �?�Q E��Q�Q $N���Q ]����Q ��%əQ m�5�Q lr��Q 2y��Q �=�E�Q ATZ�Q ���Q �^A��Q @��Q 	û�Q Ѐ5��Q �W�k�Q ���w�Q ����Q �s>�Q �H��Q z�'�Q 2��?�Q �+i|�Q 
إQ J�bإQ ��إQ NY�٥Q q%�٥Q ���ڥQ :�<ۥQ �m�ۥQ ��ۥQ UF�ۥQ 6�@ݥQ ZZ�ݥQ 6�ݥQ ��ޥQ �}ޥQ ��>ޥQ ��0�Q [H)�Q c��Q $���Q 
W��Q ����Q 2i�Q �f�Q �/��Q j��Q u��Q �HS�Q i��Q T��Q 5���Q �Uf��Q �C[�Q �^k�Q +���Q ���Q ����Q �U$�Q ٪��Q ��Q ų��Q �1i��Q Cˬ��Q  ����Q ����Q G#���Q ��:��Q ��f��Q �6u��Q �;H��Q �.���Q ����Q �o6��Q ����Q n�* �Q <� �Q �� �Q '���Q Q\��Q X=�Q k���Q lU&�Q v���Q �1�Q .#l�Q �	�Q �?�	�Q �
�Q jka�Q ����Q .���Q �]V
!�Q  �!�Q �2"�Q t�$�Q �y%�Q �%&�Q �4(�Q Υ�(�Q b�)�Q {d�)�Q ��H*�Q Bm+�Q ^�*,�Q ��n.�Q �i�.�Q &��.�Q *LG0�Q |�41�Q e��1�Q ��1�Q :�(2�Q ��R2�Q }��2�Q %4�Q ���4�Q HQ�4�Q ��8�Q x��8�Q �9�Q �	;�Q yb<�Q <��=�Q N8�>�Q ��>�Q ��P@�Q ��@�Q .�#B�Q �j�B�Q �6�C�Q ��uD�Q �j�G�Q %e�G�Q �)kH�Q �� I�Q H�`I�Q ��}I�Q ��&J�Q gfkJ�Q ��K�Q �hL�Q -ǑN�Q �3P�Q K�P�Q �_�Q�Q S��S�Q mT�Q �HV�Q �jsV�Q 
^W�Q �úZ�Q ��b[�Q ���[�Q �U�[�Q ���[�Q `�\�Q �(^�Q |W�^�Q T�G_�Q ��_�Q ���_�Q ��D`�Q Va�Q �!b�Q i+c�Q X�c�Q �V�d�Q ��Ye�Q z�e�Q ��Ug�Q $��g�Q hh�Q Fh�Q ��5i�Q �'�i�Q 	(�k�Q :0l�Q j.�l�Q ]|�l�Q a�l�Q ��m�Q �9o�Q �C�q�Q �s�Q �-s�Q �7s�Q d��u�Q ��tv�Q �%`x�Q ROdx�Q ��x�Q n��y�Q �C�y�Q G�z�Q r7xz�Q ���z�Q ��{�Q MLu|�Q ���|�Q ��|�Q zKF}�Q b:�}�Q l�ϻ�Q B���Q �-ƩQ Ĥѓ�Q ��ť�Q �U�ѫQ ]Y���Q ��.��Q �X�Q �*!�Q �'�Q ݶs4�Q �5`�Q n�Cb�Q �
끭Q �ҕ�Q �b��Q ����Q "n!�Q =DZR�Q � 0o�Q �n�o�Q �&s�Q \j
a�Q  ����Q �%2��Q :����Q �ю��Q �I��Q �º�Q ǘ���Q �9R��Q ^F/�Q �k%�Q �o�?�Q $[�F�Q �Ɯ^�Q ����Q �W��Q ks��Q d�R��Q #J���Q z���Q 7&��Q �m���Q ����Q ��u��Q D�H��Q ~����Q ͟���Q ����Q 	��Q ԝ��Q ?~���Q �n��Q �Ű �Q ���Q ]�O�Q �v#�Q �2�Q a�4�Q Β�D�Q �Z�R�Q k�S�Q 䛙Z�Q �Ub�Q ]�h�Q �S�k�Q ���k�Q ;��n�Q  :�n�Q �vz�Q �S}{�Q fu��Q �����Q ����Q �����Q �e��Q �((��Q Y�=��Q �����Q +���Q ��U��Q Y����Q ����Q �N���Q �
'=��Q z<��Q n ��Q 6����Q �|���Q 5� �Q �i,&�Q �L�Y�Q [�Re�Q <q�t�Q Q�5{�Q ��}�Q 	�h}�Q ����Q �'���Q ]�
��Q ~_���Q ����Q \��Q �|n
�Q t��Q �@#�Q �I�4�Q �w�4�Q ���M�Q �'P�Q cI<l�Q M�t�Q ��D��Q o15��Q Hu���Q ̫'��Q ���Q 62���Q P���Q �q���Q �4g��Q AN��Q 4�
���Q N����Q �+�Q ����Q Y�,�Q �Y-�Q |�v.�Q |��B�Q �Y�Q U;\�Q a��a�Q �Βz�Q ��|�Q U2���Q 3r��Q L�
��Q l����Q ����Q ��-��Q kZ��Q tS�Q P8y+�Q 4�KE�Q ؖ��Q ?�_��Q 1���Q ����Q �oA��Q ��i��Q �'���Q �Pl��Q s�3�Q ���$�Q �R�C�Q =�-{�Q #����Q 
p�R u�#R �lkR t8OR vϫ
R ѷJR N{E!R �͛'R @�n-R �;.R ��$<R ��V<R :�?R m
|@R ��GR ��~KR ��XQR %KVR ؕ_R ^�bR q�+fR ��opR ~X�rR @�+yR �n�R �]�R C�R 3f�R }���R \��R ���R K��R r���R ���R ���R ��R �I
R ��8
	R ��h(	R �_�B	R �̦C	R �'aY	R !�s^	R �.�bR �۩R IF��R �O�R �H��R p���R "���R �X�R ̹��R ݂��R ��TR z�MR [4�+R d�S,R �g�5R ��d6R ٓ FR �
QR �ZTR �C6�R 8���R ���R �˚R �J�R �#y�R ��?�R ��*�R �/�R �V�R I��R ���R �i��R �-r R ���	R �R 3��$R ��)R ���*R �W�?R ���BR 9�bR Y�eR �[mR �s�{R ��|R ��Q�R ¤��R �#Y�R IY?�R :��R ����R 
�
R "S�*R ��1R 8FnCR '	LR �WR ��YR �z_\R VvAaR �QdR eR H��gR VIDiR �4�iR ~l�kR ؐpoR �|gpR [0��R 4���R ŝR �v�R ��p�R K�R�R {�7�R a��R ����R ��N�R �',�R 8��R ��Y�R ����R �2*�R P�:�R �R ��^R 	?�R �ՍR ��_R I��)R ~%u7R /Pt=R ��RR �8�SR ��cR �qlR ���lR ~�BsR �nvR $�~R '�R �=��R MlE�R ���R ��=�R [��R ûX�R g㊐R rs�R �
��R �XU�R 6�M�R {�̹R ���R ����R A��R ��2�R @���R 7؂�R \���R �c/�R H�9�R }��R ��%�R �M��R ^B>�R ���R Z�H�R 7�[�R ۠��R �\3R ��vR ;�,
!'R *��)'R ���:'R �/�>'R ��"F'R �L�Q'R '�X'R A-^'R ���b'R (�\h'R Fl'R ��No'R ���s'R �� })R ���)R �mf�)R 0	�)R ͊��)R ��)R 
�D)R �dV)R V��X)R ��i)R ��q)R I�
�	+R �+R �oD+R 9đ+R *�'+R �g"+R v|(+R *+R ��7/+R �L/+R ~1}:+R R9�:+R k/H+R S��P+R t�T+R ��\+R E�sa+R "S�d+R �!�m+R ��1p+R M�r+R k��~-R Brނ-R �-3�-R �<X�-R n+v�-R _��-R ���-R ~$�-R �_��-R ؚ��-R �ƨ-R ����-R G���-R �m�-R /!��-R ���-R ;q�-R 7��-R �N��-R k9��-R :Ƴ*-R �ǰ--R ��B=-R _;F-R ?�]J-R /��q-R J_2t-R �fK|/R �儃/R I�N�/R ��f�/R �w�/R ��ê/R *�<�/R �>z�/R fc�/R Ļ/R �/�/R ����/R ,��/R M5��/R �F��/R �:��/R Ҁ!�/R ��x�/R V x�/R ¹��/R 5�2�/R W���/R �h��/R ����/R �� /R Ս� /R ��j/R l�</R QZ!!/R �z�"/R �&$/R ���(/R ��p4/R ��4/R F�@/R ?D
Z/R /�^/R +�F^/R RH�_/R K�`/R �K�n/R _�dp/R s��p/R ah�t/R �d�|1R c��1R ;�S�1R 06^�1R &m�1R ���1R �N�1R ��?P1R ^0�s3R �0\�3R #�j�3R �K�3R ��?�3R ]�ͨ3R �]F�3R MW�3R �n3�3R ;���3R �/U�3R ��3R sT�3R v��
S*CR ��.CR .��CCR tiVCR ?
SnCR ��[vER ؀\�ER �w��ER �6(�ER K��ER �L��ER S��ER ��(�ER z�ER w�3ER ���5ER ��<ER s�CER ��UGER v�PER o�<TER �]=[ER ��;]ER ) �{GR ��GR ��[�GR ����GR �!�GR ��(�GR �Qd�GR G$�GR �~��GR ˁ<�GR |j��GR /jGR z��GR ^�� GR )	5GR �AQGR �1�WGR R��qIR ��IR !-P�IR ����IR b���IR u�ҒIR �A��IR ���IR kb�IR Ca��IR ,���IR ���IR ��`�IR 9�]�IR y'��IR O~g�IR F+�IR 1ՁIR o��IR $�<IR ��`IR �f\(IR �Y;IR �3�>IR |W�EIR �RIR +��jIR ��(nKR ��ՐKR ��KR  �#�KR ��+�KR W�w�KR F(��KR ��KR Һ�KR ��I�KR k�:�KR ��Y�KR ��w�KR �OK�KR J�
KR �I�KR 8@nKR };"KR H��0KR 1�~KKR ���QKR �lt\KR ?oMR 0��MR �d҄MR ��8�MR �:��MR dd�MR ����MR �VǧMR /nJ�MR �9ŲMR 
�OR �z/�OR nr��OR P���OR b��OR ���OR xl�OR g1h�OR ����OR ��
OR ��ROR ��[OR ܻ
QR O+g
QR |ߦ
QR ��
QR �.�QR v! QR �QR �I�QR =K�QR ��QR 8H�"QR �`$QR T2%QR �_`(QR "�k(QR )z�)QR 8U)-QR !7/.QR d�2QR ,�4QR �տ6QR �Y;QR �h�;QR �2�DQR ���HQR $�cIQR _XJQR a�;LQR ;�QQR h7�TQR v��VQR XWQR N�,WQR 
J�WQR  %~ZQR �|[QR q~�]QR S<�_QR ��aQR J�cQR r!dQR ��=eQR �2hQR /�HjQR �G�lQR [�tQR �ػwQR _ExQR oC-xQR T~H|QR wMQ~SR �I�SR Bo�SR ��7�SR ��SR z���SR �O��SR ���SR ����SR �?��SR ���SR �5�SR �NU�SR �E��SR kR��SR n��SR �oW�SR .���SR R�
UR s�]UR �UR W�)UR O�*UR mn<+UR �̙7UR ��7UR ��/;UR ?{;UR ] A>UR ĵ_AUR �XDUR <�~MUR �5`^UR ڐ�fUR �N�fUR �;xgUR �rUR �<lxWR >�K�WR �5�WR z���WR Mx�WR �s�WR �Ɣ�WR c��WR �&�WR H0 �WR �ڇ�WR x��WR �=&WR ��u+WR �PS3WR �P�UWR B��WWR �P�eWR ]�{sWR 4g�sWR �)!wWR �i�~YR ��YR �p�YR I�YR x���YR H���YR ����YR ��k�YR F��YR ~� YR @nYR �5/YR ��1@YR �sYYR gu[R �=\�[R ���[R h4ҵ[R yGԵ[R B���[R ��[R ��B[R �Y�A[R �4�D[R �LM[R B�)X[R ���]R &��]R ���]R ���]R ���]R �j�]R ���]R az��]R �o��]R 2 ��]R ����]R C�)�]R V�]R ���]R Z��]R \���]R ����]R ?�S�]R ^��]R w���]R 1�V�]R ?]R �S�]R �
]R  �_]R ���1]R LC�;]R Q8�V]R �Ƽq]R �w]R ��w_R �Og�_R 3�C�_R ��{�_R �]�_R e[Ș_R C���_R 存�_R %*V�_R ж��_R /�_R Y��_R ����_R \f�_R zr _R {;_R ��_R z� _R F�^$_R ��$_R �P�3_R �0�K_R ��M_R �
�)�eR b���eR \:P�eR ����eR ?�eR ���eR �eR R6`eR 6��eR �2 eR ]��eR N;�eR _} eR �e�!eR 9Ѓ!eR ���)eR *�-eR �ӟ0eR �i1eR a�#1eR L83eR ��26eR G+�8eR e�	:eR ���ReR �΃XeR ���YeR ���ZeR �%\eR J�]eR p�"_eR �_eR 
�SceR qqeeR |�jeR ��leR :jEneR WIwoeR �}qeR l|reR ���reR �=.|eR �:*~gR .�ȈgR ���gR )e��gR 9�1�gR ]���gR =WԤgR Ɣ��gR b{�gR k�õgR 4x��gR Hi�gR ���gR ����gR `{x�gR �:��gR �@�gR %w�gR ����gR 6'��gR �v��gR tm=�gR �h��gR �!�gR ��gR <��gR &H	gR ���gR N0gR (�gR ��gR [�o&gR -)gR $�QEgR �Q0JgR �+fJgR ~vQLgR M��LgR �s�SgR x�YUgR ��bXgR dA�XgR �g�ZgR X��egR .~\jgR dWIyiR ���iR ��6�iR ����iR ��:�iR Ne*�iR 0> �iR XV��iR �RiR }WG
iR ��k!iR ���'iR ���)iR �DiR �qMiR ���SiR -Z
UiR �ZU]iR �U�niR �L�piR ȽviR z�}kR �2c�kR X�@�kR �;޳kR  ��kR ���kR �S�kR J(-�kR +���kR �K��kR ���kR �A�kR �_�'kR ��0kR C�1kR ��7kR ��o@kR ��PkR /�rkR f}�ykR <	�}mR ���mR �>ܐmR Y2T�mR 'N�mR x�d�mR �8��mR �k�mR �˄�mR ��8mR ��G;mR ��LmR =�FPmR �FcXmR �ʲ`mR �xoR m���oR ��oR �D/�oR �e^�oR ��� oR �װ
�wR dB��wR qf��wR �S��wR ����wR �<��wR ����wR ���wR G��wR *��wR ��!wR [%9wR ���TwR �P�rwR :��uyR �S��yR �_ԭyR h���yR ��u�yR ���yR Q��,yR ��CyR Ն UyR ��]yR �ÚhyR QP�s{R Sq׎{R �
�{R ����{R �S�{R �O��{R 2h��{R �A��{R ��%�{R �-��{R ���{R z���{R ��2�{R 	�&{R ���	{R *J�{R Z67 {R L�9{R l�$9{R �n�I{R 4�\{R �=�]{R �)�l{R �c�r{R �#H}}R �Y��}R ���}R ��]�}R �'��}R jY�}R T\��}R �}�}R R��}R ���}R -�S�}R J��}R �>�}R �@�}R ô�	}R ��D
}R S��%}R .�D)}R �qiE}R )�T}R E-f}R (Ưp}R 3�tR ��2�R I�3�R �Ȇ�R ��/�R I���R F�ѽR �7c�R �t�R �'��R F�;�R ���R Üx�R czR "�	R |�R 6hR )`qR ��KR Ζ�RR \�WR [L�fR 4"�jR ��)sR ���uR C�QxR ��y�R z�J��R �����R 	�z��R �y���R ֘���R �\ܴ�R �}���R ��aȁR ��vȁR ե�ՁR *���R �+"�R A�|�R 7�
J�R ԟ�\�R rz5a�R c��R G9�ӍR /׸׍R �P�R (�+��R �nD��R eB
���R @�ߝ�R ��깓R �6˓R =��ۓR �L�R 6�F�R ���R �G�)�R ���7�R �g�9�R ��g�R ��S�R ��e��R _�t��R �ⴕR ~V��R ^lΕR �~וR i���R �U��R E�#�R ��,�R G�2�R /��6�R ���;�R ���Q�R ]��Z�R լa�R �X�o�R ��0s�R 8�6w�R ;�}�R ����R ����R �릗R {}ɺ�R �o�͗R �(�R -����R ����R Y�L�R �5'�R ���V�R ~�e�R �Շ��R K���R t@~b�R Y�u�R �{}��R 俾��R 
	���R ?�ЛR >~�ћR ^*��R �L�
}�R q~�R ����R �݄�R E�߄�R [���R L����R �Pc��R {蠐�R  J0��R �����R ֎:��R ����R �١��R *