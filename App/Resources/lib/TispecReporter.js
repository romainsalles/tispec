/**
 * TispecReporter, by Romain Salles.
 *
 * Jasmine reporter which share results with the tispec node server
 *
 * For more info, @see  https://github.com/romainsalles/tispec
 */
var TispecReporter = function(now, connection) {
  /**
   * Send the spec results to the tispec server.
   *
   * @spec {Object} jasmine spec result
   */
  this.updateSpecs = function(spec) {
    var results = spec.results();
    now.onSpecResult(spec.description, results.totalCount, results.passedCount, results.failedCount, results.passed()/*, results.items_*/);
  };

  /**
   * Send the spec results to the server.
   *
   * @suite {Object} jasmine suite result
   */
  this.updateSuites = function(suite) {
    var results = suite.results();

    now.onSuiteResult(suite.description, results.totalCount, results.passedCount, results.failedCount);
  };

  this.endSpecs = function() {
    now.endSpecs();
  };
};

TispecReporter.prototype = {
  reportRunnerResults:  function(runner) { this.endSpecs(); },
  reportRunnerStarting: function(runner) { Ti.API.error('reportRunnerStarting'); },
  reportSpecResults:    function(spec)   { this.updateSpecs(spec); },
  reportSpecStarting:   function(spec)   { Ti.API.error('reportSpecStarting'); },
  reportSuiteResults:   function(suite)  { this.updateSuites(suite); },
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
