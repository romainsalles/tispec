class Suite
  constructor: (@specsSuiteId, @description, @totalCount, @passedCount) ->

  showResults: ->
    $("#specs_results_#{@specsSuiteId} > tbody > tr:first").before("<tr><td>#{@description}</td><td colspan=\"2\">#{@passedCount}/#{@totalCount}</td></tr>")
