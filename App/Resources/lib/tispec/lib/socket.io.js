/*! Socket.IO.js build:0.9.6, development. Copyright(c) 2011 LearnBoost <dev@learnboost.com> MIT Licensed */
this.io = {};
module.exports = this.io;

/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, global) {

  /**
   * IO namespace.
   *
   * @namespace
   */

  var io = exports;

  /**
   * Socket.IO version
   *
   * @api public
   */

  io.version = '0.9.6';

  /**
   * Protocol implemented.
   *
   * @api public
   */

  io.protocol = 1;

  /**
   * Available transports, these will be populated with the available transports
   *
   * @api public
   */

  io.transports = [];

  /**
   * Keep track of jsonp callbacks.
   *
   * @api private
   */

  io.j = [];

  /**
   * Keep track of our io.Sockets
   *
   * @api private
   */
  io.sockets = {};


  /**
   * Manages connections to hosts.
   *
   * @param {String} uri
   * @Param {Boolean} force creation of new socket (defaults to false)
   * @api public
   */

  io.connect = function (host, details) {
    var uri = io.util.parseUri(host)
      , uuri
      , socket;

    uuri = io.util.uniqueUri(uri);

    var options = {
        host: uri.host
      , secure: 'https' == uri.protocol
      , port: uri.port || ('https' == uri.protocol ? 443 : 80)
      , query: uri.query || ''
    };

    io.util.merge(options, details);

    if (options['force new connection'] || !io.sockets[uuri]) {
      socket = new io.Socket(options);
    }

    if (!options['force new connection'] && socket) {
      io.sockets[uuri] = socket;
    }

    socket = socket || io.sockets[uuri];

    // if path is different from '' or /
    return socket.of(uri.path.length > 1 ? uri.path : '');
  };

})(this.io, this);/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, global) {

  /**
   * Utilities namespace.
   *
   * @namespace
   */

  var util = exports.util = {};

  /**
   * Parses an URI
   *
   * @author Steven Levithan <stevenlevithan.com> (MIT license)
   * @api public
   */

  var re = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

  var parts = ['source', 'protocol', 'authority', 'userInfo', 'user', 'password',
               'host', 'port', 'relative', 'path', 'directory', 'file', 'query',
               'anchor'];

  util.parseUri = function (str) {
    var m = re.exec(str || '')
      , uri = {}
      , i = 14;

    while (i--) {
      uri[parts[i]] = m[i] || '';
    }

    return uri;
  };

  /**
   * Produces a unique url that identifies a Socket.IO connection.
   *
   * @param {Object} uri
   * @api public
   */

  util.uniqueUri = function (uri) {
    var protocol = uri.protocol
      , host = uri.host
      , port = uri.port;

    if ('document' in global) {
      host = host || document.domain;
      port = port || (protocol == 'https'
        && document.location.protocol !== 'https:' ? 443 : document.location.port);
    } else {
      host = host || 'localhost';

      if (!port && protocol == 'https') {
        port = 443;
      }
    }

    return (protocol || 'http') + '://' + host + ':' + (port || 80);
  };

  /**
   * Mergest 2 query strings in to once unique query string
   *
   * @param {String} base
   * @param {String} addition
   * @api public
   */

  util.query = function (base, addition) {
    var query = util.chunkQuery(base || '')
      , components = [];

    util.merge(query, util.chunkQuery(addition || ''));
    for (var part in query) {
      if (query.hasOwnProperty(part)) {
        components.push(part + '=' + query[part]);
      }
    }

    return components.length ? '?' + components.join('&') : '';
  };

  /**
   * Transforms a querystring in to an object
   *
   * @param {String} qs
   * @api public
   */

  util.chunkQuery = function (qs) {
    var query = {}
      , params = qs.split('&')
      , i = 0
      , l = params.length
      , kv;

    for (; i < l; ++i) {
      kv = params[i].split('=');
      if (kv[0]) {
        query[kv[0]] = kv[1];
      }
    }

    return query;
  };

  /**
   * Executes the given function when the page is loaded.
   *
   *     io.util.load(function () { console.log('page loaded'); });
   *
   * @param {Function} fn
   * @api public
   */

  var pageLoaded = false;

  util.load = function (fn) {
    if ('document' in global && document.readyState === 'complete' || pageLoaded) {
      return fn();
    }

    util.on(global, 'load', fn, false);
  };

  /**
   * Adds an event.
   *
   * @api private
   */

  util.on = function (element, event, fn, capture) {
    if (element.attachEvent) {
      element.attachEvent('on' + event, fn);
    } else if (element.addEventListener) {
      element.addEventListener(event, fn, capture);
    }
  };

  /**
   * Generates the correct `XMLHttpRequest` for regular and cross domain requests.
   *
   * @param {Boolean} [xdomain] Create a request that can be used cross domain.
   * @returns {XMLHttpRequest|false} If we can create a XMLHttpRequest.
   * @api private
   */

  util.request = function (xdomain) {

    if (xdomain && 'undefined' != typeof XDomainRequest) {
      return new XDomainRequest();
    }

    if ('undefined' != typeof XMLHttpRequest && (!xdomain || util.ua.hasCORS)) {
      return new XMLHttpRequest();
    }

    if (!xdomain) {
      try {
        return new window[(['Active'].concat('Object').join('X'))]('Microsoft.XMLHTTP');
      } catch(e) { }
    }

    return null;
  };

  /**
   * XHR based transport constructor.
   *
   * @constructor
   * @api public
   */

  /**
   * Change the internal pageLoaded value.
   */

  if ('undefined' != typeof window) {
    util.load(function () {
      pageLoaded = true;
    });
  }

  /**
   * Defers a function to ensure a spinner is not displayed by the browser
   *
   * @param {Function} fn
   * @api public
   */

  util.defer = function (fn) {
    if (!util.ua.webkit || 'undefined' != typeof importScripts) {
      return fn();
    }

    util.load(function () {
      setTimeout(fn, 100);
    });
  };

  /**
   * Merges two objects.
   *
   * @api public
   */

  util.merge = function merge (target, additional, deep, lastseen) {
    var seen = lastseen || []
      , depth = typeof deep == 'undefined' ? 2 : deep
      , prop;

    for (prop in additional) {
      if (additional.hasOwnProperty(prop) && util.indexOf(seen, prop) < 0) {
        if (typeof target[prop] !== 'object' || !depth) {
          target[prop] = additional[prop];
          seen.push(additional[prop]);
        } else {
          util.merge(target[prop], additional[prop], depth - 1, seen);
        }
      }
    }

    return target;
  };

  /**
   * Merges prototypes from objects
   *
   * @api public
   */

  util.mixin = function (ctor, ctor2) {
    util.merge(ctor.prototype, ctor2.prototype);
  };

  /**
   * Shortcut for prototypical and static inheritance.
   *
   * @api private
   */

  util.inherit = function (ctor, ctor2) {
    function f() {};
    f.prototype = ctor2.prototype;
    ctor.prototype = new f;
  };

  /**
   * Checks if the given object is an Array.
   *
   *     io.util.isArray([]); // true
   *     io.util.isArray({}); // false
   *
   * @param Object obj
   * @api public
   */

  util.isArray = Array.isArray || function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  };

  /**
   * Intersects values of two arrays into a third
   *
   * @api public
   */

  util.intersect = function (arr, arr2) {
    var ret = []
      , longest = arr.length > arr2.length ? arr : arr2
      , shortest = arr.length > arr2.length ? arr2 : arr;

    for (var i = 0, l = shortest.length; i < l; i++) {
      if (~util.indexOf(longest, shortest[i]))
        ret.push(shortest[i]);
    }

    return ret;
  }

  /**
   * Array indexOf compatibility.
   *
   * @see bit.ly/a5Dxa2
   * @api public
   */

  util.indexOf = function (arr, o, i) {

    for (var j = arr.length, i = i < 0 ? i + j < 0 ? 0 : i + j : i || 0;
         i < j && arr[i] !== o; i++) {}

    return j <= i ? -1 : i;
  };

  /**
   * Converts enumerables to array.
   *
   * @api public
   */

  util.toArray = function (enu) {
    var arr = [];

    for (var i = 0, l = enu.length; i < l; i++)
      arr.push(enu[i]);

    return arr;
  };

  /**
   * UA / engines detection namespace.
   *
   * @namespace
   */

  util.ua = {};

  /**
   * Whether the UA supports CORS for XHR.
   *
   * @api public
   */

  util.ua.hasCORS = 'undefined' != typeof XMLHttpRequest && (function () {
    try {
      var a = new XMLHttpRequest();
    } catch (e) {
      return false;
    }

    return a.withCredentials != undefined;
  })();

  /**
   * Detect webkit.
   *
   * @api public
   */

  util.ua.webkit = 'undefined' != typeof navigator
    && /webkit/i.test(navigator.userAgent);

   /**
   * Detect iPad/iPhone/iPod.
   *
   * @api public
   */

  util.ua.iDevice = 'undefined' != typeof navigator
      && /iPad|iPhone|iPod/i.test(navigator.userAgent);

})('undefined' != typeof io ? io : module.exports, this);

