/*
 * settings.js
 */


const bcrypt = require('bcrypt')
const db = require('../database.js')
const config = require('../config')

module.exports = {
  findAll,
  findByKey,
  update,
  validatePassword,
  changePassword,
}


function findAll() {
  return db.findAll('SELECT * FROM settings')
    .then(rows =>
      rows.reduce((acc, cur) => (
        acc[cur.key] = JSON.parse(cur.value),
        acc
      ), {})
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
  console.log({ newPassword, hash })
return update('password', hash)
})
}
