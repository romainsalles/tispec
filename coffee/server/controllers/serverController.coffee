ejs = require 'ejs'
fs  = require 'fs'

###
Result page
###
exports.dashboard = (request, response) ->
  file = fs.readFileSync 'server/views/tispec.ejs', 'ascii'
  response.end ejs.render(file)

###
Views templates used by the result page
###
exports.testSuiteView   = (request, response) -> response.sendfile 'server/public/tpl/TestSuite.html'
exports.suiteItemView   = (request, response) -> response.sendfile 'server/public/tpl/SuiteItem.html'
exports.specItemView    = (request, response) -> response.sendfile 'server/public/tpl/SpecItem.html'
exports.subSpecItemView = (request, response) -> response.sendfile 'server/public/tpl/SubSpecItem.html'
