ejs = require 'ejs'
fs  = require('fs')

# GET home page
list = (request, response) ->
  filter = request.query['filter']

  onNewSpec = (description, totalCount, passedCount, failedCount, passed) ->
    response.write('<script type="text/javascript">appendSpecResult(' +
                    JSON.stringify(
                      description: description
                      totalCount:  totalCount
                      passedCount: passedCount
                      failedCount: failedCount
                      passed:      passed) +
                    ');</script>')

  onNewSuite = (description, totalCount, passedCount, failedCount) ->
    response.write('<script type="text/javascript">appendSuiteStart(' +
                  JSON.stringify(
                    description: description
                    totalCount:  totalCount
                    passedCount: passedCount
                    failedCount: failedCount) +
                  ');</script>')

  onEndSpecs = (description, totalCount, passedCount, failedCount) ->
    response.end('</body></html>')

  # execute specs
  file = fs.readFileSync('server/views/specs_list.ejs', 'ascii')
  response.write(ejs.render(file, locals: {filter: filter, specs: []}))


  global.broadcastServer.runSpecs(['specs/example_specs.js'], onNewSpec, onNewSuite, onEndSpecs, filter)

exports.list = list
