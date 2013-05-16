class Spec
  constructor:   (@id, @suiteName, @description) ->
    @newResultCallbacks = $.Callbacks()

  setSpecsSuite: (@specsSuite) ->

  setResult:     (@totalCount, @passedCount, @failedCount, @passed, @subSpecs) ->
    @newResultCallbacks.fire this

  # Callbacks
  # ----------------------------------------------------------------------------
  onAddResult: (callback) -> @newResultCallbacks.add(callback)
