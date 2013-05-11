ejs = require 'ejs'
fs  = require 'fs'

currentResponse = null

endResponse = (response) ->
  response.writeHead 200
  console.log('end response')
  response.end()


askConfirmation = (request, response) ->
  currentResponse.end() if currentResponse
  currentResponse = response

  expectedBehavior = JSON.parse(request.body.expectedBehavior)
  require('../SpecsSocketManager').onConfirmSpec expectedBehavior, (confirmation) =>
    currentResponse.end(JSON.stringify({confirmation: confirmation}))

exports.askConfirmation = askConfirmation

startSpecs = (request, response) ->
  specsSuite = JSON.parse(request.body.specsSuite)
  require('../SpecsSocketManager').onStartSpecs(specsSuite)
  endResponse(response)

exports.startSpecs = startSpecs

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

dashboard = (request, response) ->
  file   = fs.readFileSync 'server/views/dashboard.ejs', 'ascii'
  response.end(ejs.render(file))

exports.dashboard = dashboard
