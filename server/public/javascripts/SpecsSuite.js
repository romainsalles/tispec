var SpecsSuite = (function() {
  var errorCount, passedCount, specs, suites, totalCount;

  specs = [];

  suites = [];

  totalCount = 0;

  passedCount = 0;

  errorCount = 0;

  function SpecsSuite(appName, deviceName) {
    this.appName = appName;
    this.deviceName = deviceName;
    this.id = 1;
  }

  SpecsSuite.prototype.addSpec = function(spec) {
    specs.push(spec);
    totalCount += 1;
    if (spec.passed) {
      passedCount += 1;
    } else {
      errorCount += 1;
    }
    return this;
  };

  SpecsSuite.prototype.addSuite = function(suite) {
    suites.push(suite);
    return this;
  };

  return SpecsSuite;

})();
