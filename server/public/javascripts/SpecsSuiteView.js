var SpecsSuiteView;

SpecsSuiteView = (function() {
  var currentSpec, specsSuite, updateAvancement;

  specsSuite = null;

  currentSpec = null;

  function SpecsSuiteView(socket, id, appName, appVersion, deviceName, deviceModel) {
    var that;

    this.socket = socket;
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

  SpecsSuiteView.prototype.runSpecs = function(form) {
    var filter;

    this.initializeView();
    filter = $(form).find(':input').first().val();
    socket.emit('runSpecs', {
      specsSuiteId: this.id,
      filter: filter
    });
    return false;
  };

  SpecsSuiteView.prototype.initializeView = function() {
    $('#myModal').modal('show');
    $("#specs_results_" + this.id).find("tr:gt(0)").remove();
    $("#specs_suite_avancement_success_" + this.id + " > .bar").css("width", "0%");
    $("#specs_suite_avancement_error_" + this.id + " > .bar").css("width", "0%");
    $("#specs_suite_avancement_" + this.id).val(0).trigger("change");
    $("#specs_suite_title_" + this.id).text("" + specsSuite.appName + " (" + specsSuite.appVersion + ") / " + specsSuite.deviceName);
    $("#specs_suite_avancement_" + this.id).knob({
      width: 60,
      height: 60,
      readOnly: true
    });
  };

  SpecsSuiteView.prototype.confirmManualSpec = function(behavior) {
    var confirmationDiv;

    currentSpec = specsSuite.getSpec(behavior.specId);
    confirmationDiv = $("#spec_confirmation_" + this.id);
    confirmationDiv.find('.confirmation_expected_message').text(behavior.description);
    confirmationDiv.show();
  };

  SpecsSuiteView.prototype.setManualSpecResult = function(valid) {
    if (!valid) {
      currentSpec.setManualError();
    }
    $("#spec_confirmation_" + this.id).hide();
    socket.emit('confirmSpecResult', {
      specsSuiteId: this.id,
      valide: valid
    });
  };

  SpecsSuiteView.prototype.end = function() {
    $('.spec_row').each(function() {
      if ($(this).data('content')) {
        return $(this).popover('hide');
      }
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
    $("#specs_suite_avancement_" + specsSuite.id).val(advancement).trigger('change');
  };

  return SpecsSuiteView;

})();

Spec.prototype.showResults = function() {
  switch (this.errorType) {
    case this.ERROR_NORMAL:
      this.formatNormalError();
      break;
    case this.ERROR_SCREENSHOT_UNKNOWN_IMAGE:
      this.formatScreenshotUnknownError();
      break;
    case this.ERROR_SCREENSHOT_DIFFERENT_IMAGE:
      this.formatScreenshotDifferentError();
      break;
    case this.ERROR_MANUAL_VALIDATION:
      this.formatManualValidationError();
      break;
    default:
      this.formatResult();
  }
};

Spec.prototype.formatNormalError = function() {
  var errorMessages, i, subSpec, _i, _len, _ref;

  errorMessages = [];
  _ref = this.subSpecs;
  for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
    subSpec = _ref[i];
    if (!subSpec.passed_) {
      errorMessages.push('(' + (i + 1) + ') expected <b>' + JSON.stringify(subSpec.actual) + '</b> to be <b>' + JSON.stringify(subSpec.expected) + '</b>');
    }
  }
  if (errorMessages.length > 0) {
    this.formatResult("<ul><li>" + (errorMessages.join('</li><li>')) + "</li></ul>");
  } else {
    this.formatResult();
  }
  return this;
};

Spec.prototype.formatScreenshotDifferentError = function() {
  this.formatResult("The expected screenshot doesn't match the actual one");
};

Spec.prototype.formatScreenshotUnknownError = function() {
  this.formatResult("You haven't defined an expected screenshot for this device and this app yet");
};

Spec.prototype.formatManualValidationError = function() {
  this.formatResult("You have manually rejected this test");
};

Spec.prototype.formatResult = function(errorMessage) {
  var className, error, row;

  className = errorMessage ? 'error' : 'success';
  error = errorMessage ? " data-title=\"Errors\" data-content=\"" + errorMessage + "\" data-placement=\"top\" data-html=\"true\"" : "";
  row = "<tr class=\"spec_row " + className + "\"" + error + "><td>" + this.suiteName + " " + this.description + "</td><td>" + this.passedCount + "/" + this.totalCount + "</td></tr>";
  $(row).prependTo("#specs_results_" + this.specsSuite.id);
};

Suite.prototype.showResults = function() {
  $("#specs_results_" + this.specsSuiteId + " > tbody > tr:first").before("<tr><td>" + this.description + "</td><td colspan=\"2\">" + this.passedCount + "/" + this.totalCount + "</td></tr>");
};
