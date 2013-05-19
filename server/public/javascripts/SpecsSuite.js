var SpecsSuite;

SpecsSuite = (function() {
  var specs, suites;

  specs = [];

  suites = [];

  SpecsSuite.prototype.passedCount = 0;

  SpecsSuite.prototype.errorCount = 0;

  function SpecsSuite(id, appName, appVersion, deviceName, deviceModel) {
    this.id = id;
    this.appName = appName;
    this.appVersion = appVersion;
    this.deviceName = deviceName;
    this.deviceModel = deviceModel;
    this.newSpecsCallbacks = $.Callbacks();
    this.newSpecsResultsCallbacks = $.Callbacks();
    this.newSuiteCallbacks = $.Callbacks();
  }

  SpecsSuite.prototype.setTotalCount = function(totalCount) {
    this.totalCount = totalCount;
  };

  SpecsSuite.prototype.addSpec = function(spec) {
    var _this = this;

    specs.push(spec);
    spec.setSpecsSuite(this);
    spec.onAddResult(function(spec) {
      if (spec.passed) {
        _this.passedCount += 1;
      } else {
        _this.errorCount += 1;
      }
      return _this.newSpecsResultsCallbacks.fire(spec);
    });
    this.newSpecsCallbacks.fire(spec);
    return spec;
  };

  SpecsSuite.prototype.getSpec = function(id) {
    var _id;

    _id = id.toString();
    return _.find(specs, function(spec) {
      return spec.id.toString() === _id;
    });
  };

  SpecsSuite.prototype.addSuite = function(suite) {
    suites.push(suite);
    this.newSuiteCallbacks.fire(suite);
    return suite;
  };

  SpecsSuite.prototype.onAddSpec = function(callback) {
    return this.newSpecsCallbacks.add(callback);
  };

  SpecsSuite.prototype.onAddSpecResult = function(callback) {
    return this.newSpecsResultsCallbacks.add(callback);
  };

  SpecsSuite.prototype.onAddSuite = function(callback) {
    return this.newSuiteCallbacks.add(callback);
  };

  return SpecsSuite;

})();
