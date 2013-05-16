var Spec;

Spec = (function() {
  function Spec(id, suiteName, description) {
    this.id = id;
    this.suiteName = suiteName;
    this.description = description;
    this.newResultCallbacks = $.Callbacks();
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
    return this.newResultCallbacks.fire(this);
  };

  Spec.prototype.onAddResult = function(callback) {
    return this.newResultCallbacks.add(callback);
  };

  return Spec;

})();
