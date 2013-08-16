// SubSpec Model
// ----------

// Suite (list of specs)
// In jasmine, it corresponds to the `describe` function.
tispec.TestSuite = Backbone.Model.extend({

    defaults: function() {
        return {
            totalCount: 0
        };
    },
    initialize: function() {
        // list of the suites
        this.suites   = new tispec.SuiteCollection();
    },
    setSocket: function(socket) {
        this._socket = socket;
    },
    runSpecs: function(form) {
        var filter;

        filter = $(form).find(':input').first().val();
        this._socket.emit('runSpecs', {
            specsSuiteId: this.id,
            filter:       filter
        });

        return false;
    }

});



// Collection of TestSuites
// ------------------------
tispec.TestSuiteCollection = Backbone.Collection.extend({

    model: tispec.TestSuite

});
