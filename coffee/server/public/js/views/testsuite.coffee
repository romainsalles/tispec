class tispec.TestSuiteView extends Backbone.View
  tagName: 'div'

  className: 'span12 specs_container'

  initialize: () ->
    @model.on        'reset', @render, this
    @model.suites.on 'reset', @render, this
    @model.suites.on 'add', (suite) ->
        @$el.append(new tispec.SuiteItemView({model:suite}).render().el)
      , this

  render: () ->
    filter = $('#spec_filter')?.val()

    @$el.empty();
    data        = _.clone @model.attributes
    data.id     = @model.id
    data.filter = filter || ''
    @$el.html @template(data)
    @model.suites.each (suite) ->
        $('#testSuiteTBody', this.el).append(new tispec.SuiteItemView({model:suite}).render().el)
      , this
    this

  confirmManualSpec: (expectedBehavior) ->
    confirmationDiv = $("#spec_confirmation")
    confirmationDiv.find('.confirmation_expected_message').text expectedBehavior.description
    confirmationDiv.show()
    return

  validateSpec: (valid) ->
    unless valid
      specs = tispec.currentSuite.specs
      spec  = specs.at(specs.length - 1)
      spec.set errorType: tispec.Spec.ERROR_MANUAL_VALIDATION
    $('#spec_confirmation').hide()
    tispec.SocketManager.get().confirmSpecResult @model.id, valid