/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, io) {

  /**
   * Expose constructor.
   */

  exports.EventEmitter = EventEmitter;

  /**
   * Event emitter constructor.
   *
   * @api public.
   */

  function EventEmitter () {};

  /**
   * Adds a listener
   *
   * @api public
   */

  EventEmitter.prototype.on = function (name, fn) {
    if (!this.$events) {
      this.$events = {};
    }

    if (!this.$events[name]) {
      this.$events[name] = fn;
    } else if (io.util.isArray(this.$events[name])) {
      this.$events[name].push(fn);
    } else {
      this.$events[name] = [this.$events[name], fn];
    }

    return this;
  };

  EventEmitter.prototype.addListener = EventEmitter.prototype.on;

  /**
   * Adds a volatile listener.
   *
   * @api public
   */

  EventEmitter.prototype.once = function (name, fn) {
    var self = this;

    function on () {
      self.removeListener(name, on);
      fn.apply(this, arguments);
    };

    on.listener = fn;
    this.on(name, on);

    return this;
  };

  /**
   * Removes a listener.
   *
   * @api public
   */

  EventEmitter.prototype.removeListener = function (name, fn) {
    if (this.$events && this.$events[name]) {
      var list = this.$events[name];

      if (io.util.isArray(list)) {
        var pos = -1;

        for (var i = 0, l = list.length; i < l; i++) {
          if (list[i] === fn || (list[i].listener && list[i].listener === fn)) {
            pos = i;
            break;
          }
        }

        if (pos < 0) {
          return this;
        }

        list.splice(pos, 1);

        if (!list.length) {
          delete this.$events[name];
        }
      } else if (list === fn || (list.listener && list.listener === fn)) {
        delete this.$events[name];
      }
    }

    return this;
  };

  /**
   * Removes all listeners for an event.
   *
   * @api public
   */

  EventEmitter.prototype.removeAllListeners = function (name) {
    // TODO: enable this when node 0.5 is stable
    //if (name === undefined) {
      //this.$events = {};
      //return this;
    //}

    if (this.$events && this.$events[name]) {
      this.$events[name] = null;
    }

    return this;
  };

  /**
   * Gets all listeners for a certain event.
   *
   * @api publci
   */

  EventEmitter.prototype.listeners = function (name) {
    if (!this.$events) {
      this.$events = {};
    }

    if (!this.$events[name]) {
      this.$events[name] = [];
    }

    if (!io.util.isArray(this.$events[name])) {
      this.$events[name] = [this.$events[name]];
    }

    return this.$events[name];
  };

  /**
   * Emits an event.
   *
   * @api public
   */

  EventEmitter.prototype.emit = function (name) {
    if (!this.$events) {
      return false;
    }

    var handler = this.$events[name];

    if (!handler) {
      return false;
    }

    var args = Array.prototype.slice.call(arguments, 1);

    if ('function' == typeof handler) {
      handler.apply(this, args);
    } else if (io.util.isArray(handler)) {
      var listeners = handler.slice();

      for (var i = 0, l = listeners.length; i < l; i++) {
        listeners[i].apply(this, args);
      }
    } else {
      return false;
    }

    return true;
  };

})(
    'undefined' != typeof io ? io : module.exports
  , 'undefined' != typeof io ? io : module.parent.exports
);

/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

/**
 * Based on JSON2 (http://www.JSON.org/js.html).
 */

(function (exports, nativeJSON) {
  "use strict";

  // use native JSON if it's available
  if (nativeJSON && nativeJSON.parse){
    return exports.JSON = {
      parse: nativeJSON.parse
    , stringify: nativeJSON.stringify
    }
  }

  var JSON = exports.JSON = {};

  function f(n) {
      // Format integers to have at least two digits.
      return n < 10 ? '0' + n : n;
  }

  function date(d, key) {
    return isFinite(d.valueOf()) ?
        d.getUTCFullYear()     + '-' +
        f(d.getUTCMonth() + 1) + '-' +
        f(d.getUTCDate())      + 'T' +
        f(d.getUTCHours())     + ':' +
        f(d.getUTCMinutes())   + ':' +
        f(d.getUTCSeconds())   + 'Z' : null;
  };

  var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
      escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
      gap,
      indent,
      meta = {    // table of character substitutions
          '\b': '\\b',
          '\t': '\\t',
          '\n': '\\n',
          '\f': '\\f',
          '\r': '\\r',
          '"' : '\\"',
          '\\': '\\\\'
      },
      rep;


  function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

      escapable.lastIndex = 0;
      return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
          var c = meta[a];
          return typeof c === 'string' ? c :
              '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
      }) + '"' : '"' + string + '"';
  }


  function str(key, holder) {

// Produce a string from holder[key].

      var i,          // The loop counter.
          k,          // The member key.
          v,          // The member value.
          length,
          mind = gap,
          partial,
          value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

      if (value instanceof Date) {
          value = date(key);
      }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

      if (typeof rep === 'function') {
          value = rep.call(holder, key, value);
      }

// What happens next depends on the value's type.

      switch (typeof value) {
      case 'string':
          return quote(value);

      case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

          return isFinite(value) ? String(value) : 'null';

      case 'boolean':
      case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

          return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

      case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

          if (!value) {
              return 'null';
          }

// Make an array to hold the partial results of stringifying this object value.

          gap += indent;
          partial = [];

// Is the value an array?

          if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

              length = value.length;
              for (i = 0; i < length; i += 1) {
                  partial[i] = str(i, value) || 'null';
              }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

              v = partial.length === 0 ? '[]' : gap ?
                  '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                  '[' + partial.join(',') + ']';
              gap = mind;
              return v;
          }

// If the replacer is an array, use it to select the members to be stringified.

          if (rep && typeof rep === 'object') {
              length = rep.length;
              for (i = 0; i < length; i += 1) {
                  if (typeof rep[i] === 'string') {
                      k = rep[i];
                      v = str(k, value);
                      if (v) {
                          partial.push(quote(k) + (gap ? ': ' : ':') + v);
                      }
                  }
              }
          } else {

// Otherwise, iterate through all of the keys in the object.

              for (k in value) {
                  if (Object.prototype.hasOwnProperty.call(value, k)) {
                      v = str(k, value);
                      if (v) {
                          partial.push(quote(k) + (gap ? ': ' : ':') + v);
                      }
                  }
              }
          }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

          v = partial.length === 0 ? '{}' : gap ?
              '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
              '{' + partial.join(',') + '}';
          gap = mind;
          return v;
      }
  }

// If the JSON object does not yet have a stringify method, give it one.

  JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

      var i;
      gap = '';
      indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

      if (typeof space === 'number') {
          for (i = 0; i < space; i += 1) {
              indent += ' ';
          }

// If the space parameter is a string, it will be used as the indent string.

      } else if (typeof space === 'string') {
          indent = space;
      }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

      rep = replacer;
      if (replacer && typeof replacer !== 'function' &&
              (typeof replacer !== 'object' ||
              typeof replacer.length !== 'number')) {
          throw new Error('JSON.stringify');
      }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

      return str('', {'': value});
  };

// If the JSON object does not yet have a parse method, give it one.

  JSON.parse = function (text, reviver) {
  // The parse method takes a text and an optional reviver function, and returns
  // a JavaScript value if the text is a valid JSON text.

      var j;

      function walk(holder, key) {

  // The walk method is used to recursively walk the resulting structure so
  // that modifications can be made.

          var k, v, value = holder[key];
          if (value && typeof value === 'object') {
              for (k in value) {
                  if (Object.prototype.hasOwnProperty.call(value, k)) {
                      v = walk(value, k);
                      if (v !== undefined) {
                          value[k] = v;
                      } else {
                          delete value[k];
                      }
                  }
              }
          }
          return reviver.call(holder, key, value);
      }


  // Parsing happens in four stages. In the first stage, we replace certain
  // Unicode characters with escape sequences. JavaScript handles many characters
  // incorrectly, either silently deleting them, or treating them as line endings.

      text = String(text);
      cx.lastIndex = 0;
      if (cx.test(text)) {
          text = text.replace(cx, function (a) {
              return '\\u' +
                  ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
          });
      }

  // In the second stage, we run the text against regular expressions that look
  // for non-JSON patterns. We are especially concerned with '()' and 'new'
  // because they can cause invocation, and '=' because it can cause mutation.
  // But just to be safe, we want to reject all unexpected forms.

  // We split the second stage into 4 regexp operations in order to work around
  // crippling inefficiencies in IE's and Safari's regexp engines. First we
  // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
  // replace all simple value tokens with ']' characters. Third, we delete all
  // open brackets that follow a colon or comma or that begin the text. Finally,
  // we look to see that the remaining characters are only whitespace or ']' or
  // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

      if (/^[\],:{}\s]*$/
              .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                  .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                  .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

  // In the third stage we use the eval function to compile the text into a
  // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
  // in JavaScript: it can begin a block or an object literal. We wrap the text
  // in parens to eliminate the ambiguity.

          j = eval('(' + text + ')');

  // In the optional fourth stage, we recursively walk the new structure, passing
  // each name/value pair to a reviver function for possible transformation.

          return typeof reviver === 'function' ?
              walk({'': j}, '') : j;
      }

  // If the text is not JSON parseable, then a SyntaxError is thrown.

      throw new SyntaxError('JSON.parse');
  };

})(
    'undefined' != typeof io ? io : module.exports
  , typeof JSON !== 'undefined' ? JSON : undefined
);

