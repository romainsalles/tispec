class tispec.SpecItemView extends Backbone.View

  tagName: 'div'

  className: 'span12 specs_container'

  events:
    'click .spec_description': 'toggleSpecsDetails',
    'click .save_screenshot':  'saveScreenshot'

  initialize: () ->
    @model.on          'change',  @render, this
    @model.on          'destroy', @close,  this
    @model.subSpecs.on 'add',     @render, this

  render: () ->
    # The clone hack here is to support parse.com which doesn't add the id to model.attributes. For all other persistence
    # layers, you can directly pass model.attributes to the template function
    @$el.empty();

    data       = _.clone @model.attributes
    data.id    = @model.id
    data.state = if (data.errorType is tispec.Spec.SUCCESS) then 'success' else 'error'

    @$el.html @template(data)

    if @model.get('errorType') in [tispec.Spec.ERROR_NORMAL, tispec.Spec.ERROR_MANUAL_VALIDATION]
      @model.subSpecs.each (subSpec) ->
          subSpec.errorType = @model.get 'errorType'
          $('.subspecs', this.el).append(new tispec.SubSpecItemView({model: subSpec}).render().el)
        , this

    this

  toggleSpecsDetails: () ->
    if @model.get('errorType') in [tispec.Spec.ERROR_NORMAL, tispec.Spec.ERROR_MANUAL_VALIDATION]
      $('.subspecs', this.el).toggle()

  saveScreenshot: () ->
    tispec.SocketManager.get().changeScreenshot(
      tispec.testSuiteView.model.get('appName'),
      tispec.testSuiteView.model.get('deviceModel'),
      @model.get('screenshotError')
    )
    @model.set errorType: tispec.Spec.SUCCESS
    $('.modal-backdrop').hide()
    true
