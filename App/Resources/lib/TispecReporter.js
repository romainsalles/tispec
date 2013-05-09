/**
 * TispecReporter, by Romain Salles.
 *
 * Jasmine reporter which share results with the tispec node server
 *
 * For more info, @see  https://github.com/romainsalles/tispec
 */


var queue = [];

function sendRequest(actionName, data) {
  queue.push({
    actionName: actionName,
    data: data
  });
}

/**
 * Force the order of the requests.
 * Only one request can be sent at the same time, and in the order they are
 * pushed in the stack (FIFO)
 */
(function sendRequests() {
  if (queue[0]) {
    var currentRequest = queue.shift();
    var url = "http://localhost:8666/specs/" + currentRequest.actionName;
    var client = Ti.Network.createHTTPClient({
      onload: sendRequests
    });
    client.open("POST", url);
    client.send(currentRequest.data);
  } else {
    setTimeout(sendRequests, 1000);
  }
})();

var TispecReporter = function(now) {
  /**
   * When spec start, send informations on it to the tispec server.
   */
  this.onSpecStart = function(spec) {
    sendRequest('specStart', {
      spec: JSON.stringify({
        suiteName:   spec.suite.getFullName(),
        description: spec.description
      })
    });
  };

  /**
   * When spec end, send results to the tispec server.
   *
   * @spec {Object} jasmine spec result
   */
  this.onSpecEnd = function(spec) {
    var results = spec.results();
    if (results.totalCount === 0) { return; }

    sendRequest('specEnd', {
      spec: JSON.stringify({
        suiteName:   spec.suite.getFullName(),
        description: spec.description,
        totalCount:  results.totalCount,
        passedCount: results.passedCount,
        failedCount: results.failedCount,
        passed:      results.passed(),
        subSpecs:    results.items_
      })
    });
  };

  /**
   * When suite end, send results to the tispec server.
   *
   * @suite {Object} jasmine suite result
   */
  this.onSuiteEnd = function(suite) {
    var results = suite.results();
    if (results.totalCount === 0) { return; }

    sendRequest('suiteEnd', {
      suite: JSON.stringify({
        description: suite.description,
        totalCount:  results.totalCount,
        passedCount: results.passedCount,
        failedCount: results.failedCount
      })
    });
  };

  this.endSpecs = function() {
    sendRequest('end');
  };
};

TispecReporter.prototype = {
  reportRunnerResults:  function(runner) { this.endSpecs(); },
  reportRunnerStarting: function(runner) { Ti.API.error('reportRunnerStarting'); },
  reportSpecResults:    function(spec)   { this.onSpecEnd(spec); },
  reportSpecStarting:   function(spec)   { this.onSpecStart(spec); },
  reportSuiteResults:   function(suite)  { this.onSuiteEnd(suite); },
  /**
   * Filters
   * Specify the specs you want to run.
   *
   * Use :
   * var tispecReporter = new TispecReporter;
   * jasmine.getEnv().addReporter(tispecReporter);
   * jasmine.getEnv().specFilter = function(spec) {
   *   return tispecReporter.specFilter(spec);
   * };
   */
  /**
   * Specs will not use the filter anymore.
   */
  removeSpecFilter:     function() { this.setSpecFilter(null); },
  /**
   * Add a spec filter on the given string.
   *
   * @focusedSpecName {String} only the specs containing this string will be run
   */
  setSpecFilter:        function(focusedSpecName) { this.focusedSpecName = focusedSpecName; },
  /**
   * Function used by Jasmine to determine if a spec should be lunch or not.
   *
   * @spec {Object} Jasmine spec
   */
  specFilter:           function(spec) {
    return !this.focusedSpecName || spec.getFullName().indexOf(this.focusedSpecName) !== -1;
  }
};

exports.TispecReporter = TispecReporter;
