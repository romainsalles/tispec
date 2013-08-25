fs = require 'fs'

class SpecsSocketManager
  instance = null

  class SpecsSocketManagerSingleton
    currentSocket        = null
    onConfirmSpecResults = {}

    constructor: (server) ->
      io = require('socket.io').listen server
      io.sockets.on 'connection', (socket) =>
        currentSocket = socket

        socket.on 'runSpecs', (options) =>
          global.broadcastServer.runSpecs options

        socket.on 'confirmSpecResult', (result) =>
          onConfirmSpecResults[result.specsSuiteId] result.valide

        socket.on 'changeSpecScreenshot', (result) =>
          specsSuite    = result.specsSuite
          spec          = result.spec
          actualImage   = "#{__dirname}/public/images/spec_images_temp/#{specsSuite.appName}/#{specsSuite.deviceModel}/#{spec.screenshotError}.png"
          expectedImage = "#{__dirname}/public/images/spec_images/#{specsSuite.appName}/#{specsSuite.deviceModel}/#{spec.screenshotError}.png"

          copyFileSync actualImage, expectedImage

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


    emit: (event, data) ->
      currentSocket.emit(event, data)

    setConfirmSpecCallback: (specsSuiteId, _onConfirmSpecResult) ->
      onConfirmSpecResults[specsSuiteId] = _onConfirmSpecResult

  @get:          (server)     -> instance ?= new SpecsSocketManagerSingleton(server)
  @onHello:      (specsSuiteId, appName, appVersion, deviceName, deviceModel) ->
    instance.emit 'hello', id: specsSuiteId, appName: appName, appVersion: appVersion, deviceName: deviceName, deviceModel: deviceModel
  @onStartSpecs: (specsSuite)   -> instance.emit 'start',     specsSuite
  @onSpecStart:  (spec)         -> instance.emit 'specStart', spec
  @onSpecEnd:    (spec)         -> instance.emit 'specEnd',   spec
  @onSuiteEnd:   (suite)        -> instance.emit 'suiteEnd',  suite
  @onEnd:        (specsSuiteId) -> instance.emit 'end',       specsSuiteId
  @onConfirmSpec: (behavior, onConfirmSpecResult) ->
    instance.setConfirmSpecCallback behavior.specsSuiteId, onConfirmSpecResult
    instance.emit 'confirmSpec', behavior
  @onScreenshotError: (spec)    -> instance.emit 'screenshotError', spec

exports.get               = SpecsSocketManager.get
exports.onHello           = SpecsSocketManager.onHello
exports.onStartSpecs      = SpecsSocketManager.onStartSpecs
exports.onSpecStart       = SpecsSocketManager.onSpecStart
exports.onSpecEnd         = SpecsSocketManager.onSpecEnd
exports.onSuiteEnd        = SpecsSocketManager.onSuiteEnd
exports.onEnd             = SpecsSocketManager.onEnd
exports.onConfirmSpec     = SpecsSocketManager.onConfirmSpec
exports.onScreenshotError = SpecsSocketManager.onScreenshotError
