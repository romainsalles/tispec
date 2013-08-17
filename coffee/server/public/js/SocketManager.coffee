root = exports ? this

class tispec.SocketManager
  instance = null
  # Static method used to either retrieve the
  # instance or create a new one.
  @get: () -> instance ?= new PrivateSocketManager()


# Create a private class that we can initialize however
# defined inside the wrapper scope.
class PrivateSocketManager
  constructor: () ->
    @socket = io.connect 'http://localhost'

    @socket.on 'hello', (_specsSuite) ->
      testSuite = new tispec.TestSuite(
        id:           _specsSuite.id,
        appName:      _specsSuite.appName,
        appVersion:   _specsSuite.appVersion,
        deviceName:   _specsSuite.deviceName,
        deviceModel:  _specsSuite.deviceModel
      )

      # Since the home view never changes, we instantiate it and render it only once
      if !tispec.testSuiteView
        tispec.testSuiteView = new tispec.TestSuiteView(model: testSuite)
        tispec.testSuiteView.render()
      else
        console.log('reusing testSuite view')
        tispec.testSuiteView.delegateEvents() # delegate events when the view is recycled

      $('#specs_suites').html(tispec.testSuiteView.el);
      return

    @socket.on 'start', (_specsSuite) ->
      tispec.testSuiteView.model.set(totalCount: _specsSuite.totalCount)
      return

    @socket.on 'specStart', (_spec) ->
      currentSuite = tispec.currentSuite

      unless currentSuite
        currentSuite = new tispec.Suite()

        tispec.currentSuite = currentSuite
        tispec.testSuiteView.model.suites.add(currentSuite)


      currentSuite.specs.add(new tispec.Spec(
        id:          _spec.id,
        suiteName:   _spec.suiteName,
        description: _spec.description
      ))
      return


    @socket.on 'specEnd', (_spec) ->
      specsCount = tispec.currentSuite.specs.length
      spec       = tispec.currentSuite.specs.at(specsCount - 1)

      spec.set(
        totalCount:   _spec.totalCount,
        passedCount:  _spec.passedCount,
        failedCount:  _spec.failedCount,
        passed:       _spec.passed
      );

      _.each _spec.subSpecs, (subSpec) ->
        spec.subSpecs.add(new tispec.SubSpec(
          expected: subSpec.expected,
          actual:   subSpec.actual,
          passed:   subSpec.passed_
        ))
      return


    @socket.on 'suiteEnd', (_suite) ->
      tispec.currentSuite.set(
        id:          _suite.specsSuiteId,
        description: _suite.description,
        totalCount:  _suite.totalCount,
        passedCount: _suite.passedCount
      )

      # Needed to initialize a new Suite at the next new spec
      tispec.currentSuite = null
      return

    @socket.on 'end', (specsSuiteId) ->
      console.log('SpecSuite.end');
      #getSpecsSuiteView(specsSuiteId).end()

  runSpecs: (specsSuiteId, filter) ->
    @socket.emit 'runSpecs', specsSuiteId: specsSuiteId, filter: filter
    return true
