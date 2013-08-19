express      = require 'express'
specs        = require './routes/specs'
http         = require 'http'
path         = require 'path'

class TispecServer
  constructor: () ->
    app = express()

    # all environments
    app.set('port', process.env.PORT || 8666)
    app.set('views', __dirname + '/views')
    app.set('view engine', 'ejs')
    app.use(express.favicon())
    app.use(express.logger('dev'))
    app.use(express.bodyParser())
    app.use(express.methodOverride())
    app.use(app.router)
    app.use(express.static(path.join(__dirname, '/public')))

    # development only
    app.use(express.errorHandler()) if 'development' is app.get('env')

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

    server = http.createServer(app).listen(app.get('port'), ->
      console.log('Server listening on port ' + app.get('port'))
    )
    require('./SpecsSocketManager').get server


exports.TispecServer = TispecServer
