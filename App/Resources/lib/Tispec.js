var _ = require('lib/underscore')._;

/**
 * Run the given jasmine specs
 *
 * @param specs {Array<String>} paths of the specs
 */
exports.start = function(specs) {
  Ti.include('lib/jasmine.js');
  _.each(specs, function(spec) { Ti.include(spec); });

  var TitaniumReporter = require('lib/TitaniumReporter').TitaniumReporter,
      titaniumReporter = new TitaniumReporter(),
      env = jasmine.getEnv();

  env.addReporter(titaniumReporter);
  env.specFilter = function(spec) {
    return titaniumReporter.specFilter(spec);
  };
  env.execute();
};
