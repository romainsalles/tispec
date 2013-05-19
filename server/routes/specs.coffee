ejs                = require 'ejs'
fs                 = require 'fs'
SpecsSocketManager = require '../SpecsSocketManager'

endResponse = (response) ->
  response.writeHead 200
  console.log('end response')
  response.end()


askConfirmation = (request, response) ->
  expectedBehavior = JSON.parse(request.body.expectedBehavior)
  expectedBehavior.specId       = request.body.specId
  expectedBehavior.specsSuiteId = request.query["specsSuiteId"]

  SpecsSocketManager.onConfirmSpec expectedBehavior, (valide) =>
    response.end(JSON.stringify({valide: valide}))

exports.askConfirmation = askConfirmation

SCREENSHOT_ERROR_UNKNOWN_IMAGE   = 1
SCREENSHOT_ERROR_DIFFERENT_IMAGE = 2

checkScreenshot = (request, response) ->
  appName           = request.body.appName
  deviceModel       = request.body.deviceModel
  specAlias         = request.body.specAlias
  specId            = request.body.specId
  specsSuiteId      = request.query["specsSuiteId"]

  expectedImage     = "images/spec_images/#{appName}/#{deviceModel}/#{specAlias}.png"
  expectedImagePath = "server/public/#{expectedImage}"
  actualImage       = request.files.image.path

    console.error(err) if err

    gm = require 'gm'
    # @see https://github.com/aheckmann/gm#compare
    gm.compare expectedImagePath, actualImage, 0, (err, isEqual, equality, raw) =>
      if err
        console.log JSON.stringify(err) # {"killed":false,"code":1,"signal":null}
        SpecsSocketManager.onScreenshotError id: specId, specsSuiteId: specsSuiteId, errorType: SCREENSHOT_ERROR_UNKNOWN_IMAGE, actualImage: actualImage
        response.end(JSON.stringify(valide: false))
        return

      unless isEqual
        SpecsSocketManager.onScreenshotError id: specId, specsSuiteId: specsSuiteId, errorType: SCREENSHOT_ERROR_DIFFERENT_IMAGE, expectedImage: expectedImage, actualImage: actualImage
      # if the images were considered equal, `isEqual` will be true, otherwise, false.
      #console.log('The images were equal: %s', isEqual);
      # to see the total equality returned by graphicsmagick we can inspect the `equality` argument.
      #console.log('Actual equality: %d', equality);
      # inspect the raw output
      #console.log(raw);

      response.end(JSON.stringify({valide: isEqual}))
      return

exports.checkScreenshot = checkScreenshot

screenshotErrorDifferent = (request, response) ->
  response.render 'specs_screenshots_different', specsSuiteId: request.params.specsSuiteid, specId: request.params.specId, expectedImage: request.query["expectedImage"], actualImage: request.query["actualImage"]

exports.screenshotErrorDifferent = screenshotErrorDifferent

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
