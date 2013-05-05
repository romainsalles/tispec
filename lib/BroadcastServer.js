var net = require('net'),
    _   = require('../App/Resources/lib/underscore');

function BroadcastServer(port) {
  /**
   * Dispatch specs to the different apps
   *
   * @specs {Array} path of the different specs
   */
  this.runSpecs = function(specs) {
    everyone.now.execute(specs);
  };


  server = require('http').createServer(function(req, response){
    /* Serve your static files */
  });
  server.listen(port);

  var nowjs = require("now");
  var everyone = nowjs.initialize(server);

  everyone.now.onSpecResult = function(description, totalCount, passedCount, failedCount, passed) {
    console.log('SPEC : ' + JSON.stringify([description, totalCount, passedCount, failedCount, passed]));
  };
  everyone.now.onSuiteResult = function(description, totalCount, passedCount, failedCount) {
    console.log('SUITE : ' + JSON.stringify([description, totalCount, passedCount, failedCount]));
  };

  console.log('Server created and listening on port ' + port);

  return this;
}

exports.BroadcastServer = BroadcastServer;
