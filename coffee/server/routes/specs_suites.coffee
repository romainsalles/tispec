ejs = require 'ejs'
fs  = require 'fs'

show = (request, response) ->
  response.render('specs_suites_show', { specsSuite: {id: request.params.id} })

exports.show = show
