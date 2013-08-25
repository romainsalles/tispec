ejs                = require 'ejs'
fs                 = require 'fs'
SpecsSocketManager = require '../SpecsSocketManager'
mkdirp             = require 'mkdirp'

endResponse = (response) ->
  response.writeHead 200
  console.log('end response')
  response.end()

# @see http://procbits.com/2011/11/15/synchronous-file-copy-in-node-js
copyFileSync = (srcFile, destFile) ->
  BUF_LENGTH = 64*1024
  buff = new Buffer(BUF_LENGTH)
  fdr = fs.openSync(srcFile, 'r')
  fdw = fs.openSync(destFile, 'w')
  bytesRead = 1
  pos = 0
  while bytesRead > 0
    bytesRead = fs.readSync(fdr, buff, 0, BUF_LENGTH, pos)
    fs.writeSync(fdw,buff,0,bytesRead)
    pos += bytesRead
  fs.closeSync(fdr)
  fs.closeSync(fdw)

###
Used by manual test.

The tester has to confirm that the spec is valid with a visual confirmation :
a button will be displayed in the tispec web page with a description of what he
should see in the app.
###
exports.askConfirmation = (request, response) ->
  expectedBehavior = JSON.parse(request.body.expectedBehavior)
  expectedBehavior.specId       = request.body.specId
  expectedBehavior.specsSuiteId = request.query["specsSuiteId"]

  SpecsSocketManager.onConfirmSpec expectedBehavior, (valide) =>
    response.end(JSON.stringify({valide: valide}))

SCREENSHOT_ERROR_UNKNOWN_IMAGE   = 2
SCREENSHOT_ERROR_DIFFERENT_IMAGE = 3

EXPECTED_IMAGE_RELATIVE_FOLDER = "images/spec_images"
EXPECTED_IMAGE_ABSOLUTE_FOLDER = "#{__dirname}/../public/#{EXPECTED_IMAGE_RELATIVE_FOLDER}"
ACTUAL_IMAGE_RELATIVE_FOLDER   = "images/spec_images_temp"
ACTUAL_IMAGE_ABSOLUTE_FOLDER   = "#{__dirname}/../public/#{ACTUAL_IMAGE_RELATIVE_FOLDER}"

###
Used by screenshot specs.

When a spec use a screenshot confirmation, this method compare the expected
screenshot with the actual one. Function of the result, a different message will be
displayed to the tester :
  * if the 2 images match        : the spec will be marked as valid
  * if the 2 images mismatch     : the spec will be mark as invalid and the tester
                                   will be asked to confirm the spec has failed
                                   (otherwise, he can choose the new image as the reference one)
  * if no reference image exists : the tester will be able to define the screenshot
                                   as the reference one
###
exports.checkScreenshot = (request, response) ->
  appName      = request.body.appName
  deviceModel  = request.body.deviceModel
  specAlias    = request.body.specAlias
  specId       = request.body.specId
  specsSuiteId = request.query["specsSuiteId"]

  imageFolderPath     = "#{appName}/#{deviceModel}"
  imageName           = "#{specAlias}.png"

  expectedImageFolder = "#{EXPECTED_IMAGE_ABSOLUTE_FOLDER}/#{imageFolderPath}"
  expectedImage       = "#{expectedImageFolder}/#{specAlias}.png"
  expectedImageUrl    = "/#{EXPECTED_IMAGE_RELATIVE_FOLDER}/#{imageFolderPath}/#{imageName}"

  actualTempImage     = request.files.image.path
  actualImageFolder   = "#{ACTUAL_IMAGE_ABSOLUTE_FOLDER}/#{imageFolderPath}"
  actualImage         = "#{actualImageFolder}/#{specAlias}.png"
  actualImageUrl      = "/#{ACTUAL_IMAGE_RELATIVE_FOLDER}/#{imageFolderPath}/#{imageName}"

  mkdirp expectedImageFolder, (err) ->
    console.error err if err

    gm = require 'gm'
    # @see https://github.com/aheckmann/gm#compare
    gm.compare expectedImage, actualTempImage, 0, (err, isEqual, equality, raw) =>
      if err || !isEqual
        mkdirp.sync actualImageFolder # Create folders recursively
        copyFileSync actualTempImage, actualImage

      if err
        console.log JSON.stringify(err) # {"killed":false,"code":1,"signal":null}

        SpecsSocketManager.onScreenshotError id: specId, specsSuiteId: specsSuiteId, errorType: SCREENSHOT_ERROR_UNKNOWN_IMAGE, actualImage: actualImageUrl, specAlias: specAlias
        response.end(JSON.stringify(valide: false))
        return

      unless isEqual
        SpecsSocketManager.onScreenshotError id: specId, specsSuiteId: specsSuiteId, errorType: SCREENSHOT_ERROR_DIFFERENT_IMAGE, expectedImage: expectedImageUrl, actualImage: actualImageUrl, specAlias: specAlias

      response.end(JSON.stringify(valide: isEqual))
      return

###
When the tested app starts its specs, it informs the server via this route.
###
exports.startSpecs = (request, response) ->
  specsSuite              = JSON.parse(request.body.specsSuite)
  specsSuite.specsSuiteId = request.query["specsSuiteId"]

  SpecsSocketManager.onStartSpecs specsSuite
  endResponse response

###
When the tested app starts a new spec, it informs the server via this route.
###
exports.specStart = (request, response) ->
  spec              = JSON.parse(request.body.spec)
  spec.specsSuiteId = request.query["specsSuiteId"]

  SpecsSocketManager.onSpecStart spec
  endResponse response

###
When the tested app terminates a spec, it informs the server via this route.
###
exports.specEnd = (request, response) ->
  spec              = JSON.parse(request.body.spec)
  spec.specsSuiteId = request.query["specsSuiteId"]

  SpecsSocketManager.onSpecEnd spec
  endResponse response


###
When the tested app terminates a suite, it informs the server via this route.
###
exports.suiteEnd = (request, response) ->
  suite              = JSON.parse(request.body.suite)
  suite.specsSuiteId = request.query["specsSuiteId"]

  SpecsSocketManager.onSuiteEnd suite
  endResponse response

###
When the tested app terminates the test suite, it informs the server via this route.
###
exports.specsEnd = (request, response) ->
  specsSuiteId = request.query["specsSuiteId"]

  SpecsSocketManager.onEnd specsSuiteId
  endResponse response

###
Result page
###
exports.dashboard = (request, response) ->
  file = fs.readFileSync 'server/views/tispec.ejs', 'ascii'
  response.end ejs.render(file)

###
Views templates used by the result page
###
exports.testSuiteView   = (request, response) -> response.sendfile 'server/public/tpl/TestSuite.html'
exports.suiteItemView   = (request, response) -> response.sendfile 'server/public/tpl/SuiteItem.html'
exports.specItemView    = (request, response) -> response.sendfile 'server/public/tpl/SpecItem.html'
exports.subSpecItemView = (request, response) -> response.sendfile 'server/public/tpl/SubSpecItem.html'
