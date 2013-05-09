ejs = require 'ejs'
fs  = require 'fs'

currentResponse = null

# GET home page
list = (request, response) ->
  currentResponse.end() if currentResponse
  currentResponse = response

  filter = request.query['filter']
  file   = fs.readFileSync 'server/views/specs_list.ejs', 'ascii'
  response.end(ejs.render(file, locals: {filter: filter}))

  # execute specs
  global.broadcastServer.runSpecs(['specs/example_specs.js'], filter)

exports.list = list

specStart = (request, response) ->
  spec = JSON.parse(request.body.spec)
  require('../SpecsSocketManager').onSpecStart spec
  response.end()

exports.specStart = specStart

specEnd = (request, response) ->
  spec = JSON.parse(request.body.spec)
  require('../SpecsSocketManager').onSpecEnd spec
  response.end()

exports.specEnd = specEnd

suiteEnd = (request, response) ->
  suite = JSON.parse(request.body.suite)
  require('../SpecsSocketManager').onSuiteEnd suite
  response.end()

exports.suiteEnd = suiteEnd

specsEnd = (request, response) ->
  require('../SpecsSocketManager').onEnd()
  response.end()

exports.specsEnd = specsEnd
