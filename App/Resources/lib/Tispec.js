var _ = require('lib/underscore')._;

var initialized = false;

Ti.include('lib/jasmine.js');

function initializeJasmine(now) {

  var TispecReporter = require('lib/TispecReporter').TispecReporter,
      tispecReporter = new TispecReporter(now),
      env            = jasmine.getEnv();

  env.addReporter(tispecReporter);
  env.specFilter = function(spec) {
    return tispecReporter.specFilter(spec);
  };

  return env;
}

exports.initialize = function(host, port) {
  if (initialized) { return; }

  var nowjs = require('/lib/now'),
  now = nowjs.nowInitialize('//' + host + ':' + port, {});

  now.ready(function () {
    var jasmineEnv = initializeJasmine(now);

    now.execute = function (specs) {
      _.each(specs, function(spec) { Ti.include(spec); });
      jasmineEnv.execute();
    };
  });

  initialized = true;
};
