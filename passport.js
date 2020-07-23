/*
 * passport.js
 */

const passport = require('passport')
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local')

const Settings = require('./models/settings.js')

const ROOT_USER = { id: 0, name: 'root' }

module.exports = passport

passport.serializeUser((user, done) => {
  done(undefined, /* user.id */ 0)
})

passport.deserializeUser((id, done) => {
  setImmediate(() => done(undefined, ROOT_USER))
})

passport.use(new LocalStrategy((username, password, done) => {
  console.log({ username, password })
  Settings.findByKey('password')
  .then(hash => {
    bcrypt.compare(password, hash, (err, success) => {
      if (err)
        done(err, undefined)
      else
        done(undefined, success ? ROOT_USER : null)
    })
  })
}))

/* passport.use(new OAuth2Strategy(config.google.auth, (token, refreshToken, profile, done) => {
 *
 *   // make the code asynchronous
 *   // User.findById won't fire until we have all our data back from Google
 *   process.nextTick(() => {
 *
 *     // Try to find the user based on their google id
 *     Member.findByGoogleID(profile.id)
 *     .then(user => {
 *
 *       // if a user is found, log them in
 *       Promise.any([
 *         Settings.canLogin(user.email),
 *       ].concat(profile.emails.map(email =>
 *         Settings.canLogin(email.value)
 *       )))
 *       .then(() => done(undefined, user))
 *       .catch(err => done(err))
 *     })
 *     .catch(err => {
 *       // if the user isnt in our database, create a new user
 *       if (err.type === k.ACCOUNT_NOT_FOUND) {
 *
 *         const newUser = {
 *           googleID: profile.id,
 *           token: token,
 *           name: profile.displayName,
 *           email: profile.emails[0].value,
 *         }
 *
 *         Settings.canLogin(newUser.email)
 *         .then(() => Member.create(newUser))
 *         .then(user => done(undefined, user))
 *         .catch(err => {
 *           if (err.message.includes('not in whitelist'))
 *             done(undefined, null)
 *           else
 *             done(err)
 *         })
 *       }
 *       // if some other error happens
 *       else {
 *         done(err)
 *       }
 *     })
 *   })
 * })) */
