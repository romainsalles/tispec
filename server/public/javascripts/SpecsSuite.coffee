class SpecsSuite
  specs       = []
  suites      = []
  totalCount: 0
  passedCount: 0
  errorCount: 0

  constructor: (@appName, @deviceName) ->
    @id = 1

  addSpec: (spec) ->
    specs.push(spec)
    @totalCount += 1
    if spec.passed
      @passedCount += 1
    else
      @errorCount += 1
    return this

  addSuite: (suite) ->
    suites.push(suite)
    return this
