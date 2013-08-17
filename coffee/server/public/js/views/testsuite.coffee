class tispec.TestSuiteView extends Backbone.View
  tagName: 'div'

  className: 'span12 specs_container'

  initialize: () ->
    @model.on 'reset', @render, this
    @model.suites.on 'add', (suite) ->
        @$el.append(new tispec.SuiteItemView({model:suite}).render().el)
      , this

  render: () ->
    @$el.empty();
    data    = _.clone @model.attributes
    data.id = @model.id
    @$el.html @template(data)
    @model.suites.each (suite) ->
        $('#testSuiteTBody', this.el).append(new tispec.SuiteItemView({model:suite}).render().el)
      , this
    this


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


class tispec.SpecItemView extends Backbone.View

  tagName: 'div'

  className: 'span12 specs_container'

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
    data.state = if (data.errorType is tispec.Spec.SUCCESS) then 'success' else 'important'

    @$el.html @template(data)
    @model.subSpecs.each (subSpec) ->
        $('.subspecs', this.el).append(new tispec.SubSpecItemView({model:subSpec}).render().el)
      , this

    this


class tispec.SubSpecItemView extends Backbone.View

  tagName: 'div'

  className: 'span12 subspecs_container'

  initialize: () ->
    @model.on 'change',  @render, this
    @model.on 'destroy', @close,  this

  render: () ->
    # The clone hack here is to support parse.com which doesn't add the id to model.attributes. For all other persistence
    # layers, you can directly pass model.attributes to the template function
    data    =  _.clone @model.attributes
    data.id = @model.id

    @$el.html @template(data)

    return this
