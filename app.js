global.Promise = require('bluebird')
const path = require('path')
const express = require('express')
const session = require('express-session')
const sqliteSession = require('express-session-sqlite').default
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const formData = require('express-form-data');
const compression = require('compression');
const sqlite = require('sqlite3');
const SqliteStore = sqliteSession(session)

const config = require('./config')
const backup = require('./helpers/backup')
const passport = require('./passport')
const k = require('./constants')
// const User = require('./models/user.js')

// Start backups
backup.start()

// Setup application
const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


// Middlewares
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(compression())
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(formData.parse())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))


// Passport setup
app.use(session({
  secret: 'SECRET',
  resave: false,
  saveUninitialized: true,
  store: new SqliteStore({
    driver: sqlite.Database,
    path: config.paths.sessions,
    ttl: 2 * 24 * 60 * 60 * 1000,
  })
}))
app.use(passport.initialize())
app.use(passport.session()) // persistent login sessions
app.use(flash()) // use connect-flash for flash messages stored in session



// API

app.use('/api/auth',                       require('./routes/auth'))
app.use('/api/settings',     apiProtected, require('./routes/settings'))
app.use('/api/member',       apiProtected, require('./routes/member'))
app.use('/api/category',     apiProtected, require('./routes/category'))
app.use('/api/task',         apiProtected, require('./routes/task'))
app.use('/api/run',          apiProtected, require('./routes/run')) 
app.use('/api/sync',         apiProtected, require('./routes/sync')) 
app.use('/api', (req, res) => {
  res.status(404)
  res.json({ ok: false, message: '404', url: req.originalUrl })
  res.end()
})

function apiProtected(req, res, next) {
  if (req.isAuthenticated())
    return next()

  const username = req.get('x-username')
  const password = req.get('x-password')

  if (username === 'system' && password) {
    return User.findByName(username)
    .then(user => user.password === password ? Promise.resolve(user) : Promise.reject())
    .then(user => {
      req.user = user
      return next()
    })
    .catch(() => {
      res.json({ ok: false, message: 'Not authenticated' })
      res.end()
    })
  }

  /* if (process.env.NODE_ENV === 'development') {
   *   req.user = { id: 0, name: 'root' }
   *   return next()
   * } */

  res.json({ ok: false, message: 'Not authenticated' })
  res.end()
}



/*
 * Redirect handler
 * We need to redirect all other routes to the app, e.g. /samples, /settings, etc.
 */

app.use((req, res, next) => {
  res.redirect('/')
})



// Error handler

app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error   = req.app.get('env') === 'development' ? err : {}

  if (err.type === k.ACCOUNT_NOT_FOUND)
    req.logout()

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})


module.exports = app
