// SubSpec Model
// ----------

// Suite (list of specs)
// In jasmine, it corresponds to the `describe` function.
tispec.Suite = Backbone.Model.extend({


    defaults: function() {
      return {
        description: '(suite)',
        totalCount:  0,
        passedCount: 0
      };
    },
    initialize: function() {
      // list of the specs expectations
      this.specs        = new tispec.SpecCollection();
    }

});



// Collection of Suites
// --------------------
tispec.SuiteCollection = Backbone.Collection.extend({

    model: tispec.Suite

});
