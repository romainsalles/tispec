ejs = require 'ejs'
fs  = require 'fs'

currentResponse = null

endResponse = (response) ->
  response.writeHead 200
  console.log('end response')
  response.end()


# GET home page
list = (request, response) ->
  filter = request.query['filter']
  file   = fs.readFileSync 'server/views/specs_list.ejs', 'ascii'
  response.end(ejs.render(file, locals: {filter: filter}))

  # execute specs
  global.broadcastServer.runSpecs(['specs/example_specs.js'], filter)

exports.list = list


askConfirmation = (request, response) ->
  currentResponse.end() if currentResponse
  currentResponse = response

  expectedBehavior = JSON.parse(request.body.expectedBehavior)
  require('../SpecsSocketManager').onConfirmSpec expectedBehavior, (confirmation) =>
    currentResponse.end(JSON.stringify({confirmation: confirmation}))

exports.askConfirmation = askConfirmation

specStart = (request, response) ->
  spec = JSON.parse(request.body.spec)
  require('../SpecsSocketManager').onSpecStart spec
  endResponse(response)

exports.specStart = specStart

specEnd = (request, response) ->
  spec = JSON.parse(request.body.spec)
  require('../SpecsSocketManager').onSpecEnd spec
  endResponse(response)

exports.specEnd = specEnd

suiteEnd = (request, response) ->
  suite = JSON.parse(request.body.suite)
  require('../SpecsSocketManager').onSuiteEnd suite
  endResponse(response)

exports.suiteEnd = suiteEnd

specsEnd = (request, response) ->
  require('../SpecsSocketManager').onEnd()
  endResponse(response)

exports.specsEnd = specsEnd
