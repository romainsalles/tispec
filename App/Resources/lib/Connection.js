/**
 * Connection class for Titanium connection from TCP socket.
 * It provide useful api to register event on data receiving.
 */
function Connection() {
  var that = this;

  var _buffer           = '', // [TODO] remove this and use socket buffer directly
      _socket           = null,
      MAX_FRAGMENT_SIZE = 1024;

  // Dispatch the action contained in the buffer and trigger the right connection event
  // This function is called each time the socket receive data from server (after pumped the buffer)
  function dispatchEventSocket() {
    Ti.API.log('Dispatch received event to the associated callback');
    try {
      var specs = JSON.parse(_buffer);

      // execute specs
      (function() {
        require('lib/Tispec').start(specs);
      })();

    } catch (ex) {
      Ti.API.error(ex);
    }
  }

  // Callback function to fill the buffer with received data
  function pumpCallback(e) {
    Ti.API.log('bytes       : ' + e.bytesProcessed);
    Ti.API.log('total bytes : ' + e.totalBytesProcessed);

    // Is server ended connection ?
    if (e.bytesProcessed === -1) {
      _socket.close();
      return;
    }

    if (e.buffer) {
      _buffer += Ti.Codec.decodeString({source: e.buffer, length: e.bytesProcessed });
    } else {
      Ti.API.error('Error: read callback called with no buffer!');
    }
    Ti.API.log('buffer : '+_buffer);

    // When bytes processed are 1024, then we admit it's end of received data
    // [TODO] improve with a better solution
    if (e.bytesProcessed < MAX_FRAGMENT_SIZE) {
      dispatchEventSocket();
      e.buffer.clear();
      _buffer = '';
      return;
    }
  }

  /**
   * Bind the connection with host and port
   *
   * @host {String}
   * @port {Integer}
   * @return The object itself
   */
  this.bind = function(host, port) {
    _socket = Ti.Network.Socket.createTCP({
      host:       host,
      port:       port,
      connected : function(e) {
        Ti.API.info('Livemium connected.');
        Ti.Stream.pump(e.socket, pumpCallback, MAX_FRAGMENT_SIZE, true);
      },
      error :     function(e) {
        Ti.API.error('Livemium socket error (' + e.errorCode + '): ' + e.error);
        // [TODO] handle socket timeout and reconnect to server
      },
      close:      function(e) {
        Ti.API.log('Livemium connection ended');
      }
    });

    return that;
  };

  /**
   * Connect the socket to the configured remote. @see bind()
   */
  this.connect = function() {
    _socket.connect();
  };

  /**
   * End socket
   */
  this.close = function() {
    _socket.close();
  };
}

exports.Connection = Connection;