/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, io) {

  /**
   * Parser namespace.
   *
   * @namespace
   */

  var parser = exports.parser = {};

  /**
   * Packet types.
   */

  var packets = parser.packets = [
      'disconnect'
    , 'connect'
    , 'heartbeat'
    , 'message'
    , 'json'
    , 'event'
    , 'ack'
    , 'error'
    , 'noop'
  ];

  /**
   * Errors reasons.
   */

  var reasons = parser.reasons = [
      'transport not supported'
    , 'client not handshaken'
    , 'unauthorized'
  ];

  /**
   * Errors advice.
   */

  var advice = parser.advice = [
      'reconnect'
  ];

  /**
   * Shortcuts.
   */

  var JSON = io.JSON
    , indexOf = io.util.indexOf;

  /**
   * Encodes a packet.
   *
   * @api private
   */

  parser.encodePacket = function (packet) {
    var type = indexOf(packets, packet.type)
      , id = packet.id || ''
      , endpoint = packet.endpoint || ''
      , ack = packet.ack
      , data = null;

    switch (packet.type) {
      case 'error':
        var reason = packet.reason ? indexOf(reasons, packet.reason) : ''
          , adv = packet.advice ? indexOf(advice, packet.advice) : '';

        if (reason !== '' || adv !== '')
          data = reason + (adv !== '' ? ('+' + adv) : '');

        break;

      case 'message':
        if (packet.data !== '')
          data = packet.data;
        break;

      case 'event':
        var ev = { name: packet.name };

        if (packet.args && packet.args.length) {
          ev.args = packet.args;
        }

        data = JSON.stringify(ev);
        break;

      case 'json':
        data = JSON.stringify(packet.data);
        break;

      case 'connect':
        if (packet.qs)
          data = packet.qs;
        break;

      case 'ack':
        data = packet.ackId
          + (packet.args && packet.args.length
              ? '+' + JSON.stringify(packet.args) : '');
        break;
    }

    // construct packet with required fragments
    var encoded = [
        type
      , id + (ack == 'data' ? '+' : '')
      , endpoint
    ];

    // data fragment is optional
    if (data !== null && data !== undefined)
      encoded.push(data);

    return encoded.join(':');
  };

  /**
   * Encodes multiple messages (payload).
   *
   * @param {Array} messages
   * @api private
   */

  parser.encodePayload = function (packets) {
    var decoded = '';

    if (packets.length == 1)
      return packets[0];

    for (var i = 0, l = packets.length; i < l; i++) {
      var packet = packets[i];
      decoded += '\ufffd' + packet.length + '\ufffd' + packets[i];
    }

    return decoded;
  };

  /**
   * Decodes a packet
   *
   * @api private
   */

  var regexp = /([^:]+):([0-9]+)?(\+)?:([^:]+)?:?([\s\S]*)?/;

  parser.decodePacket = function (data) {
    var pieces = data.match(regexp);

    if (!pieces) return {};

    var id = pieces[2] || ''
      , data = pieces[5] || ''
      , packet = {
            type: packets[pieces[1]]
          , endpoint: pieces[4] || ''
        };

    // whether we need to acknowledge the packet
    if (id) {
      packet.id = id;
      if (pieces[3])
        packet.ack = 'data';
      else
        packet.ack = true;
    }

    // handle different packet types
    switch (packet.type) {
      case 'error':
        var pieces = data.split('+');
        packet.reason = reasons[pieces[0]] || '';
        packet.advice = advice[pieces[1]] || '';
        break;

      case 'message':
        packet.data = data || '';
        break;

      case 'event':
        try {
          var opts = JSON.parse(data);
          packet.name = opts.name;
          packet.args = opts.args;
        } catch (e) { }

        packet.args = packet.args || [];
        break;

      case 'json':
        try {
          packet.data = JSON.parse(data);
        } catch (e) { }
        break;

      case 'connect':
        packet.qs = data || '';
        break;

      case 'ack':
        var pieces = data.match(/^([0-9]+)(\+)?(.*)/);
        if (pieces) {
          packet.ackId = pieces[1];
          packet.args = [];

          if (pieces[3]) {
            try {
              packet.args = pieces[3] ? JSON.parse(pieces[3]) : [];
            } catch (e) { }
          }
        }
        break;

      case 'disconnect':
      case 'heartbeat':
        break;
    };

    return packet;
  };

  /**
   * Decodes data payload. Detects multiple messages
   *
   * @return {Array} messages
   * @api public
   */

  parser.decodePayload = function (data) {
    // IE doesn't like data[i] for unicode chars, charAt works fine
    if (data.charAt(0) == '\ufffd') {
      var ret = [];

      for (var i = 1, length = ''; i < data.length; i++) {
        if (data.charAt(i) == '\ufffd') {
          ret.push(parser.decodePacket(data.substr(i + 1).substr(0, length)));
          i += Number(length) + 1;
          length = '';
        } else {
          length += data.charAt(i);
        }
      }

      return ret;
    } else {
      return [parser.decodePacket(data)];
    }
  };

})(
    'undefined' != typeof io ? io : module.exports
  , 'undefined' != typeof io ? io : module.parent.exports
);
/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, io) {

  /**
   * Expose constructor.
   */

  exports.Transport = Transport;

  /**
   * This is the transport template for all supported transport methods.
   *
   * @constructor
   * @api public
   */

  function Transport (socket, sessid) {
    this.socket = socket;
    this.sessid = sessid;
  };

  /**
   * Apply EventEmitter mixin.
   */

  io.util.mixin(Transport, io.EventEmitter);

  /**
   * Handles the response from the server. When a new response is received
   * it will automatically update the timeout, decode the message and
   * forwards the response to the onMessage function for further processing.
   *
   * @param {String} data Response from the server.
   * @api private
   */

  Transport.prototype.onData = function (data) {
    this.clearCloseTimeout();

    // If the connection in currently open (or in a reopening state) reset the close
    // timeout since we have just received data. This check is necessary so
    // that we don't reset the timeout on an explicitly disconnected connection.
    if (this.socket.connected || this.socket.connecting || this.socket.reconnecting) {
      this.setCloseTimeout();
    }

    if (data !== '') {
      // todo: we should only do decodePayload for xhr transports
      var msgs = io.parser.decodePayload(data);

      if (msgs && msgs.length) {
        for (var i = 0, l = msgs.length; i < l; i++) {
          this.onPacket(msgs[i]);
        }
      }
    }

    return this;
  };

  /**
   * Handles packets.
   *
   * @api private
   */

  Transport.prototype.onPacket = function (packet) {
    this.socket.setHeartbeatTimeout();

    if (packet.type == 'heartbeat') {
      return this.onHeartbeat();
    }

    if (packet.type == 'connect' && packet.endpoint == '') {
      this.onConnect();
    }

    if (packet.type == 'error' && packet.advice == 'reconnect') {
      this.open = false;
    }

    this.socket.onPacket(packet);

    return this;
  };

  /**
   * Sets close timeout
   *
   * @api private
   */

  Transport.prototype.setCloseTimeout = function () {
    if (!this.closeTimeout) {
      var self = this;

      this.closeTimeout = setTimeout(function () {
        self.onDisconnect();
      }, this.socket.closeTimeout);
    }
  };

  /**
   * Called when transport disconnects.
   *
   * @api private
   */

  Transport.prototype.onDisconnect = function () {
    if (this.close && this.open) this.close();
    this.clearTimeouts();
    this.socket.onDisconnect();
    return this;
  };

  /**
   * Called when transport connects
   *
   * @api private
   */

  Transport.prototype.onConnect = function () {
    this.socket.onConnect();
    return this;
  }

  /**
   * Clears close timeout
   *
   * @api private
   */

  Transport.prototype.clearCloseTimeout = function () {
    if (this.closeTimeout && typeof this.closeTimeout === 'number') {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }
  };

  /**
   * Clear timeouts
   *
   * @api private
   */

  Transport.prototype.clearTimeouts = function () {
    this.clearCloseTimeout();

    if (this.reopenTimeout && typeof this.reopenTimeout === 'number') {
      clearTimeout(this.reopenTimeout);
    }
  };

  /**
   * Sends a packet
   *
   * @param {Object} packet object.
   * @api private
   */

  Transport.prototype.packet = function (packet) {
    this.send(io.parser.encodePacket(packet));
  };

  /**
   * Send the received heartbeat message back to server. So the server
   * knows we are still connected.
   *
   * @param {String} heartbeat Heartbeat response from the server.
   * @api private
   */

  Transport.prototype.onHeartbeat = function (heartbeat) {
    this.packet({ type: 'heartbeat' });
  };

  /**
   * Called when the transport opens.
   *
   * @api private
   */

  Transport.prototype.onOpen = function () {
    this.open = true;
    this.clearCloseTimeout();
    this.socket.onOpen();
  };

  /**
   * Notifies the base when the connection with the Socket.IO server
   * has been disconnected.
   *
   * @api private
   */

  Transport.prototype.onClose = function () {
    var self = this;

    /* FIXME: reopen delay causing a infinit loop
    this.reopenTimeout = setTimeout(function () {
      self.open();
    }, this.socket.options['reopen delay']);*/

    this.open = false;
    this.socket.onClose();
    this.onDisconnect();
  };

  /**
   * Generates a connection url based on the Socket.IO URL Protocol.
   * See <https://github.com/learnboost/socket.io-node/> for more details.
   *
   * @returns {String} Connection url
   * @api private
   */

  Transport.prototype.prepareUrl = function () {
    var options = this.socket.options;

    return this.scheme() + '://'
      + options.host + ':' + options.port + '/'
      + options.resource + '/' + io.protocol
      + '/' + this.name + '/' + this.sessid;
  };

  /**
   * Checks if the transport is ready to start a connection.
   *
   * @param {Socket} socket The socket instance that needs a transport
   * @param {Function} fn The callback
   * @api private
   */

  Transport.prototype.ready = function (socket, fn) {
    fn.call(this);
  };
})(
    'undefined' != typeof io ? io : module.exports
  , 'undefined' != typeof io ? io : module.parent.exports
);
/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, io, global) {

  /**
   * Expose constructor.
   */

  exports.Socket = Socket;

  /**
   * Create a new `Socket.IO client` which can establish a persistent
   * connection with a Socket.IO enabled server.
   *
   * @api public
   */

  function Socket (options) {
    this.options = {
        port: 80
      , secure: false
      , document: 'document' in global ? document : false
      , resource: 'socket.io'
      , transports: io.transports
      , 'connect timeout': 10000
      , 'try multiple transports': true
      , 'reconnect': true
      , 'reconnection delay': 500
      , 'reconnection limit': Infinity
      , 'reopen delay': 3000
      , 'max reconnection attempts': 10
      , 'sync disconnect on unload': true
      , 'auto connect': true
      , 'flash policy port': 10843
    };

    io.util.merge(this.options, options);

    this.connected = false;
    this.open = false;
    this.connecting = false;
    this.reconnecting = false;
    this.namespaces = {};
    this.buffer = [];
    this.doBuffer = false;

    if (this.options['sync disconnect on unload'] &&
        (!this.isXDomain() || io.util.ua.hasCORS)) {
      var self = this;

      io.util.on(global, 'unload', function () {
        self.disconnectSync();
      }, false);
    }

    if (this.options['auto connect']) {
      this.connect();
    }
};

  /**
   * Apply EventEmitter mixin.
   */

  io.util.mixin(Socket, io.EventEmitter);

  /**
   * Returns a namespace listener/emitter for this socket
   *
   * @api public
   */

  Socket.prototype.of = function (name) {
    if (!this.namespaces[name]) {
      this.namespaces[name] = new io.SocketNamespace(this, name);

      if (name !== '') {
        this.namespaces[name].packet({ type: 'connect' });
      }
    }

    return this.namespaces[name];
  };

  /**
   * Emits the given event to the Socket and all namespaces
   *
   * @api private
   */

  Socket.prototype.publish = function () {
    this.emit.apply(this, arguments);

    var nsp;

    for (var i in this.namespaces) {
      if (this.namespaces.hasOwnProperty(i)) {
        nsp = this.of(i);
        nsp.$emit.apply(nsp, arguments);
      }
    }
  };

  /**
   * Performs the handshake
   *
   * @api private
   */

  function empty () { };

  Socket.prototype.handshake = function (fn) {
    var self = this
      , options = this.options;

    function complete (data) {
      if (data instanceof Error) {
        self.connecting = false;
        self.onError(data.message);
      } else {
        fn.apply(null, data.split(':'));
      }
    };

    var url = [
          'http' + (options.secure ? 's' : '') + ':/'
        , options.host + ':' + options.port
        , options.resource
        , io.protocol
        , io.util.query(this.options.query, 't=' + +new Date)
      ].join('/');

    var xhr = Ti.Network.createHTTPClient();
    xhr.open('GET', url, true);
    xhr.withCredentials = true;
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        xhr.onreadystatechange = empty;

        if (xhr.status == 200) {
          complete(xhr.responseText);
        } else {
          self.connecting = false;
          !self.reconnecting && self.onError(xhr.responseText);
        }
      }
    };
    xhr.send(null);
  };

  /**
   * Find an available transport based on the options supplied in the constructor.
   *
   * @api private
   */

  Socket.prototype.getTransport = function (override) {
    var transports = override || this.transports, match;

    for (var i = 0, transport; transport = transports[i]; i++) {
      if (io.Transport[transport]
        && io.Transport[transport].check(this)
        && (!this.isXDomain() || io.Transport[transport].xdomainCheck())) {
        return new io.Transport[transport](this, this.sessionid);
      }
    }

    return null;
  };

  /**
   * Connects to the server.
   *
   * @param {Function} [fn] Callback.
   * @returns {io.Socket}
   * @api public
   */

  Socket.prototype.connect = function (fn) {
    if (this.connecting) {
      return this;
    }

    var self = this;
    self.connecting = true;

    this.handshake(function (sid, heartbeat, close, transports) {
      self.sessionid = sid;
      self.closeTimeout = close * 1000;
      self.heartbeatTimeout = heartbeat * 1000;
      self.transports = transports ? io.util.intersect(
          transports.split(',')
        , self.options.transports
      ) : self.options.transports;

      self.setHeartbeatTimeout();

      function connect (transports){
        if (self.transport) self.transport.clearTimeouts();

        self.transport = self.getTransport(transports);
        if (!self.transport) return self.publish('connect_failed');

        // once the transport is ready
        self.transport.ready(self, function () {
          self.connecting = true;
          self.publish('connecting', self.transport.name);
          self.transport.open();

          if (self.options['connect timeout']) {
            self.connectTimeoutTimer = setTimeout(function () {
              if (!self.connected) {
                self.connecting = false;

                if (self.options['try multiple transports']) {
                  if (!self.remainingTransports) {
                    self.remainingTransports = self.transports.slice(0);
                  }

                  var remaining = self.remainingTransports;

                  while (remaining.length > 0 && remaining.splice(0,1)[0] !=
                         self.transport.name) {}

                    if (remaining.length){
                      connect(remaining);
                    } else {
                      self.publish('connect_failed');
                    }
                }
              }
            }, self.options['connect timeout']);
          }
        });
      }

      connect(self.transports);

      self.once('connect', function (){
        if (typeof self.connectTimeoutTimer === 'number') {
          clearTimeout(self.connectTimeoutTimer);
        }

        fn && typeof fn == 'function' && fn();
      });
    });

    return this;
  };

  /**
   * Clears and sets a new heartbeat timeout using the value given by the
   * server during the handshake.
   *
   * @api private
   */

  Socket.prototype.setHeartbeatTimeout = function () {
    if (typeof this.heartbeatTimeoutTimer === 'number') {
      clearTimeout(this.heartbeatTimeoutTimer);
    }

    var self = this;
    this.heartbeatTimeoutTimer = setTimeout(function () {
      self.transport.onClose();
    }, this.heartbeatTimeout);
  };

  /**
   * Sends a message.
   *
   * @param {Object} data packet.
   * @returns {io.Socket}
   * @api public
   */

  Socket.prototype.packet = function (data) {
    if (this.connected && !this.doBuffer) {
      this.transport.packet(data);
    } else {
      this.buffer.push(data);
    }

    return this;
  };

  /**
   * Sets buffer state
   *
   * @api private
   */

  Socket.prototype.setBuffer = function (v) {
    this.doBuffer = v;

    if (!v && this.connected && this.buffer.length) {
      this.transport.payload(this.buffer);
      this.buffer = [];
    }
  };

  /**
   * Disconnect the established connect.
   *
   * @returns {io.Socket}
   * @api public
   */

  Socket.prototype.disconnect = function () {
    if (this.connected || this.connecting) {
      if (this.open) {
        this.of('').packet({ type: 'disconnect' });
      }

      // handle disconnection immediately
      this.onDisconnect('booted');
    }

    return this;
  };

  /**
   * Disconnects the socket with a sync XHR.
   *
   * @api private
   */

  Socket.prototype.disconnectSync = function () {
    // ensure disconnection
    var xhr = Ti.Network.createHTTPClient()
      , uri = this.resource + '/' + io.protocol + '/' + this.sessionid;

    xhr.open('GET', uri, true);

    // handle disconnection immediately
    this.onDisconnect('booted');
  };

  /**
   * Check if we need to use cross domain enabled transports. Cross domain would
   * be a different port or different domain name.
   *
   * @returns {Boolean}
   * @api private
   */

  Socket.prototype.isXDomain = function () {
    return false;
  };

  /**
   * Called upon handshake.
   *
   * @api private
   */

  Socket.prototype.onConnect = function () {
    if (!this.connected) {
      this.connected = true;
      this.connecting = false;
      if (!this.doBuffer) {
        // make sure to flush the buffer
        this.setBuffer(false);
      }
      this.emit('connect');
    }
  };

  /**
   * Called when the transport opens
   *
   * @api private
   */

  Socket.prototype.onOpen = function () {
    this.open = true;
  };

  /**
   * Called when the transport closes.
   *
   * @api private
   */

  Socket.prototype.onClose = function () {
    this.open = false;
    if (typeof this.heartbeatTimeoutTimer === 'number') {
      clearTimeout(this.heartbeatTimeoutTimer);
    }
  };

  /**
   * Called when the transport first opens a connection
   *
   * @param text
   */

  Socket.prototype.onPacket = function (packet) {
    this.of(packet.endpoint).onPacket(packet);
  };

  /**
   * Handles an error.
   *
   * @api private
   */

  Socket.prototype.onError = function (err) {
    if (err && err.advice) {
      if (err.advice === 'reconnect' && (this.connected || this.connecting)) {
        this.disconnect();
        if (this.options.reconnect) {
          this.reconnect();
        }
      }
    }

    this.publish('error', err && err.reason ? err.reason : err);
  };

  /**
   * Called when the transport disconnects.
   *
   * @api private
   */

  Socket.prototype.onDisconnect = function (reason) {
    var wasConnected = this.connected
      , wasConnecting = this.connecting;

    this.connected = false;
    this.connecting = false;
    this.open = false;

    if (wasConnected || wasConnecting) {
      this.transport.close();
      this.transport.clearTimeouts();
      if (wasConnected) {
        this.publish('disconnect', reason);

        if ('booted' != reason && this.options.reconnect && !this.reconnecting) {
          this.reconnect();
        }
      }
    }
  };

  /**
   * Called upon reconnection.
   *
   * @api private
   */

  Socket.prototype.reconnect = function () {
    this.reconnecting = true;
    this.reconnectionAttempts = 0;
    this.reconnectionDelay = this.options['reconnection delay'];

    var self = this
      , maxAttempts = this.options['max reconnection attempts']
      , tryMultiple = this.options['try multiple transports']
      , limit = this.options['reconnection limit'];

    function reset () {
      if (self.connected) {
        for (var i in self.namespaces) {
          if (self.namespaces.hasOwnProperty(i) && '' !== i) {
              self.namespaces[i].packet({ type: 'connect' });
          }
        }
        self.publish('reconnect', self.transport.name, self.reconnectionAttempts);
      }

      if (typeof self.reconnectionTimer === 'number') {
        clearTimeout(self.reconnectionTimer);
      }

      self.removeListener('connect_failed', maybeReconnect);
      self.removeListener('connect', maybeReconnect);

      self.reconnecting = false;

      delete self.reconnectionAttempts;
      delete self.reconnectionDelay;
      delete self.reconnectionTimer;
      delete self.redoTransports;

      self.options['try multiple transports'] = tryMultiple;
    };

    function maybeReconnect () {
      if (!self.reconnecting) {
        return;
      }

      if (self.connected) {
        return reset();
      };

      if (self.connecting && self.reconnecting) {
        return self.reconnectionTimer = setTimeout(maybeReconnect, 1000);
      }

      if (self.reconnectionAttempts++ >= maxAttempts) {
        if (!self.redoTransports) {
          self.on('connect_failed', maybeReconnect);
          self.options['try multiple transports'] = true;
          self.transport = self.getTransport();
          self.redoTransports = true;
          self.connect();
        } else {
          self.publish('reconnect_failed');
          reset();
        }
      } else {
        if (self.reconnectionDelay < limit) {
          self.reconnectionDelay *= 2; // exponential back off
        }

        self.connect();
        self.publish('reconnecting', self.reconnectionDelay, self.reconnectionAttempts);
        self.reconnectionTimer = setTimeout(maybeReconnect, self.reconnectionDelay);
      }
    };

    this.options['try multiple transports'] = false;
    this.reconnectionTimer = setTimeout(maybeReconnect, this.reconnectionDelay);

    this.on('connect', maybeReconnect);
  };

})(
    'undefined' != typeof io ? io : module.exports
  , 'undefined' != typeof io ? io : module.parent.exports
  , this
);
/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, io) {

  /**
   * Expose constructor.
   */

  exports.SocketNamespace = SocketNamespace;

  /**
   * Socket namespace constructor.
   *
   * @constructor
   * @api public
   */

  function SocketNamespace (socket, name) {
    this.socket = socket;
    this.name = name || '';
    this.flags = {};
    this.json = new Flag(this, 'json');
    this.ackPackets = 0;
    this.acks = {};
  };

  /**
   * Apply EventEmitter mixin.
   */

  io.util.mixin(SocketNamespace, io.EventEmitter);

  /**
   * Copies emit since we override it
   *
   * @api private
   */

  SocketNamespace.prototype.$emit = io.EventEmitter.prototype.emit;

  /**
   * Creates a new namespace, by proxying the request to the socket. This
   * allows us to use the synax as we do on the server.
   *
   * @api public
   */

  SocketNamespace.prototype.of = function () {
    return this.socket.of.apply(this.socket, arguments);
  };

  /**
   * Sends a packet.
   *
   * @api private
   */

  SocketNamespace.prototype.packet = function (packet) {
    packet.endpoint = this.name;
    this.socket.packet(packet);
    this.flags = {};
    return this;
  };

  /**
   * Sends a message
   *
   * @api public
   */

  SocketNamespace.prototype.send = function (data, fn) {
    var packet = {
        type: this.flags.json ? 'json' : 'message'
      , data: data
    };

    if ('function' == typeof fn) {
      packet.id = ++this.ackPackets;
      packet.ack = true;
      this.acks[packet.id] = fn;
    }

    return this.packet(packet);
  };

  /**
   * Emits an event
   *
   * @api public
   */

  SocketNamespace.prototype.emit = function (name) {
    var args = Array.prototype.slice.call(arguments, 1)
      , lastArg = args[args.length - 1]
      , packet = {
            type: 'event'
          , name: name
        };

    if ('function' == typeof lastArg) {
      packet.id = ++this.ackPackets;
      packet.ack = 'data';
      this.acks[packet.id] = lastArg;
      args = args.slice(0, args.length - 1);
    }

    packet.args = args;

    return this.packet(packet);
  };

  /**
   * Disconnects the namespace
   *
   * @api private
   */

  SocketNamespace.prototype.disconnect = function () {
    if (this.name === '') {
      this.socket.disconnect();
    } else {
      this.packet({ type: 'disconnect' });
      this.$emit('disconnect');
    }

    return this;
  };

  /**
   * Handles a packet
   *
   * @api private
   */

  SocketNamespace.prototype.onPacket = function (packet) {
    var self = this;

    function ack () {
      self.packet({
          type: 'ack'
        , args: io.util.toArray(arguments)
        , ackId: packet.id
      });
    };

    switch (packet.type) {
      case 'connect':
        this.$emit('connect');
        break;

      case 'disconnect':
        if (this.name === '') {
          this.socket.onDisconnect(packet.reason || 'booted');
        } else {
          this.$emit('disconnect', packet.reason);
        }
        break;

      case 'message':
      case 'json':
        var params = ['message', packet.data];

        if (packet.ack == 'data') {
          params.push(ack);
        } else if (packet.ack) {
          this.packet({ type: 'ack', ackId: packet.id });
        }

        this.$emit.apply(this, params);
        break;

      case 'event':
        var params = [packet.name].concat(packet.args);

        if (packet.ack == 'data')
          params.push(ack);

        this.$emit.apply(this, params);
        break;

      case 'ack':
        if (this.acks[packet.ackId]) {
          this.acks[packet.ackId].apply(this, packet.args);
          delete this.acks[packet.ackId];
        }
        break;

      case 'error':
        if (packet.advice){
          this.socket.onError(packet);
        } else {
          if (packet.reason == 'unauthorized') {
            this.$emit('connect_failed', packet.reason);
          } else {
            this.$emit('error', packet.reason);
          }
        }
        break;
    }
  };

  /**
   * Flag interface.
   *
   * @api private
   */

  function Flag (nsp, name) {
    this.namespace = nsp;
    this.name = name;
  };

  /**
   * Send a message
   *
   * @api public
   */

  Flag.prototype.send = function () {
    this.namespace.flags[this.name] = true;
    this.namespace.send.apply(this.namespace, arguments);
  };

  /**
   * Emit an event
   *
   * @api public
   */

  Flag.prototype.emit = function () {
    this.namespace.flags[this.name] = true;
    this.namespace.emit.apply(this.namespace, arguments);
  };

})(
    'undefined' != typeof io ? io : module.exports
  , 'undefined' != typeof io ? io : module.parent.exports
);

