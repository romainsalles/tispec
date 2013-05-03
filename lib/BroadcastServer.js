var net = require('net'),
    _   = require('../App/Resources/lib/underscore');

function BroadcastServer(port) {
  var that = this,
      apps = [],
      server;

  /**
   * Initialize new stream connections
   * (ie: when a new Titanium app connects to the tispec node server)
   *
   * @ignore
   * @private
   * @stream {Stream} new stream
   */
  function manageNewStream(stream) {
    stream.setTimeout(0);
    stream.setEncoding('utf8');

    stream.on('connect', function() {
      apps.push(stream);
      console.log('Welcome stranger n°' + apps.length);
      that.runSpecs(['specs/example_specs.js']);
    });

    stream.on('end', function() {
      apps = _.without(apps, stream);
      stream.end();
      console.log('One less, there remain ' + apps.length);
    });
  }

  /**
   * Dispatch specs to the different apps
   *
   * @specs {Array} path of the different specs
   */
  this.runSpecs = function(specs) {
    _.each(apps, function(app) {
      app.write(JSON.stringify(specs) + '\n');
    });
  };

  server = net.createServer(manageNewStream);
  server.listen(port);
  console.log('Server created and listening on port ' + port);

  return this;
}

exports.BroadcastServer = BroadcastServer;
