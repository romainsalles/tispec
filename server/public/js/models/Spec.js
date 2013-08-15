// SubSpec Model
// ----------

// Match the different expectations of a spec.
// In jasmine, it corresponds to the `expect` function.
tispec.Spec = Backbone.Model.extend({

    defaults: function() {
        return {
            description: 'spec',
            totalCount:  0,
            passedCount: 0,
            failedCount: 0,
            passed:      true
        };
    },
    initialize: function() {
        // list of the specs expectations
        this.subSpecs     = new tispec.SubSpecCollection();
    }

});


// Error types
// -----------
// Classic error
tispec.Spec.ERROR_NORMAL                        = 0;
// Spec comparing 2 screenshots and the reference one hasn't been defined yet
tispec.Spec.ERROR_SCREENSHOT_UNKNOWN_IMAGE      = 1;
// Spec comparing 2 screenshots and the reference doesn't match the actual one
tispec.Spec.ERROR_SCREENSHOT_DIFFERENT_IMAGE    = 2;
// Manual spec whose person has rejected
tispec.Spec.ERROR_MANUAL_VALIDATION             = 3;


// Collection of Specs
// -------------------
tispec.SpecCollection = Backbone.Collection.extend({

    model: tispec.Spec

});
