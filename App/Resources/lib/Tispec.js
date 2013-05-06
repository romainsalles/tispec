var _ = require('lib/underscore')._;

var initialized = false;

Ti.include('lib/jasmine.js');

function initializeJasmine(reporter) {
  var env = jasmine.getEnv();

  env.addReporter(reporter);
  env.specFilter = function(spec) {
    return reporter.specFilter(spec);
  };

  return env;
}

exports.initialize = function(host, port) {
  if (initialized) { return; }

  var nowjs = require('/lib/now'),
  now = nowjs.nowInitialize('//' + host + ':' + port, {});

  now.ready(function () {
    var TispecReporter = require('lib/TispecReporter').TispecReporter,
        tispecReporter = new TispecReporter(now),
        jasmineEnv     = initializeJasmine(tispecReporter);

    now.execute = function (specs, filter) {
      _.each(specs, function(spec) { Ti.include(spec); });

      if (filter) { tispecReporter.setSpecFilter(filter); }
      else        { tispecReporter.removeSpecFilter();    }

      jasmineEnv.execute();
    };
  });

  initialized = true;
};
