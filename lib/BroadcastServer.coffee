http  = require 'http'
net   = require 'net'
nowjs = require 'now'
_     = require '../App/Resources/lib/underscore'

class BroadcastServer

  constructor: (port) ->
    server = http.createServer();
    server.listen port

    @everyone = nowjs.initialize server

    @everyone.now.onSpecResult = (description, totalCount, passedCount, failedCount, passed) => @onNewSpec(description, totalCount, passedCount, failedCount, passed)
    @everyone.now.onSuiteResult = (description, totalCount, passedCount, failedCount) =>
      @onNewSuite(description, totalCount, passedCount, failedCount)
    @everyone.now.endSpecs = => @onEndSpecs()

    console.log('Server created and listening on port ' + port)

  # Dispatch specs to the different apps
  #
  # @specs {Array} path of the different specs
  #
  runSpecs: (specs, @onNewSpec, @onNewSuite, @onEndSpecs, filter) ->
    @everyone.now.execute(specs, filter)

exports.BroadcastServer = BroadcastServer
