// SubSpec Model
// ----------

// Suite (list of specs)
// In jasmine, it corresponds to the `describe` function.
tispec.TestSuite = Backbone.Model.extend({

    initialize: function() {
        // list of the suites
        this.suites   = new tispec.SuiteCollection();
    },
    runSpecs: function(form) {
        var filter;

        filter = $(form).find(':input').first().val();
        this.socket.emit('runSpecs', {
            specsSuiteId: this.id,
            filter: filter
        });
        return false;
    }

});



// Collection of TestSuites
// ------------------------
tispec.TestSuiteCollection = Backbone.Collection.extend({

    model: tispec.TestSuite

});
