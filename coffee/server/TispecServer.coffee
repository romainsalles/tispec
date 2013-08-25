express      = require 'express'
http         = require 'http'
path         = require 'path'

###
Web server for Tispec.

It's used by the app tested to communicate its results and by the tispec page to show
the results of a test suite.

We don't use sockets for now because the Titanium implementation of *now* doesn't
work that well.
###
class TispecServer
  constructor: () ->
    app = express()
    module.exports.app = app

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

    # routes
    routes = require './routes'

    server = http.createServer(app).listen(app.get('port'), ->
      console.log('Server listening on port ' + app.get('port'))
    )
    require('./SpecsSocketManager').get server


exports.TispecServer = TispecServer