/**
 * socket.io
 * Copyright(c) 2011 LearnBoost <dev@learnboost.com>
 * MIT Licensed
 */

(function (exports, io, global) {

  /**
   * Expose constructor.
   */

  exports.websocket = WS;

  /**
   * The WebSocket transport uses the HTML5 WebSocket API to establish an
   * persistent connection with the Socket.IO server. This transport will also
   * be inherited by the FlashSocket fallback as it provides a API compatible
   * polyfill for the WebSockets.
   *
   * @constructor
   * @extends {io.Transport}
   * @api public
   */

  function WS (socket) {
    io.Transport.apply(this, arguments);
  };

  /**
   * Inherits from Transport.
   */

  io.util.inherit(WS, io.Transport);

  /**
   * Transport name
   *
   * @api public
   */

  WS.prototype.name = 'websocket';

  /**
   * Initializes a new `WebSocket` connection with the Socket.IO server. We attach
   * all the appropriate listeners to handle the responses from the server.
   *
   * @returns {Transport}
   * @api public
   */

  WS.prototype.open = function () {
    var query = io.util.query(this.socket.options.query)
      , self = this
      , Socket

    this.websocket = new WebSocket(this.prepareUrl() + query);

    this.websocket.onopen = function () {
      self.onOpen();
      self.socket.setBuffer(false);
    };
    this.websocket.onmessage = function (ev) {
      self.onData(ev.data);
    };
    this.websocket.onclose = function () {
      self.onClose();
      self.socket.setBuffer(true);
    };
    this.websocket.onerror = function (e) {
      self.onError(e);
    };

    return this;
  };

  /**
   * Send a message to the Socket.IO server. The message will automatically be
   * encoded in the correct message format.
   *
   * @returns {Transport}
   * @api public
   */

  // Do to a bug in the current IDevices browser, we need to wrap the send in a
  // setTimeout, when they resume from sleeping the browser will crash if
  // we don't allow the browser time to detect the socket has been closed
  if (io.util.ua.iDevice) {
    WS.prototype.send = function (data) {
      var self = this;
      setTimeout(function() {
         self.websocket.send(data);
      },0);
      return this;
    };
  } else {
    WS.prototype.send = function (data) {
      this.websocket.send(data);
      return this;
    };
  }

  /**
   * Payload
   *
   * @api private
   */

  WS.prototype.payload = function (arr) {
    for (var i = 0, l = arr.length; i < l; i++) {
      this.packet(arr[i]);
    }
    return this;
  };

  /**
   * Disconnect the established `WebSocket` connection.
   *
   * @returns {Transport}
   * @api public
   */

  WS.prototype.close = function () {
    this.websocket.close();
    return this;
  };

  /**
   * Handle the errors that `WebSocket` might be giving when we
   * are attempting to connect or send messages.
   *
   * @param {Error} e The error.
   * @api private
   */

  WS.prototype.onError = function (e) {
    this.socket.onError(e);
  };

  /**
   * Returns the appropriate scheme for the URI generation.
   *
   * @api private
   */
  WS.prototype.scheme = function () {
    return this.socket.options.secure ? 'wss' : 'ws';
  };

  /**
   * Checks if the browser has support for native `WebSockets` and that
   * it's not the polyfill created for the FlashSocket transport.
   *
   * @return {Boolean}
   * @api public
   */

  WS.check = function () {
    return true;
  };

  /**
   * Check if the `WebSocket` transport support cross domain communications.
   *
   * @returns {Boolean}
   * @api public
   */

  WS.xdomainCheck = function () {
    return true;
  };

  /**
   * Add the transport to your public io.transports array.
   *
   * @api private
   */

  io.transports.push('websocket');

})(
    'undefined' != typeof io ? io.Transport : module.exports
  , 'undefined' != typeof io ? io : module.parent.exports
  , this
);
(function (exports) {
  var SHA1 = (function(){var exports={};/*
 * Modified by Yuichiro MASUI <masui@masuidrive.jp>
 * Tested on nodejs and Titanium Mobile
 *
 * The JavaScript implementation of the Secure Hash Algorithm 1
 *
 *   Copyright (c) 2008  Takanori Ishikawa  <takanori.ishikawa@gmail.com>
 *   All rights reserved.
 *
 *   Redistribution and use in source and binary forms, with or without
 *   modification, are permitted provided that the following conditions
 *   are met:
 *
 *   1. Redistributions of source code must retain the above copyright
 *      notice, this list of conditions and the following disclaimer.
 *
 *   2. Redistributions in binary form must reproduce the above copyright
 *      notice, this list of conditions and the following disclaimer in the
 *      documentation and/or other materials provided with the distribution.
 *
 *   3. Neither the name of the authors nor the names of its contributors
 *      may be used to endorse or promote products derived from this
 *      software without specific prior written permission.
 *
 *   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 *   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 *   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 *   A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 *   OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 *   SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 *   TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 *   PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 *   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 *   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
/**
 * This is the javascript file for code which implements
 * the Secure Hash Algorithm 1 as defined in FIPS 180-1 published April 17, 1995.
 *
 *   Author: Takanori Ishikawa <takanori.ishikawa@gmail.com>
 *   Copyright: Takanori Ishikawa 2008
 *   License: BSD License (see above)
 *
 * NOTE:
 *   Only 8-bit string is supported, please use encodeURIComponent() function
 *   if you want to hash multibyte string.
 *
 * Supported Browsers:
 *   [Win] IE 6, Firefox 2
 *   [Mac] Safari 3, Firefox 2
 *
 * Usage:
 *   var hexdigest = new SHA1("Hello.").hexdigest(); // "9b56d519ccd9e1e5b2a725e186184cdc68de0731"
 *
 * See Also:
 *   FIPS 180-1 - Secure Hash Standard
 *   http://www.itl.nist.gov/fipspubs/fip180-1.htm
 *
 */

var SHA1 = (function(){

  /**
   * Spec is the BDD style test utilities.
   */
  var Spec;
  Spec = {
    /** Replace the Spec.describe function with empty function if false. */
    enabled: true,

    /** Indicates whether object 'a' is "equal to" 'b'. */
    equals: function(a, b) {
      var i;
      if (a instanceof Array && b instanceof Array) {
        if (a.length !== b.length) { return false; }
        for (i = 0; i < a.length; i++) { if (!Spec.equals(a[i], b[i])) { return false; } }
        return true;
      }
      if ((a !== null && b !== null) && (typeof a === "object" && typeof b === "object")) {
        for (i in a) { if(a.hasOwnProperty(i)) { if (!Spec.equals(a[i], b[i])) { return false; } } }
        return true;
      }
      return (a === b);
    },

    /** equivalent to xUint's assert */
    should: function(expection, message) {
      Spec.currentIndicator++;
      if (!expection) {
        var warning = [
          "[Spec failed",
          Spec.currentTitle ? " (" + Spec.currentTitle + ")] " : "] ",
          (message || (Spec.currentMessage + " " + Spec.currentIndicator) || "")
        ].join("");

        alert(warning);
        throw warning;
      }
      return !!expection;
    },

    /** Write your specification by using describe method. */
    describe: function(title, spec) {
      Spec.currentTitle = title;
      var name;
      for (name in spec) {
        if (spec.hasOwnProperty(name)) {
          Spec.currentMessage = name;
          Spec.currentIndicator = 0;
          spec[name]();
          Spec.currentIndicator = null;
        }
      }
      Spec.currentMessage = Spec.currentTitle = null;
    },
    Version: "0.1"
  };

  // Other BDD style stuffs.
  Spec.should.equal = function(a, b, message) { return Spec.should(Spec.equals(a, b), message); };
  Spec.should.not = function(a, message) { return Spec.should(!a, message); };
  Spec.should.not.equal = function(a, b, message) { return Spec.should(!Spec.equals(a, b), message); };
  if (!Spec.enabled) { Spec.describe = function(){}; }


  // self test
  Spec.describe("Spec object", {
    "should": function() {
      Spec.should(true);
      Spec.should(1);
    },
    "should.not": function() {
      Spec.should.not(false);
      Spec.should.not(0);
    },
    "should.equal": function() {
      Spec.should.equal(null, null);
      Spec.should.equal("", "");
      Spec.should.equal(12345, 12345);
      Spec.should.equal([0,1,2], [0,1,2]);
      Spec.should.equal([0,1,[0,1,2]], [0,1,[0,1,2]]);
      Spec.should.equal({}, {});
      Spec.should.equal({x:1}, {x:1});
      Spec.should.equal({x:[1]}, {x:[1]});
    },
    "should.not.equal": function() {
      Spec.should.not.equal([1,2,3], [1,2,3,4]);
      Spec.should.not.equal({x:1}, [1,2,3,4]);
    }
  });


  // -----------------------------------------------------------
  // Utilities
  // -----------------------------------------------------------
  // int32 -> hexdigits string (e.g. 0x123 -> '00000123')
  function strfhex32(i32) {
    i32 &= 0xffffffff;
    if (i32 < 0) { i32 += 0x100000000; }
    var hex = Number(i32).toString(16);
    if (hex.length < 8) { hex = "00000000".substr(0, 8 - hex.length) + hex; }
    return hex;
  }
  Spec.describe("sha1", {
    "strfhex32": function() {
      Spec.should.equal(strfhex32(0x0),          "00000000");
      Spec.should.equal(strfhex32(0x123),        "00000123");
      Spec.should.equal(strfhex32(0xffffffff),   "ffffffff");
    }
  });
/*
  // int32 -> string (e.g. 123 -> '00000000 00000000 00000000 01111011')
  function strfbits(i32) {
    if (typeof arguments.callee.ZERO32 === 'undefined') {
      arguments.callee.ZERO32 = new Array(33).join("0");
    }

    var bits = Number(i32).toString(2);
    // '0' padding
    if (bits.length < 32) bits = arguments.callee.ZERO32.substr(0, 32 - bits.length) + bits;
    // split by 8 bits
    return bits.replace(/(¥d{8})/g, '$1 ')
               .replace(/^¥s*(.*?)¥s*$/, '$1');
  }
  Spec.describe("sha1", {
    "strfbits": function() {
    Ti.API.info(strfbits(0));
    Ti.API.info(strfbits(1));
    Ti.API.info(strfbits(123));
      Spec.should.equal(strfbits(0),   "00000000 00000000 00000000 00000000");
      Spec.should.equal(strfbits(1),   "00000000 00000000 00000000 00000001");
      Spec.should.equal(strfbits(123), "00000000 00000000 00000000 01111011");
    }
  });
*/

  // -----------------------------------------------------------
  // SHA-1
  // -----------------------------------------------------------
  // Returns Number(32bit unsigned integer) array size to fit for blocks (512-bit strings)
  function padding_size(nbits) {
    var n = nbits + 1 + 64;
    return 512 * Math.ceil(n / 512) / 32;
  }
  Spec.describe("sha1", {
    "padding_size": function() {
      Spec.should.equal(padding_size(0),             16);
      Spec.should.equal(padding_size(1),             16);
      Spec.should.equal(padding_size(512 - 64 - 1),  16);
      Spec.should.equal(padding_size(512 - 64),      32);
    }
  });

  // 8bit string -> uint32[]
  function word_array(m) {
    var nchar = m.length;
    var size = padding_size(nchar * 8);
    var words = new Array(size);
    var i, j;
    for (i = 0, j = 0; i < nchar; ) {
      words[j++] = ((m.charCodeAt(i++) & 0xff) << 24) |
                   ((m.charCodeAt(i++) & 0xff) << 16) |
                   ((m.charCodeAt(i++) & 0xff) << 8)  |
                   ((m.charCodeAt(i++) & 0xff));
    }
    while (j < size) { words[j++] = 0; }
    return words;
  }
  Spec.describe("sha1", {
    "word_array": function() {
      Spec.should.equal(word_array(""), [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
      Spec.should.equal(word_array("1234")[0], 0x31323334);
    }
  });

  function write_nbits(words, length, nbits) {
    if (nbits > 0xffffffff) {
      var lo = nbits & 0xffffffff;
      if (lo < 0) { lo += 0x100000000; }
      words[length - 1] = lo;
      words[length - 2] = (nbits - lo) / 0x100000000;
    } else {
      words[length - 1] = nbits;
      words[length - 2] = 0x0;
    }
    return words;
  }
  Spec.describe("sha1", {
    "write_nbits": function() {
      Spec.should.equal(write_nbits([0, 0], 2, 1),             [0, 1]);
      Spec.should.equal(write_nbits([0, 0], 2, 0xffffffff),    [0, 0xffffffff]);
      Spec.should.equal(write_nbits([0, 0], 2, 0x100000000),   [1, 0]);
      Spec.should.equal(write_nbits([0, 0], 2, 0x1ffffffff),   [1, 0xffffffff]);
      Spec.should.equal(write_nbits([0, 0], 2, 0x12300000000), [0x123, 0]);
      Spec.should.equal(write_nbits([0, 0], 2, 0x123abcdef12), [0x123, 0xabcdef12]);
    }
  });

  function padding(words, nbits) {
    var i = Math.floor(nbits / 32);

    words[i] |= (1 << (((i + 1) * 32) - nbits - 1));
    write_nbits(words, padding_size(nbits), nbits);
    return words;
  }

  function digest(words) {
    var i = 0, t = 0;
    var H = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0];

    while (i < words.length) {
      var W = new Array(80);

      // (a)
      for (t = 0;  t < 16; t++) { W[t] = words[i++]; }

      // (b)
      for (t = 16; t < 80; t++) {
        var w = W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16];
        W[t] = (w << 1) | (w >>> 31);
      }

      // (c)
      var A = H[0], B = H[1], C = H[2], D = H[3], E = H[4];

      // (d) TEMP = S5(A) + ft(B,C,D) + E + Wt + Kt;
      //     E = D; D = C; C = S30(B); B = A; A = TEMP;
      for (t = 0; t < 80; t++) {
        var tmp = ((A << 5) | (A >>> 27)) + E + W[t];

        if      (t >=  0 && t <= 19) { tmp += ((B & C) | ((~B) & D))        + 0x5a827999; }
        else if (t >= 20 && t <= 39) { tmp += (B ^ C ^ D)                   + 0x6ed9eba1; }
        else if (t >= 40 && t <= 59) { tmp += ((B & C) | (B & D) | (C & D)) + 0x8f1bbcdc; }
        else if (t >= 60 && t <= 79) { tmp += (B ^ C ^ D)                   + 0xca62c1d6; }

        E = D; D = C; C = ((B << 30) | (B >>> 2)); B = A; A = tmp;
      }

      // (e) H0 = H0 + A, H1 = H1 + B, H2 = H2 + C, H3 = H3 + D, H4 = H4 + E.
      H[0] = (H[0] + A) & 0xffffffff;
      H[1] = (H[1] + B) & 0xffffffff;
      H[2] = (H[2] + C) & 0xffffffff;
      H[3] = (H[3] + D) & 0xffffffff;
      H[4] = (H[4] + E) & 0xffffffff;
      if (H[0] < 0) { H[0] += 0x100000000; }
      if (H[1] < 0) { H[1] += 0x100000000; }
      if (H[2] < 0) { H[2] += 0x100000000; }
      if (H[3] < 0) { H[3] += 0x100000000; }
      if (H[4] < 0) { H[4] += 0x100000000; }
    }

    return H;
  }

  // message: 8bit string
  var SHA1 = function(message) {
    this.message = message;
  };

  function strfhex8(i8) {
    i8 &= 0xff;
    if (i8 < 0) { i8 += 0x100; }
    var hex = Number(i8).toString(16);
    if (hex.length < 2) { hex = "00".substr(0, 2 - hex.length) + hex; }
    return hex;
  }


  var _base64_keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  SHA1.prototype = {
    digest: function() {
      var nbits = this.message.length * 8;
      var words = padding(word_array(this.message), nbits);
      return digest(words);
    },

    base64digest: function() {
      var hex = this.hexdigest();
      var output = "";
      var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
      var i = 0;
      while (i < hex.length) {
        chr1 = parseInt(hex.substring(i,   i+2), 16);
        chr2 = parseInt(hex.substring(i+2, i+4), 16);
        chr3 = parseInt(hex.substring(i+4, i+6), 16);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }

        output = output +
        _base64_keyStr.charAt(enc1) + _base64_keyStr.charAt(enc2) +
        _base64_keyStr.charAt(enc3) + _base64_keyStr.charAt(enc4);
        i += 6;
      }

      return output;
    },

    hexdigest: function() {
      var digest = this.digest();
      var i;
      for (i = 0; i < digest.length; i++) { digest[i] = strfhex32(digest[i]); }
      return digest.join("");
    }
  };

  Spec.describe("sha1", {
    "SHA1#hexdigest": function() {
      Spec.should.equal(new SHA1("").hexdigest(),       "da39a3ee5e6b4b0d3255bfef95601890afd80709");
      Spec.should.equal(new SHA1("1").hexdigest(),      "356a192b7913b04c54574d18c28d46e6395428ab");
      Spec.should.equal(new SHA1("Hello.").hexdigest(), "9b56d519ccd9e1e5b2a725e186184cdc68de0731");
      Spec.should.equal(new SHA1("9b56d519ccd9e1e5b2a725e186184cdc68de0731").hexdigest(), "f042dc98a62cbad68dbe21f11bbc1e9d416d2bf6");
      Spec.should.equal(new SHA1("MD5abZRVSXZVRcasdfasdddddddddddddddds+BNRJFSLKJFN+SEONBBJFJXLKCJFSE)RUNVXDLILKVJRN)#NVFJ)WVFWRW#)NVS$Q=$dddddddddddddWV;no9wurJFSE)RUNVXDLILKVJRN)#NVFJ)WVFWRW#)NVS$Q=$dddddddddddddWV;no9wurJFSE)RUNVXDLILKVJRN)#NVFJ)WVFWRW#)NVS$Q=$dddddddddddddWV;no9wurJFSE)RUNVXDLILKVJRN)#NVFJ)WVFWRW#)NVS$Q=$dddddddddddddWV;no9wuraddddddasdfasdfd").hexdigest(), "662dbf4ebc9cdb4224766e87634e5ba9e6de672b");
    }
  });

  return SHA1;
}());

exports.SHA1 = SHA1; // add for node.js
return exports;}()).SHA1;
  var Utils = (function(){var exports={};
exports.read_byte = function(buffer, position) {
  var data = Ti.Codec.decodeNumber({
    source: buffer,
    position: position || 0,
    type: Ti.Codec.TYPE_BYTE,
    byteOrder: Ti.Codec.BIG_ENDIAN
  });
  if(data < 0) { data += 256; } //2**8;
  return data;
};

exports.read_2byte = function(buffer, position) {
  var data = Ti.Codec.decodeNumber({
    source: buffer,
    position: position || 0,
    type: Ti.Codec.TYPE_SHORT,
    byteOrder: Ti.Codec.BIG_ENDIAN
  });
  if(data < 0) { data += 65536; } // 2**16
  return data;
};

exports.read_8byte = function(buffer, position) {
  var data = Ti.Codec.decodeNumber({
    source: buffer,
    position: position || 0,
    type: Ti.Codec.TYPE_LONG,
    byteOrder: Ti.Codec.BIG_ENDIAN

  });
  if(data < 0) { data += 18446744073709551616; } // 2**64
  return data;
};

exports.byte_length = function(str) {
  var buffer = Ti.createBuffer({length: 65536});
  var length = Ti.Codec.encodeString({
    source: str,
    dest: buffer
  });
  return length;
};

exports.trim = function(str) {
  return String(str).replace(/^\s+|\s+$/g, "");
};
return exports;}());
  var events = (function(){var exports={};// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var isArray = Array.isArray;

function EventEmitter() { }
exports.EventEmitter = EventEmitter;

// By default EventEmitters will print a warning if more than
// 10 listeners are added to it. This is a useful default which
// helps finding memory leaks.
//
// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
var defaultMaxListeners = 10;
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!this._events) { this._events = {}; }
  this._maxListeners = n;
};


EventEmitter.prototype.emit = function() {
  var type = arguments[0];

  if (!this._events) { return false; }
  var handler = this._events[type];
  if (!handler) { return false; }

  var args, l, i;
  if (typeof handler === 'function') {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        l = arguments.length;
        args = new Array(l - 1);
        for (i = 1; i < l; i++) { args[i - 1] = arguments[i]; }
        handler.apply(this, args);
    }
    return true;

  } else if (isArray(handler)) {
    l = arguments.length;
    args = new Array(l - 1);
    for (i = 1; i < l; i++) { args[i - 1] = arguments[i]; }

    var listeners = handler.slice();
    for (i = 0, l = listeners.length; i < l; i++) {
      listeners[i].apply(this, args);
    }
    return true;

  } else {
    return false;
  }
};

