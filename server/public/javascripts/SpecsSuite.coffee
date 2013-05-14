# SpecsSuite
# ==============================================================================

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


# Suite
# ==============================================================================
class Suite
  constructor: (@specsSuiteId, @description, @totalCount, @passedCount) ->

  showResults: ->
    $("#specs_results_#{@specsSuiteId} > tbody > tr:first").before("<tr><td>#{@description}</td><td colspan=\"2\">#{@passedCount}/#{@totalCount}</td></tr>");

# Spec
# ==============================================================================
class Spec
  constructor:   (@id, @suiteName, @description) ->

  setSpecsSuite: (@specsSuite) ->

  setResult:     (@totalCount, @passedCount, @failedCount, @passed, @subSpecs) ->

  showResults: ->
    errorMessages = []
    for subSpec, i in @subSpecs
      unless subSpec.passed_
        errorMessages.push '(' + (i+1) + ') expected <b>' + JSON.stringify(subSpec.actual) + '</b> to be <b>' + JSON.stringify(subSpec.expected) + '</b>'

    className = if @passed then 'success' else 'error'
    row = "<tr class=\"spec_row #{className}\""
    if errorMessages.length > 0
      subSpecsErrors = "<ul><li>#{errorMessages.join('</li><li>')}</li></ul>"
      row += " data-title=\"Errors\" data-content=\"#{subSpecsErrors}\" data-placement=\"top\" data-html=\"true\""

    row += "><td>#{@suiteName} #{@description}</td><td>#{@passedCount}/#{@totalCount}</td></tr>"
    $(row).prependTo "#specs_results_#{@specsSuite.id}"

    return this
