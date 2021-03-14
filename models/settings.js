/*
 * settings.js
 */


const fs = require('fs')
const bcrypt = require('bcrypt')
const db = require('../database.js')
const query = require('../helpers/query.js')
const config = require('../config')

module.exports = {
  findAll,
  findByKey,
  update,
  validatePassword,
  changePassword,
  restoreBackup,
}


function findAll(params) {
  return db.findAll(...query.where('SELECT * FROM settings', params))
    .then(rows =>
      rows.reduce((acc, cur) => {
        if (cur.id === 'password')
          return acc
        cur.value = JSON.parse(cur.value)
        return acc.concat(cur)
      }, [])
    )
}

function findByKey(id) {
  return db.findOne('SELECT value FROM settings WHERE id = @id', { id })
    .then(({ value }) => JSON.parse(value))
}

function update(id, value) {
  return db.run(`
    UPDATE settings
       SET value = @value
         , updatedAt = strftime('%s','now')
     WHERE id = @id`,
  {
    id,
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
