var net = require('net'),
    _   = require('../App/Resources/lib/underscore');

function BroadcastServer(port) {
  var that = this;
  /**
   * Dispatch specs to the different apps
   *
   * @specs {Array} path of the different specs
   */
  this.runSpecs = function(specs, onNewSpec, onNewSuite, onEndSpecs, filter) {
    this.onNewSpec  = onNewSpec;
    this.onNewSuite = onNewSuite;
    this.onEndSpecs = onEndSpecs;

    everyone.now.execute(specs, filter);
  };


  server = require('http').createServer(function(req, response){
    /* Serve your static files */
  });
  server.listen(port);

  var nowjs = require("now");
  var everyone = nowjs.initialize(server);

  everyone.now.onSpecResult = function(description, totalCount, passedCount, failedCount, passed) {
    that.onNewSpec(description, totalCount, passedCount, failedCount, passed);
  };
  everyone.now.onSuiteResult = function(description, totalCount, passedCount, failedCount) {
    that.onNewSuite(description, totalCount, passedCount, failedCount);
  };
  everyone.now.endSpecs = function() {
    that.onEndSpecs();
  };

  console.log('Server created and listening on port ' + port);

  return this;
}

exports.BroadcastServer = BroadcastServer;
