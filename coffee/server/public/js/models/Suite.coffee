# SubSpec Model
# ----------

# Suite (list of specs)
# In jasmine, it corresponds to the `describe` function.
class tispec.Suite extends Backbone.Model

  defaults: () ->
    description: '(suite)',
    totalCount:  0,
    passedCount: 0,
    errorCount:  0

  initialize: () ->
    # list of the specs expectations
    @specs = new tispec.SpecCollection()
    @specs.on 'change:passedCount', @updatePassedCount, this
    @specs.on 'change:failedCount', @updateErrorCount , this

  updatePassedCount: (spec, newPassedCount) ->
    @set(
      passedCount: @get('passedCount') + newPassedCount,
      totalCount:  @get('totalCount') + newPassedCount
    )

  updateErrorCount: (spec, newErrorCount) ->
    @set(
      errorCount: @get('errorCount') + newErrorCount,
      totalCount: @get('totalCount') + newErrorCount
    )

# Collection of Suites
# --------------------
class tispec.SuiteCollection extends Backbone.Collection
  model: tispec.Suite
