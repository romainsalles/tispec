var Suite;

Suite = (function() {
  function Suite(specsSuiteId, description, totalCount, passedCount) {
    this.specsSuiteId = specsSuiteId;
    this.description = description;
    this.totalCount = totalCount;
    this.passedCount = passedCount;
  }

  return Suite;

})();
