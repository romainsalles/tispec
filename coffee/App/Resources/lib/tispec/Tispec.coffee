Ti.include '/lib/tispec/lib/jasmine.js'

class Tispec
  instance = null
  # Static method used to either retrieve the
  # instance or create a new one.
  @get: (host, nowPort, serverPort) -> instance ?= new PrivateTispec host, nowPort, serverPort


# Create a private class that we can initialize however
# defined inside the wrapper scope.
class PrivateTispec
  constructor: (@host, @nowPort, @serverPort) ->
    @_initialize()

  retrieveSpecs = (folder) ->
    folder = folder || "#{Ti.Filesystem.getResourcesDirectory()}specs"

    specs   = []
    file    = Titanium.Filesystem.getFile folder
    listing = file.getDirectoryListing()

    for path in listing
      splitPath = path.split '.'
      isFile    = splitPath.length > 1 && splitPath[splitPath.length - 1] is 'spec'

      if isFile
        specs.push "#{folder}/#{path}"
      else
        specs = specs.concat retrieveSpecs("#{folder}/#{path}")

    return specs

  initializeJasmine = (reporter) ->
    # [Hack] force a new env.
    # Avoid multiple execution of the same spec if the specs are run
    # multiple times (and thus, included more than once)
    # @see https://github.com/pivotal/jasmine/pull/357
    # @see https://github.com/pivotal/jasmine/blob/master/src/core/base.js
    env = jasmine.currentEnv_ = new jasmine.Env()

    env.addReporter reporter
    env.specFilter = (spec) ->
      return reporter.specFilter spec

    return env;

  _initialize: () ->
    nowjs        = require '/lib/tispec/lib/now'
    now          = nowjs.nowInitialize "//#{@host}:#{@nowPort}", {}
    specsSuiteId = (new Date()).getTime()
    Reporter     = require('/lib/tispec/TispecReporter').TispecReporter

    # Initialize RequestManager
    require('/lib/tispec/RequestManager').get @host, @serverPort, specsSuiteId

    now.ready () ->

      # Synchronize with tispec server
      now.hello specsSuiteId, Ti.App.name, Ti.App.version, Ti.Platform.username, Ti.Platform.model

      now.execute = (options) ->
        (() ->
          return if options.specsSuiteId isnt specsSuiteId

          reporter   = new Reporter(now)
          jasmineEnv = initializeJasmine reporter

          for spec in retrieveSpecs()
            Ti.include spec

          if options.filter
            reporter.setSpecFilter options.filter
          else
            reporter.removeSpecFilter()

          jasmineEnv.execute()
        )()

module.exports = Tispec
