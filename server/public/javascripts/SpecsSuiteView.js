var SpecsSuiteView;

SpecsSuiteView = (function() {
  var specsSuite, updateAvancement;

  specsSuite = null;

  function SpecsSuiteView(id, appName, appVersion, deviceName, deviceModel) {
    var that;

    this.id = id;
    specsSuite = new SpecsSuite(this.id, appName, appVersion, deviceName, deviceModel);
    that = this;
    $.get("/specs_suites/" + this.id, function(html) {
      $('#specs_suites').append(html);
      return that.initializeView();
    });
    specsSuite.onAddSpec(updateAvancement);
    specsSuite.onAddSpecResult(function(spec) {
      return spec.showResults();
    });
    specsSuite.onAddSuite(function(suite) {
      return suite.showResults();
    });
  }

  SpecsSuiteView.prototype.onAddSpec = function(callback) {
    return this.newSpecsCallbacks.add(callback);
  };

  SpecsSuiteView.prototype.onAddSpecResult = function(callback) {
    return this.newSpecsResultsCallbacks.add(callback);
  };

  SpecsSuiteView.prototype.onAddSuite = function(callback) {
    return this.newSuiteCallbacks.add(callback);
  };

  SpecsSuiteView.prototype.getSpecsSuite = function() {
    return specsSuite;
  };

  SpecsSuiteView.prototype.initializeView = function() {
    $('#myModal').modal('show');
    $("#specs_results_" + this.id).find("tr:gt(0)").remove();
    $("#specs_suite_avancement_success_" + this.id + " > .bar").css("width", "0%");
    $("#specs_suite_avancement_error_" + this.id + " > .bar").css("width", "0%");
    $("#specs_suite_avancement_" + this.id).val(0).trigger("change");
    $("#specs_suite_title_" + this.id).text("" + specsSuite.appName + " (" + specsSuite.appVersion + ") / " + specsSuite.deviceName);
    return $("#specs_suite_avancement_" + this.id).knob({
      width: 60,
      height: 60,
      readOnly: true
    });
  };

  updateAvancement = function() {
    var advancement, error, errorPercentage, passed, passedPercentage;

    passed = specsSuite.passedCount;
    error = specsSuite.errorCount;
    advancement = (passed + error) / specsSuite.totalCount * 100;
    passedPercentage = (passed / specsSuite.totalCount) * 100;
    errorPercentage = (error / specsSuite.totalCount) * 100;
    $("#specs_suite_avancement_success_" + specsSuite.id + " > .bar").css("width", "" + passedPercentage + "%");
    $("#specs_suite_avancement_error_" + specsSuite.id + " > .bar").css("width", "" + errorPercentage + "%");
    return $("#specs_suite_avancement_" + specsSuite.id).val(advancement).trigger('change');
  };

  return SpecsSuiteView;

})();

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

Suite.prototype.showResults = function() {
  return $("#specs_results_" + this.specsSuiteId + " > tbody > tr:first").before("<tr><td>" + this.description + "</td><td colspan=\"2\">" + this.passedCount + "/" + this.totalCount + "</td></tr>");
};
