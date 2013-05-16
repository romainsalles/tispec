ejs                = require 'ejs'
fs                 = require 'fs'
SpecsSocketManager = require '../SpecsSocketManager'

endResponse = (response) ->
  response.writeHead 200
  console.log('end response')
  response.end()


askConfirmation = (request, response) ->
  expectedBehavior = JSON.parse(request.body.expectedBehavior)
  expectedBehavior.specsSuiteId = request.query["specsSuiteId"]

  SpecsSocketManager.onConfirmSpec expectedBehavior, (valide) =>
    response.end(JSON.stringify({valide: valide}))

exports.askConfirmation = askConfirmation

checkScreenshot = (request, response) ->
  appName           = request.body.appName
  deviceModel       = request.body.deviceModel
  specAlias         = request.body.specAlias

  expectedImagePath = 'server/spec_images/' + appName + '/' + deviceModel + '/' + specAlias + '.png'
  imagePath         = request.files.image.path

  gm = require 'gm'
  # @see https://github.com/aheckmann/gm#compare
  gm.compare expectedImagePath, imagePath, 0, (err, isEqual, equality, raw) =>
    console.log JSON.stringify(err) if err

    # if the images were considered equal, `isEqual` will be true, otherwise, false.
    #console.log('The images were equal: %s', isEqual);
    # to see the total equality returned by graphicsmagick we can inspect the `equality` argument.
    #console.log('Actual equality: %d', equality);
    # inspect the raw output
    #console.log(raw);

    response.end(JSON.stringify({valide: isEqual}))

exports.checkScreenshot = checkScreenshot

startSpecs = (request, response) ->
  specsSuite              = JSON.parse(request.body.specsSuite)
  specsSuite.specsSuiteId = request.query["specsSuiteId"]

  SpecsSocketManager.onStartSpecs specsSuite
  endResponse(response)

exports.startSpecs = startSpecs

specStart = (request, response) ->
  spec              = JSON.parse(request.body.spec)
  spec.specsSuiteId = request.query["specsSuiteId"]

  SpecsSocketManager.onSpecStart spec
  endResponse(response)

exports.specStart = specStart

specEnd = (request, response) ->
  spec              = JSON.parse(request.body.spec)
  spec.specsSuiteId = request.query["specsSuiteId"]

  SpecsSocketManager.onSpecEnd spec
  endResponse(response)

exports.specEnd = specEnd

suiteEnd = (request, response) ->
  suite              = JSON.parse(request.body.suite)
  suite.specsSuiteId = request.query["specsSuiteId"]

  SpecsSocketManager.onSuiteEnd suite
  endResponse(response)

exports.suiteEnd = suiteEnd

specsEnd = (request, response) ->
  specsSuiteId = request.query["specsSuiteId"]

  SpecsSocketManager.onEnd specsSuiteId
  endResponse(response)

exports.specsEnd = specsEnd

dashboard = (request, response) ->
  file = fs.readFileSync 'server/views/dashboard.ejs', 'ascii'
  response.end(ejs.render(file))

exports.dashboard = dashboard
