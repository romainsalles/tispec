ejs = require 'ejs'
fs  = require('fs')

# GET home page
list = (request, response) ->
  filter = request.query['filter']

  onSpecStart = (suiteName, description) ->
    response.write('<script type="text/javascript">updateDescription(' +
                    JSON.stringify(
                      suiteName: suiteName
                      description: description) +
                    ');</script>')
  onSpecEnd = (suiteName, description, totalCount, passedCount, failedCount, passed) ->
    response.write('<script type="text/javascript">appendSpecResult(' +
                    JSON.stringify(
                      suiteName: suiteName
                      description: description
                      totalCount:  totalCount
                      passedCount: passedCount
                      failedCount: failedCount
                      passed:      passed) +
                    ');</script>')

  onSuiteEnd = (description, totalCount, passedCount, failedCount) ->
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


  global.broadcastServer.runSpecs(['specs/example_specs.js'], onSpecStart, onSpecEnd, onSuiteEnd, onEndSpecs, filter)

exports.list = list
