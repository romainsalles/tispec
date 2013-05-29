var initialized = false;

Ti.include('/lib/tispec/lib/jasmine.js');

function retrieveSpecs(folder) {
  folder = folder || Ti.Filesystem.getResourcesDirectory() + 'specs';

  var specs   = [];
  var file    = Titanium.Filesystem.getFile(folder);
  var listing = file.getDirectoryListing();

  for (var i=0, l=listing.length; i<l; i += 1) {
    var splitPath = listing[i].split('.'),
        isFile    = splitPath.length > 1 && splitPath[splitPath.length - 1] === 'spec';

    if (isFile) { specs.push(folder + '/' + listing[i]); }
    else        { specs = specs.concat(retrieveSpecs(folder + '/' + listing[i])); }
  }

  return specs;
}

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
    now.hello(specsSuiteId, Ti.App.name, Ti.App.version, Ti.Platform.username, Ti.Platform.model);

    var Reporter       = require('/lib/tispec/TispecReporter').TispecReporter;

    now.execute = function (options) {
      (function() {
        if (options.specsSuiteId != specsSuiteId) { return; }

        var reporter   = new Reporter(now),
            jasmineEnv = initializeJasmine(reporter);

        Ti.include('/lib/tispec/TispecHelper.js');

        var specs = retrieveSpecs();
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
