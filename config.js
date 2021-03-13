/*
 * config.js
 */

const path = require('path')

module.exports = {
  paths: {
    database: path.join(__dirname, 'data', 'db.sqlite'),
    sessions: path.join(__dirname, 'data', 'sessions.sqlite'),
  },
}
