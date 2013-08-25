specs = require './routes/specs'
app   = module.parent.exports.app

# Routes used by the server
serverController = require './controllers/serverController'
app.get  '/',                           serverController.dashboard
app.get  '/tpl/TestSuiteView',          serverController.testSuiteView
app.get  '/tpl/SuiteItemView',          serverController.suiteItemView
app.get  '/tpl/SpecItemView',           serverController.specItemView
app.get  '/tpl/SubSpecItemView',        serverController.subSpecItemView

# Routes used by the app
appController = require './controllers/appController'
app.post '/specs/startSpecs',           appController.startSpecs
app.post '/specs/specStart',            appController.specStart
app.post '/specs/specEnd',              appController.specEnd
app.post '/specs/suiteEnd',             appController.suiteEnd
app.post '/specs/end',                  appController.specsEnd
app.post '/specs/askConfirmation',      appController.askConfirmation
app.post '/specs/checkScreenshot',      appController.checkScreenshot
