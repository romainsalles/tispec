# GET home page
list = (request, response) ->
  specs = []
  filter = request.query['filter']

  onNewSpec = (description, totalCount, passedCount, failedCount, passed) ->
    specs.push
      description: description
      totalCount:  totalCount
      passedCount: passedCount
      failedCount: failedCount
      passed:      passed

  onNewSuite = (description, totalCount, passedCount, failedCount) ->
    console.log('SUITE : ' + JSON.stringify([description, totalCount, passedCount, failedCount]) + '<br/>')

  onEndSpecs = (description, totalCount, passedCount, failedCount) ->
    response.render('specs_list', { specs: specs });

  # execute specs
  global.broadcastServer.runSpecs(['specs/example_specs.js'], onNewSpec, onNewSuite, onEndSpecs, filter)

exports.list = list
