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
    var Reporter   = require('lib/TispecReporter').TispecReporter,
        reporter   = new Reporter(now),
        jasmineEnv = initializeJasmine(reporter);

    now.execute = function (specs, conf) {
      Ti.include('/lib/TispecHelper.js');

      _.each(specs, function(spec) { Ti.include(spec); });

      if (conf.filter) { reporter.setSpecFilter(conf.filter); }
      else        { reporter.removeSpecFilter();    }

      jasmineEnv.execute();
    };
  });

  initialized = true;
};
