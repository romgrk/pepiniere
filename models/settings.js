/*
 * settings.js
 */


const fs = require('fs')
const bcrypt = require('bcrypt')
const db = require('../database.js')
const config = require('../config')

module.exports = {
  findAll,
  findByKey,
  update,
  validatePassword,
  changePassword,
  restoreBackup,
}


function findAll() {
  return db.findAll('SELECT * FROM settings')
    .then(rows =>
      rows.reduce((acc, cur) => {
        if (cur.key !== 'password')
          acc[cur.key] = JSON.parse(cur.value)
        return acc
      }, {})
    )
}

function findByKey(key) {
  return db.findOne('SELECT value FROM settings WHERE key = @key', { key })
    .then(({ value }) => JSON.parse(value))
}

function update(key, value) {
  return db.run('UPDATE settings SET value = @value WHERE key = @key', {
    key,
    value: JSON.stringify(value)
  })
  .then(() => value)
}

function validatePassword(password) {
  return findByKey('password').then(hash => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hash, (err, success) => {
        if (err)
          return reject(err)

        if (!success)
          return reject(new Error('Invalid password'))

        resolve(success)
      })
    })
  })
}

function changePassword(newPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(newPassword, 10, (err, hash) => {
      if (err)
        return reject(err)
      resolve(hash)
    })
  })
  .then(hash => {
    return update('password', hash)
  })
}

function restoreBackup(file) {
  // Make it all sync, not common enough to make this async
  try {
    fs.copyFileSync(file.path, config.paths.database)
    db.reload()
  } catch (err) {
    return Promise.reject(err)
  }

  return Promise.resolve(true)
}
