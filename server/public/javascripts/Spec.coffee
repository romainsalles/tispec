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
