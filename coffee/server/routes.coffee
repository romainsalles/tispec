app   = module.parent.exports.app

# Routes used by the server
serverController = require './controllers/serverController'
app.get  '/',                      serverController.dashboard
app.get  '/views/TestSuiteView',   serverController.testSuiteView
app.get  '/views/SuiteItemView',   serverController.suiteItemView
app.get  '/views/SpecItemView',    serverController.specItemView
app.get  '/views/SubSpecItemView', serverController.subSpecItemView

# Routes used by the app
appController = require './controllers/appController'
app.post '/specs/startSpecs',      appController.startSpecs
app.post '/specs/specStart',       appController.specStart
app.post '/specs/specEnd',         appController.specEnd
app.post '/specs/suiteEnd',        appController.suiteEnd
app.post '/specs/end',             appController.specsEnd
app.post '/specs/askConfirmation', appController.askConfirmation
app.post '/specs/checkScreenshot', appController.checkScreenshot
