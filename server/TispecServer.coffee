express      = require 'express'
specs        = require './routes/specs'
specs_suites = require './routes/specs_suites'
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

    app.get  '/',                      specs.dashboard
    app.get  '/specs_suites/:id',      specs_suites.show
    app.post '/specs/startSpecs',      specs.startSpecs
    app.post '/specs/specStart',       specs.specStart
    app.post '/specs/specEnd',         specs.specEnd
    app.post '/specs/suiteEnd',        specs.suiteEnd
    app.post '/specs/end',             specs.specsEnd
    app.post '/specs/askConfirmation', specs.askConfirmation

    server = http.createServer(app).listen(app.get('port'), ->
      console.log('Server listening on port ' + app.get('port'))
    )
    require('./SpecsSocketManager').get server


exports.TispecServer = TispecServer
