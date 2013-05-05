/*
 * GET home page.
 */
exports.list = function(request, response) {
  var specs = [];

  var onNewSpec = function(description, totalCount, passedCount, failedCount, passed) {
    specs.push({
      description: description,
      totalCount:  totalCount,
      passedCount: passedCount,
      failedCount: failedCount,
      passed:      passed
    });
  };

  var onNewSuite = function(description, totalCount, passedCount, failedCount) {
    console.log('SUITE : ' + JSON.stringify([description, totalCount, passedCount, failedCount]) + '<br/>');
  };

  var onEndSpecs = function(description, totalCount, passedCount, failedCount) {
    response.render('specs_list', { specs: specs });
  };

  // execute specs
  broadcastServer.runSpecs(['specs/example_specs.js'], onNewSpec, onNewSuite, onEndSpecs);
};
