http  = require 'http'
nowjs = require 'now'

class BroadcastServer

  constructor: (port) ->
    server = http.createServer();
    server.listen port

    @everyone = nowjs.initialize server
    console.log('Server created and listening on port ' + port)

    @everyone.now.hello = (appName, appVersion, deviceName) ->
      require('../server/SpecsSocketManager').onHello(appName, appVersion, deviceName)

  # Dispatch specs to the different apps
  #
  # @specs {Array} path of the different specs
  #
  runSpecs: (specs, filter) ->
    @everyone.now.execute(specs, filter) if @everyone.now.execute

exports.BroadcastServer = BroadcastServer
