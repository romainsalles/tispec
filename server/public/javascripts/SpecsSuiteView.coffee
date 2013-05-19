class SpecsSuiteView
  specsSuite  = null
  currentSpec = null

  constructor: (@socket, @id, appName, appVersion, deviceName, deviceModel) ->
    specsSuite = new SpecsSuite(@id, appName, appVersion, deviceName, deviceModel)
    that       = this

    $.get "/specs_suites/#{@id}", (html) ->
        $('#specs_suites').append html
        that.initializeView()
    specsSuite.onAddSpec       updateAvancement
    specsSuite.onAddSpecResult (spec)  -> spec.showResults()
    specsSuite.onAddSuite      (suite) -> suite.showResults()

  onAddSpec:       (callback) -> @newSpecsCallbacks.add        callback
  onAddSpecResult: (callback) -> @newSpecsResultsCallbacks.add callback
  onAddSuite:      (callback) -> @newSuiteCallbacks.add        callback

  getSpecsSuite: -> specsSuite

  initializeView: () ->
    $('#myModal').modal 'show'
    $("#specs_results_#{@id}").find("tr:gt(0)").remove()
    $("#specs_suite_avancement_success_#{@id} > .bar").css("width", "0%")
    $("#specs_suite_avancement_error_#{@id} > .bar").css("width", "0%")
    $("#specs_suite_avancement_#{@id}").val(0).trigger("change")
    $("#specs_suite_title_#{@id}").text("#{specsSuite.appName} (#{specsSuite.appVersion}) / #{specsSuite.deviceName}")
    $("#specs_suite_avancement_#{@id}").knob width: 60, height: 60, readOnly: true

  confirmManualSpec: (behavior) ->
    currentSpec = specsSuite.getSpec behavior.specId
    confirmationDiv = $("#spec_confirmation_#{@id}");
    confirmationDiv.find('.confirmation_expected_message').text(behavior.description)
    confirmationDiv.show()

  setManualSpecResult: (valid) ->
    currentSpec.setManualError() unless valid
    $("#spec_confirmation_#{@id}").hide();
    socket.emit('confirmSpecResult', specsSuiteId: @id, valide: valid );

  end: () ->
    $('.spec_row').each( -> $(this).popover 'hide' if $(this).data 'content' )

  # Private functions
  # ----------------------------------------------------------------------------
  updateAvancement = () ->
    passed           = specsSuite.passedCount
    error            = specsSuite.errorCount
    advancement      = (passed+error) / specsSuite.totalCount * 100
    passedPercentage = (passed / specsSuite.totalCount) * 100
    errorPercentage  = (error / specsSuite.totalCount) * 100

    $("#specs_suite_avancement_success_#{specsSuite.id} > .bar").css("width", "#{passedPercentage}%")
    $("#specs_suite_avancement_error_#{specsSuite.id} > .bar").css("width", "#{errorPercentage}%")
    $("#specs_suite_avancement_#{specsSuite.id}").val(advancement).trigger('change')


# Decorate models
# ------------------------------------------------------------------------------
Spec.prototype.showResults = ->
  switch @errorType
    when @ERROR_NORMAL                     then @formatNormalError()
    when @ERROR_SCREENSHOT_UNKNOWN_IMAGE   then @formatScreenshotUnknownError()
    when @ERROR_SCREENSHOT_DIFFERENT_IMAGE then @formatScreenshotDifferentError()
    when @ERROR_MANUAL_VALIDATION          then @formatManualValidationError()
    else                                        @formatResult()

Spec.prototype.formatNormalError = ->
  errorMessages = []
  for subSpec, i in @subSpecs
    unless subSpec.passed_
      errorMessages.push '(' + (i+1) + ') expected <b>' + JSON.stringify(subSpec.actual) + '</b> to be <b>' + JSON.stringify(subSpec.expected) + '</b>'

  if errorMessages.length > 0
    @formatResult "<ul><li>#{errorMessages.join('</li><li>')}</li></ul>"
  else
    @formatResult()

  return this

Spec.prototype.formatScreenshotDifferentError = ->
  @formatResult "The expected screenshot doesn't match the actual one"

Spec.prototype.formatScreenshotUnknownError = ->
  @formatResult "You haven't defined an expected screenshot for this device and this app yet"

Spec.prototype.formatManualValidationError = ->
  @formatResult "You have manually rejected this test"

Spec.prototype.formatResult = (errorMessage) ->
  className = if errorMessage then 'error' else 'success'
  error = if errorMessage then " data-title=\"Errors\" data-content=\"#{errorMessage}\" data-placement=\"top\" data-html=\"true\"" else ""

  row = "<tr class=\"spec_row #{className}\"#{error}><td>#{@suiteName} #{@description}</td><td>#{@passedCount}/#{@totalCount}</td></tr>"
  $(row).prependTo "#specs_results_#{@specsSuite.id}"

Suite.prototype.showResults = ->
  $("#specs_results_#{@specsSuiteId} > tbody > tr:first").before("<tr><td>#{@description}</td><td colspan=\"2\">#{@passedCount}/#{@totalCount}</td></tr>")
