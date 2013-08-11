var Spec;

Spec = (function() {
  Spec.prototype.ERROR_NORMAL = 0;

  Spec.prototype.ERROR_SCREENSHOT_UNKNOWN_IMAGE = 1;

  Spec.prototype.ERROR_SCREENSHOT_DIFFERENT_IMAGE = 2;

  Spec.prototype.ERROR_MANUAL_VALIDATION = 3;

  function Spec(id, suiteName, description) {
    this.id = id;
    this.suiteName = suiteName;
    this.description = description;
    this.newResultCallbacks = $.Callbacks();
  }

  Spec.prototype.setSpecsSuite = function(specsSuite) {
    this.specsSuite = specsSuite;
  };

  Spec.prototype.setScreenshotError = function(errorType, expectedImage, actualImage, screenshotError) {
    this.errorType = errorType;
    this.expectedImage = expectedImage;
    this.actualImage = actualImage;
    this.screenshotError = screenshotError;
  };

  Spec.prototype.setManualError = function() {
    return this.errorType = this.ERROR_MANUAL_VALIDATION;
  };

  Spec.prototype.setResult = function(totalCount, passedCount, failedCount, passed, subSpecs) {
    this.totalCount = totalCount;
    this.passedCount = passedCount;
    this.failedCount = failedCount;
    this.passed = passed;
    this.subSpecs = subSpecs;
    if (!this.errorType && this.failedCount > 0) {
      this.errorType = this.ERROR_NORMAL;
    }
    return this.newResultCallbacks.fire(this);
  };

  Spec.prototype.onAddResult = function(callback) {
    return this.newResultCallbacks.add(callback);
  };

  return Spec;

})();
