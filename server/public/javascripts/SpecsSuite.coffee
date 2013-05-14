# SpecsSuite
# ==============================================================================

class SpecsSuite
  specs       = []
  suites      = []
  passedCount: 0
  errorCount:  0

  constructor: (@id, @appName, @deviceName, @totalCount) ->

  addSpec: (spec) ->
    specs.push(spec)
    spec.setSpecsSuite(this)

    if spec.passed
      @passedCount += 1
    else
      @errorCount  += 1

    updateAvancement(this)
    return spec

  addSuite: (suite) ->
    suites.push(suite)
    return this

  getSpec: (id) ->
    _.find specs, (spec) -> return spec.id is id


# Specs
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
