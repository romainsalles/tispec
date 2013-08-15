// SubSpec Model
// ----------

// Suite (list of specs)
// In jasmine, it corresponds to the `describe` function.
tispec.Suite = Backbone.Model.extend({

    initialize: function (specsSuiteId, description, totalCount, passedCount) {
      // identifier of the SpecSuite it belongs
      this.specsSuiteId = specsSuiteId;

      // spec description
      this.description  = description;

      // Number of specs included in this suite
      this.totalCount   = totalCount;

      // Number of passed specs in the suite
      this.passedCount  = passedCount;

      // list of the specs expectations
      this.specs        = new tispec.SpecCollection();
    }

});



// Collection of Suites
// --------------------
tispec.SuiteCollection = Backbone.Collection.extend({

    model: tispec.Suite

});
