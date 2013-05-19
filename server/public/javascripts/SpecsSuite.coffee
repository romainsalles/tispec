class SpecsSuite
  specs       = []
  suites      = []
  passedCount: 0
  errorCount:  0

  constructor: (@id, @appName, @appVersion, @deviceName, @deviceModel) ->
    @newSpecsCallbacks        = $.Callbacks()
    @newSpecsResultsCallbacks = $.Callbacks()
    @newSuiteCallbacks        = $.Callbacks()

  setTotalCount: (@totalCount) ->

  # Spec
  # ----------------------------------------------------------------------------
  addSpec: (spec) ->
    specs.push(spec)
    spec.setSpecsSuite(this)

    spec.onAddResult (spec) =>
      if spec.passed
        @passedCount += 1
      else
        @errorCount  += 1
      @newSpecsResultsCallbacks.fire spec

    @newSpecsCallbacks.fire spec
    return spec

  getSpec: (id) ->
    _id = id.toString()
    _.find specs, (spec) -> return spec.id.toString() is _id

  # Suite
  # ----------------------------------------------------------------------------
  addSuite: (suite) ->
    suites.push(suite)

    @newSuiteCallbacks.fire suite
    return suite

  # Callbacks
  # ----------------------------------------------------------------------------

  onAddSpec:       (callback) -> @newSpecsCallbacks.add        callback
  onAddSpecResult: (callback) -> @newSpecsResultsCallbacks.add callback
  onAddSuite:      (callback) -> @newSuiteCallbacks.add        callback
