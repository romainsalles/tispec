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

    @socket.on 'hello'          , @onHello
    @socket.on 'start'          , @onTestSuiteStart
    @socket.on 'specStart'      , @onSpecStart
    @socket.on 'specEnd'        , @onSpecEnd
    @socket.on 'suiteEnd'       , @onSuiteEnd
    @socket.on 'end'            , @onTestSuiteEnd

    @socket.on 'screenshotError', @onScreenshotError


  # Outgoing sockets
  # ============================================================================

  # Run specs on the connected device
  #
  # @specsSuiteId {Integer} id of the test suite
  # @filter       {String}  only run specs containing the filter string
  runSpecs: (specsSuiteId, filter) ->
    @socket.emit 'runSpecs', specsSuiteId: specsSuiteId, filter: filter
    return true


  # Incoming sockets
  # ============================================================================

  # Test suite
  # ----------------------------------------------------------------------------

  # Handshake with the device which will run the specs
  #
  # @_specsSuite {Object} test suite
  onHello: (_specsSuite) ->
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
      console.log 'reusing testSuite view'
      tispec.testSuiteView.delegateEvents() # delegate events when the view is recycled

    $('#specs_suites').html(tispec.testSuiteView.el)
    return


  # Inform of the test suite beginning
  #
  # @_specsSuite {Object} the test suit
  onTestSuiteStart: (_specsSuite) ->
    tispec.testSuiteView.model.set(totalCount: _specsSuite.totalCount)
    return


  # Inform of the test suite end
  #
  # @specsSuiteId {Integer} the test suit id
  onTestSuiteEnd: (specsSuiteId) ->
    console.log 'SpecSuite.end'
    #getSpecsSuiteView(specsSuiteId).end()


  # Suite
  # ----------------------------------------------------------------------------

  # Inform of the the suite end
  #
  # _suite {Object} the suite
  onSuiteEnd: (_suite) ->
    tispec.currentSuite.set(
      id:          _suite.specsSuiteId,
      description: _suite.description,
      totalCount:  _suite.totalCount,
      passedCount: _suite.passedCount
    )

    # Needed to initialize a new Suite at the next new spec
    tispec.currentSuite = null
    return


  # Spec
  # ----------------------------------------------------------------------------

  # Inform of the the spec beginning
  #
  # _spec {Object} the spec
  onSpecStart: (_spec) ->
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


  # Inform of the the spec end
  #
  # _spec {Object} the spec
  onSpecEnd: (_spec) ->
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

  onScreenshotError: (_spec) ->
    specsSuite = tispec.currentSuite
    spec       = specsSuite.specs.get _spec.id

    spec.setScreenshotError _spec.errorType, _spec.expectedImage, _spec.actualImage, _spec.specAlias
