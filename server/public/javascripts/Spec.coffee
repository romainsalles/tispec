class Spec
  ERROR_NORMAL:                      0
  ERROR_SCREENSHOT_UNKNOWN_IMAGE:    1
  ERROR_SCREENSHOT_DIFFERENT_IMAGE:  2
  ERROR_MANUAL_VALIDATION:           3

  constructor:        (@id, @suiteName, @description) -> @newResultCallbacks = $.Callbacks()

  setSpecsSuite:      (@specsSuite) ->

  setScreenshotError: (@errorType, @expectedImage, @actualImage) ->
  setManualError:     -> @errorType = @ERROR_MANUAL_VALIDATION

  setResult:          (@totalCount, @passedCount, @failedCount, @passed, @subSpecs) -> @newResultCallbacks.fire this

  # Callbacks
  # ----------------------------------------------------------------------------
  onAddResult:        (callback) -> @newResultCallbacks.add(callback)
