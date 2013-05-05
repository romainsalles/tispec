// Broadcast server used to execute specs
// =============================================================================

var BroadcastServer = require('./lib/BroadcastServer').BroadcastServer;
var broadcastServer = new BroadcastServer(8128);


// Web server
// =============================================================================

var http = require('http'),
    url  = require('url');

// page rendering
// -----------------------------------------------------------------------------

function executeSpecs(request, response) {
  var onNewSpec = function(description, totalCount, passedCount, failedCount, passed) {
    response.write('SPEC : ' + JSON.stringify([description, totalCount, passedCount, failedCount, passed]) + '<br/>');
  };
  var onNewSuite = function(description, totalCount, passedCount, failedCount) {
    response.write('SUITE : ' + JSON.stringify([description, totalCount, passedCount, failedCount]) + '<br/>');
  };
  var onEndSpecs = function(description, totalCount, passedCount, failedCount) {
    response.end();
  };
  // execute specs
  broadcastServer.runSpecs(['specs/example_specs.js'], onNewSpec, onNewSuite, onEndSpecs);

  // write response
  response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
}

function render404(request, response) {
  response.writeHead(404);
  response.end('Error 404');
}

// server
// -----------------------------------------------------------------------------

var runSpecsRegex = new RegExp('^/specs/execute/?$');

var webServer = http.createServer(function(request, response) {
  var pathname = url.parse(request.url).pathname;

  if (runSpecsRegex.test(pathname)) { executeSpecs(request, response); }
  else                              { render404(request, response); }
});

webServer.listen(8666);
console.log('Listening on http://localhost:8666');
