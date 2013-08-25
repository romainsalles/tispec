specs = require './routes/specs'
app   = module.parent.exports.app

# Routes used by the server
app.get  '/',                           specs.dashboard
app.get  '/tpl/TestSuiteView',          specs.testSuiteView
app.get  '/tpl/SuiteItemView',          specs.suiteItemView
app.get  '/tpl/SpecItemView',           specs.specItemView
app.get  '/tpl/SubSpecItemView',        specs.subSpecItemView

# Routes used by the app
app.post '/specs/startSpecs',           specs.startSpecs
app.post '/specs/specStart',            specs.specStart
app.post '/specs/specEnd',              specs.specEnd
app.post '/specs/suiteEnd',             specs.suiteEnd
app.post '/specs/end',                  specs.specsEnd
app.post '/specs/askConfirmation',      specs.askConfirmation
app.post '/specs/checkScreenshot',      specs.checkScreenshot
