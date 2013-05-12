class SpecsSuite
  specs       = []
  suites      = []
  passedCount: 0
  errorCount: 0

  constructor: (@id, @appName, @deviceName, @totalCount) ->

  addSpec: (spec) ->
    specs.push(spec)
    if spec.passed
      @passedCount += 1
    else
      @errorCount += 1
    return this

  addSuite: (suite) ->
    suites.push(suite)
    return this
