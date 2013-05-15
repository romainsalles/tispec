class SpecsSuite
  specs       = []
  suites      = []
  passedCount: 0
  errorCount:  0

  constructor: (@id, @appName, @appVersion, @deviceName, @deviceModel) ->

  setTotalCount: (@totalCount) ->

  # Spec
  # ----------------------------------------------------------------------------
  addSpec: (spec) ->
    specs.push(spec)
    spec.setSpecsSuite(this)

    if spec.passed
      @passedCount += 1
    else
      @errorCount  += 1

    return spec

  getSpec: (id) ->
    _.find specs, (spec) -> return spec.id is id

  # Suite
  # ----------------------------------------------------------------------------
  addSuite: (suite) ->
    suites.push(suite)
    return this
