# SubSpec Model
# ----------

# Match the different expectations of a spec.
# In jasmine, it corresponds to the `expect` function.

class tispec.Spec extends Backbone.Model
  # Spec status
  # -----------
  @SUCCESS                           = 0
  # Classic error
  @ERROR_NORMAL                      = 1
  # Spec comparing 2 screenshots and the reference one hasn't been defined yet
  @ERROR_SCREENSHOT_UNKNOWN_IMAGE    = 2
  # Spec comparing 2 screenshots and the reference doesn't match the actual one
  @ERROR_SCREENSHOT_DIFFERENT_IMAGE  = 3
  # Manual spec whose person has rejected
  @ERROR_MANUAL_VALIDATION           = 4

  defaults: ->
    description: 'spec',
    totalCount:  0,
    passedCount: 0,
    failedCount: 0,
    passed:      true,
    errorType:   @constructor.SUCCESS

  initialize: ->
    # list of the specs expectations
    @subSpecs = new tispec.SubSpecCollection()
    @on 'change:failedCount', @setErrorType, this

  setErrorType: ->
    @set errorType: @constructor.ERROR_NORMAL if @get('failedCount') > 0

  setScreenshotError: (@errorType, @expectedImage, @actualImage, @screenshotError) ->


# Collection of Specs
# -------------------
class tispec.SpecCollection extends Backbone.Collection
  model: tispec.Spec
