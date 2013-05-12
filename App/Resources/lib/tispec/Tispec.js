var initialized = false;

Ti.include('/lib/tispec/lib/jasmine.js');

function initializeJasmine(reporter) {
  // [Hack] force a new env.
  // Avoid multiple execution of the same spec if the specs are run
  // multiple times (and thus, included more than once)
  // @see https://github.com/pivotal/jasmine/pull/357
  // @see https://github.com/pivotal/jasmine/blob/master/src/core/base.js
  var env = jasmine.currentEnv_ = new jasmine.Env();

  env.addReporter(reporter);
  env.specFilter = function(spec) {
    return reporter.specFilter(spec);
  };

  return env;
}

exports.initialize = function(host, nowPort, serverPort) {
  if (initialized) { return; }

  var nowjs = require('/lib/tispec/lib/now'),
  now = nowjs.nowInitialize('//' + host + ':' + nowPort, {});

  now.ready(function () {
    var specsSuiteId = (new Date()).getTime();
    require('/lib/tispec/RequestManager').initialize(host, serverPort, specsSuiteId);
    now.hello(specsSuiteId, Titanium.App.name, Titanium.App.version, Ti.Platform.username);

    var Reporter       = require('/lib/tispec/TispecReporter').TispecReporter;

    now.execute = function (specs, options) {
      (function() {
        if (options.specsSuiteId != specsSuiteId) { return; }

        var reporter   = new Reporter(now),
            jasmineEnv = initializeJasmine(reporter);

        Ti.include('/lib/tispec/TispecHelper.js');

        for (var i=0, l=specs.length; i < l; i += 1) {
          Ti.include(specs[i]);
        }

        if (options.filter) { reporter.setSpecFilter(options.filter); }
        else                { reporter.removeSpecFilter();    }

        jasmineEnv.execute();
      })();
    };
  });

  initialized = true;
};
