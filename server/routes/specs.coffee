ejs = require 'ejs'
fs  = require('fs')

currentResponse =  null
onSpecStart = (spec) ->
  currentResponse.write('<script type="text/javascript">updateDescription(' + spec + ');</script>')
onSpecEnd = (spec) ->
  currentResponse.write('<script type="text/javascript">appendSpecResult(' + spec + ');</script>')

onSuiteEnd = (suite) ->
  currentResponse.write('<script type="text/javascript">appendSuiteStart(' + suite + ');</script>')

onEndSpecs = () ->
  currentResponse.end('</body></html>')


# GET home page
list = (request, response) ->
  filter = request.query['filter']

  if currentResponse
    currentResponse.end()

  currentResponse = response

  # execute specs
  file = fs.readFileSync('server/views/specs_list.ejs', 'ascii')
  response.write(ejs.render(file, locals: {filter: filter, specs: []}))

  global.broadcastServer.runSpecs(['specs/example_specs.js'], filter, onEndSpecs)

exports.list = list


specStart = (request, response) ->
  onSpecStart request.body.spec
  response.end()

exports.specStart = specStart

specEnd = (request, response) ->
  onSpecEnd request.body.spec
  response.end()

exports.specEnd = specEnd

suiteEnd = (request, response) ->
  onSuiteEnd request.body.suite
  response.end()

exports.suiteEnd = suiteEnd

specsEnd = (request, response) ->
  onEndSpecs()
  response.end()

exports.specsEnd = specsEnd
