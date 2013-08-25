class tispec.SuiteItemView extends Backbone.View

  tagName: 'div'

  className: 'span12 specs_container'

  initialize: () ->
    @model.on       'change',  @render, this
    @model.on       'destroy', @close,  this
    @model.specs.on 'add',     @render, this

  render: () ->
    # The clone hack here is to support parse.com which doesn't add the id to model.attributes. For all other persistence
    # layers, you can directly pass model.attributes to the template function
    @$el.empty()

    data    = _.clone @model.attributes
    data.id = @model.id

    @$el.html @template(data)
    @model.specs.each (spec) ->
        $('.specs', this.el).append(new tispec.SpecItemView({model:spec}).render().el)
      , this

    this
