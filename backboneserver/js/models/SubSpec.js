// SubSpec Model
// ----------

// Match the different expectations of a spec.
// In jasmine, it corresponds to the `expect` function.
tispec.SubSpec = Backbone.Model.extend({

    initialize: function() {}

});
// Collection of SubSpecs
// ----------------------
tispec.SubSpecCollection = Backbone.Collection.extend({

    model: tispec.SubSpec

});