// EventEmitter is defined in src/node_events.cc
// EventEmitter.prototype.emit() is also defined there.
EventEmitter.prototype.addListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('addListener only takes instances of Function');
  }

  if (!this._events) { this._events = {}; }

  // To avoid recursion in the case that type === "newListeners"! Before
  // adding it to the listeners, first emit "newListeners".
  this.emit('newListener', type, listener);

  if (!this._events[type]) {
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  } else if (isArray(this._events[type])) {

    // If we've already got an array, just append.
    this._events[type].push(listener);

    // Check for listener leak
    if (!this._events[type].warned) {
      var m;
      if (this._maxListeners !== undefined) {
        m = this._maxListeners;
      } else {
        m = defaultMaxListeners;
      }

      if (m && m > 0 && this._events[type].length > m) {
        this._events[type].warned = true;
        console.error('(node) warning: possible EventEmitter memory ' +
                      'leak detected. %d listeners added. ' +
                      'Use emitter.setMaxListeners() to increase limit.',
                      this._events[type].length);
        console.trace();
      }
    }
  } else {
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('.once only takes instances of Function');
  }

  var self = this;
  function g() {
    self.removeListener(type, g);
    listener.apply(this, arguments);
  }

  g.listener = listener;
  self.on(type, g);

  return this;
};

