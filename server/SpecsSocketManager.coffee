class SpecsSocketManager
  instance = null

  class SpecsSocketManagerSingleton
    currentSocket       = null
    onConfirmSpecResult = null

    constructor: (server) ->
      io = require('socket.io').listen server
      io.sockets.on 'connection', (socket) =>
        currentSocket = socket

        socket.on 'runSpecs', (filter) =>
          global.broadcastServer.runSpecs ['specs/example_specs.js'], filter

        socket.on 'confirmSpecResult', (result) =>
          onConfirmSpecResult result.confirmation

    emit: (event, data) ->
      currentSocket.emit(event, data)

    setConfirmSpecCallback: (_onConfirmSpecResult) ->
      onConfirmSpecResult = _onConfirmSpecResult

  @get:          (server)     -> instance ?= new SpecsSocketManagerSingleton(server)
  @onHello:      (appName, appVersion, deviceName) ->
    instance.emit 'hello', id: 1, appName: appName, appVersion: appVersion, deviceName: deviceName
  @onStartSpecs: (specsSuite) -> instance.emit 'start',     specsSuite
  @onSpecStart:  (spec)       -> instance.emit 'specStart', spec
  @onSpecEnd:    (spec)       -> instance.emit 'specEnd',   spec
  @onSuiteEnd:   (suite)      -> instance.emit 'suiteEnd',  suite
  @onEnd:                     -> instance.emit 'end'

  @onConfirmSpec: (behavior, onConfirmSpecResult) ->
    instance.setConfirmSpecCallback onConfirmSpecResult
    instance.emit 'confirmSpec', behavior

exports.get           = SpecsSocketManager.get
exports.onHello       = SpecsSocketManager.onHello
exports.onStartSpecs  = SpecsSocketManager.onStartSpecs
exports.onSpecStart   = SpecsSocketManager.onSpecStart
exports.onSpecEnd     = SpecsSocketManager.onSpecEnd
exports.onSuiteEnd    = SpecsSocketManager.onSuiteEnd
exports.onEnd         = SpecsSocketManager.onEnd
exports.onConfirmSpec = SpecsSocketManager.onConfirmSpec
