class SpecsSocketManager
  instance = null

  class SpecsSocketManagerSingleton
    currentSocket = null

    constructor: (server) ->
      io = require('socket.io').listen server
      io.sockets.on 'connection', (socket) =>
        currentSocket = socket

    emit: (event, data) ->
      currentSocket.emit(event, data)

  @get:         (server) -> instance ?= new SpecsSocketManagerSingleton(server)
  @onSpecStart: (spec)   -> instance.emit 'specStart', spec
  @onSpecEnd:   (spec)   -> instance.emit 'specEnd', spec
  @onSuiteEnd:  (suite)  -> instance.emit 'suiteEnd', suite
  @onEnd:                -> instance.emit 'end'

exports.get         = SpecsSocketManager.get
exports.onSpecStart = SpecsSocketManager.onSpecStart
exports.onSpecEnd   = SpecsSocketManager.onSpecEnd
exports.onSuiteEnd  = SpecsSocketManager.onSuiteEnd
exports.onEnd       = SpecsSocketManager.onEnd
