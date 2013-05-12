ejs = require 'ejs'
fs  = require 'fs'

show = (request, response) ->
  console.log('===> query : ' + JSON.stringify(request.params))
  response.render('specs_suites_show', { specsSuite: {id: request.params.id} })

exports.show = show
