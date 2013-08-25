#
# TispecReporter, by Romain Salles.
#
# Jasmine reporter which share results with the tispec node server
#
# For more info, @see  https://github.com/romainsalles/tispec
RequestManager = require './RequestManager'

class TispecReporter

  constructor: () ->

  startSpecs: (runner) ->
    totalCount = 0

    for spec in runner.specs()
      totalCount += 1 if @specFilter spec

    RequestManager.get().sendRequest(
      action: 'startSpecs',
      data:
        specsSuite: JSON.stringify(
          deviceName: Ti.Platform.username,
          appName:    Titanium.App.name,
          version:    Titanium.App.version,
          totalCount: totalCount
        )
    )

  # When spec start, send informations on it to the tispec server.
  onSpecStart: (spec) ->
    RequestManager.get().sendRequest(
      action: 'specStart',
      data:
        spec: JSON.stringify(
          id:          spec.id,
          suiteName:   spec.suite.getFullName(),
          description: spec.description
        )
    )

  # When spec end, send results to the tispec server.
  #
  # @spec {Object} jasmine spec result
  onSpecEnd: (spec) ->
    results = spec.results()
    return if results.totalCount is 0

    RequestManager.get().sendRequest(
      action: 'specEnd',
      data:
        spec: JSON.stringify(
          id:          spec.id,
          suiteName:   spec.suite.getFullName(),
          description: spec.description,
          totalCount:  results.totalCount,
          passedCount: results.passedCount,
          failedCount: results.failedCount,
          passed:      results.passed(),
          subSpecs:    results.items_
        )
    )

  # When suite end, send results to the tispec server.
  #
  # @suite {Object} jasmine suite result
  onSuiteEnd: (suite) ->
    results = suite.results()
    return if results.totalCount is 0

    RequestManager.get().sendRequest(
      action: 'suiteEnd',
      data:
        suite: JSON.stringify(
          description: suite.description,
          totalCount:  results.totalCount,
          passedCount: results.passedCount,
          failedCount: results.failedCount
        )
    )

  endSpecs: () -> RequestManager.get().sendRequest action: 'end'


  #Filters
  # Specify the specs you want to run.
  #
  # Use :
  # var tispecReporter = new TispecReporter;
  # jasmine.getEnv().addReporter(tispecReporter);
  # jasmine.getEnv().specFilter = function(spec) {
  #   return tispecReporter.specFilter(spec);
  # };
  # ============================================================================

  # Specs will not use the filter anymore.
  removeSpecFilter: () -> @setSpecFilter null

  #Add a spec filter on the given string.
  #
  # @focusedSpecName {String} only the specs containing this string will be run
  setSpecFilter: (@focusedSpecName) ->

  #Function used by Jasmine to determine if a spec should be lunch or not.
  #
  # @spec {Object} Jasmine spec
  specFilter: (spec) ->
    return !@focusedSpecName || spec.getFullName().indexOf(this.focusedSpecName) isnt -1


  # Signature of Jasmine functions
  # ============================================================================

  reportRunnerResults:  (runner) -> @endSpecs()
  reportRunnerStarting: (runner) -> @startSpecs runner
  reportSpecResults:    (spec)   -> @onSpecEnd spec
  reportSpecStarting:   (spec)   -> @onSpecStart spec
  reportSuiteResults:   (suite)  -> @onSuiteEnd suite

exports.TispecReporter = TispecReporter;
