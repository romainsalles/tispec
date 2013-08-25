root = exports ? this

# Code executed on the result page
root.tispec =
  views:  {},
  models: {},
  loadTemplates: (views, callback) ->
    deferreds = []

    $.each views, (index, view) ->
      # Initialize views templates
      if tispec[view]
        deferreds.push(
          $.get(
            "views/#{view}",
            (data) -> (tispec[view].prototype.template = _.template(data)),
            'html'
          )
        )
      else
        alert "#{view} not found"

    $.when.apply(null, deferreds).done(callback)


$(document).on 'ready', () ->
  tispec.loadTemplates(
    ['TestSuiteView', 'SuiteItemView', 'SpecItemView', 'SubSpecItemView'],
    () ->
      # initialize socket manager
      tispec.SocketManager.get()
  )