EventEmitter.prototype.removeListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('removeListener only takes instances of Function');
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (!this._events || !this._events[type]) { return this; }

  var list = this._events[type];

  if (isArray(list)) {
    var i, position = -1;
    for (i = 0, length = list.length; i < length; i++) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener))
      {
        position = i;
        break;
      }
    }

    if (position < 0) { return this; }
    list.splice(position, 1);
    if (list.length === 0) {
      delete this._events[type];
    }
  } else if (list === listener ||
             (list.listener && list.listener === listener))
  {
    delete this._events[type];
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  if (arguments.length === 0) {
    this._events = {};
    return this;
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (type && this._events && this._events[type]) { this._events[type] = null; }
  return this;
};

EventEmitter.prototype.listeners = function(type) {
  if (!this._events) { this._events = {}; }
  if (!this._events[type]) { this._events[type] = []; }
  if (!isArray(this._events[type])) {
    this._events[type] = [this._events[type]];
  }
  return this._events[type];
};
return exports;}());

  var debug = function(str) {
    Ti.API.debug(str);
  };

  var CONNECTING = 0;
  var OPEN = 1;
  var CLOSING = 2;
  var CLOSED = 3;

  var BUFFER_SIZE = 65536;
  var CLOSING_TIMEOUT = 1000;

  var WebSocket = function(url, protocols, origin, extensions) {
    this.url = url;
    if(!this._parse_url()) {
      throw "Wrong url scheme for WebSocket: " + this.url;
    }

    this.origin = origin || String.format("http://%s:%s/", this._host, this._port);
    this.protocols = protocols;
    this.extensions = extensions;

    this.readyState = CONNECTING;

    this._masking_disabled = false;
    this._headers = [];
    this._pong_received = false;
    this._readBuffer = '';
    this._socketReadBuffer = undefined;
    this._closingTimer = undefined;
    this._handshake = undefined;

    this._socket = undefined;

    this._connect();
  };
  exports.WebSocket = WebSocket;
  WebSocket.prototype = new events.EventEmitter();

  WebSocket.prototype.onopen = function() {
    // NO OP
  };

  WebSocket.prototype.onmessage = function() {
    // NO OP
  };

  WebSocket.prototype.onerror = function() {
    // NO OP
  };

  WebSocket.prototype.onclose = function() {
    // NO OP
  };

  WebSocket.prototype._parse_url = function() {
    var parsed = this.url.match(/^([a-z]+):\/\/([\w.]+)(:(\d+)|)(.*)/i);
    if(!parsed || parsed[1] !== 'ws') {
      return false;
    }
    this._host = parsed[2];
    this._port = parsed[4] || 80;
    this._path = parsed[5];

    return true;
  };

  var make_handshake_key = function() {
    var i, key = "";
    for(i=0; i<16; ++i) {
      key += String.fromCharCode(Math.random()*255+1);
    }
    return Utils.trim(Ti.Utils.base64encode(key));
  };

  var make_handshake = function(host, path, origin, protocols, extensions, handshake) {
    var str = "GET " + path + " HTTP/1.1\r\n";
    str += "Host: " + host + "\r\nUpgrade: websocket\r\nConnection: Upgrade\r\n";
    str += "Sec-WebSocket-Key: " + handshake + "\r\n";
    str += "Origin: " + origin + "\r\n";
    str += "Sec-WebSocket-Origin: " + origin + "\r\n";
    str += "Sec-WebSocket-Version: 7\r\n";

    if(protocols && protocols.length > 0) {
      str += "Sec-WebSocket-Protocol: " + protocols.join(',') + "\r\n";
    }

    if(extensions && extensions.length > 0) {
      str += "Sec-WebSocket-Extensions: " + extensions.join(',') + "\r\n";
    }

    // TODO: compression
    //if @compression
    //  extensions << "deflate-application-data"
    //end

    return str + "\r\n";
  };

  WebSocket.prototype._send_handshake = function() {
    this._handshake = make_handshake_key();
    var handshake = make_handshake(this._host, this._path, this.origin, this.protocols, this.extensions, this._handshake);
    return this._socket.write(Ti.createBuffer({ value: handshake })) > 0;
  };

  WebSocket.prototype._read_http_headers = function() {
    var string = "";
    var buffer = Ti.createBuffer({ length: BUFFER_SIZE });
    var counter = 10;
    while(true) {
      var bytesRead = this._socket.read(buffer);
      if(bytesRead > 0) {
        var lastStringLen = string.length;
        string += Ti.Codec.decodeString({
          source: buffer,
          charset: Ti.Codec.CHARSET_ASCII
        });
        var eoh = string.match(/\r\n\r\n/);
        if(eoh) {
          var offset = (eoh.index + 4) - lastStringLen;
          string = string.substring(0, offset-2);

          this.buffer = Ti.createBuffer({ length: BUFFER_SIZE });
          this.bufferSize = bytesRead - offset;
          this.buffer.copy(buffer, 0, offset, this.bufferSize);
          break;
        }
      }
      else {
        debug("read_http_headers: timeout");
        --counter;
        if(counter < 0) {
          return false; // Timeout
        }
      }
      buffer.clear(); // clear the buffer before the next read
    }
    buffer.clear();
    this.headers = string.split("\r\n");

    return true;
  };

  var extract_headers = function(headers) {
    var result = {};
    headers.forEach(function(line) {
      var index = line.indexOf(":");
      if(index > 0) {
        var key = Utils.trim(line.slice(0, index));
        var value = Utils.trim(line.slice(index + 1));
        result[key] = value;
      }
    });
    return result;
  };

  var handshake_reponse = function(handshake) {
    return (new SHA1(handshake + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11")).base64digest();
  };

  WebSocket.prototype._check_handshake_response = function() {
    var version = this.headers.shift();
    if(version !== "HTTP/1.1 101 Switching Protocols") {
      // Mismatch protocol version
      debug("mismatch protocol version");
      return false;
    }
    var h = extract_headers(this.headers);
    if(!h.Upgrade || !h.Connection || !h['Sec-WebSocket-Accept']) {
      return false;
    }
    if(h.Upgrade.toLowerCase() !== 'websocket' || h.Connection.toLowerCase() !== 'upgrade' || h['Sec-WebSocket-Accept'] !== handshake_reponse(this._handshake)) {
      return false;
    }

    // TODO: compression
    // if h.has_key?('Sec-WebSocket-Extensions') and h['Sec-WebSocket-Extensions'] === 'deflate-application-data'
    //   if @compression
    //   @zout = Zlib::Deflate.new(Zlib::BEST_SPEED, Zlib::MAX_WBITS, 8, 1)
    //   @zin = Zlib::Inflate.new
    //  end
    // else
    //   @compression = false
    // end

    this.readyState = OPEN;
    return true;
  };

  WebSocket.prototype._create_frame = function(opcode, d, last_frame) {
    if(typeof last_frame === 'undefined') {
      last_frame = true;
    }

    if(last_frame === false && opcode >= 0x8 && opcode <= 0xf) {
      return false;
    }

    // apply per frame compression
    var out = Ti.createBuffer({ length: BUFFER_SIZE });
    var outIndex = 0;

    var data = d || ''; //compress(d) // TODO

    var byte1 = opcode;
    if(last_frame) {
      byte1 = byte1 | 0x80;
    }

    Ti.Codec.encodeNumber({
      source: byte1,
      dest: out,
      position: outIndex++,
      type: Ti.Codec.TYPE_BYTE,
    });

    var length = Utils.byte_length(data);

    if(length <= 125) {
      var byte2 = length;
      if(!this._masking_disabled) {
        byte2 = (byte2 | 0x80); // # set masking bit
      }
      Ti.Codec.encodeNumber({
        source: byte2,
        dest: out,
        position: outIndex++,
        type: Ti.Codec.TYPE_BYTE
      });
    }
    else if(length < BUFFER_SIZE) { // # write 2 byte length
      Ti.Codec.encodeNumber({
        source: (126 | 0x80),
        dest: out,
        position: outIndex++,
        type: Ti.Codec.TYPE_BYTE
      });
      Ti.Codec.encodeNumber({
        source: length,
        dest: out,
        position: outIndex++,
        type: Ti.Codec.TYPE_SHORT,
        byteOrder: Ti.Codec.BIG_ENDIAN
      });
      outIndex += 2;
    }
    else { // # write 8 byte length
      Ti.Codec.encodeNumber({
        source: (127 | 0x80),
        dest: out,
        position: outIndex++,
        type: Ti.Codec.TYPE_BYTE
      });
      Ti.Codec.encodeNumber({
        source: length,
        dest: out,
        position: outIndex,
        type: Ti.Codec.TYPE_LONG,
        byteOrder: Ti.Codec.BIG_ENDIAN
      });
      outIndex += 8;
    }

    //# mask data
    outIndex = this._mask_payload(out, outIndex, data);
    out.length = outIndex;

    return out;
  };

  WebSocket.prototype._mask_payload = function(out, outIndex, payload) {
    if(!this._masking_disabled) {
      var i, masking_key = [];
      for(i = 0; i < 4; ++i) {
        var key = Math.floor(Math.random()*255) & 0xff;
        masking_key.push(key);
        Ti.Codec.encodeNumber({
          source: key,
          dest: out,
          position: outIndex++,
          type: Ti.Codec.TYPE_BYTE
        });
      }

      var buffer = Ti.createBuffer({ length: BUFFER_SIZE });
      var length = Ti.Codec.encodeString({
        source: payload,
        dest: buffer
      });
      buffer.length = length;

      var string = Ti.Codec.decodeString({
        source: buffer,
        charset: Ti.Codec.CHARSET_ASCII
      });

      var masked_string = "";
      for(i = 0; i < string.length; ++i) {
        Ti.Codec.encodeNumber({
          source: string.charCodeAt(i) ^ masking_key[i % 4],
          dest: out,
          position: outIndex++,
          type: Ti.Codec.TYPE_BYTE,
        });
      }
      return outIndex;
    }
    else {
      var len = Ti.Codec.encodeString({
        source: payload,
        dest: out,
        destPosition: outIndex
      });
      return len + outIndex;
    }
  };

  var parse_frame = function(buffer, size) {
    if(size < 3) {
      return undefined;
    }

    var byte1 = Utils.read_byte(buffer, 0);
    var fin = !!(byte1 & 0x80);
    var opcode = byte1 & 0x0f;

    var byte2 = Utils.read_byte(buffer, 1);
    var mask = !!(byte2 & 0x80);
    var len = byte2 & 0x7f;

    var offset = 2;
    switch(len) {
    case 126:
      len = Utils.read_2byte(buffer, offset);
      offset += 2;
      break;

    case 127:
      // too large I felt
      len = Utils.read_8byte(buffer, offset);
      offset += 8;
      break;
    }

    if(len + offset > size) {
      return undefined;
    }

    var string = Ti.Codec.decodeString({
      source: buffer,
      position: offset,
      length: len,
      charset: Ti.Codec.CHARSET_UTF8
    });

    return({fin: fin, opcode: opcode, payload: string, size: len + offset});
  };

  WebSocket.prototype.send = function(data) {
    if(data && this.readyState === OPEN) {
      var frame = this._create_frame(0x01, data);
      var bytesWritten = this._socket.write(frame);
      return bytesWritten > 0;
    }
    else {
      return false;
    }
  };

  WebSocket.prototype._socket_close = function() {
    if(this._closingTimer && typeof this._closingTimer === 'number') {
      clearTimeout(this._closingTimer);
    }
    this._closingTimer = undefined;

    this._readBuffer = '';
    this._socketReadBuffer = undefined;

    var ev;
    if(this.readyState === CLOSING) {
      this.readyState = CLOSED;
      this._socket.close();
      ev = {
        code: 1000,
        wasClean: true,
        reason: ""
      };
      this.emit("close", ev);
      this.onclose(ev);
    }
    else if(this.readyState !== CLOSED) {
      this._socket.close();
      this.readyState = CLOSED;
      ev = {
        advice: "reconnect"
      };
      this.emit("error", ev);
      this.onerror(ev);
    }
    this._socket = undefined;
  };


  WebSocket.prototype._read_callback = function(e) {
    var self = this;

    var nextTick = function() {
      self._socketReadBuffer.clear();
      Ti.Stream.read(self._socket, self._socketReadBuffer, function(e) { self._read_callback(e); });
    };

    if('undefined' !== typeof e) {
      if (0 === e.bytesProcessed) {
        return nextTick();
      }

      if(-1 === e.bytesProcessed) { // EOF
        this._socket_close();
        return undefined;
      }

      if('undefined' === typeof this.buffer) {
        this.buffer = this._socketReadBuffer.clone();
        this.bufferSize = e.bytesProcessed;
      }
      else {
        this.buffer.copy(this._socketReadBuffer, this.bufferSize, 0, e.bytesProcessed);
        this.bufferSize += e.bytesProcessed;
        this._socketReadBuffer.clear();
      }
    }

    var frame = parse_frame(this.buffer, this.bufferSize);
    if('undefined' === typeof frame) {
      return nextTick();
    }
    else {
      if(frame.size < this.bufferSize) {
        var nextBuffer = Ti.createBuffer({ length: BUFFER_SIZE });
        if(this.bufferSize - frame.size > 0) {
          nextBuffer.copy(this.buffer, 0, frame.size, this.bufferSize - frame.size);
        }
        this.buffer.clear();
        this.buffer = nextBuffer;
        this.bufferSize -= frame.size;
      }
      else {
        this.buffer.clear();
        this.bufferSize = 0;
      }

      switch(frame.opcode) {
      case 0x00: // continuation frame
      case 0x01: // text frame
      case 0x02: // binary frame
        if(frame.fin) {
          this.emit("message", {data: this._readBuffer + frame.payload});
          this.onmessage({data: this._readBuffer + frame.payload});
          this._readBuffer = '';
        }
        else {
          this._readBuffer += frame.payload;
        }
        break;

      case 0x08: // connection close
        if(this.readyState === CLOSING) {
          this._socket_close();
        }
        else {
          this.readyState = CLOSING;
          this._socket.write(this._create_frame(0x08));
          this._closingTimer = setTimeout(function() {
            self._socket_close();
          }, CLOSING_TIMEOUT);
        }
        break;

      case 0x09: // ping
        this._socket.write(this._create_frame(0x0a, frame.payload));
        break;

      case 0x0a: // pong
        this._pong_received = true;
        break;
      }

      this._read_callback();
    }
  };
  WebSocket.prototype._error = function(code, reason) {
    if(this.buffer) {
      this.buffer.clear();
    }
    this.buffer = undefined;
    this.bufferSize = 0;

    this.readyState = CLOSED;
    if(this._socket) {
      try {
        this._socket.close();
      }
      catch(e) { }
      this._socket = undefined;
    }
    var ev = {
      wasClean: true,
      code: ('undefined' === typeof code) ? 1000 : code,
      advice: "reconnect",
      reason: reason
    };
    this.emit("error", ev);
    this.onerror(ev);
  };

  WebSocket.prototype._raise_protocol_error = function(reason) {
    this._error(1002, reason);
  };

  WebSocket.prototype.close = function(code, message) {
    if(this.readyState === OPEN) {
      this.readyState = CLOSING;

      var buffer = Ti.createBuffer({ length: BUFFER_SIZE });

      Ti.Codec.encodeNumber({
        source: code || 1000,
        dest: buffer,
        position: 0,
        type: Ti.Codec.TYPE_SHORT,
        byteOrder: Ti.Codec.BIG_ENDIAN
      });

      if(message) {
        var length = Ti.Codec.encodeString({
          source: message,
          dest: buffer,
          destPosition: 2
        });
        buffer.length = 2 + length;
      }
      else {
        buffer.length = 2;
      }

      var payload = Ti.Codec.decodeString({
        source: buffer,
        charset: Ti.Codec.CHARSET_ASCII
      });
      this._socket.write(this._create_frame(0x08, payload));

      var self = this;
      this._closingTimer = setTimeout(function() {
        self._socket_close();
      }, CLOSING_TIMEOUT);
    }
  };

  WebSocket.prototype._connect = function() {
    if(this.readyState === OPEN || this.readyState === CLOSING) {
      return false;
    }

    var self = this;
    this._socket = Ti.Network.Socket.createTCP({
      host: this._host,
      port: this._port,
      mode: Ti.Network.READ_WRITE_MODE,
      connected: function(e) {
        var result;
        result = self._send_handshake();
        if(!result) {
          return self._raise_protocol_error("send handshake");
        }

        result = self._read_http_headers();
        if(!result) {
          return self._raise_protocol_error("parse http header");
        }

        result = self._check_handshake_response();
        if(!result) {
          return self._raise_protocol_error("wrong handshake");
        }

        self._readBuffer = '';
        self._socketReadBuffer = Ti.createBuffer({ length: BUFFER_SIZE });

        self.readyState = OPEN;
        self.emit("open");
        self.onopen();

        self._read_callback();
      },
      closed: function() {
        self._socket_close();
        if(self.buffer) {
          self.buffer.clear();
        }
        self.buffer = undefined;
        self.bufferSize = 0;
      },
      error: function(e) {
        var reason;
        if('undefined' !== typeof e) {
          reason = e.error;
        }
        self._error(1000, reason);
      }
    });
    this._socket.connect();
  };
})(this);
