var SpecsSuite = (function() {
  var specs, suites;

  specs = [];

  suites = [];

  SpecsSuite.prototype.totalCount = 0;

  SpecsSuite.prototype.passedCount = 0;

  SpecsSuite.prototype.errorCount = 0;

  function SpecsSuite(appName, deviceName) {
    this.appName = appName;
    this.deviceName = deviceName;
    this.id = 1;
  }

  SpecsSuite.prototype.addSpec = function(spec) {
    specs.push(spec);
    this.totalCount += 1;
    if (spec.passed) {
      this.passedCount += 1;
    } else {
      this.errorCount += 1;
    }
    return this;
  };

  SpecsSuite.prototype.addSuite = function(suite) {
    suites.push(suite);
    return this;
  };

  return SpecsSuite;

})();
