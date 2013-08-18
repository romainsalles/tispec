# SubSpec Model
# ----------

# Suite (list of specs)
# In jasmine, it corresponds to the `describe` function.
class tispec.Suite extends Backbone.Model

  defaults: () ->
    description: '(suite)',
    totalCount:  0,
    passedCount: 0

  initialize: () ->
    # list of the specs expectations
    @specs = new tispec.SpecCollection();

# Collection of Suites
# --------------------
class tispec.SuiteCollection extends Backbone.Collection
  model: tispec.Suite
