var SpecsSuite = (function() {
  var specs, suites;

  specs = [];

  suites = [];

  SpecsSuite.prototype.passedCount = 0;

  SpecsSuite.prototype.errorCount = 0;

  function SpecsSuite(id, appName, deviceName, totalCount) {
    this.id = id;
    this.appName = appName;
    this.deviceName = deviceName;
    this.totalCount = totalCount;
  }

  SpecsSuite.prototype.addSpec = function(spec) {
    specs.push(spec);
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

