var Spec, SpecsSuite;

SpecsSuite = (function() {
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
    spec.setSpecsSuite(this);
    if (spec.passed) {
      this.passedCount += 1;
    } else {
      this.errorCount += 1;
    }
    updateAvancement(this);
    return spec;
  };

  SpecsSuite.prototype.addSuite = function(suite) {
    suites.push(suite);
    return this;
  };

  SpecsSuite.prototype.getSpec = function(id) {
    return _.find(specs, function(spec) {
      return spec.id === id;
    });
  };

  return SpecsSuite;

})();

Spec = (function() {
  function Spec(id, suiteName, description) {
    this.id = id;
    this.suiteName = suiteName;
    this.description = description;
  }

  Spec.prototype.setSpecsSuite = function(specsSuite) {
    this.specsSuite = specsSuite;
  };

  Spec.prototype.setResult = function(totalCount, passedCount, failedCount, passed, subSpecs) {
    this.totalCount = totalCount;
    this.passedCount = passedCount;
    this.failedCount = failedCount;
    this.passed = passed;
    this.subSpecs = subSpecs;
  };

  Spec.prototype.showResults = function() {
    var className, errorMessages, i, row, subSpec, subSpecsErrors, _i, _len, _ref;

    errorMessages = [];
    _ref = this.subSpecs;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      subSpec = _ref[i];
      if (!subSpec.passed_) {
        errorMessages.push('(' + (i + 1) + ') expected <b>' + JSON.stringify(subSpec.actual) + '</b> to be <b>' + JSON.stringify(subSpec.expected) + '</b>');
      }
    }
    className = this.passed ? 'success' : 'error';
    row = "<tr class=\"spec_row " + className + "\"";
    if (errorMessages.length > 0) {
      subSpecsErrors = "<ul><li>" + (errorMessages.join('</li><li>')) + "</li></ul>";
      row += " data-title=\"Errors\" data-content=\"" + subSpecsErrors + "\" data-placement=\"top\" data-html=\"true\"";
    }
    row += "><td>" + this.suiteName + " " + this.description + "</td><td>" + this.passedCount + "/" + this.totalCount + "</td></tr>";
    $(row).prependTo("#specs_results_" + this.specsSuite.id);
    return this;
  };

  return Spec;

})();
