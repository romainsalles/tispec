var Suite;

Suite = (function() {
  function Suite(specsSuiteId, description, totalCount, passedCount) {
    this.specsSuiteId = specsSuiteId;
    this.description = description;
    this.totalCount = totalCount;
    this.passedCount = passedCount;
  }

  Suite.prototype.showResults = function() {
    return $("#specs_results_" + this.specsSuiteId + " > tbody > tr:first").before("<tr><td>" + this.description + "</td><td colspan=\"2\">" + this.passedCount + "/" + this.totalCount + "</td></tr>");
  };

  return Suite;

})();
