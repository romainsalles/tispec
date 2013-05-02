var _ = require('lib/underscore')._;

/**
 * Run the given jasmine specs
 *
 * @param specs {Array<String>} paths of the specs
 */
exports.start = function(specs) {
  Ti.include('lib/jasmine.js');
  _.each(specs, function(spec) { Ti.include(spec); });

  var TitaniumReporter = require('lib/TitaniumReporter').TitaniumReporter;
  jasmine.getEnv().addReporter(new TitaniumReporter());
  jasmine.getEnv().execute();
};
