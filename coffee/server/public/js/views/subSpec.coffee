class tispec.SubSpecItemView extends Backbone.View

  tagName: 'div'

  className: 'span12 subspecs_container'

  initialize: () ->
    @model.on 'change',  @render, this
    @model.on 'destroy', @close,  this

  render: () ->
    # The clone hack here is to support parse.com which doesn't add the id to model.attributes. For all other persistence
    # layers, you can directly pass model.attributes to the template function
    data           =  _.clone @model.attributes
    data.id        = @model.id
    data.errorType = @model.errorType

    @$el.html @template(data)

    return this
