/**
 * TitaniumReporter, by Romain Salles.
 *
 * Jasmine reporter which displays results in a full screen window in a Titanium
 * application.
 *
 * For more info, @see  https://github.com/romainsalles/tispec
 */
var TitaniumReporter = function() {
  var resultWindow = Ti.UI.createWindow({zIndex: 100});

  resultWindow.webView = Ti.UI.createWebView({ html: '' });
  resultWindow.add(resultWindow.webView);
  resultWindow.open();

  var body = '';
  this.updateResults = function(message) {
    body += message;
    resultWindow.webView.html = '<html><head></head><body>' + body + '</body></html>';
  };
};

TitaniumReporter.prototype = {
  log:                  function(str) { this.updateResults(str); },
  reportRunnerResults:  function(runner) {},
  reportRunnerStarting: function(runner) {},
  reportSpecResults:    function(spec) {
    var message = formatSpecResultsMessage(spec);
    this.updateResults(message);
  },
  reportSpecStarting:   function(spec)   {},
  reportSuiteResults:   function(suite)  {
    var results = suite.results();

    this.log('<b>[' + suite.description + '] ' + results.passedCount + ' of ' + results.totalCount + ' assertions passed.</b><br><br>');
  }
};

exports.TitaniumReporter = TitaniumReporter;


// Utility functions
// =============================================================================

var OK_COLOR    = '#00FF00',
    ERROR_COLOR = '#FF0000';

/**
 * Function used to colorize a text in HTML.
 *
 * @ignore
 * @private
 * @param color {String} color of the text
 * @param text {String} text
 * @returns {String} HTML code for the colored text
 */
function colored(color, text) { return '<font color="' + color + '">' + text + '</font>'; }

/**
 * Format details of the error (expectation and result obtained) for each errors
 * of the given spec.
 *
 * @ignore
 * @private
 * @param spec {Object} jasmine spec that failed
 * @returns {String} spec formated for HTML
 */
function formatErrorDetails(spec) {
  var result = '',
      subSpecs = spec.results().items_;

  for (var i = 0, l = subSpecs.length; i < l; i += 1) {
    var subSpec = subSpecs[i];
    if (!subSpec.passed_) {
      result += ('    (' + (i+1) + ') <i>' + subSpec.message + '</i><br>');
      if (subSpec.expected) {
        result += ('    - Expected : "' + subSpec.expected + '"<br>');
      }
    result += ('    - Got      : "' + subSpec.actual + '"<br><br>');
    }
  }

  return result;
}

/**
 * Format details of the given spec
 *
 * @ignore
 * @private
 * @param spec {Object} jasmine spec that will be formated for HTML rendering
 * @returns {String} spec formated for HTML
 */
function formatSpecResultsMessage(spec) {
  var color  = OK_COLOR,
      passed = spec.results().passed(),
      result = ' (' + spec.results().passedCount + ' pass';

  if (!passed) {
    color  = ERROR_COLOR;
    result   += ', ' + spec.results().failedCount + ' fail';
  }
  result += ')';

  result = ('- ' + colored(color, spec.description) + result + '<br>');

  if (!passed) { result += formatErrorDetails(spec); }

  return result;
}
