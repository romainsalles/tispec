// SubSpec Model
// ----------

// Suite (list of specs)
// In jasmine, it corresponds to the `describe` function.
tispec.Suite = Backbone.Model.extend({

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
