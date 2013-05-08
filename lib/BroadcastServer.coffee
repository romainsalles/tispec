http  = require 'http'
net   = require 'net'
nowjs = require 'now'
_     = require '../App/Resources/lib/underscore'

class BroadcastServer

  constructor: (port) ->
    server = http.createServer();
    server.listen port

    @everyone = nowjs.initialize server

    @everyone.now.onSpecEnd = (description, totalCount, passedCount, failedCount, passed) => @onSpecEnd(description, totalCount, passedCount, failedCount, passed)
    @everyone.now.onSuiteEnd = (description, totalCount, passedCount, failedCount) =>
      @onSuiteEnd(description, totalCount, passedCount, failedCount)
    @everyone.now.endSpecs = => @onEndSpecs()

    console.log('Server created and listening on port ' + port)

  # Dispatch specs to the different apps
  #
  # @specs {Array} path of the different specs
  #
  runSpecs: (specs, @onSpecEnd, @onSuiteEnd, @onEndSpecs, filter) ->
    if @everyone.now.execute
      @everyone.now.execute(specs, filter)
    else
      @onEndSpecs()

exports.BroadcastServer = BroadcastServer
