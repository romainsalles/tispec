root = exports ? this

root.tispec =
  views:  {},
  models: {},
  loadTemplates: (views, callback) ->
    deferreds = []

    $.each views, (index, view) ->
      if tispec[view]
        deferreds.push(
          $.get(
            "tpl/#{view}",
            (data) -> (tispec[view].prototype.template = _.template(data)),
            'html'
          )
        )
      else
        alert "#{view} not found"

    $.when.apply(null, deferreds).done(callback)


class tispec.Router extends Backbone.Router
    routes:
        "": "testSuite"

    initialize: () ->
        @$content = $ '#specs_suites'

    testSuite: () ->

$(document).on 'ready', () ->
    tispec.loadTemplates(
      ['TestSuiteView', 'SuiteItemView', 'SpecItemView', 'SubSpecItemView'],
      () ->
        tispec.router = new tispec.Router()
        Backbone.history.start()
    )
